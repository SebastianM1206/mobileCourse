import { createContext } from "react";
import type { MissionId, MissionViewModel } from "../types/game";

export type GameContextValue = {
  missions: MissionViewModel[];
  points: number;
  completedCount: number;
  progressPercent: number;
  photoEvidence: string | null;
  loading: boolean;
  syncError: string | null;
  completeMission: (missionId: MissionId) => Promise<boolean>;
  savePhotoEvidence: (photoPath: string) => void;
  clearSyncError: () => void;
};

export const GameContext = createContext<GameContextValue | undefined>(undefined);
