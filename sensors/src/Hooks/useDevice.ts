import { useEffect, useState } from "react";
import { Device, type BatteryInfo, type DeviceInfo } from "@capacitor/device";

export const useDevice = () => {
  const [battery, setBattery] = useState<BatteryInfo | null>(null);
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);

  const loadDeviceData = async () => {
    try {
      setLoading(true);

      const batteryInfo = await Device.getBatteryInfo();
      const deviceInfo = await Device.getInfo();
      const id = await Device.getId();

      setBattery(batteryInfo);
      setInfo(deviceInfo);
      setDeviceId(id.identifier);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeviceData();
  }, []);

  return {
    battery,
    info,
    deviceId,
    loading,
    error,
    refresh: loadDeviceData,
  };
};