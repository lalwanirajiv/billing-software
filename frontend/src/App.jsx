import { BrowserRouter as Router } from "react-router-dom";

import { useEffect } from "react";

import { initDatabase } from "./lib/initDatabase";
import { clearLegacyInvoiceCache } from "./lib/clearLegacyInvoiceCache";
import { installGlobalErrorHandlers, logger } from "./lib/logger";

import { ToastProvider } from "./context/ToastContext";

import { CompanySettingsProvider } from "./context/CompanySettingsContext";
import { FinancialYearProvider } from "./context/FinancialYearContext";
import { PageTitleProvider } from "./context/PageTitleContext";

import AppShell from "./components/AppShell";
import ErrorBoundary from "./components/Reusables/ErrorBoundary";
import TitleUpdater from "./components/TitleUpdater";



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
      <ErrorBoundary>
        <ToastProvider>
          <CompanySettingsProvider>
            <FinancialYearProvider>
              <PageTitleProvider>
                <TitleUpdater />
                <AppShell />
              </PageTitleProvider>
            </FinancialYearProvider>
          </CompanySettingsProvider>
        </ToastProvider>
      </ErrorBoundary>
    </Router>
  );

}



export default App;

