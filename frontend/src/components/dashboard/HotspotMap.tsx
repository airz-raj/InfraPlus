"use client";

import React from "react";
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
  const defaultCenter: [number, number] = [20.5937, 78.9629]; // Default to roughly India for demo

  return (
    <MapContainer center={defaultCenter} zoom={4} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {data.features.map((feature, idx) => {
        const coords: [number, number] = [
          feature.geometry.coordinates[1], // lat
          feature.geometry.coordinates[0], // lng
        ];
        
        if (feature.properties.feature_type === "project") {
          return (
            <Marker key={idx} position={coords}>
              <Popup>
                <div className="font-sans">
                  <h3 className="font-bold">{feature.properties.title || "Project"}</h3>
                  <p className="text-sm text-emerald-600">Budget: ${feature.properties.budget?.toLocaleString()}</p>
                  <p className="text-xs">{feature.properties.category}</p>
                </div>
              </Popup>
            </Marker>
          );
        } else {
          const severity = feature.properties.severity || 1;
          const color = severity >= 4 ? "#ef4444" : severity >= 3 ? "#f97316" : "#3b82f6";
          
          return (
            <CircleMarker 
              key={idx} 
              center={coords} 
              radius={severity * 3 + 2}
              pathOptions={{ fillColor: color, color: color, fillOpacity: 0.7 }}
            >
              <Popup>
                <div className="font-sans">
                  <h3 className="font-bold capitalize">{feature.properties.category} Issue</h3>
                  <p className="text-sm">Severity: {severity}/5</p>
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
