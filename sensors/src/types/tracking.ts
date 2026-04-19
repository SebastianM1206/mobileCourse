export type TrackPoint = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  speed: number | null;
  timestamp: string;
};

export type TrackSession = {
  id: string;
  startedAt: string;
  endedAt: string;
  endReason: string;
  points: TrackPoint[];
};