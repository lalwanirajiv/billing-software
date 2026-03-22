import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BackButton } from "../Reusables/BackButton";
import TopInfoPanel from "./TopInfoPanel";
import ItemsList from "./ItemsList";
import FormHeader from "./FormHeader";
import ConfirmSaveModal from "../Reusables/ConfirmSaveModal";
import { useToast } from "../../context/ToastContext";
import { 
  getAllCustomers, 
  checkInvoice, 
  getIdByName, 
  createInvoice, 
  updateInvoice, 
  getInvoiceById, 
  getCustomerById 
} from "../../lib/api";

const initialFormData = {
  shipTo: "",
  gstin: "",
  address_line1: "",
  address_line2: "",
  billNo: "",
  date: "",
  terms: "",
  state: "State",
  items: [{ name: "", hsn: "", qty: 0, rate: 0, amount: 0 }],
};

export default function InvoiceForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id: invoiceIdParam } = useParams();
  const isExistingInvoice = !!invoiceIdParam;
  const [formData, setFormData] = useState(initialFormData);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [totals, setTotals] = useState({
    sub_total: 0,
    totalQty: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    adjustment: 0,
    grand_total: 0,
  });
  const [customers, setCustomers] = useState([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (error) {
        showToast("Failed to fetch customers", "error");
      } finally {
        setIsLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, [showToast]);

  useEffect(() => {
    // Only pre-fill form data from localStorage when EDITING an existing invoice
    const loadInvoiceData = async () => {
      if (!isExistingInvoice) {
        // Clear stale data so new invoice form starts blank
        localStorage.removeItem("invoice-data");
        localStorage.removeItem("customer-data");
        setFormData(initialFormData);
        return;
      }

      try {
        let parsedData = null;
        let parsedCustomer = null;

        // Try getting from API first as it's more reliable
        try {
          const apiInvoice = await getInvoiceById(invoiceIdParam);
          parsedData = apiInvoice;
          
          if (apiInvoice.customer_id) {
            try {
              parsedCustomer = await getCustomerById(apiInvoice.customer_id);
            } catch (custErr) {
              console.warn("Could not fetch customer details:", custErr);
            }
          }
        } catch (apiErr) {
          console.warn("API fetch failed, trying localStorage:", apiErr);
          const existingData = localStorage.getItem("invoice-data");
          const existingCustomerData = localStorage.getItem("customer-data");
          if (existingData) parsedData = JSON.parse(existingData);
          if (existingCustomerData) parsedCustomer = JSON.parse(existingCustomerData);
        }

        if (parsedData) {
          const mergedData = {
            ...initialFormData,
            ...parsedData,
            invoice_id: parsedData.invoice_id || invoiceIdParam,
            shipTo: parsedData.ship_to || parsedCustomer?.name || "",
            gstin: parsedCustomer?.gstin || "N/A",
            billNo: parsedData.bill_no || "",
            address_line1: parsedCustomer?.address_line1 || "N/A",
            address_line2: parsedCustomer?.address_line2 || "N/A",
            date: parsedData.date
              ? new Date(parsedData.date).toISOString().split("T")[0]
              : "",

            grand_total: parsedData.grand_total || 0,
            items:
              parsedData.items && parsedData.items.length
                ? parsedData.items.map((item) => ({
                    name: item.item_name || "",
                    hsn: item.hsn || "",
                    qty: Number(item.quantity) || 0,
                    rate: Number(item.price) || 0,
                    amount: Number(item.total) || 0,
                  }))
                : [{ name: "", hsn: "", qty: 0, rate: 0, amount: 0 }],
          };

          setFormData(mergedData);
        }
      } catch (error) {
        console.error("Error loading invoice data:", error);
        showToast("Failed to load invoice data", "error");
      }
    };

    loadInvoiceData();
  }, [isExistingInvoice, invoiceIdParam, showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "shipTo") setIsSuggestionsVisible(true);
  };

  const handleSuggestionClick = (customer) => {
    setFormData((prev) => ({
      ...prev,
      shipTo: customer.name,
      gstin: customer.gstin,
      address_line1: customer.address_line1 || "",
      address_line2: customer.address_line2 || "",
    }));
    setIsSuggestionsVisible(false);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    setShowConfirmSave(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmSave(false);
    await saveInvoice();
  };

  const handleCancelSave = () => {
    setShowConfirmSave(false);
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index][name] =
      name === "name" || name === "hsn" ? value : parseFloat(value) || 0;
    newItems[index].amount =
      (newItems[index].qty || 0) * (newItems[index].rate || 0);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", hsn: "", qty: 0, rate: 0, amount: 0 }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleClear = () => {
    localStorage.removeItem("invoiceData");
    setFormData(initialFormData);
  };

  // --- Auto-calc totals ---
  useEffect(() => {
    const sub_total = formData.items.reduce(
      (acc, item) => acc + (item.amount || 0),
      0
    );
    const totalQty = formData.items.reduce(
      (acc, item) => acc + (item.qty || 0),
      0
    );

    let cgst = 0,
      sgst = 0,
      igst = 0;

    if (formData.state.toLowerCase() === "interstate") {
      igst = sub_total * 0.05;
    } else {
      cgst = sub_total * 0.025;
      sgst = sub_total * 0.025;
    }

    const totalAmount = sub_total + cgst + sgst + igst;
    const grand_total = Math.round(totalAmount);
    const adjustment = grand_total - totalAmount;

    setTotals({
      sub_total,
      totalQty,
      cgst,
      sgst,
      igst,
      totalAmount,
      adjustment,
      grand_total,
    });
  }, [formData.items, formData.state]);

  // --- Save Logic ---
  const saveInvoice = async () => {
    try {
      // 1. Check duplicate bill number (only for new invoices)
      if (!isExistingInvoice) {
        const checkRes = await checkInvoice(formData.billNo);
        if (checkRes.exists) {
          showToast(
            `Invoice with Bill #${formData.billNo} already exists.`,
            "error"
          );
          return;
        }
      }

      // 2. Lookup customer_id
      let customerId = null;
      try {
        const customer = await getIdByName(formData.shipTo);
        if (customer && customer.length) {
          customerId = customer[0].customer_id;
        }
      } catch (err) {
        console.warn("Customer lookup failed:", err);
      }

      // 3. Build payload
      const payload = {
        customer_id: customerId,
        ship_to: formData.shipTo,
        bill_no: Number(formData.billNo),
        date: formData.date,
        terms_of_payment:
          formData.terms?.trim() !== "" ? formData.terms : "30 Days",
        state: formData.state,
        total_quantity: totals.totalQty,
        sub_total: totals.sub_total,
        cgst: totals.cgst,
        sgst: totals.sgst,
        igst: totals.igst,
        grand_total: totals.grand_total,
        items: (formData.items || []).map((item) => ({
          item_name: item.name || item.item_name,
          hsn: item.hsn,
          quantity: item.qty || item.quantity,
          price: item.rate || item.price,
          total: item.amount || item.total,
        })),
      };

      let response;
      console.log("This is IInvoice ID", formData.invoice_id);

      if (isExistingInvoice && formData.invoice_id) {
        response = await updateInvoice(formData.invoice_id, payload);
      } else {
        response = await createInvoice(payload);
      }

      console.log("This is Saved Response ", response);

      const invoiceId = response.invoiceId || formData.invoice_id;

      if (invoiceId) {
        showToast(
          isExistingInvoice
            ? "Invoice updated successfully!"
            : "Invoice saved successfully!",
          "success"
        );
        navigate(`/invoice/${invoiceId}`);
        localStorage.removeItem("invoice-data");
        localStorage.removeItem("customer-data");
      } else {
        showToast("Invoice saved but ID missing in response", "warning");
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      showToast("Failed to save invoice. Please try again.", "error");
    }
  };

  // --- Render ---
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <BackButton />
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg">
          <FormHeader handleClear={handleClear} />

          <form onSubmit={handleSaveClick} className="space-y-8">
            <TopInfoPanel
              formData={formData}
              handleChange={handleChange}
              totals={totals}
              customers={customers}
              handleSuggestionClick={handleSuggestionClick}
              isSuggestionsVisible={isSuggestionsVisible}
              setIsSuggestionsVisible={setIsSuggestionsVisible}
              isLoadingCustomers={isLoadingCustomers}
              filteredCustomers={
                formData.shipTo
                  ? customers.filter((c) =>
                      c.name
                        .toLowerCase()
                        .includes(formData.shipTo.toLowerCase())
                    )
                  : customers
              }
            />

            <ItemsList
              items={formData.items}
              handleItemChange={handleItemChange}
              addItem={addItem}
              removeItem={removeItem}
            />

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                {isExistingInvoice
                  ? "Update Invoice"
                  : "Save & Preview Invoice"}
              </button>
            </div>

            <ConfirmSaveModal
              isOpen={showConfirmSave}
              onCancel={handleCancelSave}
              onConfirm={handleConfirmSave}
              isExistingInvoice={isExistingInvoice}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
