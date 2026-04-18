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
import { useGeolocation } from "../Hooks/useGeolocation";

const GeolocationPage: React.FC = () => {
  const { position, error, getCurrentLocation, startTracking, stopTracking } = useGeolocation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Geolocalización</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonButton expand="block" onClick={() => void getCurrentLocation()} style={{ margin: "12px" }}>
          Obtener ubicación actual
        </IonButton>
        <IonButton expand="block" onClick={() => void startTracking()} style={{ margin: "12px" }}>
          Iniciar seguimiento
        </IonButton>
        <IonButton expand="block" color="medium" onClick={() => void stopTracking()} style={{ margin: "12px" }}>
          Detener seguimiento
        </IonButton>

        {error && (
          <IonText color="danger">
            <p style={{ margin: "12px" }}>Error al obtener ubicación.</p>
          </IonText>
        )}

        <IonList>
          <IonItem>
            <IonLabel>Latitud: {position?.latitude ?? "No disponible"}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Longitud: {position?.longitude ?? "No disponible"}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Precisión: {position?.accuracy ?? "No disponible"}</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default GeolocationPage;