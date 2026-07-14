"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Mail } from "lucide-react";
import { subscribersApi } from "@/apis/usersideApis";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Shared newsletter signup form. Renders an email input + submit button,
 * posts to POST /api/subscribers, and swaps to a success message on
 * completion. Every subscribe surface on the site (header modal, homepage
 * sidebar widget, footer, CMS newsletter blocks) uses this component so the
 * behavior — and the backend Subscriber model behind it — is one source of
 * truth.
 */
export default function NewsletterForm({
  source = "other",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  successMessage = "You're subscribed! Please check your inbox.",
  size = "md", // "sm" | "md"
  buttonBg,
  buttonTextColor = "#ffffff",
  buttonHoverBg,
  inputClassName = "",
  layout = "row", // "row" | "stack"
  dark = false,
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [hoverBtn, setHoverBtn] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await subscribersApi.subscribe(trimmed, source);
      setStatus("success");
      setEmail("");
      setError(res?.message || "");
    } catch (err) {
      setStatus("error");
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    }
  }

  const sizeClasses = size === "sm" ? "text-[11px] px-2 py-1.5" : "text-[13px] px-3.5 py-2.5";
  const btnSizeClasses = size === "sm" ? "text-[11px] px-3 py-1.5" : "text-[13px] px-4 py-2.5";

  if (status === "success") {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 ${
          dark ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-emerald-200 bg-emerald-50 text-emerald-700"
        }`}
        role="status"
      >
        <CheckCircle2 size={16} className="shrink-0" />
        <p className="text-[12.5px] font-medium leading-snug">{error || successMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className={layout === "stack" ? "space-y-2" : "flex items-stretch gap-2"} noValidate>
        <div className={layout === "stack" ? "" : "flex-1 min-w-0"}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            aria-label="Email address"
            disabled={status === "loading"}
            className={`w-full rounded-md border focus:outline-none focus:ring-2 transition-colors ${sizeClasses} ${
              dark
                ? "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white/30"
                : "bg-white border-gray-300 text-ink-900 placeholder:text-ink-400 focus:ring-primary/30 focus:border-primary"
            } ${inputClassName}`}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          onMouseEnter={() => setHoverBtn(true)}
          onMouseLeave={() => setHoverBtn(false)}
          className={`shrink-0 rounded-md font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-70 ${btnSizeClasses} ${
            layout === "stack" ? "w-full" : ""
          }`}
          style={{
            background: buttonBg ? (hoverBtn && buttonHoverBg ? buttonHoverBg : buttonBg) : hoverBtn ? "#a30000" : "#cc0000",
            color: buttonTextColor,
          }}
        >
          {status === "loading" ? <Loader2 size={13} className="animate-spin" /> : <Mail size={13} />}
          {buttonText}
        </button>
      </form>
      {status === "error" && error && (
        <p className={`text-[11.5px] mt-1.5 ${dark ? "text-red-300" : "text-red-600"}`}>{error}</p>
      )}
    </div>
  );
}
