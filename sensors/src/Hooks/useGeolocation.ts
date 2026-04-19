import { useRef, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";

type GeolocationCoords = Awaited<ReturnType<typeof Geolocation.getCurrentPosition>>["coords"];

export const useGeolocation = () => {
  const [position, setPosition] = useState<GeolocationCoords | null>(null);
  const [watchId, setWatchId] = useState<string | null>(null);
  const [error, setError] = useState<unknown | null>(null);
  const watchIdRef = useRef<string | null>(null);

  const getCurrentLocation = async () => {
    try {
      const pos = await Geolocation.getCurrentPosition();
      setPosition(pos.coords);
    } catch (err) {
      setError(err);
    }
  };

  const startTracking = async () => {
    if (watchIdRef.current) {
      return;
    }

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

      watchIdRef.current = id;
      setWatchId(id);
    } catch (err) {
      setError(err);
    }
  };

  const stopTracking = async () => {
    const currentWatchId = watchIdRef.current;

    if (currentWatchId) {
      await Geolocation.clearWatch({ id: currentWatchId });
      watchIdRef.current = null;
      setWatchId(null);
    }
  };

  return {
    position,
    watchId,
    isTracking: Boolean(watchId),
    error,
    getCurrentLocation,
    startTracking,
    stopTracking,
  };
};