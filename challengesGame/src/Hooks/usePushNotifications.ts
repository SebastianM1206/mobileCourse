import { useEffect, useState } from "react";
import {
  PushNotifications,
  type PushNotificationSchema,
} from "@capacitor/push-notifications";

export const usePushNotifications = () => {
  const [token, setToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<PushNotificationSchema | null>(null);
  const [error, setError] = useState<unknown>(null);

  const requestPermission = async (): Promise<void> => {
    const result = await PushNotifications.requestPermissions();

    if (result.receive === "granted") {
      await PushNotifications.register();
    }
  };

  useEffect(() => {
    PushNotifications.addListener("registration", (token) => {
      console.log("Token:", token.value);
      setToken(token.value);
    });

    PushNotifications.addListener("registrationError", (err) => {
      setError(err);
    });

    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log("Notificación:", notification);
        setNotification(notification);
      }
    );

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (action) => {
        console.log("Click:", action);
      }
    );

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, []);

  return {
    token,
    notification,
    error,
    requestPermission,
  };
};