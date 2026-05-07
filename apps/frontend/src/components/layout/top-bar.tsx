"use client";

import { motion } from "framer-motion";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";

export interface TopBarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function TopBar({ isCollapsed, onToggleCollapse }: TopBarProps) {
  return (
    <div className="sticky top-0 z-30 h-20 px-4 md:px-6 lg:px-8 border-b border-outline-variant bg-surface-base/80 backdrop-blur-xl flex items-center justify-between">
      <div className="flex items-center flex-1 gap-4">
        {onToggleCollapse && (
          <button 
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2.5 rounded-xl text-on-surface-muted hover:text-on-surface hover:bg-surface-high/50 transition-colors cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="w-full max-w-xl ml-10 lg:ml-0">
          <Input 
            placeholder="Search spaces, members, messages..." 
            icon={<Search className="w-4 h-4" />}
            className="bg-surface-lowest/50 border-outline-variant focus:bg-surface-highest/60 hover:bg-surface-lowest/80 transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 pl-4 shrink-0">
        <button className="relative p-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-high/50 hover:shadow-[0_0_10px_rgba(109,59,215,0.2)] hover:border-primary/20 border border-transparent transition-all cursor-pointer group">
          <Bell className="w-5 h-5 transition-all duration-200" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
        </button>
        <div className="h-8 w-[1px] border-outline-variant mx-1" />
        <button className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-surface-high/30 transition-colors cursor-pointer border border-transparent hover:border-outline-variant">
          <Avatar initials="DC" status="online" size="sm" />
          <div className="hidden md:block text-left relative top-[1px]">
            <p className="text-sm font-medium text-on-surface leading-none">Dale</p>
          </div>
        </button>
      </div>
    </div>
  );
}
