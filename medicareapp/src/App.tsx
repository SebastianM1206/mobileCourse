import React, { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import LoginPage from './pages/LoginPage';
import TabsPage from './pages/TabsPage';

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

export interface Visita {
  id: string;
  paciente: string;
  direccion: string;
  hora: string;
  estado: 'pendiente' | 'en_camino' | 'completada' | 'cancelada';
  telefono: string;
}

const App: React.FC = () => {
  const isAuthenticated = localStorage.getItem('medicareUser') !== null;
  const [visitas, setVisitas] = useState<Visita[]>([
    {
      id: '1',
      paciente: 'Juan Rodríguez',
      direccion: 'Calle Principal 123, Apto 4B',
      hora: '09:00 AM',
      estado: 'completada',
      telefono: '555-0101',
    },
    {
      id: '2',
      paciente: 'María González',
      direccion: 'Avenida Central 456',
      hora: '10:30 AM',
      estado: 'en_camino',
      telefono: '555-0102',
    },
    {
      id: '3',
      paciente: 'Carlos López',
      direccion: 'Boulevard Oeste 789',
      hora: '14:00 PM',
      estado: 'pendiente',
      telefono: '555-0103',
    },
    {
      id: '4',
      paciente: 'Ana Martínez',
      direccion: 'Calle Sur 321',
      hora: '15:30 PM',
      estado: 'pendiente',
      telefono: '555-0104',
    },
  ]);

  const countPendientes = visitas.filter((v) => v.estado === 'pendiente').length;

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {isAuthenticated ? (
            <>
              <Route
                path="/tabs"
                render={() => (
                  <TabsPage
                    visitas={visitas}
                    setVisitas={setVisitas}
                    countPendientes={countPendientes}
                  />
                )}
              />
              <Route exact path="/">
                <Redirect to="/tabs/visitas" />
              </Route>
            </>
          ) : (
            <>
              <Route path="/login" component={LoginPage} />
              <Route exact path="/">
                <Redirect to="/login" />
              </Route>
            </>
          )}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
