import express from 'express';
import { getItemsByInvoiceId, createItem, deleteItem } from '../controllers/itemController.js';

const router = express.Router();

router.get('/:invoiceId', getItemsByInvoiceId);
router.post('/', createItem);
router.delete('/:id', deleteItem);

export default router;
