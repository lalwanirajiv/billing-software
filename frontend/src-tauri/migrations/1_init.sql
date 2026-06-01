-- Canonical schema (fresh installs + legacy DBs without migration history)
CREATE TABLE IF NOT EXISTS customers (
  customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address_line1 TEXT,
  address_line2 TEXT,
  gstin TEXT,
  phone_number TEXT,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  deleted_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
  invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
  ship_to TEXT NOT NULL DEFAULT '',
  bill_no TEXT,
  date TEXT,
  terms_of_payment TEXT,
  state TEXT,
  total_quantity INTEGER DEFAULT 0,
  sub_total REAL DEFAULT 0,
  cgst REAL DEFAULT 0,
  sgst REAL DEFAULT 0,
  igst REAL DEFAULT 0,
  grand_total REAL DEFAULT 0,
  discount REAL NOT NULL DEFAULT 0,
  customer_id INTEGER,
  invoice_status TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers (customer_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER NOT NULL,
  item_name TEXT,
  hsn TEXT,
  quantity REAL DEFAULT 0,
  price REAL DEFAULT 0,
  total REAL DEFAULT 0,
  FOREIGN KEY (invoice_id) REFERENCES invoices (invoice_id) ON DELETE CASCADE
);
