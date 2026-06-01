import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { Toast } from "../components/Reusables/Toast";

const ToastContext = createContext(null);
const TOAST_DURATION_MS = 4000;

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: "", type: "" });
  const dismissTimerRef = useRef(null);

  const closeToast = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    setToast({ message: "", type: "" });
  }, []);

  const showToast = useCallback(
    (message, type = "info") => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }

      setToast({ message, type });

      dismissTimerRef.current = setTimeout(() => {
        setToast({ message: "", type: "" });
        dismissTimerRef.current = null;
      }, TOAST_DURATION_MS);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast, closeToast }}>
      {children}
      {toast.message && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
