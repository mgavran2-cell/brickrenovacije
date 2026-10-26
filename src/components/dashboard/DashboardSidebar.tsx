import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FolderOpen, FileText, Receipt, MessageSquare, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";

const navItems = [
  { label: "Pregled", icon: Home, path: "/dashboard" },
  { label: "Moj projekt", icon: FolderOpen, path: "/dashboard/moj-projekt" },
  { label: "Ponude", icon: FileText, path: "/dashboard/ponude" },
  { label: "Računi", icon: Receipt, path: "/dashboard/racuni" },
  { label: "Poruke", icon: MessageSquare, path: "/dashboard/poruke", badge: true },
  { label: "Postavke", icon: Settings, path: "/dashboard/postavke" },
];

const DashboardSidebar = () => {
  const { session, signOut } = useAuth();
  const location = useLocation();
  const [fullName, setFullName] = useState("");
  const [place, setPlace] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) return;
    (async () => {
      const [prof, proj, msgs] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", uid).maybeSingle(),
        supabase.from("projects").select("location").eq("user_id", uid).order("created_at", { ascending: false }).limit(1),
        supabase.from("poruke").select("id", { count: "exact", head: true }).eq("receiver_id", uid),
      ]);
      setFullName(prof.data?.full_name || session.user.user_metadata?.full_name || session.user.email || "");
      setPlace(proj.data?.[0]?.location ?? null);
      setUnread(msgs.count ?? 0);
    })();
  }, [session?.user?.id]);

  const initials = fullName
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-dash-bg border-r border-dash-border p-6 font-dashboard">
      <Link to="/dashboard" className="flex items-center gap-2.5 mb-10">
        <Logo size={40} />
        <span className="text-xl font-serif font-normal tracking-tight">brick.hr</span>

      </Link>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors",
                active ? "bg-dash-active text-foreground font-medium" : "text-dash-muted hover:bg-dash-hover/60"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {item.badge && unread > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 ml-auto">{unread}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex-grow" />

      <div className="pt-6 border-t border-dash-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-dash-active flex items-center justify-center text-sm font-medium text-dash-muted shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{fullName}</p>
          <p className="text-xs text-dash-subtle truncate">Klijent{place ? ` · ${place}` : ""}</p>
        </div>
        <button onClick={signOut} aria-label="Odjava" className="p-1.5 rounded-lg text-dash-subtle hover:text-destructive transition-colors">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
