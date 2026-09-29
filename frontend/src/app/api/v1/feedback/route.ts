import { NextResponse } from "next/server";
import { store } from "../store";
import { processCitizenFeedback } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const latitude = parseFloat(formData.get("latitude") as string) || 0;
    const longitude = parseFloat(formData.get("longitude") as string) || 0;

    // Simulate transcribing the audio file (Voice-to-Text)
    const simulatedText = "There is a massive pothole causing accidents on the main road.";
    
    // Process the simulated text using Gemini AI
    const aiResult = await processCitizenFeedback(simulatedText);

    const interaction = store.addInteraction({
      media_type: "audio",
      raw_intent: aiResult.intent,
      category: aiResult.category,
      severity: aiResult.severity,
      status: aiResult.severity >= 4 ? "PENDING" : "PROCESSED",
      lng: longitude,
      lat: latitude,
      location: aiResult.location,
      urgency: aiResult.urgency,
      tags: aiResult.tags,
    });

    return NextResponse.json({
      message: "Audio feedback logged successfully",
      interaction_id: interaction.id,
      status: interaction.status,
      category: interaction.category,
      severity: interaction.severity,
      location: interaction.location,
      urgency: interaction.urgency,
      tags: interaction.tags,
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ detail: "Failed to parse audio feedback" }, { status: 400 });
  }
}
