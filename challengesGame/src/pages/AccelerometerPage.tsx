import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useAccelerometer } from "../Hooks/useAccelerometer";

const AccelerometerPage: React.FC = () => {
  const { acceleration, magnitude, isShaking, isMoving, start, stop } = useAccelerometer();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Acelerómetro</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonLabel>X: {acceleration.x.toFixed(3)}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Y: {acceleration.y.toFixed(3)}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Z: {acceleration.z.toFixed(3)}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Magnitud: {magnitude.toFixed(3)}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>En movimiento: {isMoving ? "Sí" : "No"}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Detecta sacudida: {isShaking ? "Sí" : "No"}</IonLabel>
          </IonItem>
        </IonList>

        <IonButton expand="block" onClick={() => void start()} style={{ margin: "12px" }}>
          Iniciar lectura
        </IonButton>
        <IonButton expand="block" color="medium" onClick={() => void stop()} style={{ margin: "12px" }}>
          Detener lectura
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AccelerometerPage;