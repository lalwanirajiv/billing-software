ALTER TABLE company_settings ADD COLUMN setup_completed INTEGER NOT NULL DEFAULT 0;

-- Existing installations with data skip the first-time wizard.
UPDATE company_settings
SET setup_completed = 1
WHERE id = 1
  AND (
    EXISTS (SELECT 1 FROM invoices LIMIT 1)
    OR EXISTS (SELECT 1 FROM customers WHERE is_deleted = 0 LIMIT 1)
  );
