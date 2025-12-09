import { vi, beforeEach, test, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import * as api from "../services/api";

vi.mock("../services/api");

beforeEach(() => {
  vi.clearAllMocks();
});

test("renders app with form elements", async () => {
  vi.mocked(api.getTasks).mockResolvedValue([]);
  render(<App />);
  expect(screen.getByText("Add a Task")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
});

test("fetches and displays tasks on mount", async () => {
  vi.mocked(api.getTasks).mockResolvedValue([
    { id: 1, title: "Task 1", description: "Desc 1", completed: false },
    { id: 2, title: "Task 2", description: "Desc 2", completed: false },
  ]);
  render(<App />);
  expect(await screen.findByText("Task 1")).toBeInTheDocument();
  expect(await screen.findByText("Task 2")).toBeInTheDocument();
});

test("shows empty state when no tasks", async () => {
  vi.mocked(api.getTasks).mockResolvedValue([]);
  render(<App />);
  expect(
    await screen.findByText("All tasks are completed. Add a new one!")
  ).toBeInTheDocument();
});

test("shows error when API fetch fails", async () => {
  vi.mocked(api.getTasks).mockRejectedValue(new Error("Network error"));
  render(<App />);
  expect(
    await screen.findByText(/Failed to load tasks from server/)
  ).toBeInTheDocument();
});

test("creates task with title and description", async () => {
  vi.mocked(api.getTasks).mockResolvedValue([]);
  vi.mocked(api.createTask).mockResolvedValue({
    id: 1,
    title: "New Task",
    description: "New Desc",
    completed: false,
  });
  render(<App />);
  await waitFor(() => expect(api.getTasks).toHaveBeenCalled());
  fireEvent.change(screen.getByPlaceholderText("Title"), {
    target: { value: "New Task" },
  });
  fireEvent.change(screen.getByPlaceholderText("Description"), {
    target: { value: "New Desc" },
  });
  fireEvent.click(screen.getByRole("button", { name: /add/i }));
  await waitFor(() =>
    expect(api.createTask).toHaveBeenCalledWith({
      title: "New Task",
      description: "New Desc",
      completed: false,
    })
  );
  expect(await screen.findByText("New Task")).toBeInTheDocument();
});

test("uses default description when empty", async () => {
  vi.mocked(api.getTasks).mockResolvedValue([]);
  vi.mocked(api.createTask).mockResolvedValue({
    id: 1,
    title: "Title",
    description: "No description provided",
    completed: false,
  });
  render(<App />);
  await waitFor(() => expect(api.getTasks).toHaveBeenCalled());
  fireEvent.change(screen.getByPlaceholderText("Title"), {
    target: { value: "Title" },
  });
  fireEvent.click(screen.getByRole("button", { name: /add/i }));
  await waitFor(() =>
    expect(api.createTask).toHaveBeenCalledWith({
      title: "Title",
      description: "No description provided",
      completed: false,
    })
  );
});

test("trims whitespace from inputs", async () => {
  vi.mocked(api.getTasks).mockResolvedValue([]);
  vi.mocked(api.createTask).mockResolvedValue({
    id: 1,
    title: "Trim",
    description: "Trim Desc",
    completed: false,
  });
  render(<App />);
  await waitFor(() => expect(api.getTasks).toHaveBeenCalled());
  fireEvent.change(screen.getByPlaceholderText("Title"), {
    target: { value: "  Trim  " },
  });
  fireEvent.change(screen.getByPlaceholderText("Description"), {
    target: { value: "  Trim Desc  " },
  });
  fireEvent.click(screen.getByRole("button", { name: /add/i }));
  await waitFor(() =>
    expect(api.createTask).toHaveBeenCalledWith({
      title: "Trim",
      description: "Trim Desc",
      completed: false,
    })
  );
});

test("clears form after task creation", async () => {
  vi.mocked(api.getTasks).mockResolvedValue([]);
  vi.mocked(api.createTask).mockResolvedValue({
    id: 1,
    title: "Test",
    description: "Desc",
    completed: false,
  });
  render(<App />);
  await waitFor(() => expect(api.getTasks).toHaveBeenCalled());
  const titleInput = screen.getByPlaceholderText("Title") as HTMLInputElement;
  const descInput = screen.getByPlaceholderText(
    "Description"
  ) as HTMLTextAreaElement;
  fireEvent.change(titleInput, { target: { value: "Test" } });
  fireEvent.change(descInput, { target: { value: "Desc" } });
  fireEvent.click(screen.getByRole("button", { name: /add/i }));
  await waitFor(() => expect(titleInput.value).toBe(""));
  expect(descInput.value).toBe("");
});

test("shows loading state during creation", async () => {
  vi.mocked(api.getTasks).mockResolvedValue([]);
  vi.mocked(api.createTask).mockImplementation(
    () =>
      new Promise((res) =>
        setTimeout(
          () => res({ id: 1, title: "T", description: "D", completed: false }),
          100
        )
      )
  );
  render(<App />);
  await waitFor(() => expect(api.getTasks).toHaveBeenCalled());
  fireEvent.change(screen.getByPlaceholderText("Title"), {
    target: { value: "T" },
  });
  fireEvent.click(screen.getByRole("button", { name: /add/i }));
  expect(await screen.findByText("Adding...")).toBeInTheDocument();
});

test("handles creation failure with fallback", async () => {
  vi.mocked(api.getTasks).mockResolvedValue([]);
  vi.mocked(api.createTask).mockRejectedValue(new Error("Server error"));
  render(<App />);
  await waitFor(() => expect(api.getTasks).toHaveBeenCalled());
  fireEvent.change(screen.getByPlaceholderText("Title"), {
    target: { value: "Failed" },
  });
  fireEvent.click(screen.getByRole("button", { name: /add/i }));
  await waitFor(() =>
    expect(screen.getByText(/Failed to create task/)).toBeInTheDocument()
  );
  expect(await screen.findByText("Failed")).toBeInTheDocument();
});

test("marks task completed and removes from list", async () => {
  vi.mocked(api.getTasks).mockResolvedValue([
    { id: 1, title: "Task 1", description: "Desc", completed: false },
  ]);
  vi.mocked(api.completeTask).mockResolvedValue({
    id: 1,
    title: "Task 1",
    description: "Desc",
    completed: true,
  });
  render(<App />);
  await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());
  fireEvent.click(screen.getByText("Done"));
  await waitFor(() => expect(api.completeTask).toHaveBeenCalledWith(1));
  await waitFor(() =>
    expect(screen.queryByText("Task 1")).not.toBeInTheDocument()
  );
});

test("handles completion failure gracefully", async () => {
  vi.mocked(api.getTasks).mockResolvedValue([
    { id: 1, title: "Task 1", description: "Desc", completed: false },
  ]);
  vi.mocked(api.completeTask).mockRejectedValue(new Error("Network error"));
  render(<App />);
  await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());
  fireEvent.click(screen.getByText("Done"));
  await waitFor(() =>
    expect(screen.getByText(/Failed to complete task/)).toBeInTheDocument()
  );
});

