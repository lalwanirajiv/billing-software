import { getDB } from "./database";

// ================= CUSTOMERS ================= //

export const createCustomer = async (data) => {
  const db = await getDB();
  const { name, address_line1, address_line2, gstin, phone } = data;
  if (!name || name.trim() === "") throw new Error("Customer name is required");

  const result = await db.execute(
    `INSERT INTO customers (name, address_line1, address_line2, gstin, phone_number, created_at)
     VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
    [name, address_line1 || null, address_line2 || null, gstin || null, phone || null]
  );
  return { message: "Customer created successfully!", customerId: result.lastInsertId };
};

export const getAllCustomers = async () => {
  const db = await getDB();
  return await db.select(
    `SELECT * FROM customers WHERE is_deleted = 0 ORDER BY created_at DESC`
  );
};

export const getCustomerById = async (id) => {
  const db = await getDB();
  const customers = await db.select(
    `SELECT * FROM customers WHERE customer_id = $1`, [id]
  );
  if (customers.length === 0) throw new Error("Customer not found");
  return customers[0];
};

export const getIdByName = async (name) => {
  const db = await getDB();
  if (!name || name.trim() === "") throw new Error("Name is required");

  // case insensitive search in sqlite is default for LIKE
  const customers = await db.select(
    `SELECT * FROM customers WHERE name LIKE $1 AND is_deleted = 0`,
    [`%${name}%`]
  );
  if (customers.length === 0) throw new Error("Customer not found");
  return customers;
};

export const updateCustomer = async (id, data) => {
  const db = await getDB();
  const { name, address_line1, address_line2, gstin, phone } = data;
  if (!name || name.trim() === "") throw new Error("Customer name is required");

  await db.execute(
    `UPDATE customers 
     SET name = $1, address_line1 = $2, address_line2 = $3, gstin = $4, phone_number = $5
     WHERE customer_id = $6`,
    [name, address_line1 || null, address_line2 || null, gstin || null, phone || null, id]
  );
  return { message: "Customer updated successfully!" };
};

export const deleteCustomer = async (id) => {
  const db = await getDB();
  await db.execute(
    `UPDATE customers SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE customer_id = $1`,
    [id]
  );
  return { message: "Customer deleted successfully!" };
};

export const getTopCustomers = async (limit = 5) => {
  const db = await getDB();
  const res = await db.select(
    `SELECT c.customer_id, c.name AS customer_name, SUM(i.grand_total) AS total_revenue
     FROM customers c
     JOIN invoices i ON c.customer_id = i.customer_id
     GROUP BY c.customer_id, c.name
     ORDER BY total_revenue DESC
     LIMIT $1`,
    [limit]
  );
  return { data: res };
};

// ================= INVOICES ================= //

export const createInvoice = async (data) => {
  const db = await getDB();
  const { ship_to, bill_no, date, terms_of_payment, state, total_quantity, sub_total, cgst, sgst, igst, grand_total, discount, items, customer_id } = data;

  if (!ship_to || ship_to.trim() === "") throw new Error("Customer Name is required");

  const result = await db.execute(
    `INSERT INTO invoices (ship_to, bill_no, date, terms_of_payment, state, total_quantity, sub_total, cgst, sgst, igst, grand_total, discount, customer_id, invoice_status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'Due', CURRENT_TIMESTAMP)`,
    [
      ship_to || "",
      /^\d+(\.\d+)?$/.test(String(bill_no || "")) ? String(parseInt(bill_no, 10)) : String(bill_no || ""),
      date || null,
      terms_of_payment || "30 Days",
      state || "State",
      Number(total_quantity) || 0,
      Number(sub_total) || 0,
      Number(cgst) || 0,
      Number(sgst) || 0,
      Number(igst) || 0,
      Number(grand_total) || 0,
      Number(discount) || 0,
      customer_id || null,
    ]
  );
  const invoiceId = result.lastInsertId;

  if (items && items.length > 0) {
    for (let item of items) {
      await db.execute(
        `INSERT INTO items (invoice_id, item_name, hsn, quantity, price, total) VALUES ($1, $2, $3, $4, $5, $6)`,
        [invoiceId, item.item_name || item.name, item.hsn, item.quantity || item.qty, item.price || item.rate, item.total || item.amount]
      );
    }
  }
  return { message: "Invoice saved successfully!", invoiceId };
};

export const getInvoiceById = async (id) => {
  const db = await getDB();
  const docs = await db.select(`SELECT * FROM invoices WHERE invoice_id = $1`, [id]);
  if (docs.length === 0) throw new Error("Invoice not found");
  
  const items = await db.select(`SELECT * FROM items WHERE invoice_id = $1`, [id]);
  return { ...docs[0], items };
};

// Helper to refresh "Due" statuses to "Overdue" automatically
export const refreshInvoiceStatuses = async () => {
  const db = await getDB();
  const dueInvoices = await db.select(
    `SELECT invoice_id, date, terms_of_payment FROM invoices WHERE invoice_status = 'Due'`
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const inv of dueInvoices) {
    if (!inv.date) continue;

    // Default to 0 days if no numeric days are found
    let days = 30; // Default
    const match = inv.terms_of_payment?.match(/(\d+)/);
    if (match) {
      days = parseInt(match[0], 10);
    } else if (inv.terms_of_payment?.toLowerCase().includes("immediate")) {
      days = 0;
    }

    const billDate = new Date(inv.date);
    const dueDate = new Date(billDate);
    dueDate.setDate(billDate.getDate() + days);
    dueDate.setHours(0, 0, 0, 0);

    if (today > dueDate) {
      await db.execute(
        `UPDATE invoices SET invoice_status = 'Overdue' WHERE invoice_id = $1`,
        [inv.invoice_id]
      );
    }
  }
};

export const getAllInvoices = async () => {
  await refreshInvoiceStatuses();
  const db = await getDB();
  return await db.select(`SELECT * FROM invoices ORDER BY bill_no DESC`);
};

export const updateStatus = async (id, status) => {
  const db = await getDB();
  await db.execute(`UPDATE invoices SET invoice_status = $1 WHERE invoice_id = $2`, [status, id]);
  return { invoice_id: id, invoice_status: status };
};

export const getInvoicesByCustomerId = async (customerId) => {
  await refreshInvoiceStatuses();
  const db = await getDB();
  return await db.select(
    `SELECT * FROM invoices WHERE customer_id = $1 ORDER BY date DESC, bill_no DESC`,
    [customerId]
  );
};

export const getRecentInvoices = async (limit = 5) => {
  await refreshInvoiceStatuses();
  const db = await getDB();
  const invoices = await db.select(
    `SELECT i.invoice_id, i.bill_no, i.date, i.grand_total, i.invoice_status, c.name AS customer_name
     FROM invoices i
     LEFT JOIN customers c ON i.customer_id = c.customer_id
     WHERE i.invoice_status IS NOT NULL
     ORDER BY i.created_at DESC LIMIT $1`,
    [limit]
  );
  return { data: invoices };
};

export const updateInvoice = async (id, data) => {
  const db = await getDB();
  const { ship_to, bill_no, date, terms_of_payment, state, total_quantity, sub_total, cgst, sgst, igst, grand_total, discount, items, customer_id } = data;

  await db.execute(
    `UPDATE invoices
     SET ship_to = $1, bill_no = $2, date = $3, terms_of_payment = $4, state = $5, total_quantity = $6, sub_total = $7, cgst = $8, sgst = $9, igst = $10, grand_total = $11, discount = $12, customer_id = $13
     WHERE invoice_id = $14`,
    [
      ship_to || "",
      String(bill_no || ""),
      date || null,
      terms_of_payment || "30 Days",
      state || "State",
      Number(total_quantity) || 0,
      Number(sub_total) || 0,
      Number(cgst) || 0,
      Number(sgst) || 0,
      Number(igst) || 0,
      Number(grand_total) || 0,
      Number(discount) || 0,
      customer_id || null,
      id,
    ]
  );

  await db.execute(`DELETE FROM items WHERE invoice_id = $1`, [id]);

  if (items && items.length > 0) {
    for (let item of items) {
      await db.execute(
        `INSERT INTO items (invoice_id, item_name, hsn, quantity, price, total) VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, item.item_name || item.name, item.hsn, item.quantity || item.qty, item.price || item.rate, item.total || item.amount]
      );
    }
  }
  return { message: "Invoice updated successfully!" };
};

