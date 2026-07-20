import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "@/lib/api/tasks";

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskById(id),
    enabled: !!id,
  });
};
