"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Users as UsersIcon,
  UserPlus,
  ShieldCheck,
  UserCircle,
  Mail,
  MoreHorizontal,
  ListTodo,
  Edit2,
  Trash2,
  ShieldAlert,
  Loader2,
  ChevronDown,
  Check,
  X,
  Eye,
  EyeOff,
  Search,
} from "lucide-react";
import { useUsers } from "@/lib/hooks/users/useUsers";
import type { User } from "@/lib/types/users";
import { useDeleteUser } from "@/lib/hooks/users/useDeleteUser";
import { useCreateUser } from "@/lib/hooks/users/useCreateUser";
import { useUpdateUser } from "@/lib/hooks/users/useUpdateUser";
import { useFilterStore } from "@/lib/store/filters";
import { useDebounce } from "@/lib/hooks/common/useDebounce";
import { Pagination } from "@/components/ui/pagination";
import { useAuth } from "@/lib/store/auth";
import { useRouter } from "next/navigation";

// --- Main Component ---

export const Users = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Edit User Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "user">("user");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Search & Filter State
  const { search, setSearch, clearSearch } = useFilterStore();
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [page, setPage] = useState(1);
  const limit = 30;
  const [displayLimit, setDisplayLimit] = useState(10);

  useEffect(() => {
    clearSearch();
  }, [clearSearch]);

  useEffect(() => {
    setTimeout(() => {
      setPage(1);
    }, 0);
  }, [search, roleFilter]);

  // Add User Form State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newUserRole, setNewUserRole] = useState<"admin" | "user">("user");
  const [isAddUserRoleOpen, setIsAddUserRoleOpen] = useState(false);

  // Hooks
  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading, error } = useUsers({
    page: 1,
    limit,
    search: debouncedSearch || undefined,
    role: roleFilter,
  });
  const allUsers: User[] = useMemo(() => data?.data ?? [], [data]);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  // Filtered Users (Paginated Slice)
  const filteredUsers = useMemo(() => {
    const startIndex = (page - 1) * displayLimit;
    return allUsers.slice(startIndex, startIndex + displayLimit);
  }, [allUsers, page, displayLimit]);

  const totalPages = useMemo(() => {
    return Math.ceil(allUsers.length / displayLimit);
  }, [allUsers, displayLimit]);

  const stats = [
    {
      title: "Total Users",
      value: allUsers.length,
      icon: <UsersIcon className="h-5 w-5" />,
      color: "text-brand",
      bg: "bg-brand/10 border-brand/20",
    },
    {
      title: "Admins",
      value: allUsers.filter((u: User) => u.role === "admin").length,
      icon: <ShieldCheck className="h-5 w-5" />,
      color: "text-orange-500",
      bg: "bg-orange-500/10 border-orange-500/20",
    },
    {
      title: "Team Members",
      value: allUsers.filter((u: User) => u.role === "user").length,
      icon: <UserCircle className="h-5 w-5" />,
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-sm font-semibold">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-red-500 p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
          <ShieldAlert className="h-8 w-8" />
          <p className="text-sm font-bold">Failed to load users</p>
        </div>
      </div>
    );
  }

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setName(user.name || "");
    setEmail(user.email || "");
    setSelectedRole(user.role || "user");
    setOpenDropdownId(null);
  };

  const handleUpdateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const id = editingUser._id || editingUser.id || "";
    updateUser(
      {
        id,
        data: {
          name: name.trim(),
          email: email.trim(),
          role: selectedRole,
        },
      },
      {
        onSuccess: () => {
          setEditingUser(null);
        },
      },
    );
  };

  const handleDeleteUser = (id: string) => {
    deleteUser(id, {
      onSuccess: () => {
        setDeletingUser(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage workspace members, update full profile info, and assign
            permissions.
          </p>
        </div>
        <button
          onClick={() => setIsAddUserOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand text-black font-bold rounded-xl hover:opacity-90 transition-all w-full sm:w-auto shadow-lg shadow-brand/10 cursor-pointer"
        >
          <UserPlus className="h-5 w-5" />
          Add User
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm flex flex-col gap-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">
                {stat.title}
              </span>
              <div
                className={`p-2.5 rounded-xl border ${stat.bg} ${stat.color}`}
              >
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-black text-foreground">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Users Section */}
      <div className="flex flex-col gap-6 p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden shadow-xs">
        {/* Controls: Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              All Workspace Users
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Showing {filteredUsers.length} of {allUsers.length} registered
              members
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-secondary/20 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50 placeholder:text-muted-foreground/60 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Role Filter Buttons */}
            <div className="flex items-center p-1 rounded-xl bg-secondary/30 border border-border/60 w-full sm:w-auto">
              {(["all", "admin", "user"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    roleFilter === r
                      ? "bg-brand text-black shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r === "all" ? "All" : r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-2">User</th>
                <th className="py-4 px-2">Email</th>
                <th className="py-4 px-2">Role</th>
                <th className="py-4 px-2">Assigned Tasks</th>
                <th className="py-4 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: User) => {
                  const userId = user._id || user.id || "";
                  return (
                    <tr
                      key={userId}
                      className="group border-b border-border/30 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold text-xs shrink-0">
                            {user.name ? user.name[0].toUpperCase() : "U"}
                          </div>
                          <span className="font-bold text-sm text-foreground">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4 opacity-40 shrink-0" />
                          <span className="text-sm font-medium">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider
                          ${
                            user.role === "admin"
                              ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                              : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <ShieldCheck className="h-3 w-3" />
                          ) : (
                            <UserCircle className="h-3 w-3" />
                          )}
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <ListTodo className="h-4 w-4 opacity-40 shrink-0" />
                          <span className="text-sm font-semibold">
                            {user.tasksCount ?? 0} tasks
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right relative">
                        <button
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === userId ? null : userId,
                            )
                          }
                          className={`p-2 rounded-lg transition-all cursor-pointer ${
                            openDropdownId === userId
                              ? "bg-brand text-black"
                              : "text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>

                        {openDropdownId === userId && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenDropdownId(null)}
                            />
                            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-popover shadow-2xl z-20 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                              <button
                                onClick={() => handleOpenEditModal(user)}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                              >
                                <Edit2 className="h-4 w-4 text-muted-foreground" />
                                Edit Full User
                              </button>
                              <div className="h-px bg-border my-1" />
                              <button
                                onClick={() => {
                                  setDeletingUser(user);
                                  setOpenDropdownId(null);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete User
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <UsersIcon className="h-8 w-8 opacity-30" />
                      <p className="font-semibold text-sm">
                        No matching users found
                      </p>
                      <p className="text-xs">
                        Try adjusting your search query or role filter.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {allUsers.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={allUsers.length}
            pageSize={displayLimit}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setPage(1);
              setDisplayLimit(newSize);
            }}
            pageSizeOptions={[5, 10, 20, 30]}
            itemType="members"
          />
        )}
      </div>

      {/* Edit User Modal (Full User Update: Name, Email, Role) */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isUpdating && setEditingUser(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Edit User Profile
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Update full information for{" "}
                  <span className="font-semibold text-foreground">
                    {editingUser.name}
                  </span>
                </p>
              </div>
              <button
                disabled={isUpdating}
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground disabled:opacity-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleUpdateUserSubmit}
              className="flex flex-col gap-5"
            >
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  disabled={isUpdating}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="User Name"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all disabled:opacity-50"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  disabled={isUpdating}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all disabled:opacity-50"
                />
              </div>

              {/* Role Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Role & Permissions
                </label>
                <div className="relative">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/30 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2.5">
                      {selectedRole === "admin" ? (
                        <ShieldCheck className="h-4 w-4 text-orange-500" />
                      ) : (
                        <UserCircle className="h-4 w-4 text-blue-500" />
                      )}
                      <span className="capitalize font-bold text-sm">
                        {selectedRole === "admin" ? "Admin" : "User"}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                        isRoleDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isRoleDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsRoleDropdownOpen(false)}
                      />
                      <div className="absolute left-0 right-0 z-20 mt-1.5 rounded-xl border border-border bg-card shadow-2xl py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRole("admin");
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary/50 text-left ${
                            selectedRole === "admin"
                              ? "bg-brand/10 text-brand"
                              : "text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                              <ShieldCheck className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-xs">Admin</span>
                              <span className="text-[10px] text-muted-foreground font-normal">
                                Full workspace management
                              </span>
                            </div>
                          </div>
                          {selectedRole === "admin" && (
                            <Check className="h-4 w-4 text-brand" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRole("user");
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary/50 text-left ${
                            selectedRole === "user"
                              ? "bg-brand/10 text-brand"
                              : "text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                              <UserCircle className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-xs">User</span>
                              <span className="text-[10px] text-muted-foreground font-normal">
                                Standard member access
                              </span>
                            </div>
                          </div>
                          {selectedRole === "user" && (
                            <Check className="h-4 w-4 text-brand" />
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border/50">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => setEditingUser(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-foreground bg-secondary/40 border border-border/50 hover:bg-secondary/60 transition-all disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || !name.trim() || !email.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-brand text-black shadow-lg shadow-brand/20 hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isUpdating ? "Saving Changes..." : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeletingUser(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 z-10">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Delete User
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Are you sure you want to delete{" "}
              <span className="font-bold text-foreground">
                {deletingUser.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setDeletingUser(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-foreground border border-border bg-secondary/40 hover:bg-secondary/60 transition-all disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={() =>
                  handleDeleteUser(deletingUser._id || deletingUser.id || "")
                }
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => !isCreating && setIsAddUserOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Add New User
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Add a new team member to your workspace.
                </p>
              </div>
              <button
                disabled={isCreating}
                onClick={() => setIsAddUserOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all cursor-pointer disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();

                createUser(
                  {
                    name: newUserName,
                    email: newUserEmail,
                    password: newUserPassword,
                    role: newUserRole,
                  },
                  {
                    onSuccess: () => {
                      setNewUserName("");
                      setNewUserEmail("");
                      setNewUserPassword("");
                      setNewUserRole("user");
                      setIsAddUserOpen(false);
                    },
                  },
                );
              }}
              className="flex flex-col gap-5"
            >
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Name
                </label>
                <input
                  type="text"
                  required
                  disabled={isCreating}
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all placeholder:text-muted-foreground/50 disabled:opacity-50"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  required
                  disabled={isCreating}
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all placeholder:text-muted-foreground/50 disabled:opacity-50"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    disabled={isCreating}
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all placeholder:text-muted-foreground/50 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    disabled={isCreating}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Role
                </label>
                <div className="relative">
                  <button
                    type="button"
                    disabled={isCreating}
                    onClick={() => setIsAddUserRoleOpen(!isAddUserRoleOpen)}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-brand ring-1 ring-brand/50 bg-secondary/20 hover:bg-secondary/30 text-foreground font-semibold focus:outline-none transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span className="capitalize text-sm font-bold">
                      {newUserRole === "admin" ? "Admin" : "User"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                        isAddUserRoleOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isAddUserRoleOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsAddUserRoleOpen(false)}
                      />
                      <div className="absolute left-0 right-0 z-20 mt-1.5 rounded-xl border border-border bg-card shadow-2xl py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <button
                          type="button"
                          onClick={() => {
                            setNewUserRole("user");
                            setIsAddUserRoleOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary/50 text-left ${
                            newUserRole === "user"
                              ? "bg-brand/10 text-brand"
                              : "text-foreground"
                          }`}
                        >
                          <span>User</span>
                          {newUserRole === "user" && (
                            <Check className="h-4 w-4 text-brand" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewUserRole("admin");
                            setIsAddUserRoleOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary/50 text-left ${
                            newUserRole === "admin"
                              ? "bg-brand/10 text-brand"
                              : "text-foreground"
                          }`}
                        >
                          <span>Admin</span>
                          {newUserRole === "admin" && (
                            <Check className="h-4 w-4 text-brand" />
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border/50">
                <button
                  type="button"
                  disabled={isCreating}
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-foreground bg-secondary/40 border border-border/50 hover:bg-secondary/60 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isCreating ||
                    !newUserName.trim() ||
                    !newUserEmail.trim() ||
                    !newUserPassword.trim()
                  }
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand text-black shadow-lg shadow-brand/10 hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isCreating ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
