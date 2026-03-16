import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { initDatabase } from "./lib/initDatabase";
import Home from "./components/Dashboard/Dashboard";
import Invoice from "./components/Invoice/Invoice";
import InvoiceForm from "./components/Invoice Form/InvoiceForm";
import CustomerForm from "./components/Customer/CustomerForm";
import CustomerList from "./components/List Of Customers/CustomerList";
import InvoiceList from "./components/List of Invoices/InvoiceList";
import Header from "./components/Header/Header";

import { ToastProvider } from "./context/ToastContext"; // ✅ global toast
import Reports from "./components/Reports/Reports";

function App() {
  // Initialize SQLite database
  useEffect(() => {
    async function setupDB() {
      try {
        await initDatabase();
        console.log("Database initialized");
      } catch (error) {
        console.error("Database init failed:", error);
      }
    }
    setupDB();
  }, []);

  return (
    <Router>
      <ToastProvider>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/invoice/:id" element={<Invoice />} />
          <Route path="/invoice-form" element={<InvoiceForm />} />
          <Route path="/invoice-form/:id" element={<InvoiceForm />} />
          <Route path="/create-customer" element={<CustomerForm />} />
          <Route path="/edit-customer/:id" element={<CustomerForm />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </ToastProvider>
    </Router>
  );
}

export default App;
