import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/lib/api/tasks";
import { toast } from "sonner";

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tasks"],
            });
            toast.success("Task deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete task");
        },
    });
};