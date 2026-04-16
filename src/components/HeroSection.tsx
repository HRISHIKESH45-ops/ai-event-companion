import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative pt-20 pb-12 flex flex-col items-center text-center px-4">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm mb-6 border border-indigo-100 shadow-sm animate-fade-in">
        <Sparkles className="w-4 h-4 text-indigo-500" />
        <span>Hack2Skill Virtual PromptWars</span>
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
        Your Personal <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
          AI Event Companion
        </span>
      </h1>
      <p className="max-w-2xl text-lg text-slate-600 mb-8 leading-relaxed">
        Instantly generate a personalized, dynamic schedule for your next conference, hackathon, or event. Tell us what you want to achieve, and we'll handle the rest.
      </p>
    </div>
  );
}
