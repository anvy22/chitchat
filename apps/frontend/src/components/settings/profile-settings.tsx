import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthUser, useUpdateUser } from "@/hooks/use-queries";

export function ProfileSettings() {
  const { data: user } = useAuthUser();
  const updateMutation = useUpdateUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("Add your bio...");

  useEffect(() => {
    if (user) {
      const parts = user.name.split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = () => {
    updateMutation.mutate({
      name: `${firstName} ${lastName}`.trim(),
      email,
      bio,
    });
  };

  return (
    <GlassCard hover={false} className="p-6 space-y-6">
      <h2 className="text-lg font-semibold text-on-surface">Profile Settings</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">First Name</label>
          <Input 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Last Name</label>
          <Input 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Email</label>
          <Input 
            value={email} 
            disabled 
            type="email" 
            className="opacity-60 cursor-not-allowed"
          />
          <p className="text-[11px] text-on-surface-muted mt-1">Managed by your sign-in provider</p>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full bg-surface-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button 
          variant="gradient" 
          size="sm" 
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </GlassCard>
  );
}
