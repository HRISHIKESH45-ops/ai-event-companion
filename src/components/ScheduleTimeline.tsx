import { GeneratedSchedule } from "@/types";
import { useState } from "react";
import { Coffee, GraduationCap, Users, Utensils, CheckCircle2, ChevronRight, Download, Copy, Flame, Zap, Sparkles, Loader2, Send, ListChecks, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

interface ScheduleTimelineProps {
  schedule: GeneratedSchedule | null;
  onScheduleUpdate?: (schedule: GeneratedSchedule) => void;
  apiKey: string;
}

export function ScheduleTimeline({ schedule, onScheduleUpdate, apiKey }: ScheduleTimelineProps) {
  const [tweakInput, setTweakInput] = useState("");
  const [isTweaking, setIsTweaking] = useState(false);
  if (!schedule) return null;

  const getActivityIcon = (type?: string, title?: string) => {
    const t = type?.toLowerCase() || "";
    const act = title?.toLowerCase() || "";
    if (t.includes("break") || act.includes("break")) return <Coffee className="w-5 h-5 text-emerald-500" />;
    if (t.includes("network") || act.includes("network")) return <Users className="w-5 h-5 text-indigo-500" />;
    if (t.includes("food") || t.includes("meal") || act.includes("lunch") || act.includes("dinner")) return <Utensils className="w-5 h-5 text-amber-500" />;
    return <GraduationCap className="w-5 h-5 text-blue-500" />;
  };

  const getActivityColor = (type?: string, title?: string) => {
    const t = type?.toLowerCase() || "";
    const act = title?.toLowerCase() || "";
    if (t.includes("break") || act.includes("break")) return "bg-emerald-100/50 border-emerald-200";
    if (t.includes("network") || act.includes("network")) return "bg-indigo-100/50 border-indigo-200";
    if (t.includes("food") || t.includes("meal") || act.includes("lunch") || act.includes("dinner")) return "bg-amber-100/50 border-amber-200";
    return "bg-blue-50/50 border-blue-200";
  };

  const copyToClipboard = () => {
    const text = schedule.plan.map((item) => `${item.time}: ${item.activity} - ${item.reason}`).join("\n");
    navigator.clipboard.writeText(`Schedule: ${schedule.title}\n\n${text}`);
    toast.success("Schedule copied to clipboard!");
  };

  const downloadICS = () => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Hack2Skill//PromptWars//EN\n";
    
    const parseTime = (timeStr: string) => {
      const match = timeStr.match(/(\d+):(\d+)\s+(AM|PM)/i);
      if (!match) return "000000";
      let [_, h, m, p] = match;
      let hours = parseInt(h);
      if (p.toUpperCase() === "PM" && hours !== 12) hours += 12;
      if (p.toUpperCase() === "AM" && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, '0')}${m}00`;
    };

    schedule.plan.forEach((item, index) => {
      const times = item.time.split(" - ");
      if (times.length === 2) {
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `UID:event-${index}-${Date.now()}@promptwars\n`;
        icsContent += `DTSTAMP:${today}T000000Z\n`;
        // Basic local time mapping for demo purposes
        icsContent += `DTSTART:${today}T${parseTime(times[0])}Z\n`;
        icsContent += `DTEND:${today}T${parseTime(times[1])}Z\n`;
        icsContent += `SUMMARY:${item.activity}\n`;
        icsContent += `DESCRIPTION:${item.reason}\\n\\nBackup: ${item.backup_option || 'None'}\n`;
        icsContent += "END:VEVENT\n";
      }
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${schedule.title.replace(/s+/g, "_")}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Calendar file generated!");
  };

  const handleTweak = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweakInput.trim() || !schedule || !onScheduleUpdate) return;
    
    setIsTweaking(true);
    try {
      const res = await fetch("/api/tweak", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": apiKey 
        },
        body: JSON.stringify({ schedule, instruction: tweakInput }),
      });
      
      if (!res.ok) throw new Error("Failed to tweak schedule");
      const updatedSchedule = await res.json();
      onScheduleUpdate(updatedSchedule);
      setTweakInput("");
      toast.success("Schedule updated!");
    } catch (e: any) {
      toast.error(e.message || "An error occurred updating the schedule.");
    } finally {
      setIsTweaking(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{schedule.title || "Your Personalized Schedule"}</h2>
        <div className="flex gap-2">
          <button onClick={downloadICS} className="p-2 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors" title="Download Calendar">
            <Download className="w-5 h-5" />
          </button>
          <button onClick={copyToClipboard} className="p-2 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors" title="Copy to clipboard">
            <Copy className="w-5 h-5" />
          </button>
        </div>
      </div>

      {schedule.hype_summary && (
        <div className="mb-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-1 shadow-lg animate-in zoom-in-95 duration-500">
          <div className="bg-white/95 backdrop-blur rounded-lg p-5 flex gap-4 items-center">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-full shrink-0">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-slate-800 font-medium italic text-[15px] leading-relaxed">
              "{schedule.hype_summary}"
            </p>
          </div>
        </div>
      )}

      <div className="relative border-l-2 border-slate-200 ml-4 md:ml-0 space-y-8">
        {schedule.plan.map((item, idx) => (
          <div key={idx} className="relative pl-8 md:pl-10">
            <div className="absolute -left-[11px] bg-white border-2 border-slate-200 rounded-full p-1 top-1">
              <div className="w-3 h-3 bg-indigo-500 rounded-full" />
            </div>

            <div className={`glass-card p-5 md:p-6 rounded-2xl border ${getActivityColor(item.type, item.activity)} transition-shadow hover:shadow-md`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
                    <ClockIcon className="w-4 h-4" />
                    {item.time}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    {getActivityIcon(item.type, item.activity)}
                    {item.activity}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.reason}</p>
                </div>

                {item.energy_drain_score !== undefined && (
                  <div className="shrink-0 flex flex-col md:items-end justify-center bg-white/50 px-3 py-2 rounded-lg border border-slate-100 min-w[100px]">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500" /> Energy
                    </span>
                    <div className="flex gap-0.5">
                      {[...Array(10)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 h-3 rounded-sm ${i < item.energy_drain_score ? (item.energy_drain_score > 7 ? 'bg-rose-500' : item.energy_drain_score > 4 ? 'bg-amber-400' : 'bg-emerald-400') : 'bg-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {item.backup_option && (
                <div className="mt-4 pt-4 border-t border-slate-200/50">
                  <div className="flex gap-2 items-start text-sm bg-white/40 p-3 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600"><span className="font-semibold text-slate-700">Backup Option:</span> {item.backup_option}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {schedule.prep_sheet && schedule.prep_sheet.length > 0 && (
        <div className="mt-16 animate-in slide-in-from-bottom-6 duration-700 delay-150">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Briefcase className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Your Preparation Guide</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedule.prep_sheet.map((step, idx) => (
              <div key={idx} className="flex gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                <div className="mt-0.5 flex-shrink-0">
                  <div className="w-5 h-5 rounded-full border-2 border-emerald-200 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-colors">
                    <ListChecks className="w-3 h-3 text-emerald-500 group-hover:text-white" />
                  </div>
                </div>
                <span className="text-slate-700 font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 bg-indigo-50 border border-indigo-100 p-6 rounded-2xl shadow-sm">
        <h4 className="flex items-center gap-2 text-indigo-900 font-bold mb-4">
          <Sparkles className="w-5 h-5 text-indigo-500" /> Ask AI to Tweak this Schedule
        </h4>
        <form onSubmit={handleTweak} className="flex gap-3 relative">
          <input 
            type="text" 
            value={tweakInput}
            onChange={(e) => setTweakInput(e.target.value)}
            placeholder="e.g. 'Add a 30m coffee break at 2 PM' or 'Remove all networking'" 
            className="flex-grow bg-white border border-indigo-200 rounded-xl px-4 py-3 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
            disabled={isTweaking}
            required
          />
          <button 
            type="submit" 
            disabled={isTweaking}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-xl font-semibold flex items-center justify-center transition-colors disabled:opacity-70 disabled:pointer-events-none"
          >
            {isTweaking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}

function ClockIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
