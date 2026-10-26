import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Inbox, FolderOpen, Users, Hammer, FileText, Receipt, MessageSquare, BarChart3, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import { initialsOf } from "@/lib/adminFormat";

const AdminSidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { session, signOut } = useAuth();
  const location = useLocation();
  const [fullName, setFullName] = useState("");
  const [counts, setCounts] = useState({ upiti: 0, izvodaci: 0, poruke: 0 });

  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) return;
    const load = async () => {
      const [prof, req, con, msg] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", uid).maybeSingle(),
        supabase.from("renovation_requests").select("id", { count: "exact", head: true }).eq("status", "novi"),
        supabase.from("contractor_applications").select("id", { count: "exact", head: true }).eq("status", "novo"),
        supabase.from("poruke").select("id", { count: "exact", head: true }).eq("receiver_id", uid),
      ]);
      setFullName(prof.data?.full_name || session.user.email || "");
      setCounts({ upiti: req.count ?? 0, izvodaci: con.count ?? 0, poruke: msg.count ?? 0 });
    };
    load();
    const ch = supabase.channel("admin-sidebar")
      .on("postgres_changes", { event: "*", schema: "public", table: "renovation_requests" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "contractor_applications" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [session?.user?.id]);

  const items = [
    { label: "Pregled", icon: Home, path: "/admin" },
    { label: "Upiti", icon: Inbox, path: "/admin/upiti", badge: counts.upiti },
    { label: "Projekti", icon: FolderOpen, path: "/admin/projekti" },
    { label: "Klijenti", icon: Users, path: "/admin/klijenti" },
    { label: "Izvođači", icon: Hammer, path: "/admin/izvodaci", badge: counts.izvodaci },
    { label: "Ponude", icon: FileText, path: "/admin/ponude" },
    { label: "Računi", icon: Receipt, path: "/admin/racuni" },
    { label: "Poruke", icon: MessageSquare, path: "/admin/poruke", badge: counts.poruke },
    { label: "Analitika", icon: BarChart3, path: "/admin/analitika" },
    { label: "Postavke", icon: Settings, path: "/admin/postavke" },
  ];

  return (
    <div className="flex flex-col h-full w-64 bg-dash-bg p-6 font-dashboard">
      <Link to="/admin" onClick={onNavigate} className="flex items-center gap-2.5 mb-10">
        <Logo size={40} />
        <span className="text-xl font-serif font-normal tracking-tight">brick.hr</span>
        <span className="text-xs uppercase tracking-widest font-medium text-dash-muted border border-dash-border rounded-md px-2 py-0.5">Admin</span>
      </Link>

      <nav className="space-y-1">
        {items.map((item) => {
          const active = item.path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors",
                active ? "bg-dash-active text-foreground font-medium" : "text-dash-muted hover:bg-dash-hover/60"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {!!item.badge && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 ml-auto">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex-grow" />

      <div className="pt-6 border-t border-dash-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium shrink-0">
          {initialsOf(fullName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{fullName}</p>
          <p className="text-xs text-dash-subtle">Admin</p>
        </div>
        <button onClick={signOut} aria-label="Odjava" className="p-1.5 rounded-lg text-dash-subtle hover:text-destructive transition-colors">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
