"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback(
    (message, opts = {}) => {
      const id = ++idCounter;
      const type = opts.type || "success";
      const duration = opts.duration ?? 2600;
      setToasts((prev) => [...prev, { id, message, type }]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const Icon = toast.type === "error" ? AlertCircle : toast.type === "info" ? Info : CheckCircle2;
  const iconColor =
    toast.type === "error" ? "text-danger" : toast.type === "info" ? "text-primary-600" : "text-success";

  return (
    <div className="animate-toast-in flex items-center gap-2.5 rounded-card border border-border bg-white px-4 py-3 shadow-lift min-w-[240px] max-w-sm">
      <Icon size={18} className={iconColor} strokeWidth={2.25} />
      <p className="text-[13.5px] font-semibold text-ink-900 flex-1">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="text-ink-400 hover:text-ink-700 transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
