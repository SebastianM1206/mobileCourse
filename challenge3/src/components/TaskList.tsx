import TaskItem from './TaskItem';
import { Task } from '../context/TaskContext';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onViewDetail: (task: Task) => void;
}

function TaskList({ tasks, onToggleComplete, onDelete, onViewDetail }: TaskListProps) {
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
        <div className="w-14 h-14 bg-[#f2f3f5] rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-[#202020] font-bold mb-1">All clear!</p>
        <p className="text-gray-400 text-sm">Tap + to add your first task.</p>
      </div>
    );
  }

  return (
    <div className="pb-3">
      {/* Active tasks */}
      {activeTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 px-5 py-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active</span>
            <span className="text-xs bg-[#202020] text-white font-bold px-1.5 py-0.5 rounded-full">
              {activeTasks.length}
            </span>
          </div>
          <div className="divide-y divide-[#f2f3f5]">
            {activeTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onViewDetail={onViewDetail}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <div className={activeTasks.length > 0 ? 'mt-2' : ''}>
          <div className="flex items-center gap-2 px-5 py-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed</span>
            <span className="text-xs bg-[#c9f158] text-[#202020] font-bold px-1.5 py-0.5 rounded-full">
              {completedTasks.length}
            </span>
          </div>
          <div className="divide-y divide-[#f2f3f5]">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onViewDetail={onViewDetail}
              />
            ))}
          </div>
        </div>
      )}

      {/* All done banner */}
      {activeTasks.length === 0 && completedTasks.length > 0 && (
        <div className="mx-5 mb-4 mt-2 px-4 py-3 bg-[#c9f158] rounded-2xl flex items-center gap-3">
          <svg className="w-5 h-5 text-[#202020] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[#202020] text-sm font-bold">All tasks completed!</p>
        </div>
      )}
    </div>
  );
}

export default TaskList;
