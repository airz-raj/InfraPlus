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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-50"></div>
      
      <header className="bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">InfraPulse Command Center</h1>
            <p className="text-xs font-medium text-indigo-200/60 uppercase tracking-widest mt-0.5">Live AI Analytics Engine</p>
          </div>
        </div>
        <Link href="/">
          <Button variant="outline" className="font-bold bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10 hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)] rounded-full px-6">
            Citizen Portal
          </Button>
        </Link>
      </header>

      <main className="flex-1 p-6 max-w-[1800px] mx-auto w-full flex flex-col gap-6 relative z-10">
        <KPIPanel geoData={geoData} loading={loading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5 p-6 flex flex-col relative z-0 group hover:border-white/10 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-3xl -z-10"></div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Demand Hotspots & Infrastructure Projects
              </h2>
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 relative min-h-[550px] shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] z-0">
              {geoData && <HotspotMap data={geoData} />}
            </div>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5 p-6 flex flex-col justify-between relative z-0 group hover:border-white/10 transition-colors duration-500">
             <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5 rounded-3xl -z-10"></div>
             <h2 className="text-xl font-bold text-slate-100 tracking-tight mb-6">Predictive AI Analysis</h2>
             <AnalyticsCharts geoData={geoData} />
          </div>
        </div>
      </main>
    </div>
  );
}
