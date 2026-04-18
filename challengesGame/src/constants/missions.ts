import type { MissionDefinition } from "../types/game";

export const MISSIONS: MissionDefinition[] = [
  {
    id: 1,
    titulo: "Mision 1: Evidencia",
    descripcion: "Toma una foto y guardala para validar evidencia.",
    puntos: 100,
  },
  {
    id: 2,
    titulo: "Mision 2: Movimiento",
    descripcion: "Recorre al menos 30 metros desde tu punto inicial.",
    puntos: 150,
  },
  {
    id: 3,
    titulo: "Mision 3: Permanencia",
    descripcion: "Manten el dispositivo quieto durante 10 segundos.",
    puntos: 200,
  },
];
