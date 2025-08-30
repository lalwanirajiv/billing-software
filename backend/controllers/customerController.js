import sql from "../db.js";

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
      customerId: customer.id,
    });
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await sql`
      SELECT * FROM customers 
      WHERE is_deleted = FALSE
      ORDER BY created_at DESC
    `;
    res.json(customers);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const [customer] = await sql`
      SELECT * FROM customers 
      WHERE id = ${id} AND is_deleted = FALSE
    `;
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res.status(500).json({ error: err.message });
  }
};

// Soft delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const [customer] = await sql`
      UPDATE customers 
      SET is_deleted = TRUE, deleted_at = NOW()
      WHERE id = ${id} AND is_deleted = FALSE
      RETURNING id, name
    `;

    if (!customer) {
      return res
        .status(404)
        .json({ error: "Customer not found or already deleted" });
    }

    res.json({ message: "Customer deleted successfully!", customer });
  } catch (err) {
    console.error("Error deleting customer:", err);
    res.status(500).json({ error: err.message });
  }
};
