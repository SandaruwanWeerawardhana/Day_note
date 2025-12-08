import { useState } from 'react'
import type { FormEvent } from 'react'
import { TaskCard } from './components/TaskCard'

export type Task = {
  id: number
  title: string
  description: string
  completed: boolean
}

const seedTasks: Task[] = [
  {
    id: 1,
    title: 'Buy books',
    description: 'Buy books for the next school year',
    completed: false,
  },
  {
    id: 2,
    title: 'Clean home',
    description: 'Need to clean the bed room',
    completed: false,
  },
  {
    id: 3,
    title: 'Takehome assignment',
    description: 'Finish the mid-term assignment',
    completed: false,
  },
  {
    id: 4,
    title: 'Play Cricket',
    description: 'Plan the soft ball cricket match on next Sunday',
    completed: false,
  },
  {
    id: 5,
    title: 'Help Saman',
    description: 'Saman need help with his software project',
    completed: false,
  },
]

function App() {
  const [tasks, setTasks] = useState<Task[]>(seedTasks)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    if (!trimmedTitle) return

    const newTask: Task = {
      id: Date.now(),
      title: trimmedTitle,
      description: trimmedDescription || 'No description provided',
      completed: false,
    }

    setTasks((prev) => [newTask, ...prev])
    setTitle('')
    setDescription('')
  }

  const handleComplete = (id: number) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: true } : task)))
  }

  const visibleTasks = tasks.filter((task) => !task.completed).slice(0, 5)

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center px-5 py-8">
      <div className="w-[1100px] max-w-[95vw] bg-white rounded-2xl shadow-2xl shadow-black/10 flex flex-col md:flex-row gap-8 p-8 md:p-9">
        <form className="flex-1 max-w-md flex flex-col gap-4" onSubmit={handleAdd}>
          <div className="text-lg font-bold text-slate-900">Add a Task</div>
          <label className="flex flex-col gap-2 text-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wide">Title</span>
            <input
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-inner shadow-black/5 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Title"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wide">Description</span>
            <textarea
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-inner shadow-black/5 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Description"
              rows={3}
            />
          </label>
          <button
            className="inline-flex items-center justify-center self-start rounded-md bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-blue-500/35 active:translate-y-0"
            type="submit"
          >
            Add
          </button>
        </form>

        <div className="hidden md:block w-px bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200" aria-hidden />
        <div className="md:hidden h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" aria-hidden />

        <div className="flex-1.5 flex flex-col gap-4" aria-live="polite">
          {visibleTasks.length === 0 ? (
            <p className="m-0 rounded-lg border border-dashed border-slate-300 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
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
  )
}

export default App
