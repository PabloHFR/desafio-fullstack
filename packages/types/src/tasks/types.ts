export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  createdBy: string;
  assignedTo: string[];
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
  history?: TaskHistory[];
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  deadline?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedTo?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  deadline?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedTo?: string[];
}

export interface TasksResponse {
  items: Task[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface TaskHistory {
  id: string;
  action: HistoryAction;
  userId: string;
  username: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  taskId: string;
  createdAt: string;
}

export enum HistoryAction {
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  STATUS_CHANGED = "STATUS_CHANGED",
  ASSIGNED = "ASSIGNED",
  UNASSIGNED = "UNASSIGNED",
  COMMENTED = "COMMENTED",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

// Enum para Status
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  DONE = "DONE",
}
