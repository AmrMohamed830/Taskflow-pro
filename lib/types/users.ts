export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar: string;
  department: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
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
