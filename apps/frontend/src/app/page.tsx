"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Layers, Users, Zap, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
    },
  };

  return (
    <div className="min-h-screen bg-surface-base text-on-surface overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, -45, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-secondary-container/20 rounded-full blur-[100px]"
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-inverse-primary flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(208,188,255,0.4)]">
              <span className="text-on-surface font-bold text-lg">O</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-on-surface to-on-surface-variant">OrbitHQ</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-on-surface-muted hover:text-on-surface transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up">
              <Button variant="gradient" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-40 pb-20 px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Introducing OrbitHQ Spatial Workspaces 2.0</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            <span className="block text-on-surface">Virtual Spaces with</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary">
              Proximity Interaction.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-on-surface-muted mb-12 max-w-2xl mx-auto leading-relaxed">
            Break free from grid-view calls. OrbitHQ combines spatial audio, dynamic canvases, and real-time collaboration into a workspace that feels alive.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button variant="gradient" size="lg" className="w-full sm:w-auto h-14 px-8 text-base">
                Start Collaborating <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="glass" size="lg" className="w-full sm:w-auto h-14 px-8 text-base">
                View Interactive Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-32 max-w-7xl mx-auto grid md:grid-cols-3 gap-6"
        >
          <GlassCard className="p-8 group hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-on-surface mb-3">Proximity Chat</h3>
            <p className="text-on-surface-muted leading-relaxed">Walk up to colleagues to start talking. Walk away to fade out. Natural conversations restored to remote work.</p>
          </GlassCard>

          <GlassCard className="p-8 group hover:shadow-lg transition-all duration-300">
             <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
              <Layers className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-on-surface mb-3">Intelligent Canvas</h3>
            <p className="text-on-surface-muted leading-relaxed">Embed live docs, whiteboards, and external tools directly into your spatial environment. Everything in one place.</p>
          </GlassCard>

          <GlassCard className="p-8 group hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
              <Zap className="w-7 h-7 text-tertiary" />
            </div>
            <h3 className="text-xl font-semibold text-on-surface mb-3">Zero Latency</h3>
            <p className="text-on-surface-muted leading-relaxed">Powered by a globally distributed edge network, movements and voice streams execute with near-zero latency.</p>
          </GlassCard>
        </motion.div>
      </main>
    </div>
  );
}
