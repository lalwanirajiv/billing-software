import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  deleteCustomer,
  getIdByName,
  getTopCustomers,
} from "../controllers/customerController.js";

const router = express.Router();

router.post("/", createCustomer);
router.get("/", getAllCustomers);
router.get("/search", getIdByName);
router.get("/top", getTopCustomers);
router.get("/:id", getCustomerById);
router.delete("/:id", deleteCustomer);

export default router;
