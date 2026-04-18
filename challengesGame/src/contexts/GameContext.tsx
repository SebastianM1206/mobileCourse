import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { MISSIONS } from "../constants/missions";
import { db } from "../firebase/firebase";
import { GameContext, type GameContextValue } from "./game-context";
import { useLocalNotifications } from "../Hooks/useLocalNotifications";
import type {
  LocalProgressPayload,
  MissionId,
  MissionProgress,
  MissionViewModel,
} from "../types/game";
import { useAuth } from "../Hooks/useAuth";

type GameState = {
  missions: MissionProgress[];
  points: number;
  photoEvidence: string | null;
};

type RemoteProgressPayload = {
  points: number;
  missions: Array<{
    id: number;
    completed: boolean;
  }>;
};

const LEADERBOARD_COLLECTION = "leaderboard";

const getStorageKey = (uid: string): string => `missions-progress-${uid}`;
const getPhotoKey = (uid: string): string => `missions-photo-${uid}`;

const createInitialState = (): GameState => {
  const missionProgress: MissionProgress[] = MISSIONS.map((mission) => ({
    ...mission,
    completed: false,
  }));

  return {
    missions: missionProgress,
    points: 0,
    photoEvidence: null,
  };
};

const mapMissionPayload = (
  payload: LocalProgressPayload | RemoteProgressPayload | null
): Map<number, boolean> => {
  if (!payload) {
    return new Map<number, boolean>();
  }

  return new Map<number, boolean>(
    payload.missions.map((mission) => [Number(mission.id), Boolean(mission.completed)])
  );
};

const computePoints = (missions: MissionProgress[]): number =>
  missions.reduce((total, mission) => {
    if (!mission.completed) {
      return total;
    }

    return total + mission.puntos;
  }, 0);

const buildMergedMissions = (
  localPayload: LocalProgressPayload | null,
  remotePayload: RemoteProgressPayload | null
): MissionProgress[] => {
  const localMap = mapMissionPayload(localPayload);
  const remoteMap = mapMissionPayload(remotePayload);

  return MISSIONS.map((mission) => ({
    ...mission,
    completed: Boolean(localMap.get(mission.id)) || Boolean(remoteMap.get(mission.id)),
  }));
};

const toViewModel = (missions: MissionProgress[]): MissionViewModel[] =>
  missions.map((mission) => ({
    id: mission.id,
    titulo: mission.titulo,
    descripcion: mission.descripcion,
    puntos: mission.puntos,
    estado: mission.completed ? "completada" : "pendiente",
  }));

const readLocalProgress = (uid: string): LocalProgressPayload | null => {
  const raw = localStorage.getItem(getStorageKey(uid));

  if (!raw) {
    return null;
  }

  try {
    const payload = JSON.parse(raw) as LocalProgressPayload;

    if (typeof payload.points !== "number" || !Array.isArray(payload.missions)) {
      return null;
    }

    return {
      points: payload.points,
      missions: payload.missions.map((mission) => ({
        id: Number(mission.id),
        completed: Boolean(mission.completed),
      })),
    };
  } catch {
    return null;
  }
};

const readLocalPhoto = (uid: string): string | null => {
  const raw = localStorage.getItem(getPhotoKey(uid));
  return raw || null;
};

const writeLocalProgress = (uid: string, state: GameState): void => {
  const payload: LocalProgressPayload = {
    points: state.points,
    missions: state.missions.map((mission) => ({
      id: mission.id,
      completed: mission.completed,
    })),
  };

  localStorage.setItem(getStorageKey(uid), JSON.stringify(payload));

  if (state.photoEvidence) {
    localStorage.setItem(getPhotoKey(uid), state.photoEvidence);
    return;
  }

  localStorage.removeItem(getPhotoKey(uid));
};

type GameProviderProps = {
  children: ReactNode;
};

