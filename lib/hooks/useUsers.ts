import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/users";

export const useUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
};
