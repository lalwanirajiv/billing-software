import sql from '../db.js';

// --- Create Invoice (with optional items) ---
export const createInvoice = async (req, res) => {
  try {
    const { ship_to, bill_no, date, terms_of_payment, state, grand_total, items } = req.body;

    if (!ship_to || ship_to.trim() === "") {
      return res.status(400).json({ error: "Customer Name (ship_to) is required." });
    }

    // Insert invoice
    const [invoice] = await sql`
      INSERT INTO invoices
      (ship_to, bill_no, date, terms_of_payment, state, grand_total, created_at)
      VALUES
      (${ship_to}, ${bill_no}, ${date}, ${terms_of_payment}, ${state}, ${grand_total}, NOW())
      RETURNING id
    `;
    const invoiceId = invoice.id;

    // Insert items if any
    if (items && items.length > 0) {
      for (let item of items) {
        const { item_name, quantity, price, total } = item;
        await sql`
          INSERT INTO items
          (invoice_id, item_name, quantity, price, total)
          VALUES
          (${invoiceId}, ${item_name}, ${quantity}, ${price}, ${total})
        `;
      }
    }

    res.json({ message: "Invoice saved successfully!", invoiceId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// --- Get Invoice by ID with items ---
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const [invoice] = await sql`SELECT * FROM invoices WHERE id = ${id}`;
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    const items = await sql`SELECT * FROM items WHERE invoice_id = ${id}`;
    res.json({ ...invoice, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// --- Get all invoices ---
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await sql`SELECT * FROM invoices ORDER BY created_at DESC`;
    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
