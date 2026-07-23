import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addComment } from "../../api/tasks";
import type { AddCommentData } from "../../types/tasks";

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: AddCommentData }) =>
      addComment(taskId, data),

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

      toast.success("Comment added successfully");
    },

    onError: () => {
      toast.error("Failed to add comment");
    },
  });
};
