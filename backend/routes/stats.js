import express from "express";
import { getDashboardStats,getInvoiceStatusCounts } from "../controllers/statsController.js";

const router = express.Router();

router.get("/", getDashboardStats);
router.get("/invoice-status", getInvoiceStatusCounts);

export default router;
