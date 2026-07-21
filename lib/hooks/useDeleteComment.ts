import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteComment } from "../api/tasks";

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      commentId,
    }: {
      taskId: string;
      commentId: string;
    }) => deleteComment(taskId, commentId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["task-comments", variables.taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });

      toast.success("Comment deleted successfully");
    },

    onError: () => {
      toast.error("Failed to delete comment");
    },
  });
};