import sql from "../db.js";

// --- Create Invoice (with optional items) ---
export const createInvoice = async (req, res) => {
  try {
    const {
      ship_to,
      bill_no,
      date,
      terms_of_payment,
      state,
      total_quantity,
      sub_total,
      cgst,
      sgst,
      igst,
      grand_total,
      items,
      customer_id
    } = req.body;

    if (!ship_to || ship_to.trim() === "") {
      return res
        .status(400)
        .json({ error: "Customer Name (ship_to) is required." });
    }

    // Insert invoice
    const [invoice] = await sql`
  INSERT INTO invoices
  (ship_to, bill_no, date, terms_of_payment, state, total_quantity, sub_total, cgst, sgst, igst, grand_total, customer_id, created_at)
  VALUES
  (${ship_to}, ${bill_no}, ${date}, ${terms_of_payment}, ${state}, ${total_quantity}, ${sub_total}, ${cgst}, ${sgst}, ${igst}, ${grand_total},${customer_id}, NOW())
  RETURNING invoice_id
`;
    const invoiceId = invoice.invoice_id;

    // Insert items if any
    if (items && items.length > 0) {
      for (let item of items) {
        const { item_name, hsn, quantity, price, total } = item;
        await sql`
          INSERT INTO items
          (invoice_id, item_name, hsn, quantity, price, total)
          VALUES
          (${invoiceId}, ${item_name}, ${hsn},${quantity}, ${price}, ${total})
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

    const [invoice] =
      await sql`SELECT * FROM invoices WHERE invoice_id = ${id}`;
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

export const getInvoicesWithCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const result =
      await sql`SELECT ship_to FROM invoices WHERE invoice_id = '${id}'`;

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};
// invoicesController.js
export const checkInvoice = async (req, res) => {
  const { billNo } = req.params;
  try {
    const invoice = await sql`SELECT * FROM invoices WHERE bill_no = ${billNo}`;
    if (invoice.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};
