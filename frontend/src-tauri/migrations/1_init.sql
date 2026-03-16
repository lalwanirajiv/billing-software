CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address_line1 TEXT,
  address_line2 TEXT,
  gstin TEXT,
  phone_number TEXT,
  is_deleted BOOLEAN DEFAULT 0,
  deleted_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
  invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
  ship_to TEXT NOT NULL,
  bill_no TEXT,
  date DATETIME,
  terms_of_payment TEXT,
  state TEXT,
  total_quantity INTEGER,
  sub_total REAL,
  cgst REAL,
  sgst REAL,
  igst REAL,
  grand_total REAL,
  customer_id INTEGER,
  invoice_status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL
);

CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER,
  item_name TEXT,
  hsn TEXT,
  quantity REAL,
  price REAL,
  total REAL,
  FOREIGN KEY(invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE
);
