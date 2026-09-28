import { NextResponse } from "next/server";
import { store } from "../../store";
import { processCitizenFeedback } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, latitude, longitude } = body;

    const aiResult = await processCitizenFeedback(text);

    const interaction = store.addInteraction({
      media_type: "text",
      raw_intent: aiResult.intent,
      category: aiResult.category,
      severity: aiResult.severity,
      status: aiResult.severity >= 4 ? "PENDING" : "PROCESSED",
      lng: longitude || 0,
      lat: latitude || 0,
    });

    return NextResponse.json({
      message: "Feedback logged successfully",
      interaction_id: interaction.id,
      status: interaction.status,
      category: interaction.category,
      severity: interaction.severity,
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ detail: "Failed to parse text feedback" }, { status: 400 });
  }
}
