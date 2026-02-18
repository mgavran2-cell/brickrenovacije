import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Receipt,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Pregled", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Projekti", icon: FolderKanban, path: "/dashboard/projekti" },
  { label: "Ponude", icon: FileText, path: "/dashboard/ponude" },
  { label: "Računi", icon: Receipt, path: "/dashboard/racuni" },
  { label: "Poruke", icon: MessageSquare, path: "/dashboard/poruke" },
  { label: "Postavke", icon: Settings, path: "/dashboard/postavke" },
];

const DashboardSidebar = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const userEmail = session?.user?.email ?? "";
  const initials = userEmail.slice(0, 2).toUpperCase();

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-card border-r border-border sticky top-0 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary-foreground">B</span>
            </div>
            <span className="text-sm font-bold text-foreground">brick renovacije</span>
          </a>
        )}
        {collapsed && (
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center mx-auto">
            <span className="text-sm font-bold text-primary-foreground">B</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground",
            collapsed && "mx-auto mt-2"
          )}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-accent-foreground">{initials}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userEmail}</p>
              <button
                onClick={signOut}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 mt-0.5"
              >
                <LogOut className="w-3 h-3" /> Odjava
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
