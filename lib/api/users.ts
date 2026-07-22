import { api } from "./client";
import type {
  UsersResponse,
  UpdateUserRoleResponse,
  DeleteUserResponse,
  CreateUserData,
  CreateUserResponse,
  UpdateUserData,
  UpdateUserResponse,
  GetUserResponse,
} from "../types/users";

export const getUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<UsersResponse> => {
  return api.get<UsersResponse>("/users", { params });
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

export const createUser = async (
  data: CreateUserData,
): Promise<CreateUserResponse> => {
  return api.post<CreateUserResponse>("/users", data);
};

export const updateUser = async (
  id: string,
  data: UpdateUserData,
): Promise<UpdateUserResponse> => {
  return api.put<UpdateUserResponse>(`/users/${id}`, data);
};

export const getUserById = async (id: string): Promise<GetUserResponse> => {
  return api.get<GetUserResponse>(`/users/${id}`);
};
