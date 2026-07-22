import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api/users";

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};


