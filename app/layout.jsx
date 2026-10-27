// app/layout.jsx
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { serverApi } from "@/lib/serverApi";
import { SITE_URL, DEFAULT_OG_IMAGE, FAVICON_PATH } from "@/lib/seo";

// Root layout — shared by both the public site and the Admin Panel.
// Route-specific data providers (which cache/preload backend data) live in
// nested layouts instead: see app/(site)/layout.jsx for the public site and
// app/admin/layout.jsx for the Admin Panel. Keeping them separate avoids the
// public (unauthenticated) and admin (authenticated) preloads from racing
// against each other on the same in-memory cache.
//
// Favicon + default social image are STATIC now:
//   - public/favicon.ico            → favicon for every page (site + admin)
//   - public/image/hightablenews-logo.webp     → default OpenGraph / Twitter image
// Any page-specific generateMetadata (see lib/seo.js's buildMetadata) only
// overrides title/description/OG/Twitter — it never sets `icons`, so the
// favicon always applies. The OG/Twitter images set here are just the
// last-resort default for any route that doesn't define its own metadata.
export async function generateMetadata() {
  const settings = await serverApi.getSiteSettings();
  const title = settings?.seoDefaults?.metaTitle || settings?.siteName || "HighTableNews";
  const description =
    settings?.seoDefaults?.metaDescription ||
    "Power • Technology • Profiles • Wealth • Finance • Lifestyle • Culture";

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    icons: {
      icon: [{ url: FAVICON_PATH, type: "image/x-icon", sizes: "any" }],
      shortcut: [{ url: FAVICON_PATH, type: "image/x-icon" }],
    },
    openGraph: {
      title,
      description,
      siteName: settings?.siteName || "HighTableNews",
      images: [{ url: DEFAULT_OG_IMAGE }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
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