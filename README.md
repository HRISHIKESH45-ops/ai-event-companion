# AI Event Companion / Personalized Schedule Generator

Built for the **Google Hack2Skill Virtual PromptWars** project. The AI Event Companion helps attendees plan their perfect event experience, factoring in interests, time constraints, breaks, and priorities.

## Features
- **Intelligent Prompting**: Uses Google Gemini to generate highly optimized structured schedules.
- **Modern UI**: Clean, glassmorphed cards with interactive states built using Tailwind CSS.
- **Copy/Share**: Easily copy your generated schedule to clipboard.
- **Reliable Backend**: Server-controlled API route securely integrates Gemini while ensuring formatting is strictly JSON.

## Setup Instructions

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed along with `npm`.

### 2. Environment Variables
Create a file named `.env.local` in the root of the directory:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Gemini API Key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack
- **Next.js (App Router)**
- **Tailwind CSS v4**
- **@google/generative-ai (Gemini SDK)**
- **Lucide React** (Icons)
- **React Hot Toast** (Notifications)
