import type { Task } from '../App'

interface TaskCardProps {
  task: Task
  onComplete: (id: number) => void
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-600 bg-slate-700/60 backdrop-blur-md px-4 py-3 shadow-lg shadow-cyan-500/10 hover:border-cyan-500/50 transition-all">
      <div className="flex-1">
        <div className="text-base font-bold text-white drop-shadow-md">{task.title}</div>
        <div className="text-xs text-slate-400 mt-1">{task.description}</div>
      </div>
      <button
        className="rounded-lg border border-cyan-500/60 bg-cyan-500/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/30 hover:text-white hover:shadow-lg hover:shadow-cyan-500/30 active:translate-y-0.5"
        type="button"
        onClick={() => onComplete(task.id)}
      >
        Done
      </button>
    </div>
  )
}
