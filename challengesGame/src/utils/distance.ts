const EARTH_RADIUS_METERS = 6371000;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

export const calculateDistanceMeters = (
  startLatitude: number,
  startLongitude: number,
  endLatitude: number,
  endLongitude: number
): number => {
  const latitudeDelta = toRadians(endLatitude - startLatitude);
  const longitudeDelta = toRadians(endLongitude - startLongitude);

  const startLatitudeRadians = toRadians(startLatitude);
  const endLatitudeRadians = toRadians(endLatitude);

  const a =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(startLatitudeRadians) *
      Math.cos(endLatitudeRadians) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
};