export const checkInvoice = async (billNo) => {
  const db = await getDB();
  const invoices = await db.select(`SELECT * FROM invoices WHERE bill_no = $1`, [billNo]);
  return { exists: invoices.length > 0 };
};

export const getNextBillNo = async () => {
  const db = await getDB();
  // Cast to integer to get the max numeric bill number, ignoring non-numeric ones
  const res = await db.select(
    `SELECT MAX(CAST(bill_no AS INTEGER)) as max_bill FROM invoices WHERE bill_no GLOB '[0-9]*'`
  );
  const maxBill = res[0]?.max_bill;
  return maxBill ? Number(maxBill) + 1 : 1;
};

export const deleteInvoice = async (id) => {
  const db = await getDB();
  // Manual fallback: Delete items first to avoid foreign key constraint errors
  // even if the table was initialized without ON DELETE CASCADE.
  await db.execute(`DELETE FROM items WHERE invoice_id = $1`, [id]);
  await db.execute(`DELETE FROM invoices WHERE invoice_id = $1`, [id]);
  return { message: "Invoice deleted successfully!" };
};

// ================= STATS ================= //

export const getDashboardStats = async () => {
    await refreshInvoiceStatuses();
    const db = await getDB();
    
    const calcChange = (current, previous) => {
        if (!previous || previous === 0) return current ? 100 : 0;
        return (((current - previous) / previous) * 100).toFixed(1);
    };

    const runQuery = async (query) => {
        const res = await db.select(query);
        return res[0] ? Object.values(res[0])[0] : 0;
    };

    const currentMonthCondition = "strftime('%Y-%m', date) = strftime('%Y-%m', 'now')";
    const lastMonthCondition = "strftime('%Y-%m', date) = strftime('%Y-%m', 'now', '-1 month')";

    const totalRevenueCurrentMonth = await runQuery(`SELECT SUM(grand_total) FROM invoices WHERE ${currentMonthCondition}`);
    const prevTotalRevenue = await runQuery(`SELECT SUM(grand_total) FROM invoices WHERE ${lastMonthCondition}`);
    
    const totalRevenue = await runQuery(`SELECT SUM(grand_total) FROM invoices`);
    const overdueAmount = await runQuery(`SELECT SUM(grand_total) FROM invoices WHERE invoice_status='Overdue'`);
    const dueAmount = await runQuery(`SELECT SUM(grand_total) FROM invoices WHERE invoice_status='Due'`);
    const paidAmount = await runQuery(`SELECT SUM(grand_total) FROM invoices WHERE invoice_status='Paid'`);
    
    const invoicesDue = await runQuery(`SELECT COUNT(*) FROM invoices WHERE invoice_status='Due'`);
    const invoicesPaid = await runQuery(`SELECT COUNT(*) FROM invoices WHERE invoice_status='Paid'`);
    const invoicesOverdue = await runQuery(`SELECT COUNT(*) FROM invoices WHERE invoice_status='Overdue'`);
    
    // Growth of the total base (Total Now vs Total at start of month)
    const totalCustomers = await runQuery(`SELECT COUNT(*) FROM customers WHERE is_deleted = 0`);
    const totalCustomersStartOfMonth = await runQuery(`
        SELECT COUNT(*) FROM customers 
        WHERE is_deleted = 0 
        AND date(created_at) < date('now', 'start of month')
    `);

    const prevOverdueAmount = await runQuery(`SELECT SUM(grand_total) FROM invoices WHERE invoice_status='Overdue' AND ${lastMonthCondition}`);

    return {
        data: {
            totalRevenueCurrentMonth: totalRevenueCurrentMonth || 0,
            // Revenue Change: This Month Performance vs Last Month Performance
            totalRevenueChange: Number(calcChange(totalRevenueCurrentMonth || 0, prevTotalRevenue || 0)),
            overdueAmount: overdueAmount || 0,
            dueAmount: dueAmount || 0,
            paidAmount: paidAmount || 0,
            overdueAmountChange: Number(calcChange(overdueAmount || 0, prevOverdueAmount || 0)),
            invoicesDue: Number(invoicesDue) || 0,
            invoicesPaid: Number(invoicesPaid) || 0,
            invoicesOverdue: Number(invoicesOverdue) || 0,
            invoicesDueChange: null,
            totalRevenue: Number(totalRevenue) || 0,
            totalCustomers: Number(totalCustomers) || 0,
            // Customer Change: Growth of the total base this month
            totalCustomersChange: Number(calcChange(totalCustomers || 0, totalCustomersStartOfMonth || 0))
        }
    };
};

