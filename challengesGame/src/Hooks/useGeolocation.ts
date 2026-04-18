import { useState } from "react";
import { Geolocation } from "@capacitor/geolocation";

type GeolocationCoords = Awaited<ReturnType<typeof Geolocation.getCurrentPosition>>["coords"];

export const useGeolocation = () => {
  const [position, setPosition] = useState<GeolocationCoords | null>(null);
  const [watchId, setWatchId] = useState<string | null>(null);
  const [error, setError] = useState<unknown | null>(null);

  const getCurrentLocation = async (): Promise<GeolocationCoords | null> => {
    try {
      const pos = await Geolocation.getCurrentPosition();
      setPosition(pos.coords);
      setError(null);
      return pos.coords;
    } catch (err) {
      setError(err);
      return null;
    }
  };

  const startTracking = async (): Promise<boolean> => {
    try {
      const id = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (pos, err) => {
          if (err) {
            setError(err);
            return;
          }

          if (pos) {
            setPosition(pos.coords);
          }
        }
      );

      setWatchId(id);
      setError(null);
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  };

  const stopTracking = async (): Promise<void> => {
    try {
      if (watchId) {
        await Geolocation.clearWatch({ id: watchId });
        setWatchId(null);
      }
    } catch (err) {
      setError(err);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    position,
    error,
    getCurrentLocation,
    startTracking,
    stopTracking,
    clearError,
  };
};