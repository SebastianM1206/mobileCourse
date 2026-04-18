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
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { usePushNotifications } from "../Hooks/usePushNotifications";

const PushNotificationsPage: React.FC = () => {
  const { requestPermission, token, notification, error } = usePushNotifications();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Push notifications</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonButton expand="block" onClick={() => void requestPermission()} style={{ margin: "12px" }}>
          Activar push
        </IonButton>

        <IonList>
          <IonItem>
            <IonLabel>Token: {token ?? "No disponible"}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Título recibido: {notification?.title ?? "Sin notificaciones"}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Cuerpo recibido: {notification?.body ?? "Sin notificaciones"}</IonLabel>
          </IonItem>
        </IonList>

        {error && (
          <IonText color="danger">
            <p style={{ margin: "12px" }}>Error al registrar push notifications.</p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PushNotificationsPage;