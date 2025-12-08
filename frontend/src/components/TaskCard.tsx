import type { Task } from '../App'

interface TaskCardProps {
  task: Task
  onComplete: (id: number) => void
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-300 bg-slate-200 px-4 py-3 shadow-md shadow-black/10">
      <div className="flex-1">
        <div className="text-base font-bold text-slate-900">{task.title}</div>
        <div className="text-xs text-slate-700 mt-1">{task.description}</div>
      </div>
      <button
        className="rounded-md border border-slate-500 bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-white hover:shadow-inner hover:shadow-blue-100 active:translate-y-0.5"
        type="button"
        onClick={() => onComplete(task.id)}
      >
        Done
      </button>
    </div>
  )
}
