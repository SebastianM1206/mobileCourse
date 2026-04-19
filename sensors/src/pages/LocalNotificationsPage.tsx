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
import { useLocalNotifications } from "../Hooks/useLocalNotifications";

const TEST_ID = 1001;

const LocalNotificationsPage: React.FC = () => {
  const {
    permission,
    error,
    requestPermission,
    checkPermission,
    sendNotification,
    scheduleNotification,
    cancelNotification,
  } = useLocalNotifications();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Notificaciones locales</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonLabel>Permiso: {permission ?? "desconocido"}</IonLabel>
          </IonItem>
        </IonList>

        <IonButton expand="block" onClick={() => void requestPermission()} style={{ margin: "12px" }}>
          Solicitar permiso
        </IonButton>
        <IonButton expand="block" onClick={() => void checkPermission()} style={{ margin: "12px" }}>
          Verificar permiso
        </IonButton>
        <IonButton
          expand="block"
          onClick={() =>
            void sendNotification({
              id: TEST_ID,
              title: "Prueba inmediata",
              body: "Notificación local enviada",
            })
          }
          style={{ margin: "12px" }}
        >
          Enviar ahora
        </IonButton>
        <IonButton
          expand="block"
          onClick={() =>
            void scheduleNotification({
              id: TEST_ID,
              title: "Prueba programada",
              body: "Llega en 5 segundos",
              seconds: 5,
            })
          }
          style={{ margin: "12px" }}
        >
          Programar en 5s
        </IonButton>
        <IonButton
          expand="block"
          color="danger"
          onClick={() => void cancelNotification(TEST_ID)}
          style={{ margin: "12px" }}
        >
          Cancelar notificación
        </IonButton>

        {Boolean(error) && (
          <IonText color="danger">
            <p style={{ margin: "12px" }}>Error en notificaciones locales.</p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default LocalNotificationsPage;