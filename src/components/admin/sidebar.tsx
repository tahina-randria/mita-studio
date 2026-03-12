"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Mail,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Kanban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/crm", icon: LayoutDashboard },
  { label: "Leads", href: "/admin/crm/leads", icon: Users },
  { label: "Pipeline", href: "/admin/crm/pipeline", icon: Kanban },
  { label: "Calendrier", href: "/admin/crm/calendar", icon: Calendar },
  { label: "Emails", href: "/admin/crm/emails", icon: Mail },
  { label: "Devis", href: "/admin/crm/proposals", icon: FileText },
  { label: "Analytics", href: "/admin/crm/analytics", icon: BarChart3 },
  { label: "Paramètres", href: "/admin/crm/settings", icon: Settings },
];

interface AdminSidebarProps {
  adminName: string;
  adminEmail: string;
}

export function AdminSidebar({ adminName, adminEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const isActive = (href: string) => {
    if (href === "/admin/crm") {
      return pathname === "/admin/crm";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold text-white">
          M
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Mita Studio</p>
          <p className="text-xs text-gray-500">CRM Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-200 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-700">
            {adminName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {adminName}
            </p>
            <p className="truncate text-xs text-gray-500">{adminEmail}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-gray-600 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </aside>
  );
}
