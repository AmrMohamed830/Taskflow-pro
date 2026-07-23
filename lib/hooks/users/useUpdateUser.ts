import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../../api/users";
import type { UpdateUserData, UsersResponse } from "../../types/users";
import { toast } from "sonner";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      updateUser(id, data),

    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData<UsersResponse>(["users"]);

      // Optimistically update to the new value
      if (previousUsers) {
        queryClient.setQueryData<UsersResponse>(["users"], {
          ...previousUsers,
          data: previousUsers.data.map((user) =>
            (user._id || user.id) === id ? { ...user, ...data } : user,
          ),
        });
      }

      return { previousUsers };
    },

    onError: (error: Error, variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
      toast.error(error.message || "Failed to update user");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
  });
};
