'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Palette,
  Bell,
  Globe,
  Shield,
  Moon,
  Sun,
  Monitor,
  Check,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { SectionCard } from '@/components/dashboard/section-card';
import { PatientAvatar } from '@/components/dashboard/patient-avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, preferences, and security"
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex h-auto w-full flex-wrap gap-1 rounded-xl border bg-card p-1.5 sm:w-fit">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
          >
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
          >
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="language"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
          >
            <Globe className="h-4 w-4" />
            Language
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
          >
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile">
          <SectionCard
            title="Profile Information"
            description="Your professional details as shown to patients"
            icon={User}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex flex-col items-center gap-3">
                <PatientAvatar
                  name="Sarah Chen"
                  avatarUrl="https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=256"
                  size="xl"
                />
                <Button variant="outline" size="sm" className="rounded-lg">
                  Change photo
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      defaultValue="Dr. Sarah Chen"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      defaultValue="MD, FACC"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Select defaultValue="Cardiology">
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Neurology">Neurology</SelectItem>
                        <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="Dermatology">Dermatology</SelectItem>
                        <SelectItem value="General Medicine">General Medicine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license">License Number</Label>
                    <Input
                      id="license"
                      defaultValue="CA-MD-99421"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="sarah.chen@clinicos.health"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      defaultValue="+1 (415) 555-0142"
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    defaultValue="Board-certified cardiologist with 12 years of experience specializing in interventional cardiology and heart failure management. Practicing at Bayview Medical Center."
                    className="min-h-[80px] rounded-lg"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" className="rounded-xl">
                    Cancel
                  </Button>
                  <Button className="rounded-xl">Save changes</Button>
                </div>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <SectionCard
            title="Theme"
            description="Choose how ClinicOS looks to you"
            icon={Palette}
          >
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { value: 'light', icon: Sun, label: 'Light' },
                { value: 'dark', icon: Moon, label: 'Dark' },
                { value: 'system', icon: Monitor, label: 'System' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    'flex flex-col items-center gap-3 rounded-xl border p-5 transition-all hover:border-primary/30',
                    mounted && theme === opt.value
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      : 'border-border'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl',
                      mounted && theme === opt.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    <opt.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{opt.label}</span>
                  {mounted && theme === opt.value && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Accent Color</h3>
              <div className="flex gap-3">
                {[
                  { name: 'Blue', color: 'bg-primary', ring: 'ring-primary' },
                  { name: 'Teal', color: 'bg-accent', ring: 'ring-accent' },
                  { name: 'Green', color: 'bg-success', ring: 'ring-success' },
                  { name: 'Amber', color: 'bg-warning', ring: 'ring-warning' },
                ].map((c, i) => (
                  <button
                    key={c.name}
                    className={cn(
                      'h-10 w-10 rounded-full ring-offset-2 ring-offset-background transition-transform hover:scale-110',
                      c.color,
                      i === 0 && `ring-2 ${c.ring}`
                    )}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <SectionCard
            title="Notification Preferences"
            description="Choose what you want to be notified about"
            icon={Bell}
          >
            <div className="space-y-1">
              {[
                {
                  title: 'Appointment requests',
                  desc: 'When a patient requests a new appointment',
                  defaultChecked: true,
                },
                {
                  title: 'Appointment cancellations',
                  desc: 'When a patient cancels an appointment',
                  defaultChecked: true,
                },
                {
                  title: 'Emergency cases',
                  desc: 'Urgent and emergency patient alerts',
                  defaultChecked: true,
                },
                {
                  title: 'AI summaries ready',
                  desc: 'When a new AI pre-visit summary is generated',
                  defaultChecked: true,
                },
                {
                  title: 'Lab results available',
                  desc: 'When new lab results are uploaded',
                  defaultChecked: false,
                },
                {
                  title: 'Daily summary email',
                  desc: 'A daily digest of your schedule at 7 AM',
                  defaultChecked: false,
                },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <Switch defaultChecked={item.defaultChecked} />
                  </div>
                  {i < 5 && <Separator />}
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        {/* Language */}
        <TabsContent value="language">
          <SectionCard
            title="Language & Region"
            description="Set your preferred language and regional format"
            icon={Globe}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="pst">
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific (PST)</SelectItem>
                    <SelectItem value="mst">Mountain (MST)</SelectItem>
                    <SelectItem value="cst">Central (CST)</SelectItem>
                    <SelectItem value="est">Eastern (EST)</SelectItem>
                    <SelectItem value="gmt">Greenwich (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button className="rounded-xl">Save preferences</Button>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <SectionCard
            title="Security"
            description="Manage your password and security settings"
            icon={Shield}
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Change Password</h3>
                <div className="grid gap-4 sm:max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="current">Current Password</Label>
                    <Input
                      id="current"
                      type="password"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new">New Password</Label>
                    <Input
                      id="new"
                      type="password"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm New Password</Label>
                    <Input
                      id="confirm"
                      type="password"
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <Button className="rounded-xl">Update password</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Authenticator app
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Use an authenticator app for verification codes
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">SMS verification</p>
                    <p className="text-xs text-muted-foreground">
                      Receive verification codes via SMS
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Active Sessions</h3>
                <div className="space-y-2">
                  {[
                    {
                      device: 'MacBook Pro · Chrome',
                      location: 'San Francisco, CA',
                      current: true,
                    },
                    {
                      device: 'iPhone 15 · Safari',
                      location: 'San Francisco, CA',
                      current: false,
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{s.device}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.location}
                        </p>
                      </div>
                      {s.current ? (
                        <span className="rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                          Current
                        </span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
