import sql from "../db.js";

// ------------------ CREATE CUSTOMER ------------------
export const createCustomer = async (req, res) => {
  try {
    const { name, address_line1, address_line2, gstin, phone } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Customer name is required" });
    }

    const [customer] = await sql`
      INSERT INTO customers (name, address_line1, address_line2, gstin, phone_number, created_at)
      VALUES (
        ${name}, 
        ${address_line1 || null}, 
        ${address_line2 || null}, 
        ${gstin || null}, 
        ${phone || null}, 
        NOW()
      )
      RETURNING customer_id
    `;

    res.json({
      message: "Customer created successfully!",
      customerId: customer.customer_id,
    });
  } catch (err) {
    console.error("❌ Error creating customer:", err);
    res.status(500).json({ error: err.message });
  }
};

// ------------------ GET ALL CUSTOMERS ------------------
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await sql`
      SELECT * FROM customers 
      WHERE is_deleted = FALSE
      ORDER BY created_at DESC
    `;
    res.json(customers);
  } catch (err) {
    console.error("❌ Error fetching customers:", err);
    res.status(500).json({ error: err.message });
  }
};

// ------------------ GET CUSTOMER BY ID ------------------
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const [customer] = await sql`
      SELECT * FROM customers 
      WHERE customer_id = ${id}
    `;
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    console.error("❌ Error fetching customer:", err);
    res.status(500).json({ error: err.message });
  }
};

// ------------------ GET CUSTOMER ID BY NAME ------------------
export const getIdByName = async (req, res) => {
  try {
    const { name } = req.query; 
    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ error: "Name query parameter is required" });
    }

    const customers = await sql`
      SELECT * FROM customers
      WHERE name ILIKE ${"%" + name + "%"} AND is_deleted = FALSE
    `;

    if (customers.length === 0)
      return res.status(404).json({ error: "Customer not found" });

    res.json(customers);
  } catch (err) {
    console.error("❌ Error fetching customer by name:", err);
    res.status(500).json({ error: err.message });
  }
};

// ------------------ SOFT DELETE CUSTOMER ------------------
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const [customer] = await sql`
      UPDATE customers 
      SET is_deleted = TRUE, deleted_at = NOW()
      WHERE customer_id = ${id} AND is_deleted = FALSE
      RETURNING customer_id, name
    `;

    if (!customer) {
      return res
        .status(404)
        .json({ error: "Customer not found or already deleted" });
    }

    res.json({ message: "Customer deleted successfully!", customer });
  } catch (err) {
    console.error("❌ Error deleting customer:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getTopCustomers = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5; 
  try {
    const customers = await sql`
      SELECT c.customer_id, c.name AS customer_name,
             SUM(i.grand_total::numeric) AS total_revenue
      FROM customers c
      JOIN invoices i ON c.customer_id = i.customer_id
      GROUP BY c.customer_id, c.name
      ORDER BY total_revenue DESC
      LIMIT ${limit}
    `;
    res.json(customers);
  } catch (err) {
    console.error("Error fetching top customers:", err);
    res.status(500).json({ error: "Failed to fetch top customers" });
  }
};