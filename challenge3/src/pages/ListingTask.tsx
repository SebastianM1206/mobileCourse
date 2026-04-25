import { IonPage, IonContent } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import TaskList from '../components/TaskList';
import Loader from '../components/Loader';
import { useTaskContext, Task } from '../context/TaskContext';
import { useAuthContext } from '../context/AuthContext';

const ListingTask: React.FC = () => {
  const history = useHistory();
  const { tasks, deleteTask, toggleComplete } = useTaskContext();
  const { logout, user } = useAuthContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loader />;

  const activeTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const userName = user?.email?.split('@')[0] ?? 'User';
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const handleLogout = async () => {
    await logout();
    history.push('/login');
  };

  return (
    <IonPage>
      <IonContent scrollY>
        <div className="min-h-screen bg-[#f2f3f5]">

          {/* Header */}
          <div className="px-6 pt-safe pb-4">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-gray-500 text-sm font-medium">Good day,</p>
                <h1 className="text-2xl font-bold text-[#202020] capitalize">{userName}</h1>
                <p className="text-gray-400 text-sm mt-0.5">Welcome to TaskFlow</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm active:scale-90 transition-all"
              >
                <svg className="w-5 h-5 text-[#202020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[#202020] rounded-2xl p-4">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Active</p>
                <p className="text-white text-3xl font-bold">{activeTasks}</p>
                <p className="text-gray-500 text-xs mt-1">tasks pending</p>
              </div>
              <div className="bg-[#c9f158] rounded-2xl p-4">
                <p className="text-[#202020]/60 text-xs font-semibold uppercase tracking-wider mb-1">Done</p>
                <p className="text-[#202020] text-3xl font-bold">{completedTasks}</p>
                <p className="text-[#202020]/50 text-xs mt-1">tasks completed</p>
              </div>
            </div>

            {/* Progress */}
            {tasks.length > 0 && (
              <div className="bg-white rounded-2xl px-5 py-4">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-gray-500">Overall progress</span>
                  <span className="text-[#202020]">{progressPercent}%</span>
                </div>
                <div className="h-2 bg-[#f2f3f5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c9f158] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tasks card */}
          <div className="px-6 pb-28">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <h2 className="text-[#202020] font-bold text-lg">My Tasks</h2>
                <span className="text-xs text-gray-400 font-semibold bg-[#f2f3f5] px-2.5 py-1 rounded-full">
                  {tasks.length} total
                </span>
              </div>

              <TaskList
                tasks={tasks}
                onToggleComplete={(id) => toggleComplete(id)}
                onDelete={(id) => deleteTask(id)}
                onViewDetail={(task: Task) => history.push('/detail', { task })}
              />
            </div>
          </div>
        </div>

        {/* FAB */}
        <div slot="fixed" style={{ position: 'fixed', bottom: '2rem', right: '1.5rem', zIndex: 50 }}>
          <button
            onClick={() => history.push('/create-task')}
            className="w-14 h-14 bg-[#202020] rounded-2xl shadow-lg flex items-center justify-center active:scale-90 transition-all"
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ListingTask;
