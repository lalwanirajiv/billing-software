import { getDB, withTransaction } from "./database";
import { assertValidCustomerData, normalizeName } from "./validation";
import {
  deriveFyStartYearsFromDates,
  getCurrentFyStartYear,
  getFyRangeFromStartYear,
  getFyStartYearFromDate,
} from "./financialYear";

// ================= INVOICE HELPERS ================= //

export function buildFinalBillNo(billNo, date = new Date()) {
  const trimmed = String(billNo ?? "").trim();
  if (!trimmed) return "";

  if (/^\d+$/.test(trimmed)) {
    const invDate = date ? new Date(date) : new Date();
    const invMonth = invDate.getMonth() + 1;
    const invYear = invDate.getFullYear();
    const fyStartYear = invMonth >= 4 ? invYear : invYear - 1;
    const fyEndYear = fyStartYear + 1;
    return `${fyStartYear}-${fyEndYear}_${parseInt(trimmed, 10)}`;
  }

  return trimmed;
}

async function assertBillNoAvailable(db, billNo, excludeInvoiceId = null) {
  if (!billNo) {
    throw new Error("Bill number is required");
  }

  const rows = excludeInvoiceId
    ? await db.select(
        `SELECT invoice_id FROM invoices WHERE bill_no = $1 AND invoice_id != $2`,
        [billNo, excludeInvoiceId]
      )
    : await db.select(`SELECT invoice_id FROM invoices WHERE bill_no = $1`, [billNo]);

  if (rows.length > 0) {
    throw new Error("An invoice with this bill number already exists.");
  }
}

