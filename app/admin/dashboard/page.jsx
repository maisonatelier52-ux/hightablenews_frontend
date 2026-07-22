"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import CategoryDonut from "@/components/dashboard/CategoryDonut";
import MobileSitePreview from "@/components/dashboard/MobileSitePreview";
import {
  Newspaper,
  Mail,
  Users2,
  TrendingUp,
  PanelTop,
  PanelBottom,
  LayoutTemplate,
  FileSearch,
  FileText,
  UserSquare2,
  ArrowRight,
  ExternalLink,
  Pencil,
  UserPlus,
  Rows3,
  CheckCircle2,
} from "lucide-react";
import { getArticles, getCategories, onDataChange, preloadCategoriesAndArticlesAdmin } from "@/lib/categoriesArticlesApi";
import { getAuthors, onAuthorsChange, preloadAuthorsAdmin } from "@/lib/authorsApi";
import { dashboardApi } from "@/apis/adminApis";

const BUILDERS = [
  { href: "/admin/header-builder", title: "Header Builder", desc: "Edit navigation, logo & toggles", icon: PanelTop },
  { href: "/admin/footer-builder", title: "Footer Builder", desc: "Manage footer columns & links", icon: PanelBottom },
  { href: "/admin/homepage-builder", title: "Homepage Builder", desc: "Drag & drop your homepage layout", icon: LayoutTemplate },
  { href: "/admin/categorypage-builder", title: "Category Page Builder", desc: "Design category listing pages", icon: FileSearch },
  { href: "/admin/articledetailpage-builder", title: "Article Detail Builder", desc: "Layout the article reading page", icon: FileText },
  { href: "/admin/authordetailpage-builder", title: "Author Detail Builder", desc: "Design the author profile page", icon: UserSquare2 },
];

const DONUT_PALETTE = ["#152A4A", "#B68A4E", "#4E6690", "#1E9A63", "#8397B9", "#DCE3EF"];

