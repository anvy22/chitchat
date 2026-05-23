"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Orbit, Loader2, Sparkles, ShieldCheck, Zap, Layout, MousePointerClick, Coffee, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// Testimonials/Selling points focused on Creation & Customization
const TESTIMONIALS = [
  {
    quote: "Creating our virtual office took less than a minute. The templates are beautiful, and we could customize every corner to reflect our culture.",
    author: "Sarah Jenkins",
    role: "Founder at Workspace Co.",
    avatar: "SJ"
  },
  {
    quote: "We built a custom office layout that mirrors our actual San Francisco headquarters. Remote hires instantly feel like they belong.",
    author: "Liam O'Connor",
    role: "Head of Design at Stripe",
    avatar: "LO"
  },
  {
    quote: "The drag-and-drop editor is incredibly intuitive. I love that we can configure private meeting pods, quiet desks, and social spaces.",
    author: "Chloe Dubois",
    role: "Director of Ops at Buffer",
    avatar: "CD"
  }
];

export default function SignUpPage() {
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

  const handleGoogleSignUp = async () => {
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
      console.error("Error signing up with Google:", error);
      setIsLoading(false);
      setProvider(null);
    }
  };

  const handleGitHubSignUp = async () => {
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
      console.error("Error signing up with GitHub:", error);
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
              Create your account
            </h1>
            <p className="text-on-surface-muted text-sm mb-8">
              Join ChitChat today to start collaborating with your team in spatial office spaces.
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
              {/* Google Signup */}
              <button
                onClick={handleGoogleSignUp}
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
                Sign up with Google
              </button>

              {/* GitHub Signup */}
              <button
                onClick={handleGitHubSignUp}
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border border-white/[0.08] bg-surface-high/40 hover:bg-surface-highest/80 hover:border-primary/45 text-sm font-medium text-on-surface cursor-pointer transition-all duration-200 group active:scale-[0.98] shadow-sm"
              >
                <svg
                  className="w-5 h-5 fill-current text-on-surface transition-transform duration-200 group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                </svg>
                Sign up with GitHub
              </button>

              <div className="mt-6 flex flex-col items-center justify-center gap-2">
                <span className="text-xs text-on-surface-muted">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="text-primary hover:text-primary-dim font-semibold underline-offset-4 hover:underline transition-colors">
                    Sign in
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

      {/* RIGHT COLUMN: Workspace Sandbox Builder (occupies 7 cols on lg, hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-7 relative bg-[#0b0a16] flex-col justify-between p-16 overflow-hidden border-l border-white/[0.05]">
        
        {/* Deep techy ambient glow elements */}
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, 40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-24 -left-24 w-[450px] h-[450px] bg-secondary/15 rounded-full blur-[130px] pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] pointer-events-none"
        />
        
        {/* Visual representation of Sandbox Editor */}
        <div className="my-auto w-full max-w-2xl relative">
          
          {/* Editor Sandbox Canvas Box */}
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-8 shadow-2xl overflow-hidden aspect-[4/3] flex flex-col justify-between">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none" />

            {/* Header info bar inside sandbox */}
            <div className="flex justify-between items-center bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2 relative z-10">
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-white/80">Customize Your Workspace</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/90">Layout Mode</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Grid Snap On
                </span>
              </div>
            </div>

            {/* Central Editor Placement Area */}
            <div className="absolute inset-0 flex items-center justify-center p-12 pointer-events-none">
              
              {/* Placing object outline */}
              <motion.div
                animate={{
                  borderColor: ["rgba(109, 59, 215, 0.4)", "rgba(109, 59, 215, 0.8)", "rgba(109, 59, 215, 0.4)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-48 h-32 rounded-xl border border-dashed flex flex-col items-center justify-center bg-primary/5 relative z-10"
              >
                {/* Visual bounds tags */}
                <div className="absolute -top-2.5 -left-2.5 w-5 h-5 border-t border-l border-primary" />
                <div className="absolute -top-2.5 -right-2.5 w-5 h-5 border-t border-r border-primary" />
                <div className="absolute -bottom-2.5 -left-2.5 w-5 h-5 border-b border-l border-primary" />
                <div className="absolute -bottom-2.5 -right-2.5 w-5 h-5 border-b border-r border-primary" />

                {/* Animated desk items popping in */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 3,
                    ease: "easeInOut"
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="bg-primary/20 border border-primary/30 rounded-lg p-2.5 flex items-center gap-2 text-white">
                    <Coffee className="w-5 h-5 text-primary-light" />
                    <span className="text-xs font-semibold">Coffee Bar pod</span>
                  </div>
                  <span className="text-[9px] text-primary-light/80 font-mono">X: 120, Y: 450</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Float Menu Asset Palette */}
            <div className="absolute left-6 top-16 flex flex-col gap-2 relative z-10 max-w-[140px] pointer-events-auto">
              <div className="text-[10px] uppercase font-bold tracking-wider text-white/40 mb-1">Office Assets</div>
              
              <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-black/60 border border-white/10 backdrop-blur-sm text-xs font-medium text-white/95">
                <span className="flex items-center gap-1.5">🖥️ Desk Pod</span>
                <Plus className="w-3.5 h-3.5 text-white/50" />
              </div>
              
              <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-primary/20 border border-primary/30 backdrop-blur-sm text-xs font-medium text-white/95">
                <span className="flex items-center gap-1.5">☕ Espresso</span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>

              <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-black/60 border border-white/10 backdrop-blur-sm text-xs font-medium text-white/95 opacity-60">
                <span className="flex items-center gap-1.5">🪴 Plant</span>
                <Plus className="w-3.5 h-3.5 text-white/50" />
              </div>
            </div>

            {/* Neon Cursor Overlay */}
            <motion.div
              animate={{
                x: [180, 260, 200, 180],
                y: [160, 120, 180, 160]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute left-[30%] top-[30%] flex items-center gap-1.5 relative z-20 pointer-events-none"
            >
              <MousePointerClick className="w-5 h-5 text-secondary drop-shadow-[0_2px_8px_rgba(5,102,217,0.5)] fill-secondary" />
              <div className="bg-secondary px-2 py-0.5 rounded-md shadow-lg border border-secondary-container">
                <span className="text-[9px] font-bold text-white whitespace-nowrap">Admin (Placing...)</span>
              </div>
            </motion.div>

            {/* Floating Features Badges */}
            <div className="absolute right-6 top-16 flex flex-col gap-2 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-sm text-[11px] font-medium text-white/95"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                Customize Layouts
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-sm text-[11px] font-medium text-white/95"
              >
                <Zap className="w-3.5 h-3.5 text-primary-light" />
                50+ Office Assets
              </motion.div>
            </div>
            
            {/* Interactive Sandbox indicator box at bottom */}
            <div className="flex gap-2 justify-end w-full relative z-10">
              <span className="text-[10px] text-white/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Easy drag-and-drop builder
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
