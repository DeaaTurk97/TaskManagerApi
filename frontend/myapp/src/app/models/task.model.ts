export type TaskStatus = 'ToDo' | 'InProgress' | 'Done';

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: TaskStatus; 
  assignedToUserId?: number | null; 
  assignedToUsername: string | null;
}

export interface TaskItemUpdateDto {
  title?: string;
  description?: string;
  status: TaskStatus;
  assignedToUserId?: number | null;
}

export interface TaskItemCreateDto {
  title: string;
  description: string;
  status: TaskStatus;
  assignedToUserId: number | null;
}