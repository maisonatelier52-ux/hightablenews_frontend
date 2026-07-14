import AdminShell from "@/components/layout/AdminShell";
import CategoryPageBuilder from "@/components/category-builder/CategoryPageBuilder";

export default function CategoryPageBuilderPage() {
  return (
    <AdminShell title="Category Page Builder">
      <CategoryPageBuilder />
    </AdminShell>
  );
}
