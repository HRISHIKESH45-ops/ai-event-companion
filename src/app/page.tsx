"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { EventForm } from "@/components/EventForm";
import { ScheduleTimeline } from "@/components/ScheduleTimeline";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { GeneratedSchedule } from "@/types";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const [schedule, setSchedule] = useState<GeneratedSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isKeyLoaded, setIsKeyLoaded] = useState(false);

  // Load key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) setApiKey(savedKey);
    setIsKeyLoaded(true);
  }, []);

  // Save key to localStorage when it changes
  const handleSaveKey = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem("gemini_api_key", newKey);
  };

  if (!isKeyLoaded) return null; // Avoid hydration mismatch

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto space-y-12">
        <HeroSection />

        <div className="max-w-2xl mx-auto">
          <ApiKeyInput apiKey={apiKey} onSave={handleSaveKey} />
        </div>
        
        <div className="relative">
          <EventForm 
            apiKey={apiKey}
            onScheduleGenerated={(data) => {
              setSchedule(data);
              // Scroll to timeline smoothly
              setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }, 100);
            }} 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
          />
        </div>

        {schedule && (
          <div className="animate-in fade-in duration-700">
            <ScheduleTimeline 
              schedule={schedule} 
              onScheduleUpdate={setSchedule} 
              apiKey={apiKey}
            />
            
            <div className="mt-12 text-center">
              <button 
                onClick={() => setSchedule(null)}
                className="text-indigo-600 font-medium hover:text-indigo-800 underline underline-offset-4"
              >
                Create another schedule
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-24 text-center text-slate-500 text-sm">
        <p>Built for Google Hack2Skill Virtual PromptWars &copy; {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
