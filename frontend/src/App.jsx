import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./components/Dashboard/Dashboard";
import Invoice from "./components/Invoice/Invoice";
import InvoiceForm from "./components/Invoice Form/InvoiceForm";
import CustomerForm from "./components/Customer/CustomerForm";
import CustomerList from "./components/List Of Customers/CustomerList";
import InvoiceList from "./components/List of Invoices/InvoiceList";
import Header from "./components/Header/Header";

function App() {
  // Initialize theme from sessionStorage or system preference
  const [theme, setTheme] = useState(() => {
    const storedTheme = sessionStorage.getItem("theme");
    if (storedTheme) return storedTheme;

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    return "light";
  });

  // Apply theme to <html> and save to sessionStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    sessionStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <Header toggleTheme={toggleTheme} theme={theme} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/invoice/:id" element={<Invoice />} />
        <Route path="/invoice-form" element={<InvoiceForm />} />
        <Route path="/invoice-form/:id" element={<InvoiceForm />} />
        <Route path="/create-customer" element={<CustomerForm />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/invoices" element={<InvoiceList />} />
      </Routes>
    </Router>
  );
}

export default App;
