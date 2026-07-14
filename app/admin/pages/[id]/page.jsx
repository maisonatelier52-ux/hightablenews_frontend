"use client";

import { useParams } from "next/navigation";
import AdminShell from "@/components/layout/AdminShell";
import PageBuilderEditor from "@/components/page-builder/PageBuilderEditor";

export default function PageEditorRoute() {
  const params = useParams();
  const id = params?.id;
  return (
    <AdminShell title="Page Builder">
      <PageBuilderEditor pageId={id} />
    </AdminShell>
  );
}
