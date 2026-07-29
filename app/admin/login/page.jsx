"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiLoader, FiArrowRight } from "react-icons/fi";
import { setSession } from "@/lib/adminSession";

function LoginForm() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-surface-soft flex items-stretch">
      {/* Left — editorial brand panel (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-primary">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(700px circle at 10% 0%, rgba(182,138,78,0.18), transparent 55%), radial-gradient(600px circle at 90% 100%, rgba(78,102,144,0.35), transparent 55%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/10 border border-white/15 text-accent-400 font-serif font-bold text-lg backdrop-blur-sm">
              H
            </div>
            <span className="text-white font-serif text-[17px] tracking-wide">HighTableNews</span>
          </div>

          <div className="max-w-md">
            <span className="inline-block text-[11px] font-semibold tracking-[0.18em] text-accent-400 uppercase mb-5">
              Admin Panel
            </span>
            <h2 className="font-serif text-white text-[34px] xl:text-[40px] leading-[1.15] mb-5">
              Where every story earns its seat.
            </h2>
            <p className="text-[14.5px] leading-relaxed text-primary-200/90">
              Manage articles, editors, and the newsroom workflow from a single,
              considered dashboard built for HighTableNews.
            </p>
          </div>

          <p className="text-[12px] text-white/40">
            © {new Date().getFullYear()} HighTableNews. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 relative">
        <div
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{
            background:
              "radial-gradient(600px circle at 15% 10%, rgba(21,42,74,0.06), transparent 60%), radial-gradient(500px circle at 85% 90%, rgba(182,138,78,0.08), transparent 60%)",
          }}
        />

        <div className="w-full max-w-[380px] relative">
          <div className="flex flex-col items-center lg:items-start mb-8">
            <div className="lg:hidden h-12 w-12 flex items-center justify-center rounded-xl bg-primary text-accent-400 font-serif font-bold text-xl mb-3 shadow-glow">
              H
            </div>
            <h1 className="text-[22px] font-bold text-ink-900 tracking-tight">Welcome back</h1>
            <p className="text-[13.5px] text-ink-400 mt-1">Sign in to manage the newsroom.</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-border rounded-card shadow-lift p-7 flex flex-col gap-4"
          >
            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 text-[12.5px] animate-in fade-in">
                <FiAlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-ink-700">Email</span>
              <div className="relative">
                <FiMail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
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
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-medium text-ink-700">Password</span>
              </div>
              <div className="relative">
                <FiLock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-surface-soft pl-9 pr-10 py-2.5 text-[13.5px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  tabIndex={0}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition-colors focus:outline-none"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 group flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-primary-600 shadow-soft hover:shadow-glow transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader size={15} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <FiArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>
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