"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Grid,
  Layers,
  FolderOpen,
  Users,
  Settings,
  HelpCircle,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";
import { useAuthUser, useAvatarConfig } from "@/hooks/use-queries";
import { AvatarCharacter } from "@/components/avatar/avatar-character";

const navItems = [
  { id: "dashboard", label: "Home", icon: Grid, href: "/dashboard" },
  { id: "spaces", label: "Spaces", icon: Layers, href: "/spaces" },
  { id: "assets", label: "Assets", icon: FolderOpen, href: "/editor" },
  { id: "team", label: "Team", icon: Users, href: "/team" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function SidebarUserSection({ isCollapsed }: { isCollapsed: boolean }) {
  const { data: user } = useAuthUser();
  const { data: avatarConfig } = useAvatarConfig();

  return (
    <Link href="/avatar">
      <div
        title={isCollapsed ? (user?.name || "Customize Avatar") : undefined}
        className={`sidebar-row group ${isCollapsed ? "justify-center" : ""}`}
      >
        <div className="sidebar-icon-box">
          {avatarConfig ? (
            <div className="w-6 h-6 rounded-full bg-surface-high/60 flex items-center justify-center overflow-hidden">
              <AvatarCharacter config={avatarConfig} size="xs" showShadow={false} />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[8px] font-bold text-white">
              {user?.name?.charAt(0) || "?"}
            </div>
          )}
        </div>
        <div className={`sidebar-label-wrapper ${isCollapsed ? "sidebar-label-hidden" : "sidebar-label-visible"}`}>
          <span className="text-sm font-medium text-on-surface truncate">{user?.name || "User"}</span>
          <span className="text-[10px] text-on-surface-muted">Customize Avatar</span>
        </div>
      </div>
    </Link>
  );
}

export function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getIsActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const collapsed = isMobile ? false : isCollapsed;

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className={`h-20 flex items-center shrink-0 ${collapsed ? "justify-center px-3" : "px-6"}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-inverse-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <div className={`sidebar-label-wrapper ${collapsed ? "sidebar-label-hidden" : "sidebar-label-visible"}`}>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-on-surface to-on-surface-variant whitespace-nowrap">
              ChitChat
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-1">
          {navItems.map((item) => {
            const isActive = getIsActive(item.href);
            return (
              <Link key={item.id} href={item.href} onClick={() => setMobileOpen(false)}>
                <div
                  title={collapsed ? item.label : undefined}
                  className={`sidebar-row group ${collapsed ? "justify-center" : ""} ${
                    isActive
                      ? "text-primary font-medium bg-primary/10 border border-primary/20"
                      : "text-on-surface-muted hover:text-on-surface hover:bg-surface-high/40 border border-transparent"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_8px_var(--color-primary)]" />
                  )}
                  <div className="sidebar-icon-box">
                    <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-on-surface-muted group-hover:text-on-surface"}`} />
                  </div>
                  <div className={`sidebar-label-wrapper ${collapsed ? "sidebar-label-hidden" : "sidebar-label-visible"}`}>
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 pt-3 border-t border-outline flex flex-col gap-1">
          <Link href="/support">
            <div
              title={collapsed ? "Support" : undefined}
              className={`sidebar-row group ${collapsed ? "justify-center" : ""}`}
            >
              <div className="sidebar-icon-box">
                <HelpCircle className="w-5 h-5 text-on-surface-muted group-hover:text-on-surface" />
              </div>
              <div className={`sidebar-label-wrapper ${collapsed ? "sidebar-label-hidden" : "sidebar-label-visible"}`}>
                <span className="whitespace-nowrap">Support</span>
              </div>
            </div>
          </Link>
          <SidebarUserSection isCollapsed={collapsed} />

          {/* Collapse Toggle - always visible at bottom */}
          {!isMobile && (
            <button
              onClick={onToggleCollapse}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={`sidebar-row group mt-1 ${collapsed ? "justify-center" : ""}`}
            >
              <div className="sidebar-icon-box">
                {collapsed ? (
                  <PanelLeftOpen className="w-5 h-5 text-on-surface-muted group-hover:text-on-surface" />
                ) : (
                  <PanelLeftClose className="w-5 h-5 text-on-surface-muted group-hover:text-on-surface" />
                )}
              </div>
              <div className={`sidebar-label-wrapper ${collapsed ? "sidebar-label-hidden" : "sidebar-label-visible"}`}>
                <span className="whitespace-nowrap text-on-surface-muted group-hover:text-on-surface">Collapse</span>
              </div>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl glass-panel text-on-surface hover:text-primary cursor-pointer"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen fixed inset-y-0 left-0 bg-surface-lowest border-r border-outline z-40 sidebar-transition ${
          isCollapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-surface-base/80 backdrop-blur-sm sidebar-transition ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <aside
          className={`flex flex-col w-[280px] h-screen bg-surface-lowest border-r border-outline-variant shadow-2xl sidebar-transition ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <SidebarContent isMobile />
        </aside>
      </div>
    </>
  );
}