export const getInvoiceStatusCounts = async () => {
    const db = await getDB();
    const data = [];
    const statuses = ["Paid", "Overdue", "Due"];
    for (const status of statuses) {
        const res = await db.select(`SELECT COUNT(*) as value FROM invoices WHERE invoice_status = $1`, [status]);
        data.push({ name: status, value: Number(res[0]?.value) || 0 });
    }
    return { data };
};

export const getRevenueTimeline = async () => {
    const db = await getDB();
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();
    
    // Financial Year starts in April (4)
    const fyStartYear = currentMonth >= 4 ? currentYear : currentYear - 1;
    const fyEndYear = fyStartYear + 1;
    
    const startDate = `${fyStartYear}-04-01`;
    const endDate = `${fyEndYear}-03-31`;

    const res = await db.select(`
        SELECT strftime('%Y-%m', date) as month, SUM(grand_total) as revenue, COUNT(*) as count
        FROM invoices 
        WHERE date BETWEEN $1 AND $2
        GROUP BY month 
        ORDER BY month ASC
    `, [startDate, endDate]);
    
    const fullYearData = [];
    for (let m = 0; m < 12; m++) {
        const monthDate = new Date(fyStartYear, 3 + m, 1);
        const isoMonth = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
        const existing = res.find(r => r.month === isoMonth);
        fullYearData.push({
            month: isoMonth,
            revenue: existing ? Number(existing.revenue) : 0,
            count: existing ? Number(existing.count) : 0
        });
    }
    
    return { data: fullYearData };
};

