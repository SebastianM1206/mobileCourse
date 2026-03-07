import React from 'react';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge,
} from '@ionic/react';
import { Route } from 'react-router-dom';
import { documentText, people, person } from 'ionicons/icons';
import VisitasPage from './VisitasPage';
import DetalleVisitaPage from './DetalleVisitaPage';
import MisPacientesPage from './MisPacientesPage';
import PerfilMedicoPage from './PerfilMedicoPage';
import { Visita } from '../App';

interface TabsPageProps {
  visitas: Visita[];
  setVisitas: (visitas: Visita[]) => void;
  countPendientes: number;
}

const TabsPage: React.FC<TabsPageProps> = ({ visitas, setVisitas, countPendientes }) => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route
          path="/tabs/visitas"
          exact
          render={() => <VisitasPage visitas={visitas} setVisitas={setVisitas} />}
        />
        <Route
          path="/tabs/visitas/:id"
          render={(props) => <DetalleVisitaPage {...props} visitas={visitas} />}
        />

        <Route path="/tabs/pacientes" exact component={MisPacientesPage} />

        <Route path="/tabs/perfil" exact component={PerfilMedicoPage} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="visitas" href="/tabs/visitas">
          <IonIcon icon={documentText} />
          <IonLabel>Visitas</IonLabel>
          {countPendientes > 0 && (
            <IonBadge slot="end" color="danger">
              {countPendientes}
            </IonBadge>
          )}
        </IonTabButton>
        <IonTabButton tab="pacientes" href="/tabs/pacientes">
          <IonIcon icon={people} />
          <IonLabel>Pacientes</IonLabel>
        </IonTabButton>
        <IonTabButton tab="perfil" href="/tabs/perfil">
          <IonIcon icon={person} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabsPage;
