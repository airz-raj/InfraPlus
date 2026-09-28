import { FeedbackResponse, HotspotGeoJSON } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

async function readApiError(response: Response, fallback: string): Promise<never> {
  let detail = fallback;
  try {
    const body = (await response.json()) as { detail?: string | unknown };
    if (typeof body.detail === "string" && body.detail.trim()) {
      detail = body.detail;
    }
  } catch {
    /* keep fallback */
  }
  throw new Error(detail);
}

export async function submitAudioFeedback(
  audioBlob: Blob,
  latitude?: number,
  longitude?: number,
  userId?: number
): Promise<FeedbackResponse> {
  const formData = new FormData();
  formData.append("audio_file", audioBlob, "recording.webm");

  if (latitude !== undefined) formData.append("latitude", latitude.toString());
  if (longitude !== undefined) formData.append("longitude", longitude.toString());
  if (userId !== undefined) formData.append("user_id", userId.toString());

  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    await readApiError(response, `Failed to submit audio (${response.status})`);
  }

  return response.json();
}

export async function submitTextFeedback(
  text: string,
  latitude?: number,
  longitude?: number,
  userId?: number
): Promise<FeedbackResponse> {
  const response = await fetch(`${API_BASE_URL}/feedback/text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      latitude,
      longitude,
      user_id: userId,
    }),
  });

  if (!response.ok) {
    await readApiError(response, `Failed to submit text (${response.status})`);
  }

  return response.json();
}

export async function getHotspots(
  category?: string,
  minSeverity?: number
): Promise<HotspotGeoJSON> {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (minSeverity !== undefined) params.append("min_severity", minSeverity.toString());

  const response = await fetch(
    `${API_BASE_URL}/analytics/hotspots?${params.toString()}`
  );

  if (!response.ok) {
    await readApiError(response, `Failed to fetch hotspots (${response.status})`);
  }

  return response.json();
}

export async function getPredictiveDemand(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/analytics/predictive-demand`);
  if (!response.ok) {
    await readApiError(response, `Failed to fetch predictive demand (${response.status})`);
  }
  return response.json();
}
