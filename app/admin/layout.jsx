// app/admin/layout.jsx
//
// Auth is enforced by middleware.js for every /admin/** request (redirects
// to /admin/login when there's no valid session cookie), so by the time any
// page under here renders, the visitor is a signed-in admin. Each admin page
// already wraps itself in <AdminShell> (sidebar + topbar), so we don't
// double up on chrome here — but we do wire up the admin DataProvider, which
// preloads categories/articles/authors via the authenticated /admin/* routes
// (separate from the public site's DataProvider in app/(site)/layout.jsx).
import DataProvider from "@/components/admin/DataProvider";

export const metadata = {
  title: "HighTableNews CMS",
  description: "Admin panel for HighTableNews — headless CMS",
};

export default function AdminLayout({ children }) {
  return <DataProvider>{children}</DataProvider>;
}
