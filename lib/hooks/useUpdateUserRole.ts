import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "../api/users";

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: "admin" | "user" }) =>
      updateUserRole(id, role),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};
