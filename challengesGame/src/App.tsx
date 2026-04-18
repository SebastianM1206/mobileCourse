import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { GameProvider } from "./contexts/GameContext";
import { useAuth } from "./Hooks/useAuth";
import AuthPage from "./pages/AuthPage";
import MissionsPage from "./pages/MissionsPage";
import RankingPage from "./pages/RankingPage";
import ResultsPage from "./pages/ResultsPage";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <IonRouterOutlet>
      <Route exact path="/auth" render={() => (user ? <Redirect to="/misiones" /> : <AuthPage />)} />
      <Route
        exact
        path="/misiones"
        render={() => (user ? <MissionsPage /> : <Redirect to="/auth" />)}
      />
      <Route
        exact
        path="/resultados"
        render={() => (user ? <ResultsPage /> : <Redirect to="/auth" />)}
      />
      <Route
        exact
        path="/ranking"
        render={() => (user ? <RankingPage /> : <Redirect to="/auth" />)}
      />
      <Route exact path="/" render={() => <Redirect to={user ? "/misiones" : "/auth"} />} />
      <Route render={() => <Redirect to={user ? "/misiones" : "/auth"} />} />
    </IonRouterOutlet>
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AuthProvider>
        <GameProvider>
          <AppRoutes />
        </GameProvider>
      </AuthProvider>
    </IonReactRouter>
  </IonApp>
);

export default App;
