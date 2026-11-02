import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/services/auth.service";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

/**
 * Real authorization boundary for every /admin/* page except /admin/login.
 * middleware.ts only checks that a cookie exists (fast, Edge-safe); this
 * layout runs on the Node runtime and cryptographically verifies it against
 * Firebase on every request, so a forged or expired cookie never gets in.
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-muted/30 md:flex">
      <AdminSidebar email={admin.email ?? ""} />
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
