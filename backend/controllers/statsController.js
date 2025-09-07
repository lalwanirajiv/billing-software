import sql from "../db.js";

// Get dashboard statistics with change vs last month
export const getDashboardStats = async (req, res) => {
  try {
    // Current month totals (for revenue and overdue amounts)
    const [totalRevenue] = await sql`
      SELECT SUM(grand_total) AS total_revenue 
      FROM invoices
      WHERE DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE)
    `;

    const [overdueAmount] = await sql`
      SELECT SUM(grand_total) AS overdue_amount 
      FROM invoices 
      WHERE invoice_status='Overdue'
    `;

    // Invoices Due (all-time due)
    const [invoicesDue] = await sql`
      SELECT COUNT(*) AS invoices_due 
      FROM invoices 
      WHERE invoice_status='Due'
    `;

    // Total customers (all-time)
    const [totalCustomers] = await sql`
      SELECT COUNT(*) AS total_customers 
      FROM customers
    `;

    // Previous month totals (for comparison)
    const [prevTotalRevenue] = await sql`
      SELECT SUM(grand_total) AS total_revenue 
      FROM invoices
      WHERE DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    `;

    const [prevOverdueAmount] = await sql`
      SELECT SUM(grand_total) AS overdue_amount 
      FROM invoices 
      WHERE invoice_status='Overdue' 
      AND DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    `;

    const [prevInvoicesDue] = await sql`
      SELECT COUNT(*) AS invoices_due 
      FROM invoices 
      WHERE invoice_status='Due'
      AND DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    `;

    const [prevTotalCustomers] = await sql`
      SELECT COUNT(*) AS total_customers 
      FROM customers
      WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    `;

    const calcChange = (current, previous) => {
      if (!previous || previous === 0) return current ? 100 : 0;
      return (((current - previous) / previous) * 100).toFixed(1);
    };

    res.json({
      totalRevenue: totalRevenue.total_revenue || 0,
      totalRevenueChange: Number(
        calcChange(totalRevenue.total_revenue, prevTotalRevenue.total_revenue)
      ),

      overdueAmount: overdueAmount.overdue_amount || 0,
      overdueAmountChange: Number(
        calcChange(
          overdueAmount.overdue_amount,
          prevOverdueAmount.overdue_amount
        )
      ),

      invoicesDue: Number(invoicesDue.invoices_due) || 0,
      invoicesDueChange: null, // running total, % change not meaningful

      totalCustomers: Number(totalCustomers.total_customers) || 0,
      totalCustomersChange: Number(
        calcChange(
          totalCustomers.total_customers,
          prevTotalCustomers.total_customers
        )
      ),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
export const getInvoiceStatusCounts = async (req, res) => {
  try {
    const statuses = ["Paid", "Overdue", "Due"];
    const data = [];

    for (const status of statuses) {
      const [count] = await sql`
        SELECT COUNT(*) AS value
        FROM invoices
        WHERE invoice_status = ${status}
      `;
      data.push({ name: status, value: Number(count.value) });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
