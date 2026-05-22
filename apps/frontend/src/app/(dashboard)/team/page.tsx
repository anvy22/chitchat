"use client";

import { motion } from "framer-motion";
import { Mail, MoreHorizontal, UserPlus, Search } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardSkeleton } from "@/components/ui/skeleton";
import { useTeamMembers } from "@/hooks/use-queries";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const roleColors: Record<string, "info" | "warning" | "default"> = {
  admin: "warning",
  member: "info",
  guest: "default",
};

export default function TeamPage() {
  const { data: members, isLoading } = useTeamMembers();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl mx-auto">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Team</h1>
          <p className="text-on-surface-muted mt-1">{members?.length || 0} members in your workspace</p>
        </div>
        <Button variant="gradient" size="sm">
          <UserPlus className="w-4 h-4" /> Invite
        </Button>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Input placeholder="Search team members…" icon={<Search className="w-4 h-4" />} className="max-w-md" />
      </motion.div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div variants={container} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {members?.map((member, index) => {
            const cardThemes = [
              { color: "#6D3BD7" }, // purple
              { color: "#0566D9" }, // blue
              { color: "#00A572" }, // emerald
              { color: "#F59E0B" }, // amber
              { color: "#EC4899" }, // pink
              { color: "#14B8A6" }, // teal
            ];
            const theme = cardThemes[index % cardThemes.length];
            return (
            <motion.div key={member.id} variants={fadeUp} className="group relative h-full">
              {/* Background Glow */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl z-0"
                style={{ backgroundColor: `${theme.color}20` }}
              />
              
              <div className="block h-full relative z-10">
                <GlassCard 
                  className="p-6 h-full flex flex-col text-center transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1 hover:border-opacity-100"
                  style={{
                    border: `1px solid ${theme.color}40`,
                    boxShadow: `0 8px 30px -4px ${theme.color}25`
                  }}
                >
                  {/* Subtle top gradient accent */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-24 opacity-[0.15] pointer-events-none transition-opacity duration-500 group-hover:opacity-30"
                    style={{ background: `linear-gradient(180deg, ${theme.color} 0%, transparent 100%)` }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <button className="absolute -top-1 -right-1 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-surface-high/40 text-on-surface-muted transition-all cursor-pointer z-20">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    
                    <div className="flex justify-center mb-4 mt-2">
                      <div className="relative rounded-full border-2 border-[#1E1E1E] bg-[#1E1E1E] transition-transform duration-300 group-hover:scale-105 shadow-md">
                         <Avatar initials={member.avatar} status={member.status} size="lg" />
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg text-on-surface mb-1 transition-colors duration-300" style={{ '--hover-color': theme.color } as React.CSSProperties}>
                      {member.name}
                    </h3>
                    <p className="text-sm text-on-surface-muted mb-4 font-medium tracking-wide">{member.department}</p>
                    
                    <div className="flex items-center justify-center gap-2 mb-5 mt-auto">
                      <Badge variant={roleColors[member.role] || "default"} className="capitalize px-2.5 py-0.5">
                        {member.role}
                      </Badge>
                      <Badge className="bg-surface-highest text-on-surface-muted border-white/[0.05] px-2.5 py-0.5">
                        {member.spacesCount} spaces
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-center pt-4 border-t border-white/[0.08]">
                      <button className="p-2 rounded-xl hover:bg-surface-high/60 text-on-surface-muted transition-all cursor-pointer hover:text-primary hover:scale-110" title="Send email">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