test("displays only 5 incomplete tasks", async () => {
  vi.mocked(api.getTasks).mockResolvedValue([
    { id: 1, title: "Task 1", description: "D", completed: false },
    { id: 2, title: "Task 2", description: "D", completed: false },
    { id: 3, title: "Task 3", description: "D", completed: false },
    { id: 4, title: "Task 4", description: "D", completed: false },
    { id: 5, title: "Task 5", description: "D", completed: false },
    { id: 6, title: "Task 6", description: "D", completed: false },
  ]);
  render(<App />);
  await waitFor(() => expect(api.getTasks).toHaveBeenCalled());
  expect(screen.getByText("Task 1")).toBeInTheDocument();
  expect(screen.getByText("Task 5")).toBeInTheDocument();
  expect(screen.queryByText("Task 6")).not.toBeInTheDocument();
});

test("filters out completed tasks", async () => {
  vi.mocked(api.getTasks).mockResolvedValue([
    { id: 1, title: "Task 1", description: "D", completed: false },
    { id: 2, title: "Task 2", description: "D", completed: true },
    { id: 3, title: "Task 3", description: "D", completed: false },
  ]);
  render(<App />);
  await waitFor(() => expect(api.getTasks).toHaveBeenCalled());
  expect(screen.getByText("Task 1")).toBeInTheDocument();
  expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  expect(screen.getByText("Task 3")).toBeInTheDocument();
});

test("title field is required", async () => {
  vi.mocked(api.getTasks).mockResolvedValue([]);
  render(<App />);
  const titleInput = screen.getByPlaceholderText("Title") as HTMLInputElement;
  expect(titleInput.required).toBe(true);
});

test("does not submit with empty title", async () => {
  vi.mocked(api.getTasks).mockResolvedValue([]);
  render(<App />);
  await waitFor(() => expect(api.getTasks).toHaveBeenCalled());
  fireEvent.click(screen.getByRole("button", { name: /add/i }));
  expect(api.createTask).not.toHaveBeenCalled();
});

test("disables button during loading", async () => {
  vi.mocked(api.getTasks).mockResolvedValue([]);
  vi.mocked(api.createTask).mockImplementation(
    () =>
      new Promise((res) =>
        setTimeout(
          () => res({ id: 1, title: "T", description: "D", completed: false }),
          100
        )
      )
  );
  render(<App />);
  await waitFor(() => expect(api.getTasks).toHaveBeenCalled());
  const btn = screen.getByRole("button", { name: /add/i }) as HTMLButtonElement;
  fireEvent.change(screen.getByPlaceholderText("Title"), {
    target: { value: "T" },
  });
  fireEvent.click(btn);
  await waitFor(() => expect(btn.disabled).toBe(true));
  await waitFor(() => expect(btn.disabled).toBe(false));
});

test("clears error after successful operation", async () => {
  vi.mocked(api.getTasks).mockRejectedValueOnce(new Error("Error"));
  vi.mocked(api.createTask).mockResolvedValue({
    id: 1,
    title: "Test",
    description: "D",
    completed: false,
  });
  render(<App />);
  await waitFor(() =>
    expect(screen.getByText(/Failed to load tasks/)).toBeInTheDocument()
  );
  fireEvent.change(screen.getByPlaceholderText("Title"), {
    target: { value: "Test" },
  });
  fireEvent.click(screen.getByRole("button", { name: /add/i }));
  await waitFor(() =>
    expect(screen.queryByText(/Failed to load tasks/)).not.toBeInTheDocument()
  );
});
