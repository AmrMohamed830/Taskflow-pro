import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "../api/tasks";
import type { UpdateTaskStatusData } from "../types/tasks";

export const useUpdateTaskStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskStatusData }) =>
            updateTaskStatus(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
};

