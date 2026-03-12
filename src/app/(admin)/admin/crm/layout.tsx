import { redirect } from "next/navigation";
import { getAuthAdmin } from "@/lib/crm/auth-guard";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminCrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAuthAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar adminName={admin.name} adminEmail={admin.email} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
