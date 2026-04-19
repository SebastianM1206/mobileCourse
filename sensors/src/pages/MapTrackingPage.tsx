import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PluginListenerHandle } from "@capacitor/core";
import { Directory } from "@capacitor/filesystem";
import { Network, type ConnectionStatus } from "@capacitor/network";
import MapComponent, { type MapPoint } from "../components/MapComponent";
import { useAccelerometer } from "../Hooks/useAccelerometer";
import { useCamera } from "../Hooks/useCamera";
import { useDevice } from "../Hooks/useDevice";
import { useFilesystem } from "../Hooks/useFilesystem";
import { useGeolocation } from "../Hooks/useGeolocation";
import { useHaptics } from "../Hooks/useHaptics";
import { useLocalNotifications } from "../Hooks/useLocalNotifications";
import { getAddress } from "../services/opencagedata";
import { getTodayTracksFilePath, TRACKS_DIR } from "../services/trackingStorage";
import type { TrackPoint, TrackSession } from "../types/tracking";
import "./MapTrackingPage.css";

const BATTERY_LOW_THRESHOLD = 0.15;
const NO_MOVEMENT_NOTIFICATION_MS = 45_000;
const AUTO_STOP_STATIC_MS = 60_000;
const FAST_SPEED_THRESHOLD_MPS = 8;
const FAST_SPEED_NOTIFICATION_COOLDOWN_MS = 60_000;
const ADDRESS_REFRESH_MS = 20_000;

const toTrackSessions = (value: unknown): TrackSession[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value as TrackSession[];
};

const formatBatteryLevel = (value: number | null | undefined): string => {
  if (typeof value !== "number") {
    return "No disponible";
  }

  return `${Math.round(value * 100)}%`;
};

const formatSpeed = (speedMps: number | null): string => {
  if (speedMps === null) {
    return "No disponible";
  }

  return `${(speedMps * 3.6).toFixed(1)} km/h`;
};

const buildWatermarkText = (location: MapPoint | null): string => {
  if (!location) {
    return `GPS no disponible | ${new Date().toLocaleString("es-MX")}`;
  }

  return `Lat ${location.latitude.toFixed(5)} | Lng ${location.longitude.toFixed(5)} | ${new Date().toLocaleString("es-MX")}`;
};

const createWatermarkedImage = async (imagePath: string, location: MapPoint | null): Promise<string> => {
  const watermarkText = buildWatermarkText(location);

  return await new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("No se pudo crear el contexto del canvas"));
        return;
      }

      context.drawImage(image, 0, 0);

      const fontSize = Math.max(16, Math.floor(canvas.width * 0.028));
      context.font = `600 ${fontSize}px sans-serif`;
      context.textBaseline = "top";

      const textPadding = 12;
      const textWidth = context.measureText(watermarkText).width;
      const boxWidth = Math.min(canvas.width - 20, textWidth + textPadding * 2);
      const boxHeight = fontSize + textPadding * 2;
      const boxX = 10;
      const boxY = canvas.height - boxHeight - 10;

      context.fillStyle = "rgba(0, 0, 0, 0.55)";
      context.fillRect(boxX, boxY, boxWidth, boxHeight);

      context.fillStyle = "#ffffff";
      context.fillText(watermarkText, boxX + textPadding, boxY + textPadding);

      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };

    image.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    image.src = imagePath;
  });
};