async function insertInvoiceItems(db, invoiceId, items) {
  if (!items?.length) return;

  for (const item of items) {
    await db.execute(
      `INSERT INTO items (invoice_id, item_name, hsn, quantity, price, total) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        invoiceId,
        item.item_name || item.name,
        item.hsn,
        item.quantity || item.qty,
        item.price || item.rate,
        item.total || item.amount,
      ]
    );
  }
}

function invoiceInsertParams(data, billNo) {
  const {
    ship_to,
    date,
    terms_of_payment,
    state,
    total_quantity,
    sub_total,
    cgst,
    sgst,
    igst,
    grand_total,
    discount,
    customer_id,
  } = data;

  return [
    ship_to || "",
    billNo,
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
  ];
}

// ================= CUSTOMERS ================= //

async function findCustomerByExactName(db, name, excludeCustomerId = null) {
  const trimmed = normalizeName(name);
  if (!trimmed) return null;

  const rows = excludeCustomerId
    ? await db.select(
        `SELECT * FROM customers
         WHERE LOWER(TRIM(name)) = LOWER($1) AND is_deleted = 0 AND customer_id != $2`,
        [trimmed, excludeCustomerId]
      )
    : await db.select(
        `SELECT * FROM customers
         WHERE LOWER(TRIM(name)) = LOWER($1) AND is_deleted = 0`,
        [trimmed]
      );

  return rows;
}

export const createCustomer = async (data) => {
  assertValidCustomerData(data);

  const db = await getDB();
  const name = normalizeName(data.name);
  const gstin = normalizeName(data.gstin).toUpperCase() || null;
  const phone = normalizeName(data.phone) || null;
  const { address_line1, address_line2 } = data;

  const existing = await findCustomerByExactName(db, name);
  if (existing.length > 0) {
    throw new Error("A customer with this name already exists.");
  }

  const result = await db.execute(
    `INSERT INTO customers (name, address_line1, address_line2, gstin, phone_number, created_at)
     VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
    [name, address_line1 || null, address_line2 || null, gstin, phone]
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

/** Exact name match (case-insensitive, trimmed). */
export const getCustomerByExactName = async (name) => {
  const db = await getDB();
  const trimmed = normalizeName(name);
  if (!trimmed) throw new Error("Customer name is required");

  const customers = await findCustomerByExactName(db, trimmed);
  if (customers.length === 0) {
    throw new Error("Customer not found. Please select a customer from the list or create one first.");
  }
  if (customers.length > 1) {
    throw new Error("Multiple customers match this name. Please use a unique customer name.");
  }
  return customers[0];
};

/** @deprecated Use getCustomerByExactName — kept for compatibility */
export const getIdByName = async (name) => {
  const customer = await getCustomerByExactName(name);
  return [customer];
};

export const updateCustomer = async (id, data) => {
  assertValidCustomerData(data);

  const db = await getDB();
  const name = normalizeName(data.name);
  const gstin = normalizeName(data.gstin).toUpperCase() || null;
  const phone = normalizeName(data.phone) || null;
  const { address_line1, address_line2 } = data;

  const duplicates = await findCustomerByExactName(db, name, id);
  if (duplicates.length > 0) {
    throw new Error("Another customer with this name already exists.");
  }

  await db.execute(
    `UPDATE customers 
     SET name = $1, address_line1 = $2, address_line2 = $3, gstin = $4, phone_number = $5
     WHERE customer_id = $6`,
    [name, address_line1 || null, address_line2 || null, gstin, phone, id]
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

export const deleteCustomersBulk = async (ids) => {
  const db = await getDB();
  for (const id of ids) {
    await db.execute(
      `UPDATE customers SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE customer_id = $1`,
      [id]
    );
  }
  return { message: `${ids.length} customers deleted successfully!` };
};

export const getTopCustomers = async (limit = 5, startDate, endDate) => {
  const db = await getDB();
  const start = startDate || "1900-01-01";
  const end = endDate || "2999-12-31";
  const res = await db.select(
    `SELECT c.customer_id, c.name AS customer_name, SUM(i.grand_total) AS total_revenue
     FROM customers c
     JOIN invoices i ON c.customer_id = i.customer_id
     WHERE i.date BETWEEN $1 AND $2
     GROUP BY c.customer_id, c.name
     ORDER BY total_revenue DESC
     LIMIT $3`,
    [start, end, limit]
  );
  return { data: res };
};

export const getAvailableFinancialYears = async () => {
  const db = await getDB();
  const rows = await db.select(
    `SELECT DISTINCT date FROM invoices WHERE date IS NOT NULL ORDER BY date ASC`
  );
  const dates = rows.map((r) => r.date);
  return { data: deriveFyStartYearsFromDates(dates) };
};

// ================= INVOICES ================= //

export const createInvoice = async (data) => {
  const { ship_to, bill_no, date, items } = data;

  if (!ship_to || ship_to.trim() === "") {
    throw new Error("Customer Name is required");
  }

  const normalizedBillNo = buildFinalBillNo(bill_no, date);
  if (!normalizedBillNo) {
    throw new Error("Bill number is required");
  }

  return withTransaction(async (db) => {
    await assertBillNoAvailable(db, normalizedBillNo);

    const result = await db.execute(
      `INSERT INTO invoices (ship_to, bill_no, date, terms_of_payment, state, total_quantity, sub_total, cgst, sgst, igst, grand_total, discount, customer_id, invoice_status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'Due', CURRENT_TIMESTAMP)`,
      invoiceInsertParams(data, normalizedBillNo)
    );

    const invoiceId = result.lastInsertId;
    try {
      await insertInvoiceItems(db, invoiceId, items);
    } catch (error) {
      await db.execute(`DELETE FROM invoices WHERE invoice_id = $1`, [invoiceId]);
      throw error;
    }

    return { message: "Invoice saved successfully!", invoiceId };
  });
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
  return withTransaction(async (db) => {
    const dueInvoices = await db.select(
      `SELECT invoice_id, date, terms_of_payment FROM invoices WHERE invoice_status = 'Due'`
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const inv of dueInvoices) {
      if (!inv.date) continue;

      let days = 30;
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
  });
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

export const getInvoicesByCustomerId = async (customerId, startDate, endDate) => {
  await refreshInvoiceStatuses();
  const db = await getDB();
  if (startDate && endDate) {
    return await db.select(
      `SELECT * FROM invoices
       WHERE customer_id = $1 AND date BETWEEN $2 AND $3
       ORDER BY date DESC, bill_no DESC`,
      [customerId, startDate, endDate]
    );
  }
  return await db.select(
    `SELECT * FROM invoices WHERE customer_id = $1 ORDER BY date DESC, bill_no DESC`,
    [customerId]
  );
};

export const getInvoicesByDateRange = async (startDate, endDate) => {
  await refreshInvoiceStatuses();
  const db = await getDB();
  const start = startDate || "1900-01-01";
  const end = endDate || "2999-12-31";
  return await db.select(
    `SELECT * FROM invoices
     WHERE (date BETWEEN $1 AND $2) OR (date IS NULL AND $1 = '1900-01-01')
     ORDER BY bill_no DESC`,
    [start, end]
  );
};

export const getRecentInvoices = async (limit = 5, startDate, endDate) => {
  await refreshInvoiceStatuses();
  const db = await getDB();
  const start = startDate || "1900-01-01";
  const end = endDate || "2999-12-31";
  const invoices = await db.select(
    `SELECT i.invoice_id, i.bill_no, i.date, i.grand_total, i.invoice_status, c.name AS customer_name
     FROM invoices i
     LEFT JOIN customers c ON i.customer_id = c.customer_id
     WHERE i.invoice_status IS NOT NULL AND i.date BETWEEN $1 AND $2
     ORDER BY i.created_at DESC LIMIT $3`,
    [start, end, limit]
  );
  return { data: invoices };
};

export const updateInvoice = async (id, data) => {
  const { bill_no, date, items } = data;
  const normalizedBillNo = buildFinalBillNo(bill_no, date);
  if (!normalizedBillNo) {
    throw new Error("Bill number is required");
  }

  return withTransaction(async (db) => {
    await assertBillNoAvailable(db, normalizedBillNo, id);

    const previousItems = await db.select(
      `SELECT item_name, hsn, quantity, price, total FROM items WHERE invoice_id = $1`,
      [id]
    );

    await db.execute(
      `UPDATE invoices
       SET ship_to = $1, bill_no = $2, date = $3, terms_of_payment = $4, state = $5, total_quantity = $6, sub_total = $7, cgst = $8, sgst = $9, igst = $10, grand_total = $11, discount = $12, customer_id = $13
       WHERE invoice_id = $14`,
      [...invoiceInsertParams(data, normalizedBillNo), id]
    );

    await db.execute(`DELETE FROM items WHERE invoice_id = $1`, [id]);

    try {
      await insertInvoiceItems(db, id, items);
    } catch (error) {
      for (const item of previousItems) {
        await db.execute(
          `INSERT INTO items (invoice_id, item_name, hsn, quantity, price, total) VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, item.item_name, item.hsn, item.quantity, item.price, item.total]
        );
      }
      throw error;
    }

    return { message: "Invoice updated successfully!", invoiceId: id };
  });
};

export const checkInvoice = async (billNo, date = new Date(), excludeInvoiceId = null) => {
  const db = await getDB();
  const normalizedBillNo = buildFinalBillNo(billNo, date);
  if (!normalizedBillNo) return { exists: false };

  const rows = excludeInvoiceId
    ? await db.select(
        `SELECT invoice_id FROM invoices WHERE bill_no = $1 AND invoice_id != $2`,
        [normalizedBillNo, excludeInvoiceId]
      )
    : await db.select(`SELECT invoice_id FROM invoices WHERE bill_no = $1`, [normalizedBillNo]);

  return { exists: rows.length > 0 };
};

export const getNextBillNo = async (date = new Date()) => {
  const db = await getDB();
  const fyStartYear = getFyStartYearFromDate(date);
  const fyPrefix = `${fyStartYear}-${fyStartYear + 1}_`;
  const res = await db.select(`SELECT bill_no FROM invoices`);

  let maxNum = 0;
  res.forEach((row) => {
    const billNo = row.bill_no;
    if (!billNo) return;
    if (billNo.startsWith(fyPrefix)) {
      const num = parseInt(billNo.slice(fyPrefix.length), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    } else if (billNo.includes("_")) {
      const parts = billNo.split("_");
      const prefix = parts[0];
      if (prefix === `${fyStartYear}-${fyStartYear + 1}`) {
        const num = parseInt(parts[1], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    } else if (/^\d+$/.test(billNo) && fyStartYear === getCurrentFyStartYear()) {
      const num = parseInt(billNo, 10);
      if (num > maxNum) maxNum = num;
    }
  });

  return maxNum + 1;
};

export const deleteInvoice = async (id) => {
  return withTransaction(async (db) => {
    await db.execute(`DELETE FROM items WHERE invoice_id = $1`, [id]);
    await db.execute(`DELETE FROM invoices WHERE invoice_id = $1`, [id]);
    return { message: "Invoice deleted successfully!" };
  });
};

export const deleteInvoicesBulk = async (ids) => {
  return withTransaction(async (db) => {
    for (const id of ids) {
      await db.execute(`DELETE FROM items WHERE invoice_id = $1`, [id]);
      await db.execute(`DELETE FROM invoices WHERE invoice_id = $1`, [id]);
    }
    return { message: `${ids.length} invoices deleted successfully!` };
  });
};

// ================= STATS ================= //

export const getDashboardStats = async (startDate, endDate) => {
    await refreshInvoiceStatuses();
    const db = await getDB();
    const start = startDate || "1900-01-01";
    const end = endDate || "2999-12-31";
    const fyFilter = `date BETWEEN '${start}' AND '${end}'`;

    const calcChange = (current, previous) => {
        if (!previous || previous === 0) return current ? 100 : 0;
        return (((current - previous) / previous) * 100).toFixed(1);
    };

    const runQuery = async (query, params = []) => {
        const res = params.length ? await db.select(query, params) : await db.select(query);
        return res[0] ? Object.values(res[0])[0] : 0;
    };

    const currentMonthCondition = `strftime('%Y-%m', date) = strftime('%Y-%m', 'now') AND ${fyFilter}`;
    const lastMonthCondition = `strftime('%Y-%m', date) = strftime('%Y-%m', 'now', '-1 month') AND ${fyFilter}`;

    const totalRevenueCurrentMonth = await runQuery(
      `SELECT SUM(grand_total) FROM invoices WHERE ${currentMonthCondition}`
    );
    const prevTotalRevenue = await runQuery(
      `SELECT SUM(grand_total) FROM invoices WHERE ${lastMonthCondition}`
    );

    const totalRevenue = await runQuery(
      `SELECT SUM(grand_total) FROM invoices WHERE ${fyFilter}`
    );
    const overdueAmount = await runQuery(
      `SELECT SUM(grand_total) FROM invoices WHERE invoice_status='Overdue' AND ${fyFilter}`
    );
    const dueAmount = await runQuery(
      `SELECT SUM(grand_total) FROM invoices WHERE invoice_status='Due' AND ${fyFilter}`
    );
    const paidAmount = await runQuery(
      `SELECT SUM(grand_total) FROM invoices WHERE invoice_status='Paid' AND ${fyFilter}`
    );

    const invoicesDue = await runQuery(
      `SELECT COUNT(*) FROM invoices WHERE invoice_status='Due' AND ${fyFilter}`
    );
    const invoicesPaid = await runQuery(
      `SELECT COUNT(*) FROM invoices WHERE invoice_status='Paid' AND ${fyFilter}`
    );
    const invoicesOverdue = await runQuery(
      `SELECT COUNT(*) FROM invoices WHERE invoice_status='Overdue' AND ${fyFilter}`
    );

    const activeCustomers = await runQuery(
      `SELECT COUNT(DISTINCT customer_id) FROM invoices WHERE customer_id IS NOT NULL AND ${fyFilter}`
    );
    const totalCustomers = await runQuery(`SELECT COUNT(*) FROM customers WHERE is_deleted = 0`);

    const prevOverdueAmount = await runQuery(
      `SELECT SUM(grand_total) FROM invoices WHERE invoice_status='Overdue' AND ${lastMonthCondition}`
    );

    return {
        data: {
            totalRevenueCurrentMonth: totalRevenueCurrentMonth || 0,
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
            activeCustomersInFy: Number(activeCustomers) || 0,
            totalCustomersChange: Number(calcChange(activeCustomers || 0, 0))
        }
    };
};

export const getInvoiceStatusCounts = async (startDate, endDate) => {
    const db = await getDB();
    const start = startDate || "1900-01-01";
    const end = endDate || "2999-12-31";
    const data = [];
    const statuses = ["Paid", "Overdue", "Due"];
    for (const status of statuses) {
        const res = await db.select(
          `SELECT COUNT(*) as value FROM invoices WHERE invoice_status = $1 AND date BETWEEN $2 AND $3`,
          [status, start, end]
        );
        data.push({ name: status, value: Number(res[0]?.value) || 0 });
    }
    return { data };
};

export const getRevenueTimeline = async (startDate, endDate) => {
    const db = await getDB();
    const start = startDate || getFyRangeFromStartYear(getCurrentFyStartYear()).startDate;
    const end = endDate || getFyRangeFromStartYear(getCurrentFyStartYear()).endDate;
    const fyStartYear = parseInt(start.slice(0, 4), 10);

    const res = await db.select(`
        SELECT strftime('%Y-%m', date) as month, SUM(grand_total) as revenue, COUNT(*) as count
        FROM invoices 
        WHERE date BETWEEN $1 AND $2
        GROUP BY month 
        ORDER BY month ASC
    `, [start, end]);

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

export const getTopSellingItems = async (limit = 5, startDate, endDate) => {
  const db = await getDB();
  const start = startDate || "1900-01-01";
  const end = endDate || "2999-12-31";
  const res = await db.select(
    `SELECT it.item_name as name, SUM(it.quantity) as value, SUM(it.total) as revenue
     FROM items it
     INNER JOIN invoices inv ON it.invoice_id = inv.invoice_id
     WHERE inv.date BETWEEN $1 AND $2
     GROUP BY it.item_name
     ORDER BY revenue DESC
     LIMIT $3`,
    [start, end, limit]
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

