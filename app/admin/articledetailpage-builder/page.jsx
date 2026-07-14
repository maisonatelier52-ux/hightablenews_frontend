import AdminShell from "@/components/layout/AdminShell";
import ArticlePageBuilder from "@/components/article-builder/ArticlePageBuilder";

export default function ArticleDetailPageBuilderPage() {
  return (
    <AdminShell title="Article Detail Page Builder">
      <ArticlePageBuilder />
    </AdminShell>
  );
}
