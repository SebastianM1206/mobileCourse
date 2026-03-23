import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import ListingTask from './pages/ListingTask';
import Contacts from './pages/Contacts';
import Fruits from './pages/Fruits';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import EditContact from './pages/EditContact';
import EditFruit from './pages/EditFruit';
import Detail from './pages/Detail';
import Login from './pages/Login';
import Register from './pages/Register';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
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
    return <div>Loading...</div>;
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
        <ProtectedRoute isLoggedIn={isLoggedIn} path="/home">
          <Home />
        </ProtectedRoute>
        <ProtectedRoute isLoggedIn={isLoggedIn} path="/listing-task">
          <ListingTask />
        </ProtectedRoute>
        <ProtectedRoute isLoggedIn={isLoggedIn} path="/contacts">
          <Contacts />
        </ProtectedRoute>
        <ProtectedRoute isLoggedIn={isLoggedIn} path="/fruits">
          <Fruits />
        </ProtectedRoute>
        <ProtectedRoute isLoggedIn={isLoggedIn} path="/create-task">
          <CreateTask />
        </ProtectedRoute>
        <ProtectedRoute isLoggedIn={isLoggedIn} path="/edit-task/:id">
          <EditTask />
        </ProtectedRoute>
        <ProtectedRoute isLoggedIn={isLoggedIn} path="/edit-contact/:id">
          <EditContact />
        </ProtectedRoute>
        <ProtectedRoute isLoggedIn={isLoggedIn} path="/edit-fruit/:id">
          <EditFruit />
        </ProtectedRoute>
        <ProtectedRoute isLoggedIn={isLoggedIn} path="/detail">
          <Detail />
        </ProtectedRoute>
        <Route exact path="/">
          {isLoggedIn ? <Redirect to="/home" /> : <Redirect to="/login" />}
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
  )
}

export default App;
