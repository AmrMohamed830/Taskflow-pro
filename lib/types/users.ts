export interface User {
  _id: string;
  id?: string;
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
