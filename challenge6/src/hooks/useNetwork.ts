import { useState, useEffect } from "react";
import { Network, ConnectionStatus } from "@capacitor/network";

const useNetwork = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  useEffect(() => {
    const checkInitialStatus = async () => {
      const status: ConnectionStatus = await Network.getStatus();
      setIsOnline(status.connected);
      setConnectionType(status.connectionType);
    };

    checkInitialStatus();

    let listener: any;

    const setupListener = async () => {
      listener = await Network.addListener(
        "networkStatusChange",
        (status: ConnectionStatus) => {
          setIsOnline(status.connected);
          setConnectionType(status.connectionType);
        }
      );
    };

    setupListener();

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, []);

  return { isOnline, connectionType };
};

export default useNetwork;