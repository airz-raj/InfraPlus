import { NextResponse } from "next/server";
import { store } from "../../store";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, latitude, longitude } = body;

    let aiResult = {
      intent: text,
      category: "unknown",
      severity: 1,
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
        Extract the intent, category (water, electricity, roads, transport, sanitation), location, and severity (1-5) from the following citizen complaint.
        Return strictly in JSON format like {"intent": "problem", "category": "water", "severity": 4}.
        
        Text: ${text}
        `;
        const result = await model.generateContent(prompt);
        let resText = result.response.text().trim();
        if (resText.startsWith("\`\`\`json")) resText = resText.slice(7, -3);
        else if (resText.startsWith("\`\`\`")) resText = resText.slice(3, -3);
        
        const parsed = JSON.parse(resText.trim());
        aiResult = { ...aiResult, ...parsed };
      } catch (err) {
        console.error("Gemini API error", err);
      }
    }

    const interaction = store.addInteraction({
      media_type: "text",
      raw_intent: aiResult.intent,
      category: aiResult.category,
      severity: aiResult.severity,
      status: "PENDING",
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
