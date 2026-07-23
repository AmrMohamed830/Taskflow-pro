import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/lib/api/tasks";
import { toast } from "sonner";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

    queryClient.invalidateQueries({
      queryKey: ["dashboard-stats"],
    });

      toast.success("Task created successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to create task");
    },
  });
};