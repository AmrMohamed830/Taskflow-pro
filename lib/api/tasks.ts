import { api } from "./client";

import type {
  TasksResponse,
  TaskResponse,
  GetTasksParams,
  CreateTaskData,
  UpdateTaskData,
  MessageResponse,
  UpdateTaskStatusData,
  CommentsResponse,
  AddCommentData,
  AddCommentResponse,
} from "../types/tasks";

export const getTasks = async (
  params: GetTasksParams = {},
): Promise<TasksResponse> => {
  return api.get<TasksResponse>("/tasks", {
    params,
  });
};

export const getTaskById = async (id: string): Promise<TaskResponse> => {
  return api.get<TaskResponse>(`/tasks/${id}`);
};

export const createTask = async (
  data: CreateTaskData,
): Promise<TaskResponse> => {
  return api.post<TaskResponse>("/tasks", data);
};

export const updateTask = async (
  id: string,
  data: UpdateTaskData,
): Promise<TaskResponse> => {
  return api.put<TaskResponse>(`/tasks/${id}`, data);
};

export const deleteTask = async (id: string): Promise<MessageResponse> => {
  return api.delete<MessageResponse>(`/tasks/${id}`);
};

export const updateTaskStatus = async (
  id: string,
  data: UpdateTaskStatusData,
): Promise<TaskResponse> => {
  return api.patch<TaskResponse>(`/tasks/${id}/status`, data);
};

export const getTaskComments = async (
  taskId: string,
): Promise<CommentsResponse> => {
  return api.get<CommentsResponse>(`/tasks/${taskId}/comments`);
};

export const addComment = async (
  taskId: string,
  data: AddCommentData,
): Promise<AddCommentResponse> => {
  return api.post<AddCommentResponse>(`/tasks/${taskId}/comments`, data);
};
