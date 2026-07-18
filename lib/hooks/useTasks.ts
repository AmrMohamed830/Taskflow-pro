import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../api/tasks";
import type { GetTasksParams } from "../types/tasks";

export const useTasks = (params?: GetTasksParams) => {
    return useQuery({
        queryKey: ["tasks", params],
        queryFn: () => getTasks(params),
    });
};