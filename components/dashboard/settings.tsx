"use client";

import React, { useEffect, useState } from "react";
import { User, Bell, Palette, Shield, X } from "lucide-react";
import { useAuth } from "@/lib/store/auth";
import { useUser } from "@/lib/hooks/useUser";
import { useUpdateUser } from "@/lib/hooks/useUpdateUser";
import { useChangePassword } from "@/lib/hooks/useChangePassword";
import { useTheme } from "next-themes";
import { toast } from "sonner";

// --- Sub-components ---

const SettingsSection = ({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-6 p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm">
    <div className="flex items-center gap-4">
      <div className="p-2.5 rounded-xl bg-brand/10 text-brand">{icon}</div>
      <div>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <div className="flex flex-col gap-6">{children}</div>
  </div>
);

const ToggleSetting = ({
  label,
  description,
  enabled,
  onToggle,
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
        ${enabled ? "bg-brand" : "bg-secondary"}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
          ${enabled ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  </div>
);

// --- Change Password Dialog (Modal) ---

const ChangePasswordDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { mutate: changePassword, isPending } = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    changePassword(
      {
        currentPassword,
        newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password changed successfully");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">Change Password</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Update your account password.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-secondary/40 text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-muted-foreground/50"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-muted-foreground/50"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-muted-foreground/50"
              required
            />
          </div>

          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-secondary/50 hover:bg-secondary text-foreground text-sm font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 bg-brand text-black text-sm font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isPending ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Component ---

export const Settings = () => {
  const { user } = useAuth();
  const userId = user?.id || user?._id || "";
  const { data: userDataResponse } = useUser(userId);
  const { mutate: updateUser, isPending } = useUpdateUser();
  const currentUser = userDataResponse?.user || user;
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");

  useEffect(() => {
    if (currentUser) {
      setTimeout(() => {
        setName(currentUser.name);
        setEmail(currentUser.email);
        setRole(currentUser.role);
      }, 0);
    }
  }, [currentUser]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Display Name is required");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please provide a valid email address");
      return;
    }

    updateUser(
      {
        id: userId,
        data: {
          name,
          email,
          role,
        },
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
        },
      },
    );
  };

  // Change Password Dialog state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Notifications state & persistence
  const [notifications, setNotifications] = useState({
    email: true,
    reminders: true,
    summary: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("user-notifications");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setNotifications(parsed);
        }, 0);
      } catch (e) {
        console.error("Error parsing notifications settings", e);
      }
    }
  }, []);

  const handleToggleNotification = (key: "email" | "reminders" | "summary") => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("user-notifications", JSON.stringify(updated));
      toast.success("Notification preferences updated");
      return updated;
    });
  };

  // Appearance state & persistence
  const { theme, setTheme } = useTheme();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const compactSaved = localStorage.getItem("compact-mode") === "true";
    setTimeout(() => {
      setIsCompact(compactSaved);
    }, 0);
    if (compactSaved) {
      document.documentElement.classList.add("compact");
    } else {
      document.documentElement.classList.remove("compact");
    }
  }, []);

  const handleToggleCompact = () => {
    const newVal = !isCompact;
    setIsCompact(newVal);
    localStorage.setItem("compact-mode", String(newVal));
    if (newVal) {
      document.documentElement.classList.add("compact");
      toast.success("Compact mode enabled");
    } else {
      document.documentElement.classList.remove("compact");
      toast.success("Compact mode disabled");
    }
  };

  // Security state & persistence
  const [security, setSecurity] = useState({
    twoFactor: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("user-security");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setSecurity(parsed);
        }, 0);
      } catch (e) {
        console.error("Error parsing security settings", e);
      }
    }
  }, []);

  const handleToggleSecurity = (key: "twoFactor") => {
    setSecurity((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("user-security", JSON.stringify(updated));
      toast.success(`${key === "twoFactor" ? "Two-Factor Authentication" : "Security preferences"} updated`);
      return updated;
    });
  };

  // Hydration guard to prevent SSR mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col gap-8 max-w-4xl animate-pulse">
        <div>
          <div className="h-9 w-36 bg-secondary/30 rounded-xl" />
          <div className="h-4 w-64 bg-secondary/20 mt-2 rounded-lg" />
        </div>
        <div className="h-72 bg-card/20 border border-border/30 rounded-2xl" />
        <div className="h-56 bg-card/20 border border-border/30 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <SettingsSection
        icon={<User className="h-5 w-5" />}
        title="Profile"
        description="Your personal information"
      >
        <div className="flex items-center gap-4 py-2">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-black text-xl shadow-lg shadow-brand/10 shrink-0">
            {currentUser?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUser.avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              name ? name.charAt(0).toUpperCase() : "U"
            )}
          </div>
          <div>
            <h4 className="text-base font-bold text-foreground">{name || "User"}</h4>
            <p className="text-sm text-muted-foreground">{email || "Loading..."}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-muted-foreground">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
            />
          </div>
        </div>

        <div className="flex mt-2">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-6 py-2.5 bg-brand text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-brand/20"
          >
            {isPending ? "Saving..." : "Save Changes"}
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
              onToggle={() => handleToggleNotification("email")}
            />
          </div>
          <div className="pt-6">
            <ToggleSetting
              label="Task Reminders"
              description="Get reminded about due tasks"
              enabled={notifications.reminders}
              onToggle={() => handleToggleNotification("reminders")}
            />
          </div>
          <div className="pt-6">
            <ToggleSetting
              label="Weekly Summary"
              description="Receive weekly productivity reports"
              enabled={notifications.summary}
              onToggle={() => handleToggleNotification("summary")}
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
              enabled={theme === "dark"}
              onToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
          </div>
          <div className="pt-6">
            <ToggleSetting
              label="Compact Mode"
              description="Reduce spacing in the UI"
              enabled={isCompact}
              onToggle={handleToggleCompact}
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
                <p className="text-xs text-muted-foreground">
                  Update your account password
                </p>
              </div>
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="px-4 py-2 bg-secondary/50 border border-border hover:bg-secondary text-sm font-bold rounded-lg transition-all cursor-pointer"
              >
                Change Password
              </button>
            </div>
            <div className="h-px bg-border/30" />
            <ToggleSetting
              label="Two-Factor Authentication"
              description="Add an extra layer of security"
              enabled={security.twoFactor}
              onToggle={() => handleToggleSecurity("twoFactor")}
            />
          </div>
        </div>
      </SettingsSection>

      {/* Change Password Modal */}
      <ChangePasswordDialog
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};

export default Settings;
