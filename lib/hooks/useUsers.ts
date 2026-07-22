import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/users";
import { useAuth } from "@/lib/store/auth";

export const useUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["users", user?.id, params],
    queryFn: () => getUsers(params),
    enabled: !!user?.id,
  });
};
