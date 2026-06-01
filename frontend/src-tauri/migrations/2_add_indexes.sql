CREATE INDEX IF NOT EXISTS idx_invoices_bill_no ON invoices (bill_no);

CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices (customer_id);

CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices (date);

CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices (invoice_status);

CREATE INDEX IF NOT EXISTS idx_items_invoice_id ON items (invoice_id);

CREATE INDEX IF NOT EXISTS idx_customers_is_deleted ON customers (is_deleted);
