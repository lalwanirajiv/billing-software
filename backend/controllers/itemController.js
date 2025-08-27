import sql from '../db.js';

// --- Get items by invoice ID ---
export const getItemsByInvoiceId = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const items = await sql`SELECT * FROM items WHERE invoice_id = ${invoiceId}`;
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// --- Create single item (optional) ---
export const createItem = async (req, res) => {
  try {
    const { invoice_id, item_name, quantity, price, total } = req.body;

    if (!invoice_id) return res.status(400).json({ error: "Invoice ID is required" });

    const [item] = await sql`
      INSERT INTO items
      (invoice_id, item_name, quantity, price, total)
      VALUES
      (${invoice_id}, ${item_name}, ${quantity}, ${price}, ${total})
      RETURNING *
    `;

    res.json({ message: "Item saved successfully!", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// --- Optional: delete an item ---
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM items WHERE id = ${id}`;
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
