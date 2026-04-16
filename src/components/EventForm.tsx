"use client";

import { useState } from "react";
import { Loader2, Calendar, Clock, Tag, Target, User, FileText, Sparkles, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { GeneratedSchedule } from "@/types";

interface EventFormProps {
  apiKey: string;
  onScheduleGenerated: (schedule: GeneratedSchedule) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function EventForm({ apiKey, onScheduleGenerated, isLoading, setIsLoading }: EventFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    interests: "",
    eventType: "hackathon",
    startTime: "09:00",
    endTime: "18:00",
    priority: "learning",
    persona: "balanced_explorer",
    notes: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be smaller than 10MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData((prev) => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.interests) {
      toast.error("Please tell us your interests!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": apiKey 
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate schedule");
      }

      const data: GeneratedSchedule = await res.json();
      onScheduleGenerated(data);
      toast.success("Schedule generated successfully!");
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 outline-none";

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 w-full max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <User className="w-4 h-4 text-indigo-500" /> Name
          </label>
          <input
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Calendar className="w-4 h-4 text-indigo-500" /> Event Type
          </label>
          <select name="eventType" value={formData.eventType} onChange={handleChange} className={inputClasses}>
            <option value="hackathon">Hackathon</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="expo">Expo / Trade Show</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Tag className="w-4 h-4 text-indigo-500" /> Interests & Goals
        </label>
        <input
          name="interests"
          placeholder="e.g. AI, Open Source, Networking, Web3"
          value={formData.interests}
          onChange={handleChange}
          className={inputClasses}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Clock className="w-4 h-4 text-emerald-500" /> Available From
          </label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Clock className="w-4 h-4 text-rose-500" /> Available Until
          </label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Target className="w-4 h-4 text-indigo-500" /> Priority Level
          </label>
          <select name="priority" value={formData.priority} onChange={handleChange} className={inputClasses}>
            <option value="balanced">Balanced</option>
            <option value="learning">Learning-heavy (Workshops, Talks)</option>
            <option value="networking">Networking-heavy (Socials, Mixers)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <User className="w-4 h-4 text-rose-500" /> Event Persona
          </label>
          <select name="persona" value={formData.persona} onChange={handleChange} className={inputClasses}>
            <option value="balanced_explorer">The Balanced Explorer</option>
            <option value="hustler">The Hustler (Max Networking & Deals)</option>
            <option value="deep_learner">The Deep Learner (Intense Focus)</option>
            <option value="social_butterfly">The Social Butterfly (Mixers & Fun)</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ImageIcon className="w-4 h-4 text-indigo-500" /> Event Flyer / Agenda (Optional)
        </label>
        
        {imagePreview ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 group">
            <img src={imagePreview} alt="Flyer preview" className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="text-white text-sm font-medium">Click X to remove</span>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full py-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center gap-2 transition-colors group-hover:border-indigo-400 group-hover:bg-indigo-50/50">
              <div className="bg-white p-2 rounded-full shadow-sm text-slate-400 group-hover:text-indigo-500 transition-colors">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">
                Click to upload flyer
              </p>
              <p className="text-xs text-slate-400">
                AI will automatically extract event details from the flyer
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <FileText className="w-4 h-4 text-indigo-500" /> Optional Notes
        </label>
        <textarea
          name="notes"
          placeholder="Any specific constraints or needs? (e.g. I need a 1-hour lunch break at 1 PM)"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className={cn(inputClasses, "resize-none")}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !apiKey}
        className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
          isLoading || !apiKey
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:shadow-indigo-200"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Generating Schedule...
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6" />
            {!apiKey ? "Set API Key Above to Generate" : "Generate My Schedule"}
          </>
        )}
      </button>
    </form>
  );
}
