import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useGame } from "../Hooks/useGame";

const ResultsPage: React.FC = () => {
  const { points, completedCount } = useGame();

  const overallStatus =
    completedCount === 3
      ? "Completado"
      : completedCount === 0
      ? "Sin progreso"
      : "En progreso";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Resumen</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Resultados actuales</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Puntos acumulados: {points}</p>
            <p>Misiones completadas: {completedCount}/3</p>
            <p>Estado general: {overallStatus}</p>
          </IonCardContent>
        </IonCard>

        <IonButton expand="block" routerLink="/misiones">
          Volver a misiones
        </IonButton>
        <IonButton expand="block" fill="outline" routerLink="/ranking">
          Ver ranking
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ResultsPage;