const MapTrackingPage: React.FC = () => {
  const { isMoving } = useAccelerometer();
  const { position, getCurrentLocation, startTracking, stopTracking } = useGeolocation();
  const { battery, refresh } = useDevice();
  const { createDir, readFile, writeFile } = useFilesystem();
  const { photo, takePhoto } = useCamera();
  const { vibrate } = useHaptics();
  const { permission, requestPermission, sendNotification } = useLocalNotifications();

  const [networkStatus, setNetworkStatus] = useState<ConnectionStatus | null>(null);
  const [address, setAddress] = useState<string>("Conecta a WiFi para obtener direccion.");
  const [isTracking, setIsTracking] = useState(false);
  const [path, setPath] = useState<Array<[number, number]>>([]);
  const [statusMessage, setStatusMessage] = useState("Esperando movimiento...");
  const [currentSession, setCurrentSession] = useState<TrackSession | null>(null);
  const [watermarkedPhoto, setWatermarkedPhoto] = useState<string | null>(null);
  const [processingPhoto, setProcessingPhoto] = useState(false);
  const [capturedPhotoLocation, setCapturedPhotoLocation] = useState<MapPoint | null>(null);

  const trackingRef = useRef(false);
  const sessionRef = useRef<TrackSession | null>(null);
  const noMovementNotificationTimerRef = useRef<number | null>(null);
  const autoStopTimerRef = useRef<number | null>(null);
  const lastFastNotificationRef = useRef(0);
  const lastConnectionStateRef = useRef<boolean | null>(null);
  const batteryNotificationSentRef = useRef(false);
  const lastAddressFetchRef = useRef(0);

  const mapPosition: MapPoint | null = useMemo(() => {
    if (!position) {
      return null;
    }

    return {
      latitude: position.latitude,
      longitude: position.longitude,
    };
  }, [position]);

  const hasWifi = networkStatus?.connected === true && networkStatus.connectionType === "wifi";
  const batteryLevel = battery?.batteryLevel;
  const isBatteryLow = typeof batteryLevel === "number" && batteryLevel <= BATTERY_LOW_THRESHOLD;

  const clearStaticTimers = () => {
    if (noMovementNotificationTimerRef.current !== null) {
      window.clearTimeout(noMovementNotificationTimerRef.current);
      noMovementNotificationTimerRef.current = null;
    }

    if (autoStopTimerRef.current !== null) {
      window.clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
  };

  const saveSession = async (session: TrackSession): Promise<void> => {
    await createDir({
      path: TRACKS_DIR,
      directory: Directory.Documents,
    });

    const pathToFile = getTodayTracksFilePath();
    const rawData = await readFile({
      path: pathToFile,
      directory: Directory.Documents,
      isJson: true,
    });

    const sessions = toTrackSessions(rawData);
    sessions.push(session);

    await writeFile({
      path: pathToFile,
      directory: Directory.Documents,
      data: sessions,
      isJson: true,
    });
  };

  const stopTrackingSession = async (reason: string): Promise<void> => {
    if (!trackingRef.current) {
      return;
    }

    clearStaticTimers();
    await stopTracking();

    trackingRef.current = false;
    setIsTracking(false);
    setStatusMessage(`Seguimiento detenido: ${reason}`);

    const snapshot = sessionRef.current;
    sessionRef.current = null;
    setCurrentSession(null);

    if (snapshot && snapshot.points.length > 0) {
      const finishedSession: TrackSession = {
        ...snapshot,
        endedAt: new Date().toISOString(),
        endReason: reason,
      };

      await saveSession(finishedSession);
    }
  };

  const startTrackingSession = async (): Promise<void> => {
    if (trackingRef.current || isBatteryLow) {
      if (isBatteryLow) {
        setStatusMessage("Bateria baja: seguimiento bloqueado para ahorrar energia.");
      }
      return;
    }

    await startTracking();

    const now = new Date().toISOString();
    const newSession: TrackSession = {
      id: `session-${Date.now()}`,
      startedAt: now,
      endedAt: now,
      endReason: "En curso",
      points: [],
    };

    trackingRef.current = true;
    sessionRef.current = newSession;
    setCurrentSession(newSession);
    setPath([]);
    setIsTracking(true);
    setStatusMessage("Seguimiento activo por movimiento detectado.");

    void vibrate(150);
  };

  const addCurrentPointToSession = (point: TrackPoint) => {
    setPath((previousPath) => [...previousPath, [point.latitude, point.longitude]]);

    setCurrentSession((previousSession) => {
      if (!previousSession) {
        return previousSession;
      }

      const updatedSession: TrackSession = {
        ...previousSession,
        points: [...previousSession.points, point],
      };

      sessionRef.current = updatedSession;
      return updatedSession;
    });
  };

  useEffect(() => {
    trackingRef.current = isTracking;
  }, [isTracking]);

  useEffect(() => {
    sessionRef.current = currentSession;
  }, [currentSession]);

  useEffect(() => {
    void getCurrentLocation();
    void refresh();
    void requestPermission();
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void refresh();
    }, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let listener: PluginListenerHandle | null = null;
    let active = true;

    const loadInitialStatus = async () => {
      const status = await Network.getStatus();
      if (!active) {
        return;
      }

      setNetworkStatus(status);
      lastConnectionStateRef.current = status.connected;
    };

    const registerListener = async () => {
      listener = await Network.addListener("networkStatusChange", (status) => {
        setNetworkStatus(status);

        if (lastConnectionStateRef.current === true && !status.connected) {
          void sendNotification({
            title: "Conexion perdida",
            body: "Se perdio la conexion a internet durante el seguimiento.",
          });
        }

        lastConnectionStateRef.current = status.connected;
      });
    };

    void loadInitialStatus();
    void registerListener();

    return () => {
      active = false;
      if (listener) {
        void listener.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!position || !trackingRef.current) {
      return;
    }

    const point: TrackPoint = {
      latitude: position.latitude,
      longitude: position.longitude,
      accuracy: typeof position.accuracy === "number" ? position.accuracy : null,
      speed:
        typeof position.speed === "number" && Number.isFinite(position.speed) && position.speed >= 0
          ? position.speed
          : null,
      timestamp: new Date().toISOString(),
    };

    addCurrentPointToSession(point);

    if (point.speed !== null && point.speed > FAST_SPEED_THRESHOLD_MPS) {
      const now = Date.now();
      if (now - lastFastNotificationRef.current > FAST_SPEED_NOTIFICATION_COOLDOWN_MS) {
        lastFastNotificationRef.current = now;
        void sendNotification({
          title: "Velocidad alta detectada",
          body: `Movimiento rapido: ${(point.speed * 3.6).toFixed(1)} km/h`,
        });
      }
    }
  }, [position]);

  useEffect(() => {
    if (!position) {
      return;
    }

    if (!hasWifi) {
      setAddress("Conecta a WiFi para obtener direccion actual y mostrar el mapa.");
      return;
    }

    const now = Date.now();
    if (now - lastAddressFetchRef.current < ADDRESS_REFRESH_MS) {
      return;
    }

    lastAddressFetchRef.current = now;

    const loadAddress = async () => {
      try {
        const response = await getAddress(position.latitude, position.longitude);
        const formatted = response?.results?.[0]?.formatted;
        setAddress(typeof formatted === "string" ? formatted : "Direccion no disponible");
      } catch {
        setAddress("No se pudo obtener la direccion actual.");
      }
    };

    void loadAddress();
  }, [hasWifi, position]);

  useEffect(() => {
    if (isMoving) {
      clearStaticTimers();

      if (!trackingRef.current && !isBatteryLow) {
        void startTrackingSession();
      }

      return;
    }

    if (!trackingRef.current) {
      return;
    }

    if (noMovementNotificationTimerRef.current === null) {
      noMovementNotificationTimerRef.current = window.setTimeout(() => {
        void sendNotification({
          title: "Sin movimiento",
          body: "No se detecta movimiento desde hace un tiempo.",
        });
      }, NO_MOVEMENT_NOTIFICATION_MS);
    }

    if (autoStopTimerRef.current === null) {
      autoStopTimerRef.current = window.setTimeout(() => {
        void stopTrackingSession("Sin movimiento prolongado");
      }, AUTO_STOP_STATIC_MS);
    }
  }, [isMoving, isBatteryLow]);

  useEffect(() => {
    if (!isBatteryLow) {
      batteryNotificationSentRef.current = false;
      return;
    }

    if (!batteryNotificationSentRef.current) {
      batteryNotificationSentRef.current = true;
      void sendNotification({
        title: "Bateria baja",
        body: "Seguimiento pausado para ahorrar bateria.",
      });
    }

    if (trackingRef.current) {
      void stopTrackingSession("Bateria baja");
    }
  }, [isBatteryLow]);

  useEffect(() => {
    if (!photo) {
      return;
    }

    setProcessingPhoto(true);

    void createWatermarkedImage(photo, capturedPhotoLocation)
      .then((image) => setWatermarkedPhoto(image))
      .catch(() => setWatermarkedPhoto(photo))
      .finally(() => setProcessingPhoto(false));
  }, [photo, capturedPhotoLocation]);

  useEffect(() => {
    return () => {
      clearStaticTimers();
      void stopTracking();
    };
  }, []);

  const currentSpeed =
    typeof position?.speed === "number" && Number.isFinite(position.speed) && position.speed >= 0
      ? position.speed
      : null;

  const movementStateText = isMoving ? "En movimiento" : "Estatico";
  const trackingStateText = isTracking ? "Activo" : "Detenido";
  const networkLabel = hasWifi
    ? "WiFi disponible"
    : networkStatus?.connected
      ? "Internet sin WiFi"
      : "Sin internet";

  const handleTakePhoto = async () => {
    setCapturedPhotoLocation(mapPosition);
    await takePhoto();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Mapa inteligente</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="map-page-content">
        <IonCard className="map-status-card">
          <IonCardHeader>
            <IonCardTitle>Estado de seguimiento</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>Red</IonLabel>
                <IonBadge slot="end" color={hasWifi ? "success" : "warning"}>
                  {networkLabel}
                </IonBadge>
              </IonItem>

              <IonItem>
                <IonLabel>Movimiento</IonLabel>
                <IonBadge slot="end" color={isMoving ? "success" : "medium"}>
                  {movementStateText}
                </IonBadge>
              </IonItem>

              <IonItem>
                <IonLabel>Seguimiento</IonLabel>
                <IonBadge slot="end" color={isTracking ? "primary" : "medium"}>
                  {trackingStateText}
                </IonBadge>
              </IonItem>

              <IonItem>
                <IonLabel>Bateria</IonLabel>
                <IonBadge slot="end" color={isBatteryLow ? "danger" : "success"}>
                  {formatBatteryLevel(batteryLevel)}
                </IonBadge>
              </IonItem>

              <IonItem>
                <IonLabel>Velocidad actual</IonLabel>
                <IonLabel slot="end">{formatSpeed(currentSpeed)}</IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>Permiso de notificaciones</IonLabel>
                <IonLabel slot="end">{permission ?? "desconocido"}</IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel className="address-text">Direccion: {address}</IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>Puntos de la sesion actual: {currentSession?.points.length ?? 0}</IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        <MapComponent
          position={mapPosition}
          path={path}
          ready={Boolean(mapPosition && hasWifi)}
          placeholder={
            hasWifi
              ? "Obteniendo ubicacion actual..."
              : "Conectate a una red WiFi para mostrar mapa y direccion actual."
          }
          height="360px"
        />

        <IonText>
          <p className="status-message">{statusMessage}</p>
        </IonText>

        <IonButton expand="block" onClick={() => void getCurrentLocation()} className="map-action-button">
          Actualizar ubicacion
        </IonButton>

        <IonButton
          expand="block"
          onClick={() => void handleTakePhoto()}
          className="map-action-button"
          disabled={!mapPosition}
        >
          Tomar foto con marca GPS
        </IonButton>

        <IonButton
          expand="block"
          color="medium"
          onClick={() => void stopTrackingSession("Detencion manual")}
          className="map-action-button"
          disabled={!isTracking}
        >
          Detener seguimiento manualmente
        </IonButton>

        <IonButton expand="block" routerLink="/sensor/map-history" className="map-action-button">
          Ver historial de hoy
        </IonButton>

        {processingPhoto && (
          <IonText>
            <p className="status-message">Procesando foto con marca de agua...</p>
          </IonText>
        )}

        {watermarkedPhoto && (
          <IonCard className="photo-preview-card">
            <IonCardHeader>
              <IonCardTitle>Foto con ubicacion</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonImg src={watermarkedPhoto} alt="Foto con marca de agua de ubicacion" className="photo-preview" />
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MapTrackingPage;