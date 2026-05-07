"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Grid, Layers, Settings, ChevronRight, Clock, Video } from "lucide-react";
import Link from "next/link";
import { useAuthUser } from "@/hooks/use-queries";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] as [number, number, number, number] } },
};

export default function DashboardPage() {
  const { data: user } = useAuthUser();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1200px] mx-auto space-y-10">
      
      {/* Welcome Header */}
      <motion.div variants={fadeUp} className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-3">
          Welcome back, {user?.name.split(" ")[0] || "Dale"}!
        </h1>
        <p className="text-base md:text-lg text-on-surface-muted max-w-2xl">
          Here's what's happening in your workspace today. You have <span className="text-on-surface font-semibold">3 active projects</span> that need your attention.
        </p>
      </motion.div>

      {/* Projects Section */}
      <motion.div variants={fadeUp} className="space-y-6">
        <div className="flex items-center justify-between border-b border-outline-variant pb-4">
          <h2 className="text-xl font-bold text-on-surface">Q3 Marketing Launch</h2>
          <Button variant="ghost" size="sm" className="hidden sm:flex">View Project <ChevronRight className="w-4 h-4 ml-1" /></Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard className="p-6 relative group overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full blur-2xl -z-10 transition-all duration-500 opacity-50 group-hover:opacity-100 group-hover:bg-primary/20" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-surface-highest/50 border border-outline-variant">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="warning" className="bg-orange-500/10 text-orange-400 border-orange-500/20">Review at 2:00 PM</Badge>
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">Product Redesign</h3>
            <p className="text-sm text-on-surface-muted mb-6 line-clamp-2">
              Finalizing the interactive canvas prototypes for the new workspace grid.
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
              <div className="flex -space-x-2">
                <Avatar initials="JD" size="sm" />
                <Avatar initials="AS" size="sm" />
                <Avatar initials="MC" size="sm" />
                <div className="w-7 h-7 rounded-full bg-surface-highest border-2 border-surface-lowest flex items-center justify-center text-[10px] font-medium text-on-surface z-10">
                  +2
                </div>
              </div>
              <Button variant="glass" size="sm" asChild>
                <Link href="/spaces/s1">Join Space</Link>
              </Button>
            </div>
          </GlassCard>

          <GlassCard className="p-6 relative group overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full blur-2xl -z-10 transition-all duration-500 opacity-50 group-hover:opacity-100 group-hover:bg-secondary/20" />
            <div className="flex justify-between items-start mb-4">
               <div className="p-2.5 rounded-xl bg-surface-highest/50 border border-outline-variant">
                <Video className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex items-center text-xs font-medium text-on-surface-muted bg-surface-highest/50 px-2.5 py-1 rounded-full border border-outline-variant">
                <Clock className="w-3.5 h-3.5 mr-1" />
                Last active 2 hrs ago
              </div>
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">Engineering Sync</h3>
            <p className="text-sm text-on-surface-muted mb-6 line-clamp-2">
              Team discussions on WebRTC architecture and reducing proximity audio latency overhead.
            </p>
             <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
              <div className="flex -space-x-2">
                 {/* Empty state avatars mapping to 'last active' context */}
                <div className="w-7 h-7 rounded-full border border-dashed border-outline/40 flex items-center justify-center" />
              </div>
              <Button variant="ghost" size="sm" className="opacity-70 group-hover:opacity-100 transition-opacity">
                 View Recording
              </Button>
            </div>
          </GlassCard>
        </div>
      </motion.div>

      {/* Quick Access Area */}
      <motion.div variants={fadeUp} className="pt-4">
        <h3 className="text-[13px] font-semibold text-on-surface-muted uppercase tracking-wider mb-5">Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/dashboard">
            <GlassCard className="p-5 flex items-center gap-4 hover:shadow-[0_0_20px_rgba(208,188,255,0.15)] group transition-all">
              <div className="p-2.5 rounded-[12px] bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <Grid className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold text-on-surface group-hover:translate-x-1 transition-transform">Home</span>
            </GlassCard>
          </Link>
          <Link href="/spaces">
             <GlassCard className="p-5 flex items-center gap-4 hover:shadow-[0_0_20px_rgba(208,188,255,0.15)] group transition-all">
               <div className="p-2.5 rounded-[12px] bg-secondary/10 border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
                <Layers className="w-5 h-5 text-secondary" />
               </div>
              <span className="font-semibold text-on-surface group-hover:translate-x-1 transition-transform">Spaces</span>
            </GlassCard>
          </Link>
          <Link href="/settings" className="hidden md:block">
            <GlassCard className="p-5 flex items-center gap-4 hover:shadow-[0_0_20px_rgba(208,188,255,0.15)] group transition-all">
               <div className="p-2.5 rounded-[12px] bg-surface-highest/50 border border-outline-variant group-hover:bg-surface-highest transition-colors">
                <Settings className="w-5 h-5 text-on-surface-variant" />
              </div>
              <span className="font-semibold text-on-surface group-hover:translate-x-1 transition-transform">Settings</span>
            </GlassCard>
          </Link>
        </div>
      </motion.div>

    </motion.div>
  );
}
