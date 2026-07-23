import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "../../api/tasks";
import type {
  UpdateTaskStatusData,
  Task,
  TasksResponse,
} from "../../types/tasks";
import { toast } from "sonner";

type TasksCacheData = TasksResponse | Task[];

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskStatusData }) =>
      updateTaskStatus(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasksData = queryClient.getQueriesData<TasksCacheData>({
        queryKey: ["tasks"],
      });

      queryClient.setQueriesData<TasksCacheData>(
        { queryKey: ["tasks"] },
        (oldData: TasksCacheData | undefined) => {
          if (!oldData) return oldData;
          if (
            !Array.isArray(oldData) &&
            "tasks" in oldData &&
            Array.isArray(oldData.tasks)
          ) {
            return {
              ...oldData,
              tasks: oldData.tasks.map((task: Task) =>
                task._id === id ? { ...task, status: data.status } : task,
              ),
            };
          }
          if (Array.isArray(oldData)) {
            return oldData.map((task: Task) =>
              task._id === id ? { ...task, status: data.status } : task,
            );
          }
          return oldData;
        },
      );

      return { previousTasksData };
    },

    onError: (err: Error, _variables, context) => {
      if (context?.previousTasksData) {
        context.previousTasksData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(err.message || "Failed to update task status");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
