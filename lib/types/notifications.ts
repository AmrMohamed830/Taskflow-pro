export interface Notification {
  _id: string;
  user: string;
  title: string;
  description: string;
  unread: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
}

export interface MarkAllReadResponse {
  success: boolean;
  message: string;
}

export interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}
