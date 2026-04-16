# AI Event Companion 🗓️⚡

An intelligent, multi-modal scheduling assistant submitted for the **Hack2Skill Virtual PromptWars**. Built for professionals, hackers, and event enthusiasts to instantly generate highly personalized, optimized itineraries.

## 🎯 The Problem It Solves

Attending large conferences and hackathons is overwhelming. Attendees are forced to dig through hundreds of overlapping sessions to manually piece together a 9-to-5 schedule. Existing tools are static and don't care if you want to network with VCs ("The Hustler"), focus entirely on tech workshops ("The Deep Learner"), or when you need a break. 

**AI Event Companion solves this by acting as your personal human-like concierge.**

## 🚀 Key "God-Tier" Features

1. **🖼️ Multi-Modal Flyer Parsing**: Too lazy to type the event details? Just upload a picture of the hackathon flyer. The Gemini Vision models perfectly extract session titles, timelines, and descriptions directly from the image.
2. **🌍 AI Tweak Copilot**: Schedules shouldn’t be static. Feel tired at 2 PM? Chat with the Tweak Copilot at the bottom of the timeline. It instantly modifies the JSON schedule without losing context.
3. **🎭 Persona-Based Generation**: Tell the AI your persona (e.g., "The Social Butterfly"), and it curates the day differently. It even generates a custom "Hype Badge" summary in the tone of that persona.
4. **🔥 Energy Level Heatmap**: The backend AI intelligently grades each activity with an `energy_drain_score` (1-10), visually displaying a green/orange/red heatmap so you don't burn out.
5. **🎒 AI Prep & Packing Guide**: Based on your schedule (e.g., "Python Workshop"), the AI generates a customized preparation checklist (e.g., "Install VS Code", "Bring power bank").
6. **🗓️ Native Calendar Integration (1-Click ICS)**: Instantly download your AI-generated schedule into Apple/Google Calendar via a generated `.ics` file.
7. **🔒 Bring Your Own Key (BYOK)**: A highly secure API key gateway stored locally in your browser, consuming the user's specific quota for scaleable deployment.
8. **⚡ Multi-Model Resilience**: If a Gemini model hits a high-traffic Spike (503) or Quota Limit (429), the API intelligently fails over between `gemini-2.0-flash`, `gemini-2.5-flash-lite`, and others for 100% uptime.

---

## 💻 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Next.js API Routes (`/api/schedule`, `/api/tweak`).
- **AI Core**: Google Generative AI Node SDK (`@google/generative-ai`), Prompt Engineering, Strict Schema structured outputs.
- **Data parsing**: Custom ICS VCard generator.

---

## 🛠️ How to Run Locally

1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Start the dev server with `npm run dev`.
4. Open `http://localhost:3000`.
5. Enter your own **Gemini API Key** in the configuration box (Get one free at AI Studio).
6. Upload a flyer, fill out your goals, and click **Generate**!

---

## 🧑‍⚖️ Note for Judges & Demo Data

Want to test the app instantly without thinking up prompt scenarios?

👉 **[Click here to view DEMO_DATA.md](./DEMO_DATA.md)** for a pre-filled "John Doe" profile that perfectly shows off the AI's constraints routing.

**To Test the Multi-Modal Vision:**
1. Download the **`sample_hackathon_flyer.png`** attached in this repository.
2. Drag and drop it into the "Event Flyer" upload box.
3. Watch the AI perfectly read the unstructured image and build a strictly-typed JSON schedule from it!
