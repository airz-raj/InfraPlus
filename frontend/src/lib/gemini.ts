import { GoogleGenerativeAI } from "@google/generative-ai";

export async function processCitizenFeedback(text: string) {
  let aiResult = {
    intent: text,
    category: "unknown",
    severity: 1,
    location: "Unknown Location",
    urgency: "Standard",
    tags: [] as string[],
  };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("No GEMINI_API_KEY provided, using advanced regex/fuzzy processing.");
    return fallbackRegexProcessor(text);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
    You are an AI for a Digital Public Good platform.
    Analyze the following citizen infrastructure complaint and deeply extract:
    1. intent: a brief 3-5 word summary of the core issue
    2. category: strictly one of ["water", "electricity", "roads", "transport", "sanitation"]
    3. severity: an integer from 1 (minor) to 5 (critical emergency)
    4. location: specific street, area, or city mentioned. Use "Unspecified" if none found.
    5. urgency: strictly one of ["Low", "Medium", "High", "Critical"]
    6. tags: an array of 2-3 contextual string tags (e.g. ["pothole", "safety risk", "traffic jam"])
    
    Return strictly in JSON format. Example: {"intent": "broken water pipe", "category": "water", "severity": 4, "location": "Downtown Metro Station", "urgency": "High", "tags": ["flooding", "pipe burst"]}
    
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
    return fallbackRegexProcessor(text);
  }
}

function fallbackRegexProcessor(text: string) {
  const lower = text.toLowerCase();
  
  let category = "unknown";
  if (/(water|pipe|leak|pump|dry|drain|sewage|sanitation)/.test(lower)) category = "water";
  else if (/(power|electricity|light|wire|pole|current|blackout|outage)/.test(lower)) category = "electricity";
  else if (/(road|pothole|street|highway|bridge|asphalt|traffic|accident)/.test(lower)) category = "roads";
  else if (/(bus|train|metro|transport|station)/.test(lower)) category = "transport";
  
  if (category === "unknown" && /(trash|garbage|waste|clean)/.test(lower)) category = "sanitation";

  let severity = 1;
  let urgency = "Low";
  if (/(emergency|massive|huge|critical|danger|accident|death|dying|crash)/.test(lower)) { severity = 5; urgency = "Critical"; }
  else if (/(major|bad|terrible|days|broken|stopped|blocked)/.test(lower)) { severity = 4; urgency = "High"; }
  else if (/(issue|problem|need|repair|fix)/.test(lower)) { severity = 3; urgency = "Medium"; }
  else if (/(minor|small|slight)/.test(lower)) { severity = 2; urgency = "Low"; }

  // Extract a faux location by finding words after "in", "at", "near", "by", "on"
  let location = "Unspecified Zone";
  const locMatch = lower.match(/(?:in|at|near|by|on) ([a-z0-9\s]{4,20})(?:\b|$)/i);
  if (locMatch && locMatch[1]) {
    location = locMatch[1].trim().replace(/\b\w/g, l => l.toUpperCase()); // title case
  } else {
    // If no preposition found, assume it might be a general ward/street if mentioned
    if (/(street|road|ward|district|block|nagar)/.test(lower)) {
      location = "Local District";
    }
  }

  // Generate some smart tags based on keywords
  const tags: string[] = [];
  if (/(accident|danger|crash|risk)/.test(lower)) tags.push("Safety Hazard");
  if (/(traffic|jam|blocked)/.test(lower)) tags.push("Traffic Disruption");
  if (/(days|weeks|months)/.test(lower)) tags.push("Chronic Issue");
  if (/(water|leak|flood)/.test(lower)) tags.push("Resource Waste");
  if (tags.length === 0) tags.push("Citizen Report");

  let intent = text.slice(0, 35).trim();
  if (text.length > 35) intent += "...";

  return {
    intent,
    category,
    severity,
    location,
    urgency,
    tags,
  };
}
