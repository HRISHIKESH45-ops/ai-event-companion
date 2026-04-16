import { useState } from "react";
import { Key, Save, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface ApiKeyInputProps {
  apiKey: string;
  onSave: (key: string) => void;
}

export function ApiKeyInput({ apiKey, onSave }: ApiKeyInputProps) {
  const [inputValue, setInputValue] = useState(apiKey);
  const [isEditing, setIsEditing] = useState(!apiKey);

  const handleSave = () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    onSave(inputValue.trim());
    setIsEditing(false);
    toast.success("API Key saved locally!");
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-6 shadow-xl shadow-indigo-500/5 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${apiKey ? 'bg-emerald-100' : 'bg-amber-100'}`}>
            <Key className={`w-5 h-5 ${apiKey ? 'text-emerald-600' : 'text-amber-600'}`} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Gemini API Configuration</h3>
            <p className="text-xs text-slate-500 font-medium">Your key is stored only in your browser.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {apiKey ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Key Active
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100">
              <AlertCircle className="w-3.5 h-3.5" />
              Key Required
            </div>
          )}
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-colors"
          >
            Get Key <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <input
              type="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Paste your Gemini AI API Key here..."
              className="flex-1 px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-medium"
            />
            <button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-200"
            >
              <Save className="w-4 h-4" /> Save
            </button>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-between px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 font-mono text-sm">••••••••••••••••••••••••••••</span>
            <button 
              onClick={() => setIsEditing(true)}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-bold"
            >
              Change
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
