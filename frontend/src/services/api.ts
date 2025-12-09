import type { Task } from "../App";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function getTasks(): Promise<Task[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

export async function createTask(task: Omit<Task, "id">): Promise<Task> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error("Failed to create task");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

export async function updateTask(
  id: number,
  updates: Partial<Task>
): Promise<Task> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error("Failed to update task");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

export async function completeTask(id: number): Promise<Task> {
  return updateTask(id, { completed: true });
}
