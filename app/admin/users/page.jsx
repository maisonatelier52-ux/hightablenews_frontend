import AdminShell from "@/components/layout/AdminShell";
import EmptyState from "@/components/ui/EmptyState";
import { Users2 } from "lucide-react";

export default function UsersPage() {
  return (
    <AdminShell title="Users">
      <EmptyState
        icon={Users2}
        title="Manage editors and roles here"
        description="Control who can publish, edit layouts, or only draft articles."
      />
    </AdminShell>
  );
}
