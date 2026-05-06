import "./admin.css";
import { AdminAuthProvider } from "../../components/admin/AdminAuthProvider";
import AdminShell from "../../components/admin/AdminShell";

export const metadata = {
  title: "SeatCracker Admin",
  description: "Internal Admin Dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>
        {children}
      </AdminShell>
    </AdminAuthProvider>
  );
}
