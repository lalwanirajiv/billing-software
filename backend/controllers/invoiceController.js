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
      customer_id,
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
    const invoices = await sql`SELECT * FROM invoices ORDER BY bill_no `;
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

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // ✅ should come from body, not params
  try {
    const result =
      await sql`UPDATE invoices SET invoice_status = ${status} WHERE invoice_id = ${id} RETURNING *`;

    if (result.count === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(result[0]); // return the updated row
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Update Invoice by ID (with items) ---
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      shipTo,
      billNo,
      date,
      terms,
      state,
      totalQty,
      sub_total,
      cgst,
      sgst,
      igst,
      totalAmount,
      grand_total,
      items,
      customer_id,
    } = req.body;
    
    console.log("Update Invoice Body:", req.body);

    const [updatedInvoice] = await sql`
      UPDATE invoices
      SET ship_to = ${shipTo},
          bill_no = ${billNo},
          date = ${date},
          terms_of_payment = ${terms},
          state = ${state},
          total_quantity = ${totalQty},
          sub_total = ${sub_total},
          cgst = ${cgst},
          sgst = ${sgst},
          igst = ${igst},
          grand_total = ${
            grand_total ?? totalAmount
          }, -- pick whichever is available
          customer_id = ${customer_id}
      WHERE invoice_id = ${id}
      RETURNING *
    `;

    if (!updatedInvoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Remove old items
    await sql`DELETE FROM items WHERE invoice_id = ${id}`;

    // Insert updated items
    if (items && items.length > 0) {
      for (let item of items) {
        const { name, hsn, qty, rate, amount } = item;
        await sql`
          INSERT INTO items (invoice_id, item_name, hsn, quantity, price, total)
          VALUES (${id}, ${name}, ${hsn}, ${qty}, ${rate}, ${amount})
        `;
      }
    }

    res.json({
      message: "Invoice updated successfully!",
      invoice: updatedInvoice,
    });
  } catch (err) {
    console.error("Update Invoice Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getRecentInvoices = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5; // default 5 invoices

    const invoices = await sql`
      SELECT i.invoice_id, i.bill_no, i.date, i.grand_total, i.invoice_status,
             c.name AS customer_name
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.customer_id
      WHERE i.invoice_status IS NOT NULL
      ORDER BY i.created_at DESC
      LIMIT ${limit}
    `;

    res.json(invoices);
  } catch (err) {
    console.error("Error fetching recent invoices:", err);
    res.status(500).json({ error: err.message });
  }
};