"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { PillGroup } from "@/components/ui/pill-group";
import { ColorPickerGroup } from "@/components/ui/color-picker-group";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const ACCENT_COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#EC4899"];
const THEME_OPTIONS = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
];

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <GlassCard hover={false} className="p-6 space-y-6">
      <h2 className="text-lg font-semibold text-on-surface">Appearance</h2>
      <div>
        <p className="text-sm font-medium text-on-surface mb-3">Theme</p>
        {mounted && (
          <PillGroup 
            options={THEME_OPTIONS}
            value={theme || 'system'}
            onChange={setTheme}
          />
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-on-surface mb-3">Accent Color</p>
        <ColorPickerGroup
          colors={ACCENT_COLORS}
          value={accentColor}
          onChange={setAccentColor}
        />
      </div>
    </GlassCard>
  );
}
