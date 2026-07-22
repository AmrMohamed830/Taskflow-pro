import { api } from "./client";
import type {
  NotificationsResponse,
  MarkAllReadResponse,
  DeleteNotificationResponse,
} from "../types/notifications";

export const getNotifications = async (): Promise<NotificationsResponse> => {
  return api.get<NotificationsResponse>("/notifications");
};

export const markNotificationsAllRead = async (): Promise<MarkAllReadResponse> => {
  return api.patch<MarkAllReadResponse>("/notifications/read-all");
};

export const deleteNotification = async (
  id: string,
): Promise<DeleteNotificationResponse> => {
  return api.delete<DeleteNotificationResponse>(`/notifications/${id}`);
};
