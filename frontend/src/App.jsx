import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Invoice from "./components/Invoice/Invoice"; 
import InvoiceForm from "./components/Invoice Form/InvoiceForm";
import CustomerForm from "./components/Customer/CustomerForm";


function App() {
  return (
    <Router>
      {/* <nav className="p-4 bg-gray-200 flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/invoice">Invoice</Link>
        <Link to="/invoice-form">Invoice Form</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/invoice-form" element={<InvoiceForm />} />
        <Route path="/create-customer" element={<CustomerForm />} />
      </Routes>
    </Router>
  );
}

export default App;
