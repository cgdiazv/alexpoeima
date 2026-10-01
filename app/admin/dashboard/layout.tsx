import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboardWrapper } from "@/components/admin/AdminDashboardWrapper";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken || sessionToken !== "authenticated_alexpoeima_user") {
    redirect("/admin");
  }

  return <AdminDashboardWrapper>{children}</AdminDashboardWrapper>;
}
