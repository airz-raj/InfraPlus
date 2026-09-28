import { NextResponse } from "next/server";
import { store } from "../../store";
// Re-use text logic for mock audio processing
import { POST as processText } from "./text/route";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    // Simulate transcribing the audio file
    const simulatedText = "There is a massive pothole causing accidents on the main road.";
    const latitude = parseFloat(formData.get("latitude") as string) || 0;
    const longitude = parseFloat(formData.get("longitude") as string) || 0;

    const mockRequest = new Request("http://localhost/api/v1/feedback/text", {
      method: "POST",
      body: JSON.stringify({ text: simulatedText, latitude, longitude })
    });

    return await processText(mockRequest);
  } catch (error) {
    return NextResponse.json({ detail: "Failed to parse audio feedback" }, { status: 400 });
  }
}
