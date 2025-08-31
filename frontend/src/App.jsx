import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Invoice from "./components/Invoice/Invoice";
import InvoiceForm from "./components/Invoice Form/InvoiceForm";
import CustomerForm from "./components/Customer/CustomerForm";
import Header from "./components/Header/Header";
import { useState, useEffect } from "react";
import CustomerList from "./components/List Of Customers/CustomerList";
import InvoiceList from "./components/List of Invoices/InvoiceList";

function App() {
  const [theme, setTheme] = useState("light");

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Apply theme to HTML
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Router>
      <Header toggleTheme={toggleTheme} theme={theme} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/invoice-form" element={<InvoiceForm />} />
        <Route path="/create-customer" element={<CustomerForm />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/invoices" element={<InvoiceList />} />
      </Routes>
    </Router>
  );
}

export default App;
