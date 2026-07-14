"use client";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm" }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" style={{ backdropFilter: "blur(2px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-red-600" />
            </div>
            <h3 className="text-[14.5px] font-bold text-ink-900">{title}</h3>
          </div>
          <button onClick={onCancel} className="text-ink-400 hover:text-ink-700 p-1 rounded cursor-pointer">
            <X size={17} />
          </button>
        </div>
        <div className="px-5 py-4">
          <p className="text-[13px] text-ink-500 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-border text-ink-600 text-[13px] font-medium hover:bg-surface-soft transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-[13px] font-semibold hover:bg-red-700 transition-colors cursor-pointer">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
