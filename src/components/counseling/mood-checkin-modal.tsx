"use client";

import React, { useState } from "react";
import { MoodCheckin, MoodTag } from "@/types";
import { X, Smile, Sparkles, CheckCircle2 } from "lucide-react";

interface MoodCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckinCompleted: (checkin: MoodCheckin) => void;
}

export function MoodCheckinModal({
  isOpen,
  onClose,
  onCheckinCompleted,
}: MoodCheckinModalProps) {
  const [moodScore, setMoodScore] = useState<number>(4);
  const [moodTag, setMoodTag] = useState<MoodTag>("Calm");
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [stressFactors, setStressFactors] = useState<string[]>(["Academics"]);
  const [loading, setLoading] = useState(false);
  const [completedCheckin, setCompletedCheckin] = useState<MoodCheckin | null>(null);

  if (!isOpen) return null;

  const moodOptions: { score: number; tag: MoodTag; emoji: string; desc: string }[] = [
    { score: 5, tag: "Great", emoji: "🌟", desc: "Energized & Motivated" },
    { score: 4, tag: "Calm", emoji: "🌿", desc: "Balanced & Focused" },
    { score: 3, tag: "Overwhelmed", emoji: "🌊", desc: "Heavy Workload" },
    { score: 2, tag: "Anxious", emoji: "⚡", desc: "Tense or Uneasy" },
    { score: 1, tag: "Exhausted", emoji: "🔋", desc: "Depleted Energy" },
  ];

  const availableFactors = [
    "Academics",
    "Exams & Tests",
    "Placement Prep",
    "Hostel / Roommates",
    "Sleep Deprivation",
    "Personal / Social",
  ];

  const handleToggleFactor = (factor: string) => {
    if (stressFactors.includes(factor)) {
      setStressFactors(stressFactors.filter((f) => f !== factor));
    } else {
      setStressFactors([...stressFactors, factor]);
    }
  };

  const getExerciseRecommendation = (score: number, tag: MoodTag): string => {
    if (score >= 4) {
      return "Celebrate your equilibrium! 10-minute mindful reflection or evening campus jog.";
    } else if (score === 3) {
      return "Pomodoro 25/5 rhythm breakdown & 5-minute deep diaphragmatic box breathing.";
    } else {
      return "Grounding 5-4-3-2-1 sensory reset, warm chamomile herbal tea & restorative power nap.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const exercise = getExerciseRecommendation(moodScore, moodTag);

    try {
      const res = await fetch("/api/counseling/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood_score: moodScore,
          mood_tag: moodTag,
          sleep_hours: sleepHours,
          stress_factors: stressFactors.length > 0 ? stressFactors : ["None"],
          coping_exercise: exercise,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setCompletedCheckin(data.data);
        onCheckinCompleted(data.data);
      }
    } catch (err) {
      console.error("Mood check-in error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAll = () => {
    setCompletedCheckin(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleCloseAll}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {completedCheckin ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              Emotional Pulse Logged!
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Thank you for tuning in to your mental wellbeing today.
            </p>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left space-y-3 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Recorded State:</span>
                <span className="font-bold text-teal-300">
                  {completedCheckin.mood_tag} ({completedCheckin.mood_score} / 5)
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Sleep Logged:</span>
                <span className="text-slate-200">
                  {completedCheckin.sleep_hours} hours
                </span>
              </div>
              <div className="p-3 rounded-xl bg-teal-950/20 border border-teal-500/30 text-xs">
                <span className="block font-semibold text-teal-300 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Recommended Coping Ritual:
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {completedCheckin.coping_exercise}
                </p>
              </div>
            </div>

            <button
              onClick={handleCloseAll}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-lg shadow-teal-600/25 transition-all"
            >
              Done & Return to Wellness Sanctuary
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <Smile className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Daily Emotional Pulse Check-In
                </h2>
                <p className="text-xs text-slate-400">
                  Track your mental energy and receive personalized mindfulness prompts
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                How is your emotional battery feeling right now?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {moodOptions.map((opt) => {
                  const isSelected = moodScore === opt.score;
                  return (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => {
                        setMoodScore(opt.score);
                        setMoodTag(opt.tag);
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                        isSelected
                          ? "bg-teal-500/20 border-teal-400 text-teal-200 ring-2 ring-teal-400/30"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-2xl mb-1">{opt.emoji}</span>
                      <span className="text-[11px] font-bold">{opt.tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label className="font-medium text-slate-300">Sleep Duration Last Night</label>
                <span className="font-bold text-teal-300">{sleepHours} Hours</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full accent-teal-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>3 hrs</span>
                <span>7-8 hrs (Ideal)</span>
                <span>12 hrs</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Primary Stressors or Triggers (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableFactors.map((factor) => {
                  const isChecked = stressFactors.includes(factor);
                  return (
                    <button
                      key={factor}
                      type="button"
                      onClick={() => handleToggleFactor(factor)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isChecked
                          ? "bg-teal-500/20 border-teal-400/50 text-teal-200"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {factor}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseAll}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-lg shadow-teal-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? "Recording..." : "Save Today's Check-in"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
