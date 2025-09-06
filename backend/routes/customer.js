import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  deleteCustomer,
  getIdByName,
} from "../controllers/customerController.js";

const router = express.Router();

// POST /api/customers
router.post("/", createCustomer);

// GET /api/customers
router.get("/", getAllCustomers);

// GET /api/customers/search?name=Rahul
router.get("/search", getIdByName);
// GET /api/customers/:id
router.get("/:id", getCustomerById);

// DELETE /api/customers/:id
router.delete("/:id", deleteCustomer);

export default router;
