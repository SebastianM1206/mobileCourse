import { useEffect, useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";

type NotificationPayload = {
  id?: number;
  title?: string;
  body?: string;
};

type ScheduledNotificationPayload = NotificationPayload & {
  seconds?: number;
};

type LocalNotificationPermission = Awaited<
  ReturnType<typeof LocalNotifications.checkPermissions>
>["display"];

export const useLocalNotifications = () => {
  const [permission, setPermission] = useState<LocalNotificationPermission | null>(null);
  const [error, setError] = useState<unknown>(null);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const result = await LocalNotifications.requestPermissions();
      setPermission(result.display);
      return result.display === "granted";
    } catch (err) {
      setError(err);
      return false;
    }
  };

  const checkPermission = async (): Promise<void> => {
    try {
      const result = await LocalNotifications.checkPermissions();
      setPermission(result.display);
    } catch (err) {
      setError(err);
    }
  };

  const sendNotification = async ({
    id = Date.now(),
    title = "Notificación",
    body = "Mensaje",
  }: NotificationPayload = {}): Promise<void> => {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id,
            title,
            body,
          },
        ],
      });
    } catch (err) {
      setError(err);
    }
  };

  const scheduleNotification = async ({
    id = Date.now(),
    title = "Recordatorio",
    body = "Tienes algo pendiente",
    seconds = 5,
  }: ScheduledNotificationPayload = {}): Promise<void> => {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id,
            title,
            body,
            schedule: {
              at: new Date(Date.now() + seconds * 1000),
            },
          },
        ],
      });
    } catch (err) {
      setError(err);
    }
  };

  const cancelNotification = async (id: number): Promise<void> => {
    try {
      await LocalNotifications.cancel({
        notifications: [{ id }],
      });
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    const listenerPromise = LocalNotifications.addListener(
      "localNotificationActionPerformed",
      (notification) => {
        console.log("Notificación tocada:", notification);
      }
    );

    return () => {
      void listenerPromise.then((listener) => listener.remove());
    };
  }, []);

  useEffect(() => {
    checkPermission();
  }, []);

  return {
    permission,
    error,
    requestPermission,
    checkPermission,
    sendNotification,
    scheduleNotification,
    cancelNotification,
  };
};