import { IonPage, IonContent } from '@ionic/react';

function Loader() {
  return (
    <IonPage>
      <IonContent scrollY={false}>
        <div className="min-h-screen bg-[#f2f3f5] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#c9f158] rounded-3xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-[#202020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-[#202020] text-xl font-bold mb-1">TaskFlow</h1>
            <p className="text-gray-400 text-sm mb-5">Loading your tasks…</p>
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-2 h-2 bg-[#202020] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-[#202020] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-[#c9f158] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Loader;