// Maps each ActivityLog `type` (see backend/models/ActivityLog.js) to an
// icon + accent color for the Recent Activity feed below.
const ACTIVITY_ICON_MAP = {
  "article.created": { icon: Pencil, color: "#152A4A" },
  "article.updated": { icon: Pencil, color: "#152A4A" },
  "article.published": { icon: CheckCircle2, color: "#1E9A63" },
  "article.deleted": { icon: Pencil, color: "#D0384F" },
  "category.created": { icon: Rows3, color: "#4E6690" },
  "author.created": { icon: UserPlus, color: "#11151F" },
  "page.created": { icon: FileText, color: "#4E6690" },
  "page.updated": { icon: FileText, color: "#152A4A" },
  "page.published": { icon: CheckCircle2, color: "#1E9A63" },
  "page.deleted": { icon: FileText, color: "#D0384F" },
  "subscriber.joined": { icon: Users2, color: "#B68A4E" },
  "settings.updated": { icon: PanelBottom, color: "#B68A4E" },
  "header.updated": { icon: PanelTop, color: "#4E6690" },
  "footer.updated": { icon: PanelBottom, color: "#B68A4E" },
  "homepage.updated": { icon: LayoutTemplate, color: "#4E6690" },
};

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function daysAgoLabel(date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function DashboardPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [activity, setActivity] = useState(null);
  const [backendStats, setBackendStats] = useState(null);
  const [showAllActivity, setShowAllActivity] = useState(false);

  const loadAll = useCallback(async () => {
    await Promise.all([preloadCategoriesAndArticlesAdmin(), preloadAuthorsAdmin()]);
    setArticles(getArticles());
    setCategories(getCategories());
    setAuthors(getAuthors());
  }, []);

  useEffect(() => {
    loadAll();
    const unsubData = onDataChange(() => {
      setArticles(getArticles());
      setCategories(getCategories());
    });
    const unsubAuthors = onAuthorsChange(() => setAuthors(getAuthors()));
    return () => {
      unsubData();
      unsubAuthors();
    };
  }, [loadAll]);

  useEffect(() => {
    dashboardApi.getActivity(10).then(setActivity).catch(() => setActivity([]));
    dashboardApi.getStats().then(setBackendStats).catch(() => setBackendStats(null));
  }, []);

  const published = useMemo(() => articles.filter((a) => a.isPublished), [articles]);

  const publishedThisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return published.filter((a) => a.date && new Date(a.date).getTime() >= weekAgo).length;
  }, [published]);

  const recentArticles = useMemo(() => {
    return [...articles]
      .sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0))
      .slice(0, 5);
  }, [articles]);

  // Last 7 calendar days, oldest → newest, for the analytics chart.
  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return days;
  }, []);

  const articlesPublishedPerDay = useMemo(() => {
    return last7Days.map((day) => {
      const next = new Date(day);
      next.setDate(next.getDate() + 1);
      return published.filter((a) => {
        if (!a.date) return false;
        const t = new Date(a.date).getTime();
        return t >= day.getTime() && t < next.getTime();
      }).length;
    });
  }, [last7Days, published]);

  // Page-view / visitor traffic isn't tracked by the backend (no analytics
  // pipeline requested), so that series is omitted; subscriber growth below
  // comes straight from the real Subscriber model instead.
  const chartLabels = backendStats?.chart?.labels?.map((d) => new Date(d)) || last7Days;
  const articlesSeries = backendStats?.chart?.articlesPublishedPerDay || articlesPublishedPerDay;
  const subscribersSeries = backendStats?.chart?.subscribersPerDay || chartLabels.map(() => 0);

  const donutSegments = useMemo(() => {
    const counts = categories.map((c) => ({
      label: c.name,
      value: articles.filter((a) => a.categoryId === c._id).length,
    }));
    const sorted = counts.filter((c) => c.value > 0).sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, 5);
    const restTotal = sorted.slice(5).reduce((s, c) => s + c.value, 0);
    if (restTotal > 0) top.push({ label: "Others", value: restTotal });
    return top.map((c, i) => ({ ...c, color: DONUT_PALETTE[i % DONUT_PALETTE.length] }));
  }, [categories, articles]);

  const STATS = [
    {
      label: "Published Articles",
      value: published.length.toLocaleString(),
      delta: `+${publishedThisWeek} this week`,
      icon: Newspaper,
    },
    {
      label: "Newsletter Subscribers",
      value: (backendStats?.totals?.subscribers ?? 0).toLocaleString(),
      delta: "Live from Subscribers",
      icon: Mail,
    },
    { label: "Active Authors", value: String(authors.length), delta: "Live from Authors", icon: Users2 },
    { label: "Avg. Read Time", value: "3m 42s", delta: "+0.4% from last week", icon: TrendingUp },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="p-5 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-6 rounded-card overflow-hidden relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 px-6 py-6 lg:px-8 lg:py-7">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{ background: "radial-gradient(420px circle at 85% -10%, rgba(182,138,78,0.35), transparent 60%)" }}
          />
          <div className="relative flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-[22px] lg:text-[26px] font-bold text-white tracking-[-0.01em]">Good morning, Editor 👋</h2>
              <p className="text-[13.5px] text-white/60 mt-1.5">Here's what's happening with HighTableNews today.</p>
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-[13px] font-semibold text-white/85 hover:bg-white/10 hover:text-white transition-colors"
              >
                View live site <ExternalLink size={13} />
              </Link>
              <Link
                href="/admin/articles"
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent-500 px-3.5 py-2 text-[13px] font-bold text-primary-800 hover:bg-accent-400 transition-colors shadow-soft"
              >
                + New Article
              </Link>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-card border border-border bg-white p-5 shadow-soft hover:shadow-lift transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12.5px] font-medium text-ink-500">{s.label}</span>
                  <div className="h-8 w-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary">
                    <Icon size={15} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-ink-900">{s.value}</p>
                <p className="text-[12px] text-emerald-600 font-medium mt-1">{s.delta}</p>
              </div>
            );
          })}
        </div>

        {/* Quick build + live preview */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8 items-stretch">
          <div className="xl:col-span-2">
            {/*
              Sticky inner wrapper: the OUTER div above is stretched by
              `items-stretch` to match the taller Mobile Site Preview
              column's height. This inner wrapper then sticks to the top
              of the viewport while the page scrolls, and can only move
              as far as its stretched parent's bottom edge — which lines
              up with the bottom of the Mobile Site Preview. So it stays
              pinned until that preview finishes scrolling past, then
              releases naturally back into the normal flow.
            */}
            <div className="xl:sticky xl:top-6">
              <h3 className="text-[13px] font-semibold text-ink-500 uppercase tracking-wide mb-3">Quick access</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {BUILDERS.map((b) => {
                  const Icon = b.icon;
                  return (
                    <Link
                      key={b.href}
                      href={b.href}
                      className="group rounded-card border border-border bg-white p-5 shadow-soft hover:shadow-lift hover:border-primary/30 transition-all"
                    >
                      <div className="h-9 w-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary mb-3">
                        <Icon size={17} />
                      </div>
                      <p className="text-[14px] font-semibold text-ink-900">{b.title}</p>
                      <p className="text-[12.5px] text-ink-500 mt-1">{b.desc}</p>
                      <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        Open builder <ArrowRight size={13} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile site preview */}
          <MobileSitePreview src="/" />
        </div>

        {/* Analytics + top categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 items-stretch">
          <div className="rounded-card border border-border bg-white shadow-soft p-5 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[14px] font-semibold text-ink-900">Site Analytics</h3>
              <span className="text-[12px] text-ink-400">Last {chartLabels.length} days</span>
            </div>
            <AnalyticsChart
              labels={chartLabels.map(daysAgoLabel)}
              series={[
                { key: "published", label: "Articles Published", color: "#152A4A", data: articlesSeries },
                { key: "subscribers", label: "New Subscribers", color: "#B68A4E", data: subscribersSeries },
              ]}
            />
          </div>

          <div className="rounded-card border border-border bg-white shadow-soft p-5 flex flex-col">
            <h3 className="text-[14px] font-semibold text-ink-900 mb-4">Top Categories</h3>
            {donutSegments.length > 0 ? (
              <CategoryDonut segments={donutSegments} />
            ) : (
              <p className="text-[13px] text-ink-400">No articles yet.</p>
            )}
          </div>
        </div>

        {/* Recent articles + recent activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 rounded-card border border-border bg-white shadow-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-ink-900">Recent Articles</h3>
              <Link href="/admin/articles" className="text-[12.5px] font-semibold text-primary hover:underline">
                View All
              </Link>
            </div>
            {recentArticles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wide text-ink-400">
                      <th className="px-5 py-2.5 font-semibold">Title</th>
                      <th className="px-3 py-2.5 font-semibold hidden sm:table-cell">Author</th>
                      <th className="px-3 py-2.5 font-semibold hidden md:table-cell">Category</th>
                      <th className="px-3 py-2.5 font-semibold">Status</th>
                      <th className="px-5 py-2.5 font-semibold hidden lg:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentArticles.map((a) => (
                      <tr key={a._id} className="hover:bg-surface-soft/60 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {a.mainImage ? (
                              <img src={a.mainImage} alt={a.imageAlt || a.title} className="h-9 w-9 rounded-md object-cover shrink-0" />
                            ) : (
                              <div className="h-9 w-9 rounded-md bg-primary-50 flex items-center justify-center text-primary shrink-0">
                                <Rows3 size={14} />
                              </div>
                            )}
                            <span className="text-[13px] font-medium text-ink-900 truncate max-w-[220px]">{a.title}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-[13px] text-ink-600 hidden sm:table-cell whitespace-nowrap">
                          {a.author || "—"}
                        </td>
                        <td className="px-3 py-3 hidden md:table-cell">
                          <span className="text-[12px] font-medium text-primary bg-primary-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                            {a.categoryName || "—"}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`text-[12px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                              a.isPublished ? "bg-emerald-50 text-emerald-600" : "bg-surface-muted text-ink-500"
                            }`}
                          >
                            {a.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[12.5px] text-ink-500 hidden lg:table-cell whitespace-nowrap">
                          {a.date ? new Date(a.date).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="px-5 py-6 text-[13px] text-ink-400">No articles yet — create your first one from the Articles page.</p>
            )}
          </div>

          <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-[14px] font-semibold text-ink-900">Recent Activity</h3>
            </div>
            {activity === null && (
              <p className="px-5 py-6 text-[13px] text-ink-400">Loading activity…</p>
            )}
            {activity && activity.length === 0 && (
              <p className="px-5 py-6 text-[13px] text-ink-400">No activity yet — actions across the admin panel will show up here.</p>
            )}
            {activity && activity.length > 0 && (
              <>
                <div
                  className="divide-y divide-border overflow-hidden transition-[max-height] duration-300 ease-in-out"
                  style={{ maxHeight: showAllActivity ? activity.length * 100 : 300 }}
                >
                  {(showAllActivity ? activity : activity.slice(0, 3)).map((a) => {
                    const meta = ACTIVITY_ICON_MAP[a.type] || { icon: Pencil, color: "#2563eb" };
                    const Icon = meta.icon;
                    return (
                      <div key={a._id} className="px-5 py-3.5 flex items-start gap-3">
                        <div
                          className="h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${meta.color}1a`, color: meta.color }}
                        >
                          <Icon size={13} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] text-ink-700 leading-snug">
                            <span className="font-semibold text-ink-900">{a.actorName}</span> {a.message}
                          </p>
                          <span className="text-[11.5px] text-ink-400">{timeAgo(a.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {activity.length > 3 && (
                  <div className="px-5 py-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setShowAllActivity((v) => !v)}
                      className="w-full inline-flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-primary hover:underline"
                    >
                      {showAllActivity ? (
                        <>Show Less ↑</>
                      ) : (
                        <>View More ↓</>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}