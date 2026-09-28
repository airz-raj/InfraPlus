"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getHotspots } from "@/lib/api";
import { HotspotGeoJSON } from "@/types/api";
import dynamic from "next/dynamic";
import KPIPanel from "./KPIPanel";
import AnalyticsCharts from "./AnalyticsCharts";
import { Button } from "@/components/ui/button";

const HotspotMap = dynamic(() => import("./HotspotMap"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-500">Loading Interactive Map...</div>
});

export default function DashboardLayout() {
  const [geoData, setGeoData] = useState<HotspotGeoJSON | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getHotspots();
        setGeoData(data);
      } catch (err) {
        console.error("Failed to load hotspots", err);
        // Fallback mock data if backend is offline
        setGeoData({
          type: "FeatureCollection",
          features: [
            { type: "Feature", geometry: { type: "Point", coordinates: [77.209, 28.6139] }, properties: { feature_type: "complaint", category: "water", severity: 5, status: "PENDING" } },
            { type: "Feature", geometry: { type: "Point", coordinates: [72.8777, 19.0760] }, properties: { feature_type: "complaint", category: "electricity", severity: 3, status: "PROCESSED" } },
            { type: "Feature", geometry: { type: "Point", coordinates: [77.1025, 28.7041] }, properties: { feature_type: "project", category: "roads", budget: 2500000, title: "Highway Renewal" } }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950">InfraPulse Dashboard</h1>
          <p className="text-sm text-slate-500">Live AI-Driven Infrastructure Demand Analytics</p>
        </div>
        <Link href="/">
          <Button variant="outline" className="font-semibold shadow-sm text-slate-700">Citizen Portal</Button>
        </Link>
      </header>

      <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6">
        <KPIPanel geoData={geoData} loading={loading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col relative z-0">
            <h2 className="text-lg font-bold mb-4 text-slate-800">Demand Hotspots & Infrastructure Projects</h2>
            <div className="flex-1 rounded-xl overflow-hidden border border-slate-200 relative min-h-[500px] z-0">
              {geoData && <HotspotMap data={geoData} />}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between relative z-0">
             <AnalyticsCharts geoData={geoData} />
          </div>
        </div>
      </main>
    </div>
  );
}
