"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useUsers } from "@/lib/hooks/useUsers";
import { useUpdateUserRole } from "@/lib/hooks/useUpdateUserRole";
import type { User } from "@/lib/types/users";

// --- Main Component ---

export const Users = () => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<"admin" | "user">("user");
  const { data, isLoading, error } = useUsers();
  const users = data?.data ?? [];
  const { mutate: updateUserRole, isPending } = useUpdateUserRole();
  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: <UsersIcon className="h-5 w-5" />,
      color: "text-brand",
      bg: "bg-brand/10",
    },
    {
      title: "Admins",
      value: users.filter((u) => u.role === "admin").length,
      icon: <ShieldCheck className="h-5 w-5" />,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Team Members",
      value: users.filter((u) => u.role === "user").length,
      icon: <UserCircle className="h-5 w-5" />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong</div>;
  }

  const handleUpdateUser = (id: string, role: "admin" | "user") => {
    updateUserRole(
      {
        id,
        role,
      },
      {
        onSuccess: () => {
          setEditingUser(null);
        },
      },
    );
  };

  const handleDeleteUser = () => {
    setDeletingUser(null);
  };

  return (
    <div className="flex flex-col gap-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage team members and their roles
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand text-black font-bold rounded-lg hover:opacity-90 transition-all w-full sm:w-auto shadow-lg shadow-brand/10">
          <UserPlus className="h-5 w-5" />
          Add User
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">
                {stat.title}
              </span>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-black text-foreground">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Users Table Section */}
      <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm overflow-hidden">
        <div>
          <h2 className="text-lg font-bold text-foreground">All Users</h2>
          <p className="text-sm text-muted-foreground">
            A list of all users in your workspace including their name, email,
            and role.
          </p>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-2">User</th>
                <th className="py-4 px-2">Email</th>
                <th className="py-4 px-2">Role</th>
                <th className="py-4 px-2">Tasks</th>
                <th className="py-4 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const userId = user._id || user.id || "";
                return (
                  <tr
                    key={userId}
                    className="group border-b border-border/30 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold text-xs">
                          {user.name ? user.name[0].toUpperCase() : "U"}
                        </div>
                        <span className="font-bold text-sm text-foreground">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4 opacity-40" />
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
                            ? "bg-brand/10 text-brand border border-brand/20"
                            : "bg-secondary/50 text-muted-foreground border border-border/50"
                        }`}
                      >
                        {user.role === "admin" && (
                          <ShieldCheck className="h-3 w-3" />
                        )}
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ListTodo className="h-4 w-4 opacity-40" />
                        <span className="text-sm font-semibold">
                          {user.tasksCount ?? 0} assigned
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
                        className={`p-2 rounded-lg transition-all ${openDropdownId === userId ? "bg-brand text-black" : "text-muted-foreground hover:bg-secondary"}`}
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
                              onClick={() => {
                                setEditingUser(user);
                                setSelectedRole(user.role);
                                setOpenDropdownId(null);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                            >
                              <Edit2 className="h-4 w-4 text-muted-foreground" />
                              Edit
                            </button>
                            <div className="h-px bg-border my-1" />
                            <button
                              onClick={() => {
                                setDeletingUser(user);
                                setOpenDropdownId(null);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditingUser(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Edit User</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Update user information.
                </p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
              >
                <MoreHorizontal className="h-5 w-5 rotate-45" />{" "}
                {/* Using X manually or rotate cross */}
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-muted-foreground">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={editingUser.name}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={editingUser.email}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-muted-foreground">
                  Role
                </label>
                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={(e) =>
                      setSelectedRole(e.target.value as "admin" | "user")
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-brand bg-secondary/20 text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4 rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                onClick={() => setEditingUser(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-foreground hover:bg-secondary transition-all"
              >
                Cancel
              </button>
              <button
                disabled={isPending}
                onClick={() =>
                  handleUpdateUser(
                    editingUser._id || editingUser.id || "",
                    selectedRole,
                  )
                }
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand text-black shadow-lg shadow-brand/20 hover:opacity-90 transition-all"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeletingUser(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
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
                onClick={() => setDeletingUser(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-foreground border border-brand hover:bg-brand/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser()}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
