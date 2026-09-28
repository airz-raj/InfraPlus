import { GoogleGenerativeAI } from "@google/generative-ai";

export async function processCitizenFeedback(text: string) {
  let aiResult = {
    intent: text,
    category: "unknown",
    severity: 1,
  };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("No GEMINI_API_KEY provided, returning mock processing.");
    return aiResult;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
    You are an AI for a Digital Public Good platform.
    Analyze the following citizen infrastructure complaint and extract:
    1. intent: a brief 3-5 word summary of the issue
    2. category: strictly one of ["water", "electricity", "roads", "transport", "sanitation"]
    3. severity: an integer from 1 (minor) to 5 (critical emergency)
    
    Return strictly in JSON format. Example: {"intent": "broken water pipe", "category": "water", "severity": 4}
    
    Text: ${text}
    `;
    
    const result = await model.generateContent(prompt);
    let resText = result.response.text().trim();
    if (resText.startsWith("\`\`\`json")) resText = resText.slice(7, -3);
    else if (resText.startsWith("\`\`\`")) resText = resText.slice(3, -3);
    
    const parsed = JSON.parse(resText.trim());
    return { ...aiResult, ...parsed };
  } catch (err) {
    console.error("Gemini API error", err);
    return aiResult;
  }
}
