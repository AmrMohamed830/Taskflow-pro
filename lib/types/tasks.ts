export type TaskStatus = "todo" | "doing" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface User {
    _id: string;
    name: string;
    email: string;
}

export interface Task {
    _id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;

    assignedTo: User;
    createdBy: User;

    tags: string[];
    comments: [];

    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface TasksResponse {
    success: boolean;
    tasks: Task[];
    pagination: Pagination;
}

export type GetTasksParams = {
    status?: TaskStatus;
    assignedTo?: string;
    tag?: string;
    search?: string;
    page?: number;
    limit?: number;
};

export interface TaskResponse {
    success: boolean;
    task: Task;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    assignedTo?: string;
    tags?: string[];
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    assignedTo?: string;
    tags?: string[];
}

export interface MessageResponse {
    success: boolean;
    message: string;
}

export interface UpdateTaskStatusData {
    status: TaskStatus;
}