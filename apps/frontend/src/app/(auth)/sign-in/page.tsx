"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Orbit, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="glass-card-static p-8 md:p-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Orbit className="w-5 h-5 text-on-surface" />
            </div>
            <span className="text-xl font-bold text-on-surface">OrbitHQ</span>
          </div>

          <h1 className="text-2xl font-bold text-on-surface text-center mb-2">Welcome back</h1>
          <p className="text-on-surface-muted text-center mb-8">Sign in to enter your workspace</p>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="glass-card flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-on-surface cursor-pointer">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0 1 12 4.92c1.72 0 3.28.6 4.5 1.58l3.36-3.36A11.86 11.86 0 0 0 12 0 12 12 0 0 0 .46 8.24l4.81 3.52Z"/><path fill="#4285F4" d="M23.54 12.27c0-.91-.08-1.55-.24-2.23H12v4.04h6.63a5.83 5.83 0 0 1-2.46 3.79l3.78 2.93c2.27-2.1 3.59-5.18 3.59-8.53Z"/><path fill="#FBBC05" d="M5.27 14.24a7.2 7.2 0 0 1-.38-2.24c0-.78.14-1.54.37-2.24L.45 6.24A12.01 12.01 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l3.99-3.16Z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.78-2.93a7.15 7.15 0 0 1-4.15 1.2 7.08 7.08 0 0 1-6.73-4.88l-4.8 3.72A12 12 0 0 0 12 24Z"/></svg>
              Google
            </button>
            <button className="glass-card flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-on-surface cursor-pointer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/></svg>
              GitHub
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-surface-high px-3 text-on-surface-muted">or continue with</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Email</label>
              <Input
                type="email"
                placeholder="dale@orbithq.com"
                icon={<Mail className="w-4 h-4" />}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-muted hover:text-on-surface transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-outline-variant bg-surface-low accent-primary" />
                <span className="text-sm text-on-surface-muted">Remember me</span>
              </label>
              <span className="text-sm text-primary hover:text-primary-light cursor-pointer transition-colors">Forgot password?</span>
            </div>

            <Link href="/dashboard">
              <Button variant="gradient" className="w-full mt-2">
                Sign In <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </form>

          <p className="text-center text-sm text-on-surface-muted mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:text-primary-light transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
