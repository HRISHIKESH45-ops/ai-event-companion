import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";

// SDK will be initialized per-request using the user's key if provided
const fallbackApiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const userApiKey = req.headers.get("x-api-key");
    const activeApiKey = userApiKey || fallbackApiKey;

    if (!activeApiKey) {
      return NextResponse.json(
        { error: "No API key provided. Please set your Gemini API key in the settings." },
        { status: 401 }
      );
    }

    const genAI = new GoogleGenerativeAI(activeApiKey);
    const body = await req.json();
    const { name, interests, eventType, startTime, endTime, priority, notes, persona, image } = body;

    if (!startTime || !endTime || !eventType) {
      return NextResponse.json(
        { error: "Missing required fields (startTime, endTime, eventType)." },
        { status: 400 }
      );
    }

    const prompt = `
      You are an expert AI Event Companion and Scheduling Assistant.
      Create a personalized event schedule for a user based on the following details:

      User Details:
      - Name: ${name || "Guest"}
      - Interests: ${interests || "General event topics"}
      - Event Type: ${eventType}
      - Priority Level: ${priority || "Balanced"}
      - Event Persona: ${persona || "Balanced Explorer"}
      - Time Window: ${startTime} to ${endTime}
      - Additional Notes: ${notes || "None"}

      Rules for the generated schedule:
      1. Strictly adhere to the available time window (${startTime} to ${endTime}).
      2. Factor in the event type, the user's focus (priority), and specifically their "Event Persona". Embody this persona in the schedule choices!
      3. Include necessary breaks, meals/food, and networking opportunities.
      4. Avoid overlapping time slots. Make lengths realistic (e.g., 15m breaks, 30m-1h sessions).
      5. Provide a backup option for each session to give flexibility.
      6. Output an "energy_drain_score" (1 to 10) for each activity (1 = relaxing break, 10 = intense brain-draining workshop).
      7. Provide a short, highly stylized 2-sentence "hype_summary" that generates hype for the day, adopting the tone of the Event Persona.
      8. Provide a "prep_sheet" array of 4-6 specific preparation steps or items to bring (e.g. "Install Python", "Bring a notebook", "Download the event app").

      IMPORTANT: If an image flyer is provided, prioritize extracting session titles and times from the flyer to build the schedule. If the flyer is unstructured, use your best judgment to organize it.
    `;

    // Credit-efficient: prioritize lighter models for lower quota consumption and better availability
    const candidateModels = [
      "gemini-2.5-flash-lite", 
      "gemini-2.0-flash-lite", 
      "gemini-2.5-flash",
      "gemini-2.0-flash"
    ];
    
    let result;
    let lastError;
    const MAX_RETRIES = 2;

    // Prepare content parts
    const parts: any[] = [{ text: prompt }];
    if (image) {
      const base64Data = image.split(",")[1];
      const mimeType = image.split(",")[0].split(":")[1].split(";")[0];
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
    }

    // Response schema (shared across attempts)
    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING, description: "A catchy title for this schedule" },
        hype_summary: { type: SchemaType.STRING, description: "A highly stylized 2-sentence hype summary for the user's day based on their persona." },
        prep_sheet: { 
          type: SchemaType.ARRAY, 
          items: { type: SchemaType.STRING },
          description: "4-6 preparation steps or items to bring."
        },
        plan: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              time: { type: SchemaType.STRING, description: "Time range, e.g., 10:00 AM - 11:00 AM" },
              type: { type: SchemaType.STRING, description: "session, break, networking, or food" },
              activity: { type: SchemaType.STRING, description: "Name of the activity" },
              reason: { type: SchemaType.STRING, description: "Why this matches the user inputs" },
              backup_option: { type: SchemaType.STRING, description: "Optional backup activity" },
              energy_drain_score: { type: SchemaType.NUMBER, description: "Energy drain out of 10" }
            },
            required: ["time", "type", "activity", "reason", "backup_option", "energy_drain_score"],
          },
        },
      },
      required: ["title", "hype_summary", "plan", "prep_sheet"],
    };

    // Attempt generation with model fallback
    for (const modelName of candidateModels) {
      console.log(`Attempting generation with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig: {
              maxOutputTokens: 4096,
              temperature: 0.5,
              responseMimeType: "application/json",
              responseSchema,
            },
          });
          break; // Success!
        } catch (err: any) {
          lastError = err;
          console.warn(`Error with ${modelName} on attempt ${attempt}:`, err.message);
          // If it's a 404 (retired model), skip to next model immediately
          if (err.message?.includes("404")) break;
          if (attempt < MAX_RETRIES) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
      }
      if (result) break; // Found a working model
    }

    if (!result) {
      throw new Error(`Failed to generate schedule after ${MAX_RETRIES} attempts. Last error: ${lastError?.message}`);
    }

    const responseText = result.response.text();
    
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      // Fallback: extract JSON structure using regex in case of markdown or extra padding
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to extract JSON from model output.");
      }
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Error generating schedule:", error);
    
    const errorMessage = error.message || "";
    // Sometimes the overarching error is just "Failed..." but we logged the quota error earlier
    const isQuotaError = errorMessage.includes("429") || errorMessage.includes("Quota") || errorMessage.includes("exceeded");
    const isOverloaded = errorMessage.includes("503") || errorMessage.includes("overloaded");

    if (isQuotaError) {
      return NextResponse.json(
        { error: "Your Gemini API key has exceeded its free tier limit for all available models. Please use a different key or try again in 24 hours." },
        { status: 500 }
      );
    }
    
    if (isOverloaded) {
      return NextResponse.json(
        { error: "Google's Gemini AI servers are currently experiencing high demand (503 Service Unavailable). Please wait a few moments and try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate schedule. Please try again." },
      { status: 500 }
    );
  }
}
