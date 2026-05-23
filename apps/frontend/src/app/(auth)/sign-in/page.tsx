"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Orbit, Loader2, Sparkles, MessageSquare, ShieldCheck, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// Testimonials data for the showcase panel
const TESTIMONIALS = [
  {
    quote: "ChitChat completely transformed our remote collaboration. The spatial map makes us feel like we're working in the same room.",
    author: "Elena Rostova",
    role: "VP of Product at Linear",
    avatar: "ER"
  },
  {
    quote: "The low-latency spatial audio and real-time canvas boards are unmatched. It has replaced three other tools for our engineering team.",
    author: "Marcus Chen",
    role: "Lead Architect at Vercel",
    avatar: "MC"
  },
  {
    quote: "Designing virtual offices on ChitChat is incredibly fun. It boosts our company culture and makes remote work feel human.",
    author: "Jessica Alba",
    role: "Head of People at Stripe",
    avatar: "JA"
  }
];

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<"google" | "github" | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Rotate testimonials every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setProvider("google");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setIsLoading(false);
      setProvider(null);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setIsLoading(true);
      setProvider("github");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      setIsLoading(false);
      setProvider(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base flex lg:grid lg:grid-cols-12 text-on-surface overflow-hidden">
      
      {/* LEFT COLUMN: Authentication Form (occupies 5 cols on lg, full width otherwise) */}
      <div className="flex-1 lg:col-span-5 flex flex-col justify-between p-8 md:p-12 lg:p-16 relative bg-surface-lowest z-10">
        
        {/* Glow effects for mobile/tablet background */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/15 rounded-full blur-[120px] pointer-events-none lg:hidden" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/15 rounded-full blur-[120px] pointer-events-none lg:hidden" />

        {/* Top Header / Branding */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/20">
            <Orbit className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-on-surface">ChitChat</span>
        </div>

        {/* Main Content Area */}
        <div className="max-w-md w-full mx-auto my-auto py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-on-surface">
              Welcome back
            </h1>
            <p className="text-on-surface-muted text-sm mb-8">
              Start collaborating with your team in high-fidelity, real-time spatial office spaces.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="w-full py-12 flex flex-col items-center justify-center space-y-4 glass-card-static p-8">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-on-surface-muted animate-pulse">
                Connecting secure session via {provider === "google" ? "Google" : "GitHub"}...
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Google Login */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border border-white/[0.08] bg-surface-high/40 hover:bg-surface-highest/80 hover:border-primary/45 text-sm font-medium text-on-surface cursor-pointer transition-all duration-200 group active:scale-[0.98] shadow-sm"
              >
                <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.27 9.76A7.08 7.08 0 0 1 12 4.92c1.72 0 3.28.6 4.5 1.58l3.36-3.36A11.86 11.86 0 0 0 12 0 12 12 0 0 0 .46 8.24l4.81 3.52Z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.54 12.27c0-.91-.08-1.55-.24-2.23H12v4.04h6.63a5.83 5.83 0 0 1-2.46 3.79l3.78 2.93c2.27-2.1 3.59-5.18 3.59-8.53Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.24a7.2 7.2 0 0 1-.38-2.24c0-.78.14-1.54.37-2.24L.45 6.24A12.01 12.01 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l3.99-3.16Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.78-2.93a7.15 7.15 0 0 1-4.15 1.2 7.08 7.08 0 0 1-6.73-4.88l-4.8 3.72A12 12 0 0 0 12 24Z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* GitHub Login */}
              <button
                onClick={handleGitHubSignIn}
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border border-white/[0.08] bg-surface-high/40 hover:bg-surface-highest/80 hover:border-primary/45 text-sm font-medium text-on-surface cursor-pointer transition-all duration-200 group active:scale-[0.98] shadow-sm"
              >
                <svg
                  className="w-5 h-5 fill-current text-on-surface transition-transform duration-200 group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                </svg>
                Continue with GitHub
              </button>

              <div className="mt-6 flex flex-col items-center justify-center gap-2">
                <span className="text-xs text-on-surface-muted">
                  Don't have an account?{" "}
                  <Link href="/sign-up" className="text-primary hover:text-primary-dim font-semibold underline-offset-4 hover:underline transition-colors">
                    Sign up free
                  </Link>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer info & Trust indicators */}
        <div className="relative z-10 flex flex-col gap-6">
          <div className="border-t border-white/[0.06] pt-6">
            <p className="text-[11px] uppercase tracking-wider text-on-surface-muted mb-3 font-semibold text-center lg:text-left">
              Trusted by global teams at
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 opacity-40 grayscale contrast-125">
              <span className="text-sm font-bold tracking-tight">VERCEL</span>
              <span className="text-sm font-bold tracking-tight">LINEAR</span>
              <span className="text-sm font-bold tracking-tight">STRIPE</span>
              <span className="text-sm font-bold tracking-tight">SUPABASE</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-on-surface-muted">
            <span>© 2026 ChitChat Inc.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-on-surface transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-on-surface transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: SaaS Showcase Hero (occupies 7 cols on lg, hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-7 relative bg-[#0b0a16] flex-col justify-between p-16 overflow-hidden border-l border-white/[0.05]">
        
        {/* Deep techy ambient glow elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-32 left-1/4 w-[450px] h-[450px] bg-secondary/15 rounded-full blur-[140px] pointer-events-none"
        />
        
        {/* Visual representation of spatial workspace */}
        <div className="my-auto w-full max-w-2xl relative">
          
          {/* Spatial Grid Showcase Box */}
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-8 shadow-2xl overflow-hidden aspect-[4/3] flex flex-col justify-between">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none" />

            {/* Glowing lines between avatar nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.line
                x1="25%" y1="28%" x2="60%" y2="28%"
                stroke="url(#purpleGlow)" strokeWidth="2" strokeDasharray="6,4"
                animate={{ strokeDashoffset: [-20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <motion.line
                x1="60%" y1="28%" x2="45%" y2="70%"
                stroke="url(#blueGlow)" strokeWidth="2"
                className="opacity-75"
              />
              <motion.line
                x1="25%" y1="28%" x2="45%" y2="70%"
                stroke="url(#purpleGlow)" strokeWidth="2"
                className="opacity-75"
              />
              <motion.line
                x1="75%" y1="55%" x2="60%" y2="28%"
                stroke="url(#emeraldGlow)" strokeWidth="2" strokeDasharray="8,4"
                animate={{ strokeDashoffset: [20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
              <defs>
                <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6D3BD7" />
                  <stop offset="100%" stopColor="#D0BCFF" />
                </linearGradient>
                <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0566D9" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
                <linearGradient id="emeraldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00A572" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
              </defs>
            </svg>

            {/* Header info bar inside showcase */}
            <div className="flex justify-between items-center bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-white/80">Design Space #2</span>
              </div>
              <div className="flex gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/90">Canvas Mode</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 border border-primary/30 text-primary-light">Voice Connected</span>
              </div>
            </div>

            {/* Node 1: Sarah */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[20%] top-[20%] flex flex-col items-center gap-1.5 relative z-10"
            >
              <div className="w-12 h-12 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary/30">
                SC
              </div>
              <div className="bg-surface px-2.5 py-0.5 rounded-md border border-white/[0.08] shadow-md flex items-center gap-1">
                <span className="text-[10px] font-bold text-black dark:text-white">Sarah</span>
                <MessageSquare className="w-3 h-3 text-primary animate-pulse" />
              </div>
            </motion.div>

            {/* Node 2: Emma */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute left-[55%] top-[20%] flex flex-col items-center gap-1.5 relative z-10"
            >
              <div className="w-12 h-12 rounded-full border-2 border-secondary bg-secondary/10 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-secondary/30">
                ER
              </div>
              <div className="bg-surface px-2.5 py-0.5 rounded-md border border-white/[0.08] shadow-md">
                <span className="text-[10px] font-bold text-black dark:text-white">Emma</span>
              </div>
            </motion.div>

            {/* Node 3: Liam */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute left-[40%] top-[60%] flex flex-col items-center gap-1.5 relative z-10"
            >
              <div className="w-12 h-12 rounded-full border-2 border-tertiary bg-tertiary/10 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-tertiary/30">
                LC
              </div>
              <div className="bg-surface px-2.5 py-0.5 rounded-md border border-white/[0.08] shadow-md flex items-center gap-1">
                <span className="text-[10px] font-bold text-black dark:text-white">Liam</span>
                <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              </div>
            </motion.div>

            {/* Node 4: Sophia (Far right, no active stream) */}
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute left-[70%] top-[45%] flex flex-col items-center gap-1.5 relative z-10"
            >
              <div className="w-12 h-12 rounded-full border-2 border-slate-500 bg-slate-500/10 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-slate-500/30">
                SJ
              </div>
              <div className="bg-surface px-2.5 py-0.5 rounded-md border border-white/[0.08] shadow-md">
                <span className="text-[10px] font-bold text-black dark:text-white">Sophia</span>
              </div>
            </motion.div>

            {/* Floating SaaS USP Badges */}
            <div className="absolute right-6 top-16 flex flex-col gap-2 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-sm text-[11px] font-medium text-white/95"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                Real-Time Presence
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-sm text-[11px] font-medium text-white/95"
              >
                <Zap className="w-3.5 h-3.5 text-primary-light" />
                Ultralow Latency Audio
              </motion.div>
            </div>
            
            {/* Interactive Canvas indicator box at bottom */}
            <div className="flex gap-2 justify-end w-full relative z-10">
              <span className="text-[10px] text-white/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> End-to-end encrypted
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Testimonials Slider */}
        <div className="relative w-full max-w-xl">
          <div className="h-32 flex flex-col justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <p className="text-white/80 font-medium text-lg leading-relaxed italic">
                  "{TESTIMONIALS[activeTestimonial].quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[11px] font-bold text-white shadow-md">
                    {TESTIMONIALS[activeTestimonial].avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {TESTIMONIALS[activeTestimonial].author}
                    </h4>
                    <p className="text-xs text-white/50">
                      {TESTIMONIALS[activeTestimonial].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Dots Indicator */}
          <div className="flex gap-1.5 mt-6">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeTestimonial === index ? "w-6 bg-primary" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
