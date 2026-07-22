export interface User {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar?: string;
  department?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  tasksCount?: number;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UpdateUserRoleResponse {
  success: boolean;
  user: User;
  message: string;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

export interface CreateUserResponse {
  success: boolean;
  user: User;
  message: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: "admin" | "user";
  avatar?: string;
  department?: string;
}

export interface UpdateUserResponse {
  success: boolean;
  user: User;
  message: string;
}

export interface GetUserResponse {
  success: boolean;
  user: User;
}