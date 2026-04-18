import { useState } from "react";
import { Camera, CameraResultType } from "@capacitor/camera";

export const useCamera = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<unknown | null>(null);

  const takePhoto = async (): Promise<string | null> => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri,
      });

      const nextPhoto = image.webPath ?? null;
      setPhoto(nextPhoto);
      setError(null);

      return nextPhoto;
    } catch (err) {
      setError(err);
      return null;
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return { photo, error, takePhoto, clearError };
};