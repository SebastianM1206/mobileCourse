import { useEffect } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import "./MapComponent.css";

export type MapPoint = {
  latitude: number;
  longitude: number;
};

type MapComponentProps = {
  position: MapPoint | null;
  path?: Array<[number, number]>;
  ready?: boolean;
  zoom?: number;
  placeholder?: string;
  height?: string;
};

const RecenterMap = ({ position }: { position: MapPoint }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([position.latitude, position.longitude]);
  }, [map, position.latitude, position.longitude]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  position,
  path = [],
  ready = Boolean(position),
  zoom = 17,
  placeholder = "Obteniendo ubicacion...",
  height = "360px",
}) => {
  if (!ready || !position) {
    return (
      <div className="map-container map-placeholder" style={{ height }}>
        <p>{placeholder}</p>
      </div>
    );
  }

  return (
    <div className="map-container" style={{ height }}>
        <MapContainer
          center={[position.latitude, position.longitude]}
          zoom={zoom}
          className="leaflet-wrapper"
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RecenterMap position={position} />
          <Marker position={[position.latitude, position.longitude]} />
          {path.length > 1 && <Polyline positions={path} />}
        </MapContainer>
    </div>
  );
};

export default MapComponent;