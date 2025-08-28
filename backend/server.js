import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import invoiceRoutes from "./routes/invoices.js";
import itemRoutes from "./routes/items.js";
import customerRoutes from "./routes/customer.js"

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies

// --- Routes ---
app.use("/api/invoices", invoiceRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/customer", customerRoutes);

// --- Default route ---
app.get("/", (req, res) => {
  res.send("Invoice API running...");
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
