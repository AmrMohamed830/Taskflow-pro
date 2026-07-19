import { api } from "./client";
import type { UsersResponse } from "../types/users";

export const getUsers = async (): Promise<UsersResponse> => {
  return api.get<UsersResponse>("/users");
};
