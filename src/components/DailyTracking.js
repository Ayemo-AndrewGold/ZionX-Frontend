"use client";

import { useState, useEffect } from "react";
import { submitDailyTracking, getTrackingHistory } from "@/lib/api";

const MOOD_OPTIONS = [
  { value: "great", label: "😊 Great", color: "bg-green-100 text-green-700" },
  { value: "good", label: "🙂 Good", color: "bg-blue-100 text-blue-700" },
  { value: "okay", label: "😐 Okay", color: "bg-yellow-100 text-yellow-700" },
  { value: "bad", label: "😟 Bad", color: "bg-orange-100 text-orange-700" },
  { value: "terrible", label: "😢 Terrible", color: "bg-red-100 text-red-700" },
];

const ENERGY_OPTIONS = [
  { value: "high", label: "High ⚡", color: "bg-green-100 text-green-700" },
  { value: "medium", label: "Medium ⭐", color: "bg-blue-100 text-blue-700" },
  { value: "low", label: "Low 🔋", color: "bg-orange-100 text-orange-700" },
];

export default function DailyTracking() {
  const [mood, setMood] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [energy, setEnergy] = useState("");
  const [medications, setMedications] = useState("");
  const [notes, setNotes] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setLoading(true);
      const data = await getTrackingHistory(7); // Last 7 days
      setHistory(data.entries || []);
    } catch (err) {
      console.error("Failed to load tracking history:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!mood || !energy) {
      setMessage({ type: "error", text: "Mood and energy level are required" });
      return;
    }

    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });

      const trackingData = {
        mood,
        symptoms: symptoms.split(",").map(s => s.trim()).filter(Boolean),
        energy,
        medications: medications.split(",").map(m => m.trim()).filter(Boolean),
        notes,
      };

      await submitDailyTracking(trackingData);
      setMessage({ type: "success", text: "✓ Tracking data saved successfully!" });

      // Reset form
      setMood("");
      setSymptoms("");
      setEnergy("");
      setMedications("");
      setNotes("");

      // Reload history
      loadHistory();
    } catch (err) {
      setMessage({ type: "error", text: `Failed to save: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Daily Health Tracking</h1>
        <p className="text-sm text-slate-500">Track your daily health metrics to help ZionX provide better care</p>
      </div>

      {/* Tracking Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Today's Check-in</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              How are you feeling today? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {MOOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMood(option.value)}
                  className={`py-3 px-2 text-sm font-medium rounded-lg border-2 transition-all ${
                    mood === option.value
                      ? `${option.color} border-current`
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Energy Level <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ENERGY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setEnergy(option.value)}
                  className={`py-3 px-4 text-sm font-medium rounded-lg border-2 transition-all ${
                    energy === option.value
                      ? `${option.color} border-current`
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label htmlFor="symptoms" className="block text-sm font-medium text-slate-700 mb-2">
              Symptoms (comma-separated)
            </label>
            <input
              id="symptoms"
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., headache, nausea, fatigue"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Medications */}
          <div>
            <label htmlFor="medications" className="block text-sm font-medium text-slate-700 mb-2">
              Medications Taken Today (comma-separated)
            </label>
            <input
              id="medications"
              type="text"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="e.g., Aspirin, Insulin"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional observations or concerns..."
              rows={3}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Message */}
          {message.text && (
            <div className={`p-3 rounded-lg ${
              message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-medium rounded-lg transition-colors"
          >
            {submitting ? "Saving..." : "Save Today's Entry"}
          </button>
        </form>
      </div>

      {/* History */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Entries (Last 7 Days)</h2>
        
        {loading ? (
          <p className="text-sm text-slate-500">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No tracking entries yet. Start by submitting your first check-in above.</p>
        ) : (
          <div className="space-y-3">
            {history.map((entry, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{entry.date}</span>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      MOOD_OPTIONS.find(m => m.value === entry.mood)?.color || "bg-slate-100"
                    }`}>
                      {MOOD_OPTIONS.find(m => m.value === entry.mood)?.label || entry.mood}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      ENERGY_OPTIONS.find(e => e.value === entry.energy)?.color || "bg-slate-100"
                    }`}>
                      {ENERGY_OPTIONS.find(e => e.value === entry.energy)?.label || entry.energy}
                    </span>
                  </div>
                </div>
                {entry.symptoms && entry.symptoms.length > 0 && (
                  <p className="text-xs text-slate-600">
                    <span className="font-medium">Symptoms:</span> {entry.symptoms.join(", ")}
                  </p>
                )}
                {entry.medications && entry.medications.length > 0 && (
                  <p className="text-xs text-slate-600">
                    <span className="font-medium">Medications:</span> {entry.medications.join(", ")}
                  </p>
                )}
                {entry.notes && (
                  <p className="text-xs text-slate-600 mt-1">
                    <span className="font-medium">Notes:</span> {entry.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
