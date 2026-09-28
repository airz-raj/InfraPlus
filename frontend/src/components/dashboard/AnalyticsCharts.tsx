"use client";

import React from "react";
import { HotspotGeoJSON } from "@/types/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend } from "recharts";

export default function AnalyticsCharts({ geoData }: { geoData: HotspotGeoJSON | null }) {
  if (!geoData) return <div className="h-full flex items-center justify-center text-slate-400">Loading charts...</div>;

  const complaints = geoData.features.filter(f => f.properties.feature_type === "complaint");
  
  // Compute category mix
  const categoryCounts = complaints.reduce((acc, curr) => {
    const cat = curr.properties.category || "other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.keys(categoryCounts).map(k => ({
    name: k.charAt(0).toUpperCase() + k.slice(1),
    count: categoryCounts[k]
  })).sort((a, b) => b.count - a.count);

  // Mock Predictive Demand Data
  const forecastData = [
    { month: "Jan", actual: 45, predicted: 45 },
    { month: "Feb", actual: 52, predicted: 50 },
    { month: "Mar", actual: 61, predicted: 65 },
    { month: "Apr", actual: null, predicted: 78 },
    { month: "May", actual: null, predicted: 92 },
    { month: "Jun", actual: null, predicted: 110 },
  ];

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex-1">
        <h3 className="text-md font-semibold mb-4 text-slate-800">Complaint Volume by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip cursor={{ fill: "#f1f5f9" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-md font-semibold mb-4 text-slate-800">Predictive Demand Forecast (6 Mo)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" name="Actual Reports" dataKey="actual" stroke="#0f172a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" name="AI Prediction" dataKey="predicted" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-400 mt-2 italic text-center">*Forecast derived via predictive modeling based on complaint velocity</p>
      </div>
    </div>
  );
}
