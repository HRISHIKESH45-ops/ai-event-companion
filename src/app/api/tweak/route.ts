import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";

const fallbackApiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const userApiKey = req.headers.get("x-api-key");
    const activeApiKey = userApiKey || fallbackApiKey;

    if (!activeApiKey) {
      return NextResponse.json({ error: "No API key provided. Please set your Gemini API key in the settings." }, { status: 401 });
    }

    const genAI = new GoogleGenerativeAI(activeApiKey);
    const { schedule, instruction } = await req.json();

    if (!schedule || !instruction) {
      return NextResponse.json({ error: "Missing required fields (schedule, instruction)." }, { status: 400 });
    }

    const prompt = `
      You are an expert AI Event Companion.
      The user previously generated this schedule:
      ${JSON.stringify(schedule, null, 2)}

      The user has requested the following tweak/modification to the schedule:
      "${instruction}"

      Please modify the schedule to accurately fulfill the user's tweak.
      - Ensure you keep the start and end times generally intact, just shuffling/adding/removing the requested items.
      - Maintain realistic durations for sessions and breaks.
      - Output the complete, modified schedule JSON using the exact same structure as before.
      - Recalculate 'energy_drain_score' (1-10) and update the 'hype_summary' if the vibe of the day changes.

      Return ONLY a pure JSON object mapping to the schema.
    `;

    const candidateModels = [
      "gemini-2.5-flash-lite", 
      "gemini-2.0-flash-lite", 
      "gemini-2.5-flash",
      "gemini-2.0-flash"
    ];

    let result;
    let lastError;
    const MAX_RETRIES = 2;

    for (const modelName of candidateModels) {
      console.log(`Attempting tweak with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: 4096,
              temperature: 0.5,
              responseMimeType: "application/json",
              responseSchema: {
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
              },
            },
          });
          break; // Success
        } catch (err: any) {
          lastError = err;
          console.warn(`Error tweaking with ${modelName} on attempt ${attempt}:`, err.message);
          if (err.message?.includes("404")) break;
          if (attempt < MAX_RETRIES) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
      }
      if (result) break;
    }

    if (!result) {
      throw new Error(`Failed to generated tweaked schedule after ${MAX_RETRIES} attempts. Last error: ${lastError?.message}`);
    }

    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Error tweaking schedule:", error);
    return NextResponse.json(
      { error: "Failed to tweak schedule. Please try again." },
      { status: 500 }
    );
  }
}