export const GameProvider = ({ children }: GameProviderProps) => {
  const { user } = useAuth();
  const { sendNotification, requestPermission } = useLocalNotifications();

  const [state, setState] = useState<GameState>(createInitialState);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  const stateRef = useRef<GameState>(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (user) {
      return;
    }

    setState((previousState) => {
      const isAlreadyReset =
        previousState.points === 0 &&
        previousState.photoEvidence === null &&
        previousState.missions.every((mission) => !mission.completed);

      if (isAlreadyReset) {
        return previousState;
      }

      return createInitialState();
    });

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    writeLocalProgress(user.uid, state);
  }, [state, user]);

  const syncStateToFirebase = useCallback(
    async (nextState: GameState): Promise<void> => {
      if (!user) {
        return;
      }

      try {
        await setDoc(
          doc(db, LEADERBOARD_COLLECTION, user.uid),
          {
            uid: user.uid,
            email: user.email ?? "Sin correo",
            points: nextState.points,
            missions: nextState.missions.map((mission) => ({
              id: mission.id,
              completed: mission.completed,
            })),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        setSyncError(null);
      } catch {
        setSyncError("No se pudo sincronizar con Firebase.");
      }
    },
    [user]
  );

  useEffect(() => {
    if (!user) {
      return;
    }

    void requestPermission();
  }, [user?.uid]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadProgress = async (): Promise<void> => {
      setLoading(true);

      const localPayload = readLocalProgress(user.uid);
      const localPhoto = readLocalPhoto(user.uid);
      let remotePayload: RemoteProgressPayload | null = null;

      try {
        const snapshot = await getDoc(doc(db, LEADERBOARD_COLLECTION, user.uid));

        if (snapshot.exists()) {
          const data = snapshot.data() as {
            points?: number;
            missions?: Array<{ id?: number; completed?: boolean }>;
          };

          remotePayload = {
            points: Number(data.points ?? 0),
            missions: Array.isArray(data.missions)
              ? data.missions.map((mission) => ({
                  id: Number(mission.id ?? 0),
                  completed: Boolean(mission.completed),
                }))
              : [],
          };
        }

        setSyncError(null);
      } catch {
        setSyncError("No se pudo cargar el progreso remoto.");
      }

      const mergedMissions = buildMergedMissions(localPayload, remotePayload);
      const nextState: GameState = {
        missions: mergedMissions,
        points: computePoints(mergedMissions),
        photoEvidence: localPhoto,
      };

      if (cancelled) {
        return;
      }

      stateRef.current = nextState;
      setState(nextState);
      setLoading(false);
      await syncStateToFirebase(nextState);
    };

    void loadProgress();

    return () => {
      cancelled = true;
    };
  }, [syncStateToFirebase, user]);

  const completeMission = useCallback(
    async (missionId: MissionId): Promise<boolean> => {
      if (!user) {
        return false;
      }

      const currentState = stateRef.current;
      const targetMission = currentState.missions.find((mission) => mission.id === missionId);

      if (!targetMission || targetMission.completed) {
        return false;
      }

      const updatedMissions = currentState.missions.map((mission) => {
        if (mission.id !== missionId) {
          return mission;
        }

        return {
          ...mission,
          completed: true,
        };
      });

      const nextState: GameState = {
        ...currentState,
        missions: updatedMissions,
        points: computePoints(updatedMissions),
      };

      stateRef.current = nextState;
      setState(nextState);

      await sendNotification({
        title: "Mision completada",
        body: "Has completado una mision",
      });

      const completedCount = updatedMissions.filter((mission) => mission.completed).length;
      const remaining = MISSIONS.length - completedCount;

      if (remaining === 1) {
        await sendNotification({
          title: "Casi terminas",
          body: "Te falta 1 mision para completar",
        });
      }

      await syncStateToFirebase(nextState);
      return true;
    },
    [sendNotification, syncStateToFirebase, user]
  );

  const savePhotoEvidence = useCallback((photoPath: string): void => {
    const currentState = stateRef.current;
    const nextState: GameState = {
      ...currentState,
      photoEvidence: photoPath,
    };

    stateRef.current = nextState;
    setState(nextState);
  }, []);

  const clearSyncError = (): void => {
    setSyncError(null);
  };

  const completedCount = useMemo(
    () => state.missions.filter((mission) => mission.completed).length,
    [state.missions]
  );

  const progressPercent = useMemo(() => {
    if (MISSIONS.length === 0) {
      return 0;
    }

    return (completedCount / MISSIONS.length) * 100;
  }, [completedCount]);

  const value = useMemo<GameContextValue>(
    () => ({
      missions: toViewModel(state.missions),
      points: state.points,
      completedCount,
      progressPercent,
      photoEvidence: state.photoEvidence,
      loading,
      syncError,
      completeMission,
      savePhotoEvidence,
      clearSyncError,
    }),
    [
      clearSyncError,
      completeMission,
      completedCount,
      loading,
      progressPercent,
      state.missions,
      state.photoEvidence,
      state.points,
      syncError,
      savePhotoEvidence,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
