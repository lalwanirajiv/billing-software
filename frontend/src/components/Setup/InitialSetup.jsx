import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { useCompanySettings } from "../../context/CompanySettingsContext";
import { completeInitialSetup } from "../../lib/companySettings";
import { validateCompanySettingsData } from "../../lib/validation";
import CompanySetupForm from "./CompanySetupForm";

export default function InitialSetup() {
  const { settings, reloadSettings } = useCompanySettings();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateCompanySettingsData(formData);
    const firstError = Object.values(validationErrors)[0];
    if (firstError) {
      showToast(firstError, "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await completeInitialSetup({
        ...formData,
        cgst_rate: Number(formData.cgst_rate),
        sgst_rate: Number(formData.sgst_rate),
        igst_rate: Number(formData.igst_rate),
      });
      await reloadSettings();
      showToast("Setup complete. Welcome to Billing Software!", "success");
    } catch (err) {
      console.error("Initial setup failed:", err);
      showToast(err.message || "Failed to complete setup", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-indigo-100 dark:border-gray-700">
          <div className="bg-indigo-600 px-6 py-8 sm:px-8">
            <div className="flex items-start gap-4">
              <div className="bg-white/15 p-3 rounded-xl">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-indigo-100 text-sm font-semibold uppercase tracking-wider">
                  First-time setup
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  Welcome to Billing Software
                </h1>
                <p className="text-indigo-100 mt-2 text-sm sm:text-base">
                  Review the pre-filled details below and save to start using the system.
                  You can change these anytime from Settings.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <CompanySetupForm formData={formData} onChange={handleChange} />

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                * Company name is required. All other fields are pre-filled and editable.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-cta-primary w-full sm:w-auto disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? "Saving..." : "Complete Setup & Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
