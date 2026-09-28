import React from "react";
import { HotspotGeoJSON } from "@/types/api";
import { AlertTriangle, HardHat, FileWarning, TrendingUp } from "lucide-react";

export default function KPIPanel({ geoData, loading }: { geoData: HotspotGeoJSON | null; loading: boolean }) {
  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><div className="h-24 bg-slate-200 animate-pulse rounded-xl col-span-full" /></div>;
  }

  const complaints = geoData?.features.filter(f => f.properties.feature_type === "complaint") || [];
  const projects = geoData?.features.filter(f => f.properties.feature_type === "project") || [];
  const highSeverity = complaints.filter(f => (f.properties.severity || 0) >= 4).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-red-100 text-red-600 rounded-lg"><AlertTriangle size={24} /></div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Critical Issues</p>
          <p className="text-2xl font-bold">{highSeverity}</p>
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><FileWarning size={24} /></div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Total Complaints</p>
          <p className="text-2xl font-bold">{complaints.length}</p>
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><HardHat size={24} /></div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Active Projects</p>
          <p className="text-2xl font-bold">{projects.length}</p>
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><TrendingUp size={24} /></div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Avg Severity</p>
          <p className="text-2xl font-bold">
            {complaints.length > 0 
              ? (complaints.reduce((acc, curr) => acc + (curr.properties.severity || 0), 0) / complaints.length).toFixed(1)
              : "0"}
          </p>
        </div>
      </div>
    </div>
  );
}
