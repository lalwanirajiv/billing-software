import express from "express";
import {
  createInvoice,
  getInvoiceById,
  getAllInvoices,
  getInvoicesWithCustomer,
  checkInvoice,
  updateStatus,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/", createInvoice);
router.put("/:id/status", updateStatus);
router.get("/:id", getInvoiceById);
router.get("/", getAllInvoices);
router.get("/:id", getInvoicesWithCustomer);
router.get("/check/:billNo", checkInvoice);

export default router;
