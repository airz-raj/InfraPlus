import { NextResponse } from "next/server";
import { store } from "../../store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category")?.toLowerCase();
  const minSeverity = parseInt(searchParams.get("min_severity") || "0");

  const features = [];

  for (const i of store.interactions) {
    if (category && i.category.toLowerCase() !== category) continue;
    if (minSeverity && i.severity < minSeverity) continue;

    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: [i.lng, i.lat] },
      properties: {
        interaction_id: i.id,
        category: i.category,
        severity: i.severity,
        status: i.status,
        feature_type: "complaint"
      }
    });
  }

  for (const p of store.projects) {
    if (category && p.category.toLowerCase() !== category) continue;

    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      properties: {
        category: p.category,
        feature_type: "project",
        title: p.title,
        budget: p.budget,
        description: p.description
      }
    });
  }

  return NextResponse.json({ type: "FeatureCollection", features });
}
