"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { setSession } from "@/lib/adminSession";

function LoginForm() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error || "Invalid email or password.");
        setLoading(false);
        return;
      }
      // Store the JWT (+ admin profile) client-side so apis/axiosConfig.js
      // can send it as a Bearer token on every admin API call.
      setSession(data.token, data.admin);
      // Full page navigation (not router.push) so the browser sends the
      // freshly-set session cookie on the very next request and middleware
      // re-evaluates from scratch — this also self-heals if client-router
      // cache ever gets stuck showing a stale redirect.
      window.location.assign(nextPath);
    } catch (err) {
      clearTimeout(timeout);
      setError(err?.name === "AbortError" ? "The server took too long to respond. Please try again." : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-soft flex items-center justify-center px-4 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at 15% 10%, rgba(21,42,74,0.06), transparent 60%), radial-gradient(500px circle at 85% 90%, rgba(182,138,78,0.08), transparent 60%)",
        }}
      />
      <div className="w-full max-w-sm relative">
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary text-accent-400 font-serif font-bold text-xl mb-3 shadow-glow">
            H
          </div>
          <h1 className="text-[19px] font-bold text-ink-900 tracking-tight">HighTableNews</h1>
          <p className="text-[13px] text-ink-400 mt-0.5">Sign in to the admin panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-border rounded-card shadow-lift p-6 flex flex-col gap-4"
        >
          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 text-[12.5px]">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-medium text-ink-700">Email</span>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hightablenews.com"
                className="w-full rounded-lg border border-border bg-surface-soft pl-9 pr-3 py-2.5 text-[13.5px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-medium text-ink-700">Password</span>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-surface-soft pl-9 pr-3 py-2.5 text-[13.5px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-primary-600 shadow-soft hover:shadow-glow transition-all disabled:opacity-60"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-[11.5px] text-ink-400 text-center mt-4">
          Credentials are configured in <code className="text-ink-500">.env.local</code>.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
