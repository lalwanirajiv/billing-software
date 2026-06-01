DROP INDEX IF EXISTS idx_invoices_bill_no;

CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_bill_no_unique ON invoices (bill_no)
WHERE bill_no IS NOT NULL AND bill_no != '';
