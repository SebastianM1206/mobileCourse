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
import { useHaptics } from "../Hooks/useHaptics";

const HapticsPage: React.FC = () => {
  const {
    isAvailable,
    impact,
    notify,
    vibrate,
    selectionStart,
    selectionChanged,
    selectionEnd,
  } = useHaptics();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Hápticos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonLabel>Disponible: {isAvailable ? "Sí" : "No"}</IonLabel>
          </IonItem>
        </IonList>

        <IonButton expand="block" onClick={() => void impact("light")} style={{ margin: "12px" }}>
          Impacto ligero
        </IonButton>
        <IonButton expand="block" onClick={() => void impact("medium")} style={{ margin: "12px" }}>
          Impacto medio
        </IonButton>
        <IonButton expand="block" onClick={() => void impact("heavy")} style={{ margin: "12px" }}>
          Impacto fuerte
        </IonButton>
        <IonButton expand="block" onClick={() => void notify("success")} style={{ margin: "12px" }}>
          Notificación éxito
        </IonButton>
        <IonButton expand="block" onClick={() => void vibrate(200)} style={{ margin: "12px" }}>
          Vibrar 200ms
        </IonButton>
        <IonButton expand="block" onClick={() => void selectionStart()} style={{ margin: "12px" }}>
          Selection start
        </IonButton>
        <IonButton expand="block" onClick={() => void selectionChanged()} style={{ margin: "12px" }}>
          Selection changed
        </IonButton>
        <IonButton expand="block" onClick={() => void selectionEnd()} style={{ margin: "12px" }}>
          Selection end
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default HapticsPage;