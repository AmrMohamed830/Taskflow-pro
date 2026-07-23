import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markNotificationsAllRead,
  deleteNotification,
} from "../../api/notifications";
import { useAuth } from "@/lib/store/auth";
import type { NotificationsResponse } from "../../types/notifications";

export const useNotifications = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: getNotifications,
    refetchInterval: 15000, // Refetch notifications every 15 seconds to make it dynamic
    enabled: !!user?.id,
  });
};

export const useMarkNotificationsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: markNotificationsAllRead,
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["notifications", user?.id],
      });

      // Snapshot the previous value
      const previousNotifications =
        queryClient.getQueryData<NotificationsResponse>([
          "notifications",
          user?.id,
        ]);

      // Optimistically update to the new value
      if (previousNotifications) {
        queryClient.setQueryData<NotificationsResponse>(
          ["notifications", user?.id],
          {
            ...previousNotifications,
            data: previousNotifications.data.map((n) => ({
              ...n,
              unread: false,
            })),
          },
        );
      }

      // Return context with previous value
      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications", user?.id],
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: deleteNotification,
    onMutate: async (id: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["notifications", user?.id],
      });

      // Snapshot the previous value
      const previousNotifications =
        queryClient.getQueryData<NotificationsResponse>([
          "notifications",
          user?.id,
        ]);

      // Optimistically update to the new value
      if (previousNotifications) {
        queryClient.setQueryData<NotificationsResponse>(
          ["notifications", user?.id],
          {
            ...previousNotifications,
            data: previousNotifications.data.filter((n) => n._id !== id),
          },
        );
      }

      // Return context with previous value
      return { previousNotifications };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications", user?.id],
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });
};
