import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonImg,
  IonLabel,
  IonPage,
  IonProgressBar,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useAccelerometer } from "../Hooks/useAccelerometer";
import { useCamera } from "../Hooks/useCamera";
import { useGeolocation } from "../Hooks/useGeolocation";
import { useHaptics } from "../Hooks/useHaptics";
import { useAuth } from "../Hooks/useAuth";
import { useGame } from "../Hooks/useGame";
import { calculateDistanceMeters } from "../utils/distance";

const MOVEMENT_TARGET_METERS = 30;
const STILLNESS_TARGET_SECONDS = 10;

type CoordinatesSnapshot = {
  latitude: number;
  longitude: number;
};

const getErrorMessage = (error: unknown): string => {
  if (!error) {
    return "Ocurrio un error en el dispositivo.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "No fue posible completar la accion.";
};

const MissionsPage: React.FC = () => {
  const { logout } = useAuth();
  const {
    missions,
    points,
    completedCount,
    progressPercent,
    photoEvidence,
    loading,
    syncError,
    completeMission,
    savePhotoEvidence,
    clearSyncError,
  } = useGame();

  const { photo, error: cameraError, takePhoto, clearError: clearCameraError } = useCamera();
  const {
    position,
    error: geolocationError,
    getCurrentLocation,
    startTracking,
    stopTracking,
    clearError: clearGeolocationError,
  } = useGeolocation();
  const { isMoving } = useAccelerometer({ interval: 200 });
  const { vibrate } = useHaptics();

  const [pageError, setPageError] = useState<string | null>(null);
  const [isTrackingMovement, setIsTrackingMovement] = useState(false);
  const [movementStart, setMovementStart] = useState<CoordinatesSnapshot | null>(null);
  const [movementDistance, setMovementDistance] = useState(0);
  const [isStillnessRunning, setIsStillnessRunning] = useState(false);
  const [stillnessRemaining, setStillnessRemaining] = useState<number>(STILLNESS_TARGET_SECONDS);

  const stillnessStartRef = useRef<number | null>(null);

  const missionOne = missions.find((mission) => mission.id === 1);
  const missionTwo = missions.find((mission) => mission.id === 2);
  const missionThree = missions.find((mission) => mission.id === 3);

  const missionOneCompleted = missionOne?.estado === "completada";
  const missionTwoCompleted = missionTwo?.estado === "completada";
  const missionThreeCompleted = missionThree?.estado === "completada";
  const missionThreeEnabled = missionTwoCompleted;

  const displayedPhoto = photoEvidence ?? photo;

  useEffect(() => {
    return () => {
      void stopTracking();
    };
  }, [stopTracking]);

  useEffect(() => {
    if (!cameraError) {
      return;
    }

    setPageError(getErrorMessage(cameraError));
  }, [cameraError]);

  useEffect(() => {
    if (!geolocationError) {
      return;
    }

    setPageError(getErrorMessage(geolocationError));
  }, [geolocationError]);

  useEffect(() => {
    if (!isTrackingMovement || !movementStart || !position || missionTwoCompleted) {
      return;
    }

    const distance = calculateDistanceMeters(
      movementStart.latitude,
      movementStart.longitude,
      position.latitude,
      position.longitude
    );

    setMovementDistance(distance);

    if (distance < MOVEMENT_TARGET_METERS) {
      return;
    }

    void stopTracking();
    setIsTrackingMovement(false);
    void completeMission(2);
  }, [
    completeMission,
    isTrackingMovement,
    missionTwoCompleted,
    movementStart,
    position,
    stopTracking,
  ]);

  useEffect(() => {
    if (!missionThreeEnabled || missionThreeCompleted) {
      setIsStillnessRunning(false);
      setStillnessRemaining(STILLNESS_TARGET_SECONDS);
      stillnessStartRef.current = null;
    }
  }, [missionThreeCompleted, missionThreeEnabled]);

  useEffect(() => {
    if (!isStillnessRunning || missionThreeCompleted) {
      return;
    }

    const timer = window.setInterval(() => {
      if (isMoving) {
        stillnessStartRef.current = null;
        setStillnessRemaining(STILLNESS_TARGET_SECONDS);
        return;
      }

      if (stillnessStartRef.current === null) {
        stillnessStartRef.current = Date.now();
        return;
      }

      const elapsedSeconds = (Date.now() - stillnessStartRef.current) / 1000;
      const remaining = Math.max(0, STILLNESS_TARGET_SECONDS - elapsedSeconds);
      setStillnessRemaining(Number(remaining.toFixed(1)));

      if (elapsedSeconds < STILLNESS_TARGET_SECONDS) {
        return;
      }

      window.clearInterval(timer);
      setStillnessRemaining(0);
      setIsStillnessRunning(false);
      void vibrate(300);
      void completeMission(3);
    }, 200);

    return () => {
      window.clearInterval(timer);
    };
  }, [completeMission, isMoving, isStillnessRunning, missionThreeCompleted, vibrate]);

  const handleMissionOne = async (): Promise<void> => {
    if (missionOneCompleted) {
      return;
    }

    clearCameraError();
    setPageError(null);

    const imagePath = await takePhoto();

    if (!imagePath) {
      setPageError("No fue posible guardar la foto. Revisa permisos de camara.");
      return;
    }

    savePhotoEvidence(imagePath);
    await completeMission(1);
  };

  const handleMissionTwoStart = async (): Promise<void> => {
    if (missionTwoCompleted) {
      return;
    }

    clearGeolocationError();
    setPageError(null);

    const current = await getCurrentLocation();

    if (!current) {
      setPageError("No se pudo obtener la ubicacion inicial.");
      return;
    }

    const didStart = await startTracking();

    if (!didStart) {
      setPageError("No se pudo iniciar el seguimiento de ubicacion.");
      return;
    }

    setMovementStart({
      latitude: current.latitude,
      longitude: current.longitude,
    });
    setMovementDistance(0);
    setIsTrackingMovement(true);
  };

  const handleMissionTwoStop = async (): Promise<void> => {
    await stopTracking();
    setIsTrackingMovement(false);
  };

  const handleMissionThreeStart = (): void => {
    if (!missionThreeEnabled || missionThreeCompleted) {
      return;
    }

    setPageError(null);
    setStillnessRemaining(STILLNESS_TARGET_SECONDS);
    stillnessStartRef.current = null;
    setIsStillnessRunning(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Misiones</IonTitle>
          <IonButton slot="end" onClick={() => void logout()}>
            Salir
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Puntos: {points}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>
              Progreso: {completedCount}/3 ({Math.round(progressPercent)}%)
            </p>
            <IonProgressBar value={progressPercent / 100} />
            <IonButton expand="block" routerLink="/resultados" style={{ marginTop: 12 }}>
              Ver resumen
            </IonButton>
            <IonButton expand="block" fill="outline" routerLink="/ranking">
              Ver ranking
            </IonButton>
          </IonCardContent>
        </IonCard>

        {loading && (
          <IonText>
            <p style={{ margin: 16 }}>Cargando progreso...</p>
          </IonText>
        )}

        {(pageError || syncError) && (
          <IonCard color="danger">
            <IonCardContent>
              <p>{pageError ?? syncError}</p>
              {syncError && (
                <IonButton size="small" onClick={clearSyncError}>
                  Limpiar mensaje
                </IonButton>
              )}
            </IonCardContent>
          </IonCard>
        )}

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{missionOne?.titulo}</IonCardTitle>
            <IonChip color={missionOneCompleted ? "success" : "warning"}>
              <IonLabel>{missionOne?.estado}</IonLabel>
            </IonChip>
          </IonCardHeader>
          <IonCardContent>
            <p>{missionOne?.descripcion}</p>
            <IonButton
              expand="block"
              disabled={missionOneCompleted}
              onClick={() => void handleMissionOne()}
            >
              {missionOneCompleted ? "Mision completada" : "Tomar foto"}
            </IonButton>

            {displayedPhoto && <IonImg src={displayedPhoto} alt="Foto de evidencia" />}
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{missionTwo?.titulo}</IonCardTitle>
            <IonChip color={missionTwoCompleted ? "success" : "warning"}>
              <IonLabel>{missionTwo?.estado}</IonLabel>
            </IonChip>
          </IonCardHeader>
          <IonCardContent>
            <p>{missionTwo?.descripcion}</p>
            <p>Distancia recorrida: {movementDistance.toFixed(1)} m</p>
            <IonButton
              expand="block"
              disabled={missionTwoCompleted || isTrackingMovement}
              onClick={() => void handleMissionTwoStart()}
            >
              Comenzar movimiento
            </IonButton>
            <IonButton
              expand="block"
              fill="outline"
              disabled={!isTrackingMovement}
              onClick={() => void handleMissionTwoStop()}
            >
              Detener movimiento
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{missionThree?.titulo}</IonCardTitle>
            <IonChip color={missionThreeCompleted ? "success" : "warning"}>
              <IonLabel>{missionThree?.estado}</IonLabel>
            </IonChip>
          </IonCardHeader>
          <IonCardContent>
            <p>{missionThree?.descripcion}</p>
            {!missionThreeEnabled && <p>Debes completar la Mision 2 para habilitar esta etapa.</p>}
            {missionThreeEnabled && !missionThreeCompleted && (
              <>
                <p>Tiempo restante quieto: {stillnessRemaining.toFixed(1)} s</p>
                <p>Estado de movimiento: {isMoving ? "Moviendose" : "Quieto"}</p>
              </>
            )}
            <IonButton
              expand="block"
              disabled={!missionThreeEnabled || missionThreeCompleted || isStillnessRunning}
              onClick={handleMissionThreeStart}
            >
              {isStillnessRunning ? "Analizando estabilidad..." : "Iniciar permanencia"}
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default MissionsPage;
