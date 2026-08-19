"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

export default function LiveMap() {
  const [commuterLocation, setCommuterLocation] =
    useState<[number, number]>([
      21.1702,
      72.8311,
    ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCommuterLocation((previous) => [
        previous[0] + 0.0001,
        previous[1] + 0.0001,
      ]);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-gray-700">
      <MapContainer
        center={commuterLocation}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CircleMarker
          center={commuterLocation}
          radius={12}
          pathOptions={{
            color: "red",
            fillColor: "red",
            fillOpacity: 0.8,
          }}
        >
          <Popup>
            <strong>🚨 Commuter</strong>
            <br />
            Live emergency location
          </Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}