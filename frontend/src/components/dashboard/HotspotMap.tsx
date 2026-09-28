"use client";

import React, { useMemo } from "react";
import { HotspotGeoJSON } from "@/types/api";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix standard marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function HotspotMap({ data }: { data: HotspotGeoJSON }) {
  const defaultCenter: [number, number] = [20.5937, 78.9629];

  // Unique key forces a fresh MapContainer when data changes,
  // preventing "Map container is already initialized" in React Strict Mode.
  const mapKey = useMemo(
    () => `map-${data.features.length}-${Date.now()}`,
    [data.features.length]
  );

  return (
    <MapContainer
      key={mapKey}
      center={defaultCenter}
      zoom={4}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {data.features.map((feature, idx) => {
        const coords: [number, number] = [
          feature.geometry.coordinates[1],
          feature.geometry.coordinates[0],
        ];

        if (feature.properties.feature_type === "project") {
          return (
            <Marker key={`project-${idx}`} position={coords}>
              <Popup>
                <div className="font-sans text-slate-900">
                  <h3 className="font-bold text-sm">{feature.properties.title || "Project"}</h3>
                  <p className="text-xs text-emerald-600 font-semibold">Budget: ₹{feature.properties.budget?.toLocaleString("en-IN")}</p>
                  <p className="text-xs capitalize text-slate-500">{feature.properties.category}</p>
                </div>
              </Popup>
            </Marker>
          );
        } else {
          const severity = feature.properties.severity || 1;
          const color = severity >= 4 ? "#ef4444" : severity >= 3 ? "#f97316" : "#3b82f6";

          return (
            <CircleMarker
              key={`complaint-${idx}`}
              center={coords}
              radius={severity * 3 + 4}
              pathOptions={{ fillColor: color, color: color, fillOpacity: 0.6, weight: 1.5 }}
            >
              <Popup>
                <div className="font-sans text-slate-900">
                  <h3 className="font-bold capitalize text-sm">{feature.properties.category} Issue</h3>
                  <p className="text-xs font-semibold">Severity: {severity}/5</p>
                  <p className="text-xs text-slate-500">Status: {feature.properties.status}</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        }
      })}
    </MapContainer>
  );
}

