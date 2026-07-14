import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

// Root layout — shared by both the public site and the Admin Panel.
// Route-specific data providers (which cache/preload backend data) live in
// nested layouts instead: see app/(site)/layout.jsx for the public site and
// app/admin/layout.jsx for the Admin Panel. Keeping them separate avoids the
// public (unauthenticated) and admin (authenticated) preloads from racing
// against each other on the same in-memory cache.
export const metadata = {
  title: "HighTableNews",
  description: "Power • Technology • Profiles • Wealth • Finance • Lifestyle • Culture",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-ink-900 antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
