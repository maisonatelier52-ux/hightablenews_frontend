import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { serverApi } from "@/lib/serverApi";

// Root layout — shared by both the public site and the Admin Panel.
// Route-specific data providers (which cache/preload backend data) live in
// nested layouts instead: see app/(site)/layout.jsx for the public site and
// app/admin/layout.jsx for the Admin Panel. Keeping them separate avoids the
// public (unauthenticated) and admin (authenticated) preloads from racing
// against each other on the same in-memory cache.
//
// generateMetadata (rather than a static `metadata` export) so the favicon
// uploaded in the admin Settings page can be read from the backend and
// applied site-wide, including the Admin Panel itself. Any page-specific
// generateMetadata (see lib/seo.js's buildMetadata) only overrides
// title/description/OG/Twitter — it never sets `icons`, so this favicon
// always applies no matter which page is being rendered.
export async function generateMetadata() {
  const settings = await serverApi.getSiteSettings();
  const favicon = settings?.favicon || "";

  return {
    title: settings?.seoDefaults?.metaTitle || settings?.siteName || "HighTableNews",
    description:
      settings?.seoDefaults?.metaDescription ||
      "Power • Technology • Profiles • Wealth • Finance • Lifestyle • Culture",
    icons: favicon
      ? {
          icon: [{ url: favicon, type: "image/x-icon" }],
          shortcut: [{ url: favicon, type: "image/x-icon" }],
        }
      : undefined,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-ink-900 antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}