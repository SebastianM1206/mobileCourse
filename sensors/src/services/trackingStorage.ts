export const TRACKS_DIR = "tracks";

export const getTodayDateKey = (): string => new Date().toISOString().slice(0, 10);

export const getTodayTracksFilePath = (): string => `${TRACKS_DIR}/${getTodayDateKey()}.json`;