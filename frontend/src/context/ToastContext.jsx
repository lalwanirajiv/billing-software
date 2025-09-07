import React, { createContext, useContext, useState, useCallback } from "react";
import { Toast } from "../components/Reusables/Toast"; // adjust path if needed

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });

    // Auto-dismiss after 4s
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 4000);
  }, []);

  const closeToast = useCallback(() => {
    setToast({ message: "", type: "" });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
