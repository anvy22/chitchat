"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProfileSettings() {
  return (
    <GlassCard hover={false} className="p-6 space-y-6">
      <h2 className="text-lg font-semibold text-on-surface">Profile Settings</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">First Name</label>
          <Input defaultValue="Dale" />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Last Name</label>
          <Input defaultValue="Cooper" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Email</label>
          <Input defaultValue="dale@orbithq.com" type="email" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Bio</label>
          <textarea
            defaultValue="Engineering lead at OrbitHQ. Building the future of remote collaboration."
            rows={3}
            className="w-full bg-surface-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="gradient" size="sm">Save Changes</Button>
      </div>
    </GlassCard>
  );
}
