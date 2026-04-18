import {
  IonButton,
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

const sensors = [
  { label: "Acelerómetro", path: "/sensor/accelerometer" },
  { label: "Cámara", path: "/sensor/camera" },
  { label: "Dispositivo", path: "/sensor/device" },
  { label: "Sistema de archivos", path: "/sensor/filesystem" },
  { label: "Geolocalización", path: "/sensor/geolocation" },
  { label: "Hápticos", path: "/sensor/haptics" },
  { label: "Notificaciones locales", path: "/sensor/local-notifications" },
  { label: "Push notifications", path: "/sensor/push-notifications" },
];

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sensores</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {sensors.map((sensor) => (
            <IonButton
              key={sensor.path}
              expand="block"
              routerLink={sensor.path}
              style={{ margin: "12px" }}
            >
              {sensor.label}
            </IonButton>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
