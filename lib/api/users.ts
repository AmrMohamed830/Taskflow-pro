import { api } from "./client";
import type {
  UsersResponse,
  UpdateUserRoleResponse,
  DeleteUserResponse,
  CreateUserData,
  CreateUserResponse,
} from "../types/users";

export const getUsers = async (): Promise<UsersResponse> => {
  return api.get<UsersResponse>("/users");
};

export const updateUserRole = async (
  id: string,
  role: "admin" | "user",
): Promise<UpdateUserRoleResponse> => {
  return api.patch<UpdateUserRoleResponse>(`/users/${id}/role`, {
    role,
  });
};

export const deleteUser = async (id: string): Promise<DeleteUserResponse> => {
  return api.delete<DeleteUserResponse>(`/users/${id}`);
};

export const createUser = async (data: CreateUserData): Promise<CreateUserResponse> => {
  return api.post<CreateUserResponse>("/users", data);
};

