import { api } from "./client";
import type { UsersResponse, UpdateUserRoleResponse } from "../types/users";

export const getUsers = async (): Promise<UsersResponse> => {
  return api.get<UsersResponse>("/users");
};

export const updateUserRole = async (
  id: string,
  role: "admin" | "user",
): Promise<UpdateUserRoleResponse> => {
  return api.patch<UpdateUserRoleResponse>(
    `/users/${id}/role`,
    {
      role,
    },
  );
};