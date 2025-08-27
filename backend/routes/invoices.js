import express from 'express';
import { createInvoice, getInvoiceById, getAllInvoices } from '../controllers/invoiceController.js';

const router = express.Router();

router.post('/', createInvoice);
router.get('/:id', getInvoiceById);
router.get('/', getAllInvoices);

export default router;
