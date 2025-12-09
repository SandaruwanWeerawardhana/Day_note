import type { Task } from '../App'

interface TaskCardProps {
  task: Task
  onComplete: (id: number) => void
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-600 bg-slate-700/60 backdrop-blur-md px-4 py-2 shadow-lg shadow-cyan-500/10 hover:border-cyan-500/50 transition-all min-h-[96px] h-[96px] w-[560px] shrink-0">
      <div className="flex-1 overflow-hidden">
        <div className="text-base font-bold text-white drop-shadow-md truncate">{task.title}</div>
        <div className="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</div>
      </div>
      <button
        className="whitespace-nowrap rounded-lg border border-cyan-500/60 bg-cyan-500/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/30 hover:text-white hover:shadow-lg hover:shadow-cyan-500/30 active:translate-y-0.5"
        type="button"
        onClick={() => onComplete(task.id)}
      >
        Done
      </button>
    </div>
  )
}
