import { Button } from "@/components/base/Button";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Monitor,
  Calendar,
  Settings,
  ChevronLeft,
  ListTodo,
  Folder,
  Info,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { t } = useTranslation();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  const menuItems = [
    { icon: LayoutDashboard, label: t("common.dashboard"), to: "/" },
    { icon: Briefcase, label: t("common.projects"), to: "/projects" },
    { icon: Users, label: t("common.teams"), to: "/teams" },
    { icon: ListTodo, label: t("common.tasks"), to: "/tasks" },
    { icon: Calendar, label: t("common.calendar"), to: "/calendar" },
    { icon: Monitor, label: t("common.assets"), to: "/assets" },
    { icon: Folder, label: t("common.files"), to: "/files" },
    { icon: Settings, label: t("common.settings"), to: "/settings" },
    { icon: Info, label: t("common.about"), to: "/about" },
  ];

  return (
    <aside
      className={cn(
        "h-full bg-surface-container-low border-r border-outline-variant flex flex-col transition-all duration-300 relative z-40",
        isSidebarCollapsed ? "w-20" : "w-64",
      )}
    >
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center justify-between p-3 rounded-lg text-on-surface-variant hover:bg-interaction-hover hover:text-on-surface transition-all group"
            activeProps={{ className: "bg-primary-container/20 text-primary" }}
          >
            <div className="flex items-center min-w-[32px]">
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {!isSidebarCollapsed && (
                <span className="ml-4 font-bold text-label-md truncate whitespace-nowrap animate-fade-in">
                  {item.label}
                </span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <ChevronLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-outline-variant flex flex-col items-center gap-4">
        {!isSidebarCollapsed && (
          <div className="text-[10px] font-bold text-on-surface-variant/40 tracking-widest text-center animate-fade-in uppercase">
            {t("common.copyright")}
          </div>
        )}
        <Button
          className={cn(
            "w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all active:scale-90",
            isSidebarCollapsed && "rotate-180",
          )}
          onClick={toggleSidebar}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    </aside>
  );
}
