import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import ListingTask from './pages/ListingTask';
import CreateTask from './pages/CreateTask';
import Detail from './pages/Detail';
import Login from './pages/Login';
import Register from './pages/Register';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';

import './theme/variables.css';

setupIonicReact();

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  path: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isLoggedIn, path, children }) => (
  <Route exact path={path}>
    {isLoggedIn ? children : <Redirect to="/login" />}
  </Route>
);

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuthContext();
  const isLoggedIn = !!user;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f3f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#c9f158] rounded-3xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-[#202020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-[#202020] text-xl font-bold mb-1">TaskFlow</h1>
          <p className="text-gray-400 text-sm mb-5">Loading…</p>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 bg-[#202020] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-[#202020] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-[#c9f158] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <ProtectedRoute isLoggedIn={isLoggedIn} path="/listing-task">
          <ListingTask />
        </ProtectedRoute>
        <ProtectedRoute isLoggedIn={isLoggedIn} path="/create-task">
          <CreateTask />
        </ProtectedRoute>
        <ProtectedRoute isLoggedIn={isLoggedIn} path="/detail">
          <Detail />
        </ProtectedRoute>
        <Route exact path="/">
          {isLoggedIn ? <Redirect to="/listing-task" /> : <Redirect to="/login" />}
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => {
  return (
    <IonApp>
      <AuthProvider>
        <TaskProvider>
          <AppRoutes />
        </TaskProvider>
      </AuthProvider>
    </IonApp>
  );
};

export default App;
