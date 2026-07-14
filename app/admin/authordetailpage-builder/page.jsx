import AdminShell from "@/components/layout/AdminShell";
import AuthorPageBuilder from "@/components/author-builder/AuthorPageBuilder";

export default function AuthorDetailPageBuilderPage() {
  return (
    <AdminShell title="Author Detail Page Builder">
      <AuthorPageBuilder />
    </AdminShell>
  );
}
