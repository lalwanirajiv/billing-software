
import sql from '../db.js';

export const createCustomer = async (req, res) => {
  try {
    const { name, address_line1, address_line2 , gstin } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Customer name is required" });
    }

    const [customer] = await sql`
      INSERT INTO customers (name, address_line1 , address_line2 , gstin, created_at)
      VALUES (${name}, ${address_line1 || null},${ address_line2  || null}, ${gstin || null}, NOW())
      RETURNING id
    `;

    res.json({ message: "Customer created successfully!", customerId: customer.id });
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await sql`SELECT * FROM customers ORDER BY created_at DESC`;
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
    const [customer] = await sql`SELECT * FROM customers WHERE id = ${id}`;
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res.status(500).json({ error: err.message });
  }
};
