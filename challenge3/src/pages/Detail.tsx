import { IonPage, IonContent } from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import { useTaskContext, Task } from '../context/TaskContext';

interface LocationState {
  task?: Task;
}

const Detail: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const { deleteTask, toggleComplete } = useTaskContext();
  const task = location.state?.task;

  if (!task) {
    return (
      <IonPage>
        <IonContent scrollY={false}>
          <div className="min-h-screen bg-[#f2f3f5] flex flex-col">
            <div className="px-6 pt-safe pb-4 flex items-center gap-4">
              <button
                onClick={() => history.goBack()}
                className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm"
              >
                <svg className="w-5 h-5 text-[#202020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-[#202020]">Task Detail</h1>
            </div>
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-[#202020] font-bold text-lg mb-2">Task not found</p>
                <p className="text-gray-400 text-sm mb-6">This task may have been deleted.</p>
                <button
                  onClick={() => history.push('/listing-task')}
                  className="px-6 py-3 bg-[#202020] text-white font-semibold rounded-2xl text-sm"
                >
                  Back to tasks
                </button>
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const handleDelete = () => {
    deleteTask(task.id);
    history.push('/listing-task');
  };

  const handleToggle = () => {
    toggleComplete(task.id);
    history.goBack();
  };

  return (
    <IonPage>
      <IonContent scrollY={false}>
        <div className="min-h-screen bg-[#f2f3f5] flex flex-col">

          {/* Header */}
          <div className="px-6 pt-safe pb-4">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => history.goBack()}
                className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm active:scale-90 transition-all"
              >
                <svg className="w-5 h-5 text-[#202020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-[#202020]">Task Detail</h1>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${
                task.completed ? 'bg-[#c9f158] text-[#202020]' : 'bg-[#202020] text-white'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${task.completed ? 'bg-[#202020]' : 'bg-[#c9f158]'}`} />
                {task.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 px-6">

            {/* Main task card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Task</p>
              <h2 className={`text-xl font-bold text-[#202020] leading-snug mb-6 ${task.completed ? 'line-through opacity-40' : ''}`}>
                {task.title}
              </h2>

              {/* Toggle row */}
              <div className="flex items-center justify-between pt-4 border-t border-[#f2f3f5]">
                <div>
                  <p className="text-sm font-semibold text-[#202020]">Mark as complete</p>
                  <p className="text-xs text-gray-400">Tap to toggle status</p>
                </div>
                <button
                  onClick={handleToggle}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    task.completed ? 'bg-[#c9f158]' : 'bg-gray-200'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                    task.completed ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* Meta card */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-[#f2f3f5]">
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-sm text-gray-500 font-medium">Task ID</span>
                <span className="text-sm font-bold text-[#202020] font-mono">#{task.id}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-sm text-gray-500 font-medium">Status</span>
                <span className={`text-sm font-bold ${task.completed ? 'text-[#202020]' : 'text-gray-400'}`}>
                  {task.completed ? 'Done ✓' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-safe pt-6 flex gap-3">
            <button
              onClick={() => history.goBack()}
              className="flex-1 py-4 bg-white text-[#202020] font-semibold rounded-2xl active:scale-95 transition-all text-sm shadow-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-4 bg-[#202020] text-white font-semibold rounded-2xl active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Detail;
