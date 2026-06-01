import React, { useState, useEffect } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { open } from "@tauri-apps/plugin-dialog";

import {

  Settings as SettingsIcon,

  Folder,

  Save,

  Database,

  Download,

  Upload,

  HardDrive,

  Info,

} from "lucide-react";

import { useToast } from "../../context/ToastContext";

import { BackButton } from "../Reusables/BackButton";
import PageHeader from "../Reusables/PageHeader";

import ConfirmRestoreModal from "../Reusables/ConfirmRestoreModal";

import { backupDatabase, restoreDatabase } from "../../lib/backup";

import { updateCompanySettings } from "../../lib/companySettings";
import { validateCompanySettingsData } from "../../lib/validation";

import { useCompanySettings } from "../../context/CompanySettingsContext";

import CompanySetupForm from "../Setup/CompanySetupForm";



function SettingsCard({ icon: Icon, title, description, children }) {

  return (

    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 space-y-5">

      <div className="flex items-start gap-3">

        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2.5 rounded-xl shrink-0">

          <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />

        </div>

        <div>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>

          {description && (

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>

          )}

        </div>

      </div>

      {children}

    </div>

  );

}



const Settings = () => {

  const [savePath, setSavePath] = useState("");

  const [companyForm, setCompanyForm] = useState({});

  const [lastBackupPath, setLastBackupPath] = useState("");

  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  const [isBackingUp, setIsBackingUp] = useState(false);

  const [isRestoring, setIsRestoring] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [appVersion, setAppVersion] = useState(__APP_VERSION__);

  const { showToast } = useToast();

  const { settings, loading, reloadSettings } = useCompanySettings();



  useEffect(() => {
    getVersion()
      .then(setAppVersion)
      .catch(() => setAppVersion(__APP_VERSION__));
  }, []);



  useEffect(() => {

    const savedPath = localStorage.getItem("pdf-save-path");

    if (savedPath) setSavePath(savedPath);



    const lastBackup = localStorage.getItem("last-backup-path");

    if (lastBackup) setLastBackupPath(lastBackup);

  }, []);



  useEffect(() => {

    setCompanyForm(settings);

  }, [settings]);



  const handleSelectFolder = async () => {

    try {

      const selected = await open({

        directory: true,

        multiple: false,

        title: "Select default folder for Invoices",

      });

      if (selected) setSavePath(String(selected));

    } catch (err) {

      console.error("Error selecting folder:", err);

      showToast("Failed to open folder dialog", "error");

    }

  };



  const handleCompanyChange = (e) => {

    const { name, value } = e.target;

    setCompanyForm((prev) => ({ ...prev, [name]: value }));

  };



  const handleSaveSettings = async () => {
    const validationErrors = validateCompanySettingsData(companyForm);
    const firstError = Object.values(validationErrors)[0];
    if (firstError) {
      showToast(firstError, "error");
      return;
    }

    setIsSaving(true);

    try {

      localStorage.setItem("pdf-save-path", savePath.trim());

      await updateCompanySettings({

        ...companyForm,

        cgst_rate: Number(companyForm.cgst_rate),

        sgst_rate: Number(companyForm.sgst_rate),

        igst_rate: Number(companyForm.igst_rate),

      });

      await reloadSettings();

      showToast("Settings saved successfully!", "success");

    } catch (err) {

      console.error("Save settings failed:", err);

      showToast(err.message || "Failed to save settings", "error");

    } finally {

      setIsSaving(false);

    }

  };



  const handleBackup = async () => {

    setIsBackingUp(true);

    try {

      const result = await backupDatabase();

      if (result.cancelled) {

        showToast("Backup cancelled", "info");

        return;

      }

      setLastBackupPath(result.path);

      showToast("Backup saved successfully", "success");

    } catch (err) {

      console.error("Backup failed:", err);

      showToast(err.message || "Failed to create backup", "error");

    } finally {

      setIsBackingUp(false);

    }

  };



  const handleRestoreConfirm = async () => {

    setIsRestoring(true);

    try {

      const result = await restoreDatabase();

      setShowRestoreConfirm(false);



      if (result.cancelled) {

        showToast("Restore cancelled", "info");

        return;

      }



      showToast("Database restored successfully. Reloading...", "success");

      window.setTimeout(() => window.location.reload(), 800);

    } catch (err) {

      console.error("Restore failed:", err);

      showToast(err.message || "Failed to restore backup", "error");

    } finally {

      setIsRestoring(false);

    }

  };



  if (loading) {

    return (

      <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-slate-900 min-h-screen flex justify-center items-center">

        <p className="text-gray-500 dark:text-gray-400 text-lg">Loading settings...</p>

      </div>

    );

  }



  return (

    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-slate-900 min-h-screen">

      <div className="max-w-5xl mx-auto">

        <BackButton />



        <PageHeader
          eyebrow="Company & backup"
          title="Settings"
          description="Company profile, tax rates, and app preferences"
          className="mb-8"
          actions={
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={isSaving || isBackingUp || isRestoring}
              className="btn-cta-primary w-full sm:w-auto disabled:opacity-50 disabled:pointer-events-none"
            >

            <Save size={20} />

            <span>{isSaving ? "Saving..." : "Save Changes"}</span>

          </button>
          }
        />



        <div className="space-y-6">

          {/* Company, bank & tax */}

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">

            <CompanySetupForm formData={companyForm} onChange={handleCompanyChange} />

          </div>



          {/* PDF storage */}

          <SettingsCard

            icon={Folder}

            title="PDF Storage"

            description="Folder where invoice PDFs are saved. Type a path or use Browse. Leave empty to pick a location each time."

          >

            <label htmlFor="pdf-save-path" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Destination folder
            </label>

            <div className="flex flex-col sm:flex-row gap-3">

              <input

                id="pdf-save-path"

                type="text"

                value={savePath}

                onChange={(e) => setSavePath(e.target.value)}

                placeholder="e.g. C:\Users\You\Documents\Invoice PDFs"

                autoComplete="off"

                spellCheck={false}

                className="flex-grow w-full min-w-0 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3 text-sm font-mono text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"

              />

              <button

                type="button"

                onClick={handleSelectFolder}

                className="btn-cta-secondary shrink-0"

              >

                <Folder size={20} />

                <span>Browse</span>

              </button>

            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Saved when you click Save Changes. PDFs use this folder plus the invoice file name.
            </p>

          </SettingsCard>



          {/* Database backup */}

          <SettingsCard

            icon={Database}

            title="Database Backup"

            description="Create a full backup or restore from a previous file. Restore saves a safety copy of your current data first."

          >

            {lastBackupPath && (

              <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3">

                <HardDrive className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />

                <p className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all">

                  Last backup: {lastBackupPath}

                </p>

              </div>

            )}



            <div className="flex flex-col sm:flex-row gap-3">

              <button

                type="button"

                onClick={handleBackup}

                disabled={isBackingUp || isRestoring}

                className="btn-cta-primary flex-1 sm:flex-none disabled:opacity-50 disabled:pointer-events-none"

              >

                <Download size={20} />

                <span>{isBackingUp ? "Creating Backup..." : "Backup Database"}</span>

              </button>

              <button

                type="button"

                onClick={() => setShowRestoreConfirm(true)}

                disabled={isBackingUp || isRestoring}

                className="btn-cta-secondary flex-1 sm:flex-none disabled:opacity-50 disabled:pointer-events-none !border-amber-300 dark:!border-amber-700 !text-amber-800 dark:!text-amber-300"

              >

                <Upload size={20} />

                <span>Restore from Backup</span>

              </button>

            </div>

          </SettingsCard>



          {/* Info tip */}

          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40 rounded-2xl p-4 sm:p-5 flex items-start gap-3">

            <Info className="text-indigo-600 dark:text-indigo-400 w-5 h-5 mt-0.5 shrink-0" />

            <p className="text-sm text-indigo-800 dark:text-indigo-200">

              Changes to company profile and tax rates apply to new invoices immediately.

              Seller details and GST calculations on the invoice form use these settings.

            </p>
            <p className="text-xs text-indigo-600/80 dark:text-indigo-300/80 mt-2">
              App version {appVersion}
            </p>

          </div>

        </div>

      </div>



      <ConfirmRestoreModal

        isOpen={showRestoreConfirm}

        onCancel={() => setShowRestoreConfirm(false)}

        onConfirm={handleRestoreConfirm}

        isRestoring={isRestoring}

      />

    </div>

  );

};



export default Settings;


