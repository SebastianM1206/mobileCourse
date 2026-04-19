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
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useMemo, useState } from "react";
import { Directory } from "@capacitor/filesystem";
import MapComponent, { type MapPoint } from "../components/MapComponent";
import { useFilesystem } from "../Hooks/useFilesystem";
import { getTodayDateKey, getTodayTracksFilePath, TRACKS_DIR } from "../services/trackingStorage";
import type { TrackSession } from "../types/tracking";
import "./MapHistoryPage.css";

const toTrackSessions = (value: unknown): TrackSession[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value as TrackSession[];
};

const formatTime = (value: string): string => new Date(value).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

const formatDateTime = (value: string): string =>
  new Date(value).toLocaleString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const MapHistoryPage: React.FC = () => {
  const { createDir, listFiles, readFile, loading } = useFilesystem();

  const [sessions, setSessions] = useState<TrackSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string>("");

  const loadTodayHistory = async (): Promise<void> => {
    try {
      setLoadError("");

      await createDir({
        path: TRACKS_DIR,
        directory: Directory.Documents,
      });

      const files = await listFiles({
        path: TRACKS_DIR,
        directory: Directory.Documents,
      });

      const todayFileName = `${getTodayDateKey()}.json`;
      const fileExists = files.some((item) => (typeof item === "string" ? item : item.name) === todayFileName);

      if (!fileExists) {
        setSessions([]);
        setSelectedSessionId(null);
        return;
      }

      const content = await readFile({
        path: getTodayTracksFilePath(),
        directory: Directory.Documents,
        isJson: true,
      });

      const orderedSessions = toTrackSessions(content).sort(
        (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      );

      setSessions(orderedSessions);
      setSelectedSessionId((previousId) => {
        if (previousId && orderedSessions.some((session) => session.id === previousId)) {
          return previousId;
        }

        return orderedSessions[0]?.id ?? null;
      });
    } catch {
      setLoadError("No se pudo cargar el historial de recorridos de hoy.");
    }
  };

  useEffect(() => {
    void loadTodayHistory();
  }, []);

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId) ?? null,
    [selectedSessionId, sessions]
  );

  const selectedPath = useMemo(() => {
    if (!selectedSession) {
      return [] as Array<[number, number]>;
    }

    return selectedSession.points.map((point) => [point.latitude, point.longitude] as [number, number]);
  }, [selectedSession]);

  const selectedPosition: MapPoint | null = useMemo(() => {
    if (!selectedSession || selectedSession.points.length === 0) {
      return null;
    }

    const lastPoint = selectedSession.points[selectedSession.points.length - 1];
    return {
      latitude: lastPoint.latitude,
      longitude: lastPoint.longitude,
    };
  }, [selectedSession]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/sensor/map-tracking" />
          </IonButtons>
          <IonTitle>Historial de hoy</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="map-history-content">
        <IonCard className="history-summary-card">
          <IonCardHeader>
            <IonCardTitle>Resumen del dia</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>Recorridos guardados hoy</IonLabel>
                <IonBadge slot="end" color="primary">
                  {sessions.length}
                </IonBadge>
              </IonItem>
              <IonItem>
                <IonLabel>Fecha</IonLabel>
                <IonLabel slot="end">{getTodayDateKey()}</IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        <MapComponent
          position={selectedPosition}
          path={selectedPath}
          ready={Boolean(selectedPosition)}
          placeholder="Selecciona un recorrido para visualizarlo en el mapa."
          height="320px"
        />

        <IonButton expand="block" onClick={() => void loadTodayHistory()} className="history-action-button">
          Actualizar historial
        </IonButton>
        <IonButton expand="block" routerLink="/sensor/map-tracking" className="history-action-button">
          Volver al mapa
        </IonButton>

        {loading && (
          <IonText>
            <p className="history-message">Cargando historial...</p>
          </IonText>
        )}

        {loadError && (
          <IonText color="danger">
            <p className="history-message">{loadError}</p>
          </IonText>
        )}

        {sessions.length === 0 && !loading && (
          <IonText>
            <p className="history-message">Todavia no hay recorridos guardados en este dia.</p>
          </IonText>
        )}

        <IonList>
          {sessions.map((session, index) => (
            <IonItem
              key={session.id}
              button
              detail
              onClick={() => setSelectedSessionId(session.id)}
              color={selectedSessionId === session.id ? "light" : undefined}
            >
              <IonLabel>
                <h2>Recorrido {sessions.length - index} ({formatTime(session.startedAt)})</h2>
                <p>Inicio: {formatDateTime(session.startedAt)}</p>
                <p>Fin: {formatDateTime(session.endedAt)}</p>
                <p>Puntos: {session.points.length}</p>
                <p>Motivo de cierre: {session.endReason}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MapHistoryPage;