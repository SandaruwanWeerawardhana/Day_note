import { useState, useCallback } from "react";
import type { Task, CreateTaskDTO } from "../types/task";
import { DEFAULT_DESCRIPTION, MAX_VISIBLE_TASKS } from "../types/task";
import * as api from "../services/api";

interface UseTasksReturn {
  tasks: Task[];
  visibleTasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (title: string, description: string) => Promise<void>;
  completeTask: (id: number) => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleTasks = tasks
    .filter((task) => !task.completed)
    .slice(0, MAX_VISIBLE_TASKS);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await api.getTasks();
      if (fetchedTasks?.length > 0) {
        setTasks(fetchedTasks);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to load tasks from server.");
    } finally {
      setLoading(false);
    }
  }, []);

  const createLocalTask = (title: string, description: string): Task => ({
    id: Date.now(),
    title,
    description: description || DEFAULT_DESCRIPTION,
    completed: false,
  });

  const addTask = useCallback(async (title: string, description: string) => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) return;

    const taskData: CreateTaskDTO = {
      title: trimmedTitle,
      description: trimmedDescription || DEFAULT_DESCRIPTION,
      completed: false,
    };

    try {
      setLoading(true);
      setError(null);
      const newTask = await api.createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      console.error("Failed to create task:", err);
      setError("Failed to create task. Using local fallback.");

      const localTask = createLocalTask(trimmedTitle, trimmedDescription);
      setTasks((prev) => [localTask, ...prev]);
    } finally {
      setLoading(false);
    }
  }, []);

  const completeTask = useCallback(async (id: number) => {
    const markComplete = () => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: true } : task
        )
      );
    };

    try {
      setLoading(true);
      setError(null);
      await api.completeTask(id);
      markComplete();
    } catch (err) {
      console.error("Failed to complete task:", err);
      setError("Failed to complete task. Applied locally.");

      markComplete();
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    visibleTasks,
    loading,
    error,
    fetchTasks,
    addTask,
    completeTask,
  };
}
