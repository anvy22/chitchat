"use client";

import { motion } from "framer-motion";
import { SETTINGS_TABS } from "@/constants/strings";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { LogOut } from "lucide-react";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { AppearanceSettings } from "@/components/settings/appearance-settings";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { logout } = useAuth();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-on-surface">Settings</h1>
        <p className="text-on-surface-muted mt-1">Manage your workspace preferences</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <motion.div variants={fadeUp} className="w-full lg:w-56 shrink-0 flex flex-col gap-3">
          <div className="glass-card-static rounded-2xl p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {SETTINGS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-muted hover:text-on-surface hover:bg-surface-high/40"
                }`}
              >
                <tab.icon className="w-4.5 h-4.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 transition-all cursor-pointer w-full"
          >
            <LogOut className="w-4.5 h-4.5" />
            Log Out
          </button>
        </motion.div>

        {/* Content */}
        <motion.div variants={fadeUp} className="flex-1">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "appearance" && <AppearanceSettings />}
          {/* Add other components here as needed */}
          {["privacy", "audio", "display"].includes(activeTab) && (
            <div className="glass-card-static rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-surface-high flex items-center justify-center mb-4">
                <span className="text-2xl">🚧</span>
              </div>
              <h3 className="text-lg font-medium text-on-surface">Coming Soon</h3>
              <p className="text-on-surface-muted mt-1 max-w-sm">
                This settings panel is currently under construction.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
