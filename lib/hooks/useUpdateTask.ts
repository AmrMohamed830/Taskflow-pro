import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../api/tasks";
import { toast } from "sonner";
import type { UpdateTaskData } from "../types/tasks";

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
      updateTask(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      toast.success("Task updated successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update task");
    },
  });
};
