import { IonPage, IonContent } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';

const CreateTask: React.FC = () => {
  const history = useHistory();
  const { addTask } = useTaskContext();
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleAddTask = () => {
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }
    addTask({ id: Date.now(), title: title.trim(), completed: false });
    history.push('/listing-task');
  };

  return (
    <IonPage>
      <IonContent scrollY={false}>
        <div className="min-h-screen bg-[#f2f3f5] flex flex-col">

          {/* Header */}
          <div className="px-6 pt-safe pb-4">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => history.goBack()}
                className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm active:scale-90 transition-all"
              >
                <svg className="w-5 h-5 text-[#202020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-[#202020]">New Task</h1>
                <p className="text-gray-400 text-xs">What do you need to do?</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 px-6">
            {/* Input card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                Task title
              </label>
              <textarea
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(''); }}
                placeholder="e.g. Review project proposal…"
                rows={4}
                className="w-full px-4 py-3 rounded-2xl bg-[#f2f3f5] text-[#202020] placeholder-gray-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#c9f158] transition-all resize-none"
              />
              {error && (
                <div className="mt-3 flex items-center gap-2 text-red-500">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>

            {/* Tip card */}
            <div className="bg-[#c9f158] rounded-2xl p-4 flex gap-3 items-start">
              <div className="w-7 h-7 bg-[#202020] rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-[#c9f158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[#202020] text-xs font-bold mb-0.5">Quick tip</p>
                <p className="text-[#202020]/70 text-xs">Be specific. Clear titles help you stay focused and on track.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-safe pt-6 flex flex-col gap-3">
            <button
              onClick={handleAddTask}
              className="w-full py-4 bg-[#202020] text-white font-semibold rounded-2xl active:scale-95 transition-all text-sm tracking-wide flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Create Task
            </button>
            <button
              onClick={() => history.goBack()}
              className="w-full py-4 bg-white text-[#202020] font-semibold rounded-2xl active:scale-95 transition-all text-sm tracking-wide shadow-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreateTask;
