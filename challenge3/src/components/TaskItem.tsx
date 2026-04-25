import { Task } from '../context/TaskContext';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onViewDetail: (task: Task) => void;
}

function TaskItem({ task, onToggleComplete, onDelete, onViewDetail }: TaskItemProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">

      {/* Lime checkbox */}
      <button
        onClick={() => onToggleComplete(task.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all active:scale-90 ${
          task.completed
            ? 'bg-[#c9f158] border-[#c9f158]'
            : 'border-gray-300 hover:border-[#202020]'
        }`}
      >
        {task.completed && (
          <svg className="w-3.5 h-3.5 text-[#202020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Title */}
      <span
        className={`flex-1 text-sm font-medium leading-snug min-w-0 ${
          task.completed ? 'line-through text-gray-400' : 'text-[#202020]'
        }`}
      >
        {task.title}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onViewDetail(task)}
          className="w-8 h-8 rounded-xl bg-[#f2f3f5] flex items-center justify-center text-gray-500 hover:bg-[#202020] hover:text-white active:scale-90 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="w-8 h-8 rounded-xl bg-[#f2f3f5] flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white active:scale-90 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
