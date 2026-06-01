import { Routes, Route } from "react-router-dom";
import Home from "./Dashboard/Dashboard";
import Invoice from "./Invoice/Invoice";
import InvoiceForm from "./Invoice Form/InvoiceForm";
import CustomerForm from "./Customer/CustomerForm";
import CustomerList from "./List Of Customers/CustomerList";
import InvoiceList from "./List of Invoices/InvoiceList";
import Header from "./Header/Header";
import Reports from "./Reports/Reports";
import CustomerAccount from "./List Of Customers/CustomerAccount";
import Footer from "./Footer/Footer";
import Settings from "./Settings/Settings";
import InitialSetup from "./Setup/InitialSetup";
import { useCompanySettings } from "../context/CompanySettingsContext";

function AppRoutes() {
  return (
    <>
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
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function AppShell() {
  const { loading, setupCompleted } = useCompanySettings();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 font-medium">Loading...</p>
      </div>
    );
  }

  if (!setupCompleted) {
    return <InitialSetup />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppRoutes />
    </div>
  );
}
