export type MissionId = 1 | 2 | 3;

export type MissionStatus = "pendiente" | "completada";

export type MissionDefinition = {
  id: MissionId;
  titulo: string;
  descripcion: string;
  puntos: number;
};

export type MissionProgress = MissionDefinition & {
  completed: boolean;
};

export type MissionViewModel = MissionDefinition & {
  estado: MissionStatus;
};

export type LocalProgressPayload = {
  points: number;
  missions: Array<{
    id: number;
    completed: boolean;
  }>;
};
