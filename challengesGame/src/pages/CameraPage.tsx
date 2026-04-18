import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useCamera } from "../Hooks/useCamera";

const CameraPage: React.FC = () => {
  const { photo, takePhoto } = useCamera();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Cámara</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonButton expand="block" onClick={() => void takePhoto()} style={{ margin: "12px" }}>
          Tomar foto
        </IonButton>

        {photo ? (
          <IonImg src={photo} alt="Foto tomada" />
        ) : (
          <IonText>
            <p style={{ margin: "12px" }}>Aún no hay foto.</p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default CameraPage;