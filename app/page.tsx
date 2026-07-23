'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  CalendarClock,
  Eye,
  EyeOff,
  HeartPulse,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ThemeToggle } from '@/components/dashboard/theme-toggle';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const email = (
      document.getElementById("email") as HTMLInputElement
    ).value;

    const password = (
      document.getElementById("password") as HTMLInputElement
    ).value;

    console.log("auth =", auth);
    console.log("auth type =", typeof auth);

    await signInWithEmailAndPassword(auth, email, password);

    router.push("/overview");
  } catch (error) {
    console.error("FULL ERROR:", error);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left — Brand / illustration panel */}
      <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-accent p-8 text-white lg:p-12">
        {/* Decorative grid + glow */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 40%)',
            }}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <HeartPulse className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">ClinicOS</span>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h1 className="text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
              The doctor dashboard that puts patients first.
            </h1>
            <p className="mt-4 text-base text-white/80">
              Manage appointments, review AI-assisted patient summaries, and
              deliver care — all in one beautifully simple workspace.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="mt-10 space-y-4"
          >
            {[
              { icon: CalendarClock, text: 'Smart appointment scheduling' },
              { icon: Sparkles, text: 'AI-generated pre-visit summaries' },
              { icon: ShieldCheck, text: 'HIPAA-compliant patient records' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                  <f.icon className="h-4 w-4" />
                </div>
                <span className="text-sm text-white/90">{f.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-white/60">
          <Activity className="h-4 w-4" />
          <span>Trusted by 2,400+ clinicians worldwide</span>
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="absolute right-6 top-6">
          <ThemeToggle />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 lg:hidden">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to your ClinicOS doctor dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@clinicos.health"
                  defaultValue="sarah.chen@clinicos.health"
                  className="h-11 rounded-xl pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  defaultValue="clinicos2024"
                  className="h-11 rounded-xl pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" defaultChecked />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me on this device
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl text-sm font-medium"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in to dashboard
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
