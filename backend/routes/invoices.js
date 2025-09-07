import express from "express";
import {
  createInvoice,
  getInvoiceById,
  getAllInvoices,
  getInvoicesWithCustomer,
  checkInvoice,
  updateStatus,
  updateInvoice,
  getRecentInvoices
} from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/", createInvoice);
router.get("/recent", getRecentInvoices);
router.put("/:id/status", updateStatus);
router.get("/:id", getInvoiceById);
router.get("/", getAllInvoices);
router.put("/:id", updateInvoice);
router.get("/:id", getInvoicesWithCustomer);
router.get("/check/:billNo", checkInvoice);
export default router;
