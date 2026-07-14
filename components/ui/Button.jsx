"use client";

import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-600 shadow-soft hover:shadow-glow",
  secondary: "bg-white text-ink-700 border border-border hover:bg-surface-soft hover:border-ink-200",
  ghost: "bg-transparent text-ink-700 hover:bg-surface-soft",
  danger: "bg-white text-danger border border-danger/25 hover:bg-danger/5",
};

const sizes = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-semibold tracking-[-0.01em] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : Icon ? <Icon size={15} /> : null}
      {children}
    </button>
  );
}
