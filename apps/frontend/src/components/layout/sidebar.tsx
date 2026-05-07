"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { useState } from "react";

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

export function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getIsActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden relative">
      <div className="h-20 p-6 flex items-center justify-start shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-inverse-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">O</span>
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1, marginLeft: 12 }}
              exit={{ width: 0, opacity: 0, marginLeft: 0 }}
              className="flex items-center flex-1 overflow-hidden"
            >
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-on-surface to-on-surface-variant whitespace-nowrap block flex-1">
                OrbitHQ
              </span>
              <button
                onClick={onToggleCollapse}
                className="p-1 rounded-md text-on-surface-muted hover:text-on-surface hover:bg-surface-high/40 transition-colors ml-2"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      

      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto mt-2">
        {navItems.map((item) => {
          const isActive = getIsActive(item.href);
          return (
            <Link key={item.id} href={item.href} onClick={() => setMobileOpen(false)}>
              <div
                title={isCollapsed ? item.label : undefined}
                className={`relative flex items-center px-3 py-2.5 rounded-[12px] transition-all duration-300 cursor-pointer group ${
                  isActive
                    ? "text-primary font-medium"
                    : "text-on-surface-muted hover:text-on-surface hover:bg-surface-high/40"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-[12px] transition-opacity duration-300" />
                )}
                {isActive && (
                   <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_8px_var(--color-primary)] transition-all duration-300" />
                )}
                <div className="flex items-center justify-center min-w-[20px] ml-1">
                  <item.icon className={`w-5 h-5 relative z-10 ${isActive ? "text-primary" : "text-on-surface-muted group-hover:text-on-surface"}`} />
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1, marginLeft: 12 }}
                      exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10 whitespace-nowrap overflow-hidden block"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-outline flex flex-col gap-2">
        <Link href="/support">
          <div 
            title={isCollapsed ? "Support" : undefined}
            className="flex items-center px-3 py-2.5 rounded-[12px] text-on-surface-muted hover:text-on-surface hover:bg-surface-high/40 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-center min-w-[20px] ml-1">
              <HelpCircle className="w-5 h-5" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1, marginLeft: 12 }}
                  exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                  className="whitespace-nowrap overflow-hidden block"
                >
                  Support
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Link>
      </div>
    </div>
  );

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
      <aside className={`hidden lg:flex flex-col h-screen fixed inset-y-0 left-0 bg-surface-lowest border-r border-outline z-40 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isCollapsed ? "w-[80px]" : "w-[260px]"}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-surface-base/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col w-[280px] h-screen bg-surface-lowest border-r border-white/[0.06] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </motion.aside>
        </div>
      )}
    </>
  );
}
