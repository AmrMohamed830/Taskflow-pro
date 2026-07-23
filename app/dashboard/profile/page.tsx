"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/store/auth";
import { useUpdateUser } from "@/lib/hooks/users/useUpdateUser";
import { useChangePassword } from "@/lib/hooks/auth/useChangePassword";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  User as UserIcon,
  Mail,
  Briefcase,
  Check,
  Shield,
  Palette,
  Bell,
  Lock,
  X,
} from "lucide-react";

// --- Sub-components ---

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
      type="button"
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
      },
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
            <h3 className="text-xl font-bold text-foreground">
              Change Password
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Update your account password.
            </p>
          </div>
          <button
            type="button"
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
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-muted-foreground/50 outline-none"
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
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-muted-foreground/50 outline-none"
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
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-muted-foreground/50 outline-none"
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

// --- Main Page Component ---

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { data: session } = useSession();
  const updateUserMutation = useUpdateUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  const userImage = session?.user?.image || user?.avatar;
  const isFormChanged =
    name !== (user?.name || "") ||
    email !== (user?.email || "") ||
    department !== (user?.department || "");

  // Local state persistence for other settings
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    reminders: true,
    summary: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
  });

  const { theme, setTheme } = useTheme();
  const [isCompact, setIsCompact] = useState(false);

  // Sync profile details
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setDepartment(user.department || "");
      if (user.notificationSettings) {
        setNotifications(user.notificationSettings);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?._id]);

  // Load other settings from localStorage on mount
  useEffect(() => {
    const savedNotifs = localStorage.getItem("user-notifications");
    if (savedNotifs) {
      try {
        setNotifications(JSON.parse(savedNotifs));
      } catch (e) {
        console.error(e);
      }
    }

    const savedSecurity = localStorage.getItem("user-security");
    if (savedSecurity) {
      try {
        setSecurity(JSON.parse(savedSecurity));
      } catch (e) {
        console.error(e);
      }
    }

    const compactSaved = localStorage.getItem("compact-mode") === "true";
    setIsCompact(compactSaved);
  }, []);

  const handleToggleNotification = (key: "email" | "reminders" | "summary") => {
    if (!user) return;
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem("user-notifications", JSON.stringify(updated));

    updateUserMutation.mutate(
      {
        id: user.id || user._id || "",
        data: {
          notificationSettings: updated,
        },
      },
      {
        onSuccess: (response) => {
          if (response?.user) {
            setUser(response.user);
          }
          toast.success("Notification preferences updated");
        },
      },
    );
  };

  const handleToggleSecurity = (key: "twoFactor") => {
    setSecurity((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("user-security", JSON.stringify(updated));
      toast.success(
        `${key === "twoFactor" ? "Two-Factor Authentication" : "Security preferences"} updated`,
      );
      return updated;
    });
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    updateUserMutation.mutate(
      {
        id: user.id || user._id || "",
        data: {
          name,
          email,
          department,
        },
      },
      {
        onSuccess: (response) => {
          if (response?.user) {
            setUser(response.user);
          }
        },
      },
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Profile & Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account info, security, and interface preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Profile Preview */}
        <div className="lg:col-span-1 p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col items-center gap-6 lg:h-fit">
          <div className="flex flex-col items-center gap-4">
            <div className="h-28 w-28 rounded-full overflow-hidden bg-brand/10 border-2 border-brand/20 flex items-center justify-center text-brand font-black text-4xl shadow-inner select-none relative">
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userImage}
                  alt={name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : name ? (
                name.charAt(0).toUpperCase()
              ) : (
                "U"
              )}
            </div>
            <div className="text-center">
              <h3 className="font-bold text-foreground text-lg">
                {name || "User"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {user.role === "admin" ? "Administrator" : "Team Member"}
              </p>
              {user.department && (
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-secondary text-[10px] font-bold text-muted-foreground">
                  {user.department}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Cards list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Details Form */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <UserIcon className="h-3.5 w-3.5 opacity-75" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all outline-none"
                  />
                </div>

                {/* Department */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 opacity-75" /> Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Engineering, Design..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 opacity-75" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updateUserMutation.isPending || !isFormChanged}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand text-black font-bold text-sm shadow-md shadow-brand/10 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {updateUserMutation.isPending ? (
                    <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="h-4.5 w-4.5 stroke-3" />
                  )}
                  Save Profile Details
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Appearance & Theme */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-3">
              <Palette className="h-5 w-5 text-purple-500" />
              <h3 className="font-bold text-foreground text-base">
                Appearance & Layout
              </h3>
            </div>

            <div className="flex flex-col gap-5 divide-y divide-border/30">
              <div className="pt-0">
                <ToggleSetting
                  label="Dark Mode"
                  description="Toggle default theme light / dark"
                  enabled={theme === "dark"}
                  onToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
                />
              </div>
              <div className="pt-5">
                <ToggleSetting
                  label="Compact Layout"
                  description="Decrease padding to pack more contents in columns"
                  enabled={isCompact}
                  onToggle={handleToggleCompact}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Security & Password */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-3">
              <Shield className="h-5 w-5 text-red-500" />
              <h3 className="font-bold text-foreground text-base">
                Security & Protection
              </h3>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">
                    Password Update
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Keep your login credentials secure
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border hover:bg-secondary text-sm font-bold rounded-xl transition-all cursor-pointer shrink-0 text-foreground"
                >
                  <Lock className="h-3.5 w-3.5" /> Change Password
                </button>
              </div>

              <div className="h-px bg-border/30" />

              <ToggleSetting
                label="Two-Factor Authentication"
                description="Add an extra verification safety check to your session logins"
                enabled={security.twoFactor}
                onToggle={() => handleToggleSecurity("twoFactor")}
              />
            </div>
          </div>

          {/* Card 4: Notifications Preferences */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-3">
              <Bell className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-foreground text-base">
                Notifications Preferences
              </h3>
            </div>

            <div className="flex flex-col gap-5 divide-y divide-border/30">
              <div className="pt-0">
                <ToggleSetting
                  label="Email Notifications"
                  description="Receive summaries and comment flags via emails"
                  enabled={notifications.email}
                  onToggle={() => handleToggleNotification("email")}
                />
              </div>
              <div className="pt-5">
                <ToggleSetting
                  label="Task Reminders"
                  description="Receive notifications near task deadlines"
                  enabled={notifications.reminders}
                  onToggle={() => handleToggleNotification("reminders")}
                />
              </div>
              <div className="pt-5">
                <ToggleSetting
                  label="Weekly Summary Reports"
                  description="Receive weekly dashboard productivity stats updates"
                  enabled={notifications.summary}
                  onToggle={() => handleToggleNotification("summary")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordDialog
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}
