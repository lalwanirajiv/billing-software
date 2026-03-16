const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// ---- Database path discovered from the system ----
let dbPath = 'C:\\Users\\Rajiv\\AppData\\Roaming\\com.tauri.dev\\billing.db';
console.log('📂 Using database at:', dbPath);

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(dbPath);

// ---- Helpers ----
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', row => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

async function migrate() {
  console.log('🚀 Starting migration...');

  // Enable foreign keys
  await run('PRAGMA foreign_keys = OFF;');

  // Read CSV files
  const customers = await readCSV(path.join(__dirname, 'customers_rows (1).csv'));
  const invoices  = await readCSV(path.join(__dirname, 'invoices_rows (1).csv'));
  const items     = await readCSV(path.join(__dirname, 'items_rows (1).csv'));

  console.log(`📋 Customers: ${customers.length}, Invoices: ${invoices.length}, Items: ${items.length}`);

  // ---- Maps: UUID -> new SQLite integer ID ----
  const customerIdMap = {}; // old UUID -> new integer
  const invoiceIdMap  = {}; // old UUID -> new integer

  // ---- 1. Import CUSTOMERS ----
  console.log('\n👥 Importing customers...');
  let customerCount = 0;
  for (const c of customers) {
    // Skip test accounts and deleted customers (optional - comment out to include all)
    const isDeleted = c.is_deleted === 'true';
    
    try {
      const newId = await run(
        `INSERT INTO customers (name, address_line1, address_line2, gstin, phone_number, is_deleted, deleted_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          (c.name || '').trim(),
          c.address_line1 || null,
          c.address_line2 || null,
          c.gstin || null,
          c.phone_number || null,
          isDeleted ? 1 : 0,
          c.deleted_at || null,
          c.created_at || null
        ]
      );
      customerIdMap[c.customer_id] = newId;
      customerCount++;
    } catch (err) {
      console.error(`  ⚠️ Failed to insert customer "${c.name}": ${err.message}`);
    }
  }
  console.log(`  ✅ Imported ${customerCount} customers`);

  // ---- 2. Import INVOICES ----
  console.log('\n🧾 Importing invoices...');
  let invoiceCount = 0;
  for (const inv of invoices) {
    // Map the old UUID customer_id to the new integer ID
    const newCustomerId = customerIdMap[inv.customer_id] || null;
    
    try {
      const newId = await run(
        `INSERT INTO invoices (ship_to, bill_no, date, terms_of_payment, state, total_quantity, sub_total, cgst, sgst, igst, grand_total, customer_id, invoice_status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          inv.ship_to || null,
          inv.bill_no ? Number(inv.bill_no) : null,
          inv.date || null,
          inv.terms_of_payment || null,
          inv.state || null,
          inv.total_quantity ? Number(inv.total_quantity) : null,
          inv.sub_total ? Number(inv.sub_total) : null,
          inv.cgst ? Number(inv.cgst) : null,
          inv.sgst ? Number(inv.sgst) : null,
          inv.igst ? Number(inv.igst) : null,
          inv.grand_total ? Number(inv.grand_total) : null,
          newCustomerId,
          inv.invoice_status || null,
          inv.created_at || null
        ]
      );
      invoiceIdMap[inv.invoice_id] = newId;
      invoiceCount++;
    } catch (err) {
      console.error(`  ⚠️ Failed to insert invoice #${inv.bill_no}: ${err.message}`);
    }
  }
  console.log(`  ✅ Imported ${invoiceCount} invoices`);

  // ---- 3. Import ITEMS ----
  console.log('\n📦 Importing items...');
  let itemCount = 0;
  let skippedItems = 0;
  for (const item of items) {
    const newInvoiceId = invoiceIdMap[item.invoice_id];
    if (!newInvoiceId) {
      skippedItems++;
      continue; // orphan item (no matching invoice)
    }

    try {
      await run(
        `INSERT INTO items (invoice_id, item_name, hsn, quantity, price, total)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          newInvoiceId,
          item.item_name || null,
          item.hsn || null,
          item.quantity ? Number(item.quantity) : null,
          item.price ? Number(item.price) : null,
          item.total ? Number(item.total) : null
        ]
      );
      itemCount++;
    } catch (err) {
      console.error(`  ⚠️ Failed to insert item "${item.item_name}": ${err.message}`);
    }
  }
  console.log(`  ✅ Imported ${itemCount} items (skipped ${skippedItems} orphan items)`);

  // ---- Done ----
  await run('PRAGMA foreign_keys = ON;');
  db.close();

  console.log('\n🎉 Migration complete!');
  console.log(`   Customers: ${customerCount}`);
  console.log(`   Invoices:  ${invoiceCount}`);
  console.log(`   Items:     ${itemCount}`);
  console.log('\n📍 Database location:', dbPath);
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  db.close();
  process.exit(1);
});
