import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  deleteCustomer
} from "../controllers/customerController.js";

const router = express.Router();

// POST /api/customers
router.post("/", createCustomer);

// GET /api/customers
router.get("/", getAllCustomers);

// GET /api/customers/:id
router.get("/:id", getCustomerById);

router.delete("/:id", deleteCustomer);

export default router;
