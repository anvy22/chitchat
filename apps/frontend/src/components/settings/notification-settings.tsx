"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { SwitchItem } from "@/components/ui/switch-item";
import { useState } from "react";

const NOTIFICATIONS = [
  { id: 'invites', label: "Space invitations", desc: "Get notified when invited to new spaces", defaultChecked: true },
  { id: 'dms', label: "Direct messages", desc: "Notifications for direct messages", defaultChecked: true },
  { id: 'proximity', label: "Proximity alerts", desc: "When someone enters your proximity zone", defaultChecked: false },
  { id: 'activity', label: "Space activity", desc: "Updates from spaces you're a member of", defaultChecked: true },
  { id: 'digest', label: "Weekly digest", desc: "Weekly summary of workspace activity", defaultChecked: false },
];

export function NotificationSettings() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    NOTIFICATIONS.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.defaultChecked }), {})
  );

  const togglePref = (id: string, checked: boolean) => {
    setPrefs(p => ({ ...p, [id]: checked }));
  };

  return (
    <GlassCard hover={false} className="p-6 space-y-5">
      <h2 className="text-lg font-semibold text-on-surface">Notification Preferences</h2>
      <div className="flex flex-col">
        {NOTIFICATIONS.map((item) => (
          <SwitchItem
            key={item.id}
            label={item.label}
            description={item.desc}
            checked={prefs[item.id]}
            onChange={(checked) => togglePref(item.id, checked)}
          />
        ))}
      </div>
    </GlassCard>
  );
}
