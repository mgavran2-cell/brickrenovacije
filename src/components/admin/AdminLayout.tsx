import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2, Menu } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import AdminSidebar from "./AdminSidebar";
import Logo from "@/components/Logo";
import { useStaffRole } from "@/hooks/useStaffRole";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { isStaff, loading } = useStaffRole();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dash-bg">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!isStaff) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex min-h-screen bg-dash-bg w-full font-dashboard">
      <aside className="hidden md:block h-screen sticky top-0 border-r border-dash-border">
        <AdminSidebar />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-dash-bg">
          <AdminSidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex-1 min-w-0 min-h-screen">
        <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-dash-border">
          <div className="flex items-center gap-2"><Logo size={32} /><span className="font-serif text-lg">brick.hr</span></div>
          <button aria-label="Izbornik" onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-dash-hover"><Menu className="w-5 h-5" /></button>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
