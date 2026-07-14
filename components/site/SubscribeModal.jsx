"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Mail } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

export default function SubscribeModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] bg-black/50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Subscribe to our newsletter"
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 h-8 w-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-gray-100 hover:text-ink-700 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="px-7 pt-8 pb-2 text-center">
          <div className="h-12 w-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <Mail size={20} />
          </div>
          <h2 className="text-[19px] font-bold text-ink-900">Subscribe to HighTableNews</h2>
          <p className="text-[13px] text-ink-500 mt-1.5 leading-snug">
            Get our top stories on power, technology, and wealth delivered straight to your inbox.
          </p>
        </div>

        <div className="px-7 pt-5 pb-8">
          <NewsletterForm
            source="header"
            layout="stack"
            size="md"
            placeholder="you@example.com"
            buttonText="Subscribe"
          />
          <p className="text-[11px] text-ink-400 text-center mt-3">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
