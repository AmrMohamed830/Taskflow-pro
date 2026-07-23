import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../../api/tasks";
import { toast } from "sonner";
import type {
  UpdateTaskData,
  Task as APITask,
  TasksResponse,
} from "../../types/tasks";
import type { UsersResponse, User as APIUser } from "../../types/users";

type TasksCacheData = TasksResponse | APITask[];

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
      updateTask(id, data),

    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot the previous tasks data
      const previousTasksData = queryClient.getQueriesData<TasksCacheData>({
        queryKey: ["tasks"],
      });

      // Optimistically update the query caches
      queryClient.setQueriesData<TasksCacheData>(
        { queryKey: ["tasks"] },
        (oldData: TasksCacheData | undefined) => {
          if (!oldData) return oldData;

          const updateTaskObj = (task: APITask): APITask => {
            if (task._id !== id) return task;

            const updated = { ...task, ...data };

            if (data.assignedTo !== undefined) {
              if (data.assignedTo === "") {
                updated.assignedTo = null as unknown as APITask["assignedTo"];
              } else {
                const usersResponse = queryClient.getQueryData<UsersResponse>([
                  "users",
                ]);
                const usersList = usersResponse?.data || [];
                const newAssignee = usersList.find(
                  (u: APIUser) => (u._id || u.id) === data.assignedTo,
                );

                updated.assignedTo = newAssignee
                  ? {
                      _id: newAssignee._id || newAssignee.id || "",
                      name: newAssignee.name,
                      email: newAssignee.email,
                    }
                  : (null as unknown as APITask["assignedTo"]);
              }
            }

            return updated as APITask;
          };

          if (
            !Array.isArray(oldData) &&
            "tasks" in oldData &&
            Array.isArray(oldData.tasks)
          ) {
            return {
              ...oldData,
              tasks: oldData.tasks.map(updateTaskObj),
            } as TasksResponse;
          }
          if (Array.isArray(oldData)) {
            return oldData.map(updateTaskObj);
          }
          return oldData;
        },
      );

      return { previousTasksData };
    },

    onError: (error: Error, variables, context) => {
      if (context?.previousTasksData) {
        context.previousTasksData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(error.message || "Failed to update task");
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", variables.id] });
      toast.success("Task updated successfully");
    },
  });
};
