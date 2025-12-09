import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { TaskCard } from "./components/TaskCard";
import * as api from "./services/api";

export type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

const seedTasks: Task[] = [
  {
    id: 1,
    title: "Buy books",
    description: "Buy books for the next school year",
    completed: false,
  },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const fetchedTasks = await api.getTasks();
        if (fetchedTasks != null && fetchedTasks.length > 0) {
          setTasks(fetchedTasks);
        }else {
          setTasks(seedTasks);
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch tasks, using seed data:", err);
        setError("Failed to load tasks from server. Using local data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) return;

    try {
      setLoading(true);
      const newTask = await api.createTask({
        title: trimmedTitle,
        description: trimmedDescription || "No description provided",
        completed: false,
      });

      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
      setDescription("");
      setError(null);
    } catch (err) {
      console.error("Failed to create task:", err);
      setError("Failed to create task. Please try again.");

      const newTask: Task = {
        id: Date.now(),
        title: trimmedTitle,
        description: trimmedDescription || "No description provided",
        completed: false,
      };
      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
      setDescription("");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id: number) => {
    try {
      setLoading(true);
      await api.completeTask(id);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: true } : task
        )
      );
      setError(null);
    } catch (err) {
      console.error("Failed to complete task:", err);
      setError("Failed to complete task. Please try again.");

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: true } : task
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const visibleTasks = tasks.filter((task) => !task.completed).slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-2 py-2">
      <div className="w-[1100px] h-[600px] max-w-[95vw] bg-slate-800/40 backdrop-blur-xl rounded-3xl shadow-2xl shadow-cyan-500/10 border border-cyan-500/20 flex flex-col md:flex-row gap-8 p-8 md:p-9">
        <form
          className="flex-1 max-w-md flex flex-col gap-4"
          onSubmit={handleAdd}
        >
          <div className="text-lg text-center font-bold text-cyan-400 drop-shadow-lg underline">
            Add a Task
          </div>
          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <label className="flex flex-col gap-2 text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wide drop-shadow">
              Title
            </span>
            <input
              className="w-full rounded-lg border border-slate-600 bg-slate-700/50 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/30"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Title"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wide drop-shadow">
              Description
            </span>
            <textarea
              className="w-full rounded-lg border border-slate-600 bg-slate-700/50 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/30"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Description"
              rows={3}
            />
          </label>
          <button
            className="inline-flex items-center justify-center self-start rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:shadow-cyan-500/50 hover:shadow-xl active:translate-y-0 text-center disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>

        <div
          className="hidden md:block w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent"
          aria-hidden
        />
        <div
          className="md:hidden h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
          aria-hidden
        />

        <div
          className="flex-1.5 flex flex-col gap-4 min-h-[400px] max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-slate-700/20"
          aria-live="polite"
        >
          {visibleTasks.length === 0 ? (
            <p className="m-0 rounded-lg border border-dashed border-cyan-500/40 bg-slate-700/30 backdrop-blur-sm px-4 py-3 text-sm font-semibold text-slate-300 drop-shadow">
              All tasks are completed. Add a new one!
            </p>
          ) : (
            visibleTasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={handleComplete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
