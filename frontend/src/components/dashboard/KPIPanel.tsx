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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300 group">
        <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl group-hover:bg-red-500/20 group-hover:scale-110 transition-all duration-300 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]"><AlertTriangle size={28} /></div>
        <div>
          <p className="text-xs text-indigo-200/60 font-bold uppercase tracking-wider mb-1">Critical Issues</p>
          <p className="text-3xl font-black text-slate-100">{highSeverity}</p>
        </div>
      </div>
      <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300 group">
        <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]"><FileWarning size={28} /></div>
        <div>
          <p className="text-xs text-indigo-200/60 font-bold uppercase tracking-wider mb-1">Total Complaints</p>
          <p className="text-3xl font-black text-slate-100">{complaints.length}</p>
        </div>
      </div>
      <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300 group">
        <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]"><HardHat size={28} /></div>
        <div>
          <p className="text-xs text-indigo-200/60 font-bold uppercase tracking-wider mb-1">Active Projects</p>
          <p className="text-3xl font-black text-slate-100">{projects.length}</p>
        </div>
      </div>
      <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300 group">
        <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-300 shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]"><TrendingUp size={28} /></div>
        <div>
          <p className="text-xs text-indigo-200/60 font-bold uppercase tracking-wider mb-1">Avg Severity</p>
          <p className="text-3xl font-black text-slate-100">
            {complaints.length > 0 
              ? (complaints.reduce((acc, curr) => acc + (curr.properties.severity || 0), 0) / complaints.length).toFixed(1)
              : "0"}
          </p>
        </div>
      </div>
    </div>
  );
}