// ================= DETAILED REPORTS ================= //

export const getSalesReport = async (startDate, endDate) => {
  await refreshInvoiceStatuses();
  const db = await getDB();
  
  const start = startDate || "1900-01-01";
  const end = endDate || "2999-12-31";

  // Using a more inclusive query to capture NULL dates and edge cases
  const res = await db.select(
    `SELECT invoice_id, date, bill_no AS invoice, ship_to AS customer, grand_total AS amount, (sub_total) AS taxable_value, (cgst + sgst + igst) AS tax, invoice_status
     FROM invoices
     WHERE date BETWEEN $1 AND $2
     ORDER BY date DESC, bill_no DESC`,
    [start, end]
  );
  return { data: res };
};

export const getInvoiceStatusReport = async (startDate, endDate) => {
  const db = await getDB();
  const start = startDate || "1900-01-01";
  const end = endDate || "2999-12-31";
  
  const res = await db.select(
    `SELECT 
        invoice_status as status, 
        COUNT(*) as count, 
        SUM(grand_total) as amount
     FROM invoices
     WHERE date BETWEEN $1 AND $2
     GROUP BY invoice_status`,
    [start, end]
  );
  return { data: res };
};

export const getTaxReport = async (startDate, endDate) => {
  const db = await getDB();
  const start = startDate || "1900-01-01";
  const end = endDate || "2999-12-31";
  const res = await db.select(
    `SELECT 
        SUM(sub_total) AS taxable_value, 
        SUM(cgst) AS total_cgst, 
        SUM(sgst) AS total_sgst, 
        SUM(igst) AS total_igst, 
        SUM(cgst + sgst + igst) AS total_tax,
        SUM(grand_total) AS total_amount,
        COUNT(*) as total_invoices,
        SUM(CASE WHEN igst > 0 THEN 1 ELSE 0 END) as interstate_count,
        SUM(CASE WHEN igst > 0 THEN 0 ELSE 1 END) as state_count,
        SUM(CASE WHEN igst > 0 THEN grand_total ELSE 0 END) as interstate_amount,
        SUM(CASE WHEN igst > 0 THEN 0 ELSE grand_total END) as state_amount
     FROM invoices
     WHERE date BETWEEN $1 AND $2`,
    [start, end]
  );
  return { 
    data: res[0] || { 
      taxable_value: 0, total_cgst: 0, total_sgst: 0, total_igst: 0, total_tax: 0, 
      total_amount: 0, total_invoices: 0, interstate_count: 0, state_count: 0, 
      interstate_amount: 0, state_amount: 0 
    } 
  };
};

export const getCustomerDetailedReport = async (startDate, endDate) => {
  const db = await getDB();
  const start = startDate || "1900-01-01";
  const end = endDate || "2999-12-31";
  const res = await db.select(
    `SELECT ship_to AS customer, COUNT(*) AS total_invoices, SUM(grand_total) AS total_revenue
     FROM invoices
     WHERE date BETWEEN $1 AND $2
     GROUP BY ship_to
     ORDER BY total_revenue DESC`,
    [start, end]
  );
  return { data: res };
};

export const getRevenueChartData = async (startDate, endDate) => {
  const db = await getDB();
  const start = startDate || "1900-01-01";
  const end = endDate || "2999-12-31";
  const res = await db.select(
    `SELECT strftime('%Y-%m', date) AS name, SUM(grand_total) AS sales
     FROM invoices
     WHERE date BETWEEN $1 AND $2
     GROUP BY name
     ORDER BY name ASC`,
    [start, end]
  );
  return { data: res };
};

export const getTopSellingItems = async (limit = 5) => {
  const db = await getDB();
  const res = await db.select(
    `SELECT item_name as name, SUM(quantity) as value, SUM(total) as revenue
     FROM items
     GROUP BY item_name
     ORDER BY revenue DESC
     LIMIT $1`,
    [limit]
  );
  return { data: res };
};

export const getDetailedInvoicesByDate = async (startDate, endDate) => {
  const db = await getDB();
  const start = startDate || "1900-01-01";
  const end = endDate || "2999-12-31";
  
  const res = await db.select(
    `SELECT i.*, c.name AS customer_name, c.gstin AS customer_gstin 
     FROM invoices i
     LEFT JOIN customers c ON i.customer_id = c.customer_id
     WHERE (i.date BETWEEN $1 AND $2) OR (i.date IS NULL AND $1 = '1900-01-01')
     ORDER BY i.date ASC, i.bill_no ASC`,
    [start, end]
  );
  return { data: res };
};

