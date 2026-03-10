import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useState, useEffect } from 'react';
import ListingTask from './pages/ListingTask';
import CreateTask from './pages/CreateTask';
import Detail from './pages/Detail';
import Login from './pages/Login';
import { TaskProvider } from './context/TaskContext';

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

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const logged = localStorage.getItem('logged');
    if (logged === 'true') {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <IonApp><div>Loading...</div></IonApp>;
  }

  return (
    <IonApp>
      <TaskProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/login">
              <Login />
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
      </TaskProvider>
    </IonApp>
  );
};

export default App;
