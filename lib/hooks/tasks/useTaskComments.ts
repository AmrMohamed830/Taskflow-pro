import { useQuery } from "@tanstack/react-query";
import { getTaskComments } from "../../api/tasks";

export const useTaskComments = (taskId: string) => {
  return useQuery({
    queryKey: ["task-comments", taskId],
    queryFn: () => getTaskComments(taskId),
    enabled: !!taskId,
  });
};
