import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import CustomerAccount from "./components/List Of Customers/CustomerAccount";
import Footer from "./components/Footer/Footer";

import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "Dashboard";

    if (path === "/") title = "Dashboard";
    else if (path.startsWith("/invoice/")) title = "View Invoice";
    else if (path === "/invoice-form") title = "Create Invoice";
    else if (path.startsWith("/invoice-form/")) title = "Edit Invoice";
    else if (path === "/create-customer") title = "Add Customer";
    else if (path.startsWith("/edit-customer/")) title = "Edit Customer";
    else if (path === "/customers") title = "Customer List";
    else if (path === "/invoices") title = "Invoice List";
    else if (path === "/reports") title = "Reports";
    else if (path.startsWith("/customer/")) title = "Customer Account";

    const fullTitle = `${title} | My Billing Software`;
    document.title = fullTitle;

    // Tauri-specific window title update
    try {
      const appWindow = getCurrentWebviewWindow();
      if (appWindow) {
        appWindow.setTitle(fullTitle).catch(err => console.error("Tauri title update failed:", err));
      }
    } catch (e) {
      // Not running in Tauri or API not available
    }
  }, [location]);

  return null;
}

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
      <TitleUpdater />
      <ToastProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
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
              <Route path="/customer/:id" element={<CustomerAccount />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;
