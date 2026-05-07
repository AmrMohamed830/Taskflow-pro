"use client";

import React, { useState } from "react";
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Mail, 
  Lock, 
  Check, 
  ChevronRight,
  Monitor
} from "lucide-react";

// --- Sub-components ---

const SettingsSection = ({ 
  icon, 
  title, 
  description, 
  children 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-6 p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm">
    <div className="flex items-center gap-4">
      <div className="p-2.5 rounded-xl bg-brand/10 text-brand">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <div className="flex flex-col gap-6">
      {children}
    </div>
  </div>
);

const ToggleSetting = ({ 
  label, 
  description, 
  enabled, 
  onToggle 
}: { 
  label: string; 
  description: string; 
  enabled: boolean; 
  onToggle: () => void;
}) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-bold text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </div>
    <button 
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
        ${enabled ? 'bg-brand' : 'bg-secondary'}`}
    >
      <span 
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
          ${enabled ? 'translate-x-5' : 'translate-x-0'}`} 
      />
    </button>
  </div>
);

// --- Main Component ---

export const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    reminders: true,
    summary: false
  });

  const [appearance, setAppearance] = useState({
    darkMode: true,
    compact: false
  });

  const [security, setSecurity] = useState({
    twoFactor: false
  });

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <SettingsSection 
        icon={<User className="h-5 w-5" />} 
        title="Profile" 
        description="Your personal information"
      >
        <div className="flex items-center gap-4 py-2">
          <div className="h-16 w-16 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-black text-xl shadow-lg shadow-brand/10">
            A
          </div>
          <div>
            <h4 className="text-base font-bold text-foreground">Alex Admin</h4>
            <p className="text-sm text-muted-foreground">admin@taskflow.com</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-muted-foreground">Display Name</label>
            <input 
              type="text" 
              defaultValue="Alex Admin"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-muted-foreground">Email</label>
            <input 
              type="email" 
              defaultValue="admin@taskflow.com"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
            />
          </div>
        </div>
        
        <div className="flex mt-2">
          <button className="px-6 py-2.5 bg-brand text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-brand/20">
            Save Changes
          </button>
        </div>
      </SettingsSection>

      {/* Notifications Section */}
      <SettingsSection 
        icon={<Bell className="h-5 w-5" />} 
        title="Notifications" 
        description="Manage your notification preferences"
      >
        <div className="flex flex-col gap-6 divide-y divide-border/30">
          <div className="pt-0">
            <ToggleSetting 
              label="Email Notifications" 
              description="Receive updates via email" 
              enabled={notifications.email} 
              onToggle={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
            />
          </div>
          <div className="pt-6">
            <ToggleSetting 
              label="Task Reminders" 
              description="Get reminded about due tasks" 
              enabled={notifications.reminders} 
              onToggle={() => setNotifications(prev => ({ ...prev, reminders: !prev.reminders }))}
            />
          </div>
          <div className="pt-6">
            <ToggleSetting 
              label="Weekly Summary" 
              description="Receive weekly productivity reports" 
              enabled={notifications.summary} 
              onToggle={() => setNotifications(prev => ({ ...prev, summary: !prev.summary }))}
            />
          </div>
        </div>
      </SettingsSection>

      {/* Appearance Section */}
      <SettingsSection 
        icon={<Palette className="h-5 w-5" />} 
        title="Appearance" 
        description="Customize the look and feel"
      >
        <div className="flex flex-col gap-6 divide-y divide-border/30">
          <div className="pt-0">
            <ToggleSetting 
              label="Dark Mode" 
              description="Use dark theme" 
              enabled={appearance.darkMode} 
              onToggle={() => setAppearance(prev => ({ ...prev, darkMode: !prev.darkMode }))}
            />
          </div>
          <div className="pt-6">
            <ToggleSetting 
              label="Compact Mode" 
              description="Reduce spacing in the UI" 
              enabled={appearance.compact} 
              onToggle={() => setAppearance(prev => ({ ...prev, compact: !prev.compact }))}
            />
          </div>
        </div>
      </SettingsSection>

      {/* Security Section */}
      <SettingsSection 
        icon={<Shield className="h-5 w-5" />} 
        title="Security" 
        description="Manage your security settings"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">Password</p>
                <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
              </div>
              <button className="px-4 py-2 bg-secondary/50 border border-border hover:bg-secondary text-sm font-bold rounded-lg transition-all">
                Change Password
              </button>
            </div>
            <div className="h-px bg-border/30" />
            <ToggleSetting 
              label="Two-Factor Authentication" 
              description="Add an extra layer of security" 
              enabled={security.twoFactor} 
              onToggle={() => setSecurity(prev => ({ ...prev, twoFactor: !prev.twoFactor }))}
            />
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

export default Settings;
