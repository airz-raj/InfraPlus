export interface FeedbackRequest {
  text?: string;
  userId?: number;
  latitude?: number;
  longitude?: number;
}

export interface FeedbackResponse {
  id: number;
  media_type: string;
  category: string;
  severity: number;
  status: string;
  raw_intent?: string;
  location?: string;
  urgency?: string;
  tags?: string[];
  created_at: string;
}

export interface HotspotFeatureProperties {
  interaction_id?: number;
  category: string;
  severity?: number;
  status?: string;
  feature_type: "complaint" | "project";
  title?: string;
  budget?: number;
  description?: string;
}

export interface HotspotFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: HotspotFeatureProperties;
}

export interface HotspotGeoJSON {
  type: "FeatureCollection";
  features: HotspotFeature[];
}
