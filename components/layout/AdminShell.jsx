"use client";

// components/layout/AdminShell.jsx
//
// Shared chrome (sidebar nav + topbar) for every page under /admin/**.
// Each admin page renders `<AdminShell title="...">{page content}</AdminShell>`
// so this is the one place that owns navigation, the signed-in admin's
// name/avatar, and logout.

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Newspaper,
  FolderTree,
  Users2,
  FileText,
  Image as ImageIcon,
  PanelTop,
  PanelBottom,
  LayoutTemplate,
  FileSearch,
  UserSquare2,
  Settings,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Mail,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { getStoredAdmin, clearSession } from "@/lib/adminSession";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/articles", label: "Articles", icon: Newspaper },
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/authors", label: "Authors", icon: Users2 },
      { href: "/admin/pages", label: "Pages", icon: FileText },
      { href: "/admin/media-library", label: "Media Library", icon: ImageIcon },
    ],
  },
  {
    label: "Builders",
    items: [
      { href: "/admin/header-builder", label: "Header Builder", icon: PanelTop },
      { href: "/admin/footer-builder", label: "Footer Builder", icon: PanelBottom },
      { href: "/admin/homepage-builder", label: "Homepage Builder", icon: LayoutTemplate },
      { href: "/admin/categorypage-builder", label: "Category Page Builder", icon: FileSearch },
      { href: "/admin/articledetailpage-builder", label: "Article Detail Builder", icon: FileText },
      { href: "/admin/authordetailpage-builder", label: "Author Detail Builder", icon: UserSquare2 },
    ],
  },
  {
    label: "Admin",
    items: [
      { href: "/admin/users", label: "Users", icon: Users2 },
      { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
      { href: "/admin/sitemap-robots", label: "Sitemap & Robots", icon: FileSearch },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "/";

function Logo({ collapsed }) {
  return (
    <Link href="/admin/dashboard" className={`flex items-center min-w-0 ${collapsed ? "justify-center" : "gap-2.5"}`}>
      <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-primary text-accent-400 font-serif font-bold text-[15px] shadow-glow">
        H
      </div>
      {!collapsed && (
        <div className="min-w-0 leading-tight">
          <div className="text-[14.5px] font-bold text-ink-900 tracking-tight truncate">HighTableNews</div>
          <div className="text-[10.5px] font-medium text-ink-400 tracking-wide truncate">Admin Panel</div>
        </div>
      )}
    </Link>
  );
}

function NavLinks({ pathname, onNavigate, collapsed }) {
  return (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-6">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          {!collapsed && (
            <p className="px-2.5 mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.09em] text-ink-300 whitespace-nowrap">
              {section.label}
            </p>
          )}
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={`group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-150 ${
                    collapsed ? "justify-center" : ""
                  } ${
                    active
                      ? "bg-primary-50 text-primary-600 font-semibold"
                      : "text-ink-700 hover:bg-surface-soft hover:text-ink-900"
                  }`}
                >
                  {active && !collapsed && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-full bg-accent-500" />
                  )}
                  <Icon
                    size={16}
                    strokeWidth={active ? 2.1 : 1.8}
                    className={`shrink-0 ${active ? "text-primary-600" : "text-ink-400 group-hover:text-ink-600"}`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function AdminShell({ title, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const admin = getStoredAdmin();

  useEffect(() => {
    const stored = window.localStorage.getItem("htn-admin-sidebar-collapsed");
    if (stored === "1") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem("htn-admin-sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  }

  function handleLogout() {
    clearSession();
    router.push("/admin/login");
  }

  const initials = (admin?.name || "Admin")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-surface-soft flex">
      {/* Sidebar — desktop */}
      <aside
        className={`hidden lg:flex lg:flex-col shrink-0 border-r border-border bg-white transition-[width] duration-200 ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
      >
        <div className={`h-16 flex items-center border-b border-border ${collapsed ? "justify-center px-2" : "px-5"}`}>
          <Logo collapsed={collapsed} />
        </div>
        <div className={`px-3 pt-3 flex ${collapsed ? "justify-center" : ""}`}>
          {collapsed ? (
            <Link
              href="/admin/articles"
              title="New Article"
              className="h-9 w-9 flex items-center justify-center rounded-lg bg-primary text-accent-400 hover:bg-primary-600 shadow-glow transition-colors"
            >
              <Plus size={16} strokeWidth={2.4} />
            </Link>
          ) : (
            <Link
              href="/admin/articles"
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary text-white hover:bg-primary-600 px-3 py-2.5 text-[12.5px] font-bold shadow-glow transition-colors"
            >
              <Plus size={14} strokeWidth={2.6} />
              New Article
            </Link>
          )}
        </div>
        <NavLinks pathname={pathname} collapsed={collapsed} />
        <div className={`px-3 pb-3 flex ${collapsed ? "justify-center" : ""}`}>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="View live site"
            className={`flex items-center justify-center gap-2 rounded-lg border border-border text-ink-500 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-colors duration-150 ${
              collapsed ? "h-9 w-9" : "w-full h-9 text-[12.5px] font-medium"
            }`}
          >
            <ArrowUpRight size={14} />
            {!collapsed && "View live site"}
          </a>
        </div>
        <div className="border-t border-border p-3 space-y-1">
          <button
            onClick={toggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-ink-700 hover:bg-surface-soft hover:text-ink-900 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {collapsed ? <PanelLeftOpen size={16} className="text-ink-400 shrink-0" /> : <PanelLeftClose size={16} className="text-ink-400 shrink-0" />}
            {!collapsed && "Collapse"}
          </button>
        </div>
        <div className={`p-[14px_16px_18px] border-t border-border flex items-center ${collapsed ? "justify-center" : "gap-2.5"}`}>
          <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-accent-400 flex items-center justify-center text-[12.5px] font-bold shadow-soft uppercase">
            {initials}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-ink-900 truncate">{admin?.name || "Admin"}</div>
                <div className="text-[11px] text-ink-400 truncate">{admin?.email || "admin@hightablenews.com"}</div>
              </div>
              <button
                onClick={handleLogout}
                title="Log out"
                className="text-ink-300 hover:text-danger transition-colors shrink-0"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Sidebar — mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-[1px]" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 flex flex-col w-64 bg-white h-full shadow-lift">
            <div className="h-16 flex items-center justify-between gap-2.5 px-5 border-b border-border">
              <Logo collapsed={false} />
              <button onClick={() => setMobileOpen(false)} className="text-ink-400 hover:text-ink-700">
                <X size={20} />
              </button>
            </div>
            <div className="px-3 pt-3">
              <Link
                href="/admin/articles"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary text-white hover:bg-primary-600 px-3 py-2.5 text-[12.5px] font-bold shadow-glow transition-colors"
              >
                <Plus size={14} strokeWidth={2.6} />
                New Article
              </Link>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} collapsed={false} />
            <div className="border-t border-border p-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-ink-700 hover:bg-surface-soft hover:text-danger transition-colors"
              >
                <LogOut size={16} className="text-ink-400" />
                Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-11 shrink-0 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-soft">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-white/70 hover:text-white"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-1.5 min-w-0 text-[12.5px] font-medium">
              <span className="text-white/50">Admin</span>
              <span className="text-white/30">›</span>
              <span className="text-white truncate font-semibold">{title}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11.5px] font-semibold text-white/85 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ArrowUpRight size={12} />
              Live Site
            </a>
            <div className="h-7 w-7 rounded-full bg-accent-500 text-primary-800 flex items-center justify-center text-[11px] font-bold shadow-soft uppercase">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
