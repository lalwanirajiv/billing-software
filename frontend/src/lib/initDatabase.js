import { getDB } from "./database";

export async function initDatabase() {
    const db = await getDB();
    
    console.log("Database  table checked/created");
  await db.execute(`CREATE TABLE IF NOT EXISTS customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address_line1 TEXT,
    address_line2 TEXT,
    gstin TEXT,
    phone_number TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    is_deleted INTEGER DEFAULT 0,
    deleted_at TEXT
  )`);
  console.log("Customers table checked/created");
  
  await db.execute(`CREATE TABLE IF NOT EXISTS invoices (
    invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
    bill_no TEXT,
    date TEXT,
    terms_of_payment TEXT,
    state TEXT,
    sub_total REAL,
    cgst REAL,
    sgst REAL,
    igst REAL,
    grand_total REAL,
    total_quantity INTEGER,
    invoice_status TEXT,
    ship_to TEXT,
    customer_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
  )`);
  console.log("Invoice table checked/created");
  
  await db.execute(`CREATE TABLE IF NOT EXISTS items (
    items_id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER,
    item_name TEXT,
    hsn TEXT,
    quantity INTEGER,
    price REAL,
    total REAL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id)
    )`);
    console.log("Items table checked/created");
}