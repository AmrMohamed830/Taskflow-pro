import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../api/tasks";
import { toast } from "sonner";
import type { UpdateTaskData } from "../types/tasks";

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
      updateTask(id, data),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["task", variables.id],
      });

      toast.success("Task updated successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update task");
    },
  });
};
