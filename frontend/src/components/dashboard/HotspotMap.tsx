"use client";

import React, { useEffect, useRef } from "react";
import { HotspotGeoJSON } from "@/types/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix standard marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function HotspotMap({ data }: { data: HotspotGeoJSON }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // If a map already exists on this DOM node, destroy it first
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 4,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    // Add all features
    data.features.forEach((feature) => {
      const lat = feature.geometry.coordinates[1];
      const lng = feature.geometry.coordinates[0];

      if (feature.properties.feature_type === "project") {
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(
          `<div style="font-family:system-ui;"><strong style="font-size:13px;">${feature.properties.title || "Project"}</strong><br/><span style="color:#10b981;font-size:12px;font-weight:600;">Budget: ₹${feature.properties.budget?.toLocaleString("en-IN")}</span><br/><span style="color:#64748b;font-size:11px;text-transform:capitalize;">${feature.properties.category}</span></div>`
        );
      } else {
        const severity = feature.properties.severity || 1;
        const color = severity >= 4 ? "#ef4444" : severity >= 3 ? "#f97316" : "#3b82f6";

        const circle = L.circleMarker([lat, lng], {
          radius: severity * 3 + 4,
          fillColor: color,
          color: color,
          fillOpacity: 0.6,
          weight: 1.5,
        }).addTo(map);

        circle.bindPopup(
          `<div style="font-family:system-ui;"><strong style="font-size:13px;text-transform:capitalize;">${feature.properties.category} Issue</strong><br/><span style="font-size:12px;font-weight:600;">Severity: ${severity}/5</span><br/><span style="color:#64748b;font-size:11px;">Status: ${feature.properties.status}</span></div>`
        );
      }
    });

    mapRef.current = map;

    // Force Leaflet to recalculate tile positions after layout settles
    const timer = setTimeout(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
    };
  }, [data]);

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
}
