export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export type CreateTaskDTO = Omit<Task, "id">;

export const MAX_VISIBLE_TASKS = 5;
export const DEFAULT_DESCRIPTION = "No description provided";
