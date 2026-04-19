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
import { useDevice } from "../Hooks/useDevice";

const DevicePage: React.FC = () => {
  const { battery, info, deviceId, loading, error, refresh } = useDevice();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Dispositivo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonButton expand="block" onClick={() => void refresh()} style={{ margin: "12px" }}>
          Actualizar
        </IonButton>

        {loading && (
          <IonText>
            <p style={{ margin: "12px" }}>Cargando...</p>
          </IonText>
        )}

        {Boolean(error) && (
          <IonText color="danger">
            <p style={{ margin: "12px" }}>Error al leer información del dispositivo.</p>
          </IonText>
        )}

        <IonList>
          <IonItem>
            <IonLabel>ID: {deviceId ?? "No disponible"}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Batería: {battery?.batteryLevel ?? "No disponible"}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Cargando: {battery?.isCharging ? "Sí" : "No"}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Plataforma: {info?.platform ?? "No disponible"}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Modelo: {info?.model ?? "No disponible"}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Sistema operativo: {info?.operatingSystem ?? "No disponible"}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Versión OS: {info?.osVersion ?? "No disponible"}</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default DevicePage;