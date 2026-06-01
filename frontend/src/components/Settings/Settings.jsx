import React, { useState, useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { Settings as SettingsIcon, Folder, Save, CheckCircle } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { BackButton } from "../Reusables/BackButton";

const Settings = () => {
  const [savePath, setSavePath] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    const savedPath = localStorage.getItem("pdf-save-path");
    if (savedPath) {
      setSavePath(savedPath);
    }
  }, []);

  const handleSelectFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: "Select default folder for Invoices",
      });
      if (selected) {
        setSavePath(selected);
      }
    } catch (err) {
      console.error("Error selecting folder:", err);
      showToast("Failed to open folder dialog", "error");
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem("pdf-save-path", savePath);
    showToast("Settings saved successfully!", "success");
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <BackButton />
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mt-4">
          <div className="bg-indigo-600 p-6 flex items-center space-x-3">
            <SettingsIcon className="text-white w-8 h-8" />
            <h1 className="text-2xl font-bold text-white">System Settings</h1>
          </div>
          
          <div className="p-8 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                <Folder className="w-5 h-5" />
                <h2 className="text-lg font-semibold uppercase tracking-wider">PDF Storage</h2>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Select the default folder where all your generated Invoice PDFs will be stored automatically.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm font-mono text-gray-700 dark:text-gray-300 break-all min-h-[3rem] flex items-center">
                    {savePath || "No folder selected..."}
                  </div>
                  <button
                    onClick={handleSelectFolder}
                    className="bg-gray-800 dark:bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors flex items-center justify-center space-x-2 whitespace-nowrap"
                  >
                    <Folder className="w-4 h-4" />
                    <span>Browse</span>
                  </button>
                </div>
              </div>
            </section>

            <div className="pt-6 border-t dark:border-gray-700 flex justify-end">
              <button
                onClick={handleSaveSettings}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all shadow-lg flex items-center space-x-2 font-bold"
              >
                <Save className="w-5 h-5" />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 p-4 rounded-xl flex items-start space-x-3">
          <CheckCircle className="text-blue-600 dark:text-blue-400 w-5 h-5 mt-0.5" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Pro Tip:</strong> Once a folder is set, the system will skip the "Save As" dialog and directly place the PDF in your chosen directory for a faster workflow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
