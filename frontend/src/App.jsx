import { BrowserRouter as Router, useLocation } from "react-router-dom";

import { useEffect } from "react";

import { initDatabase } from "./lib/initDatabase";
import { clearLegacyInvoiceCache } from "./lib/clearLegacyInvoiceCache";
import { installGlobalErrorHandlers, logger } from "./lib/logger";

import { ToastProvider } from "./context/ToastContext";

import { CompanySettingsProvider } from "./context/CompanySettingsContext";

import AppShell from "./components/AppShell";
import ErrorBoundary from "./components/Reusables/ErrorBoundary";

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

    else if (path === "/settings") title = "Settings";



    const fullTitle = `${title} | My Billing Software`;

    document.title = fullTitle;



    try {

      const appWindow = getCurrentWebviewWindow();

      if (appWindow) {

        appWindow.setTitle(fullTitle).catch((err) => console.error("Tauri title update failed:", err));

      }

    } catch {

      // Not running in Tauri or API not available

    }

  }, [location]);



  return null;

}



function App() {

  useEffect(() => {
    installGlobalErrorHandlers();
    clearLegacyInvoiceCache();
    logger.info("Application started");

    async function setupDB() {
      try {
        await initDatabase();
        logger.info("Database initialized");
      } catch (error) {
        logger.error("Database init failed", error);
      }
    }

    setupDB();
  }, []);



  return (

    <Router>

      <TitleUpdater />

      <ErrorBoundary>

        <ToastProvider>

          <CompanySettingsProvider>

            <AppShell />

          </CompanySettingsProvider>

        </ToastProvider>

      </ErrorBoundary>

    </Router>

  );

}



export default App;

