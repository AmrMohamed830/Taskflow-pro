import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../api/tasks";
import type { GetTasksParams } from "../../types/tasks";
import { useAuth } from "@/lib/store/auth";

export const useTasks = (params?: GetTasksParams) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["tasks", user?.id, params],
    queryFn: () => getTasks(params),
    enabled: !!user?.id,
  });
};
