import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../../api/users";
import type { UsersResponse } from "../../types/users";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),

    onMutate: async (id: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData<UsersResponse>(["users"]);

      // Optimistically update to the new value
      if (previousUsers) {
        queryClient.setQueryData<UsersResponse>(["users"], {
          ...previousUsers,
          data: previousUsers.data.filter(
            (user) => (user._id || user.id) !== id,
          ),
        });
      }

      return { previousUsers };
    },

    onError: (error: Error, id, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
      toast.error(error.message || "Failed to delete user");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
  });
};
