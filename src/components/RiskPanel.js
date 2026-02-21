"use client";

import { useState } from "react";

/* ── Risk level config ── */
const RISK_CONFIG = {
  low:      { label: "Low",      color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-200", bar: "bg-emerald-400", pct: 20 },
  moderate: { label: "Moderate", color: "text-amber-600",   bg: "bg-amber-50",    border: "border-amber-200",   bar: "bg-amber-400",   pct: 50 },
  high:     { label: "High",     color: "text-red-600",     bg: "bg-red-50",      border: "border-red-200",     bar: "bg-red-400",     pct: 75 },
  critical: { label: "Critical", color: "text-violet-600",  bg: "bg-violet-50",   border: "border-violet-200",  bar: "bg-violet-500",  pct: 95 },
};

const TRACKING_FIELDS = [
  { id: "mood",     label: "Mood",          icon: "😊", placeholder: "How are you feeling?" },
  { id: "symptoms", label: "Symptoms",      icon: "🩺", placeholder: "Any symptoms today?" },
  { id: "energy",   label: "Energy Level",  icon: "⚡", placeholder: "Low / Medium / High" },
  { id: "meds",     label: "Medications",   icon: "💊", placeholder: "Medications taken today" },
];

export default function RiskPanel({ currentSpecialist }) {
  /* API stub: replace with real risk data from backend */
  const riskLevel = "low";
  const risk = RISK_CONFIG[riskLevel];

  const [trackingOpen, setTrackingOpen] = useState(false);
  const [trackingData, setTrackingData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  /* API stub: POST /tracking/daily */
  function handleTrackingSubmit(e) {
    e.preventDefault();
    // TODO: await submitDailyTracking(trackingData)
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <aside className="flex flex-col h-full bg-white border-l border-slate-200/80 overflow-y-auto">

      {/* ── Risk Score ── */}
      <div className="p-4 border-b border-slate-100">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Risk Monitor
        </p>

        <div className={`rounded-xl p-3 border ${risk.bg} ${risk.border}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Current Risk Level</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${risk.bg} ${risk.color} border ${risk.border}`}>
              {risk.label}
            </span>
          </div>
          {/* Bar */}
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${risk.bar}`}
              style={{ width: `${risk.pct}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            {/* API stub: real score from /risk/score */}
            Score: {risk.pct}/100 · Updated just now
          </p>
        </div>

        {/* Risk levels legend */}
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {Object.entries(RISK_CONFIG).map(([key, cfg]) => (
            <div key={key} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-medium ${cfg.bg} ${cfg.border} ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.bar}`} />
              {cfg.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Active Agent ── */}
      {currentSpecialist && (
        <div className="p-4 border-b border-slate-100">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Active Agent
          </p>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-50 border border-teal-100">
            <span className="text-lg">{currentSpecialist.icon}</span>
            <div>
              <p className="text-xs font-bold text-teal-800">{currentSpecialist.label} Agent</p>
              <p className="text-[10px] text-teal-600">Routing active</p>
            </div>
            <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 routing-pulse" />
          </div>
        </div>
      )}

      {/* ── Daily Tracking ── */}
      <div className="p-4 border-b border-slate-100">
        <button
          onClick={() => setTrackingOpen((v) => !v)}
          className="w-full flex items-center justify-between"
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Daily Tracking
          </p>
          <svg
            className={`w-3 h-3 text-slate-400 transition-transform ${trackingOpen ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {trackingOpen && (
          <form onSubmit={handleTrackingSubmit} className="mt-3 space-y-2">
            {TRACKING_FIELDS.map((field) => (
              <div key={field.id}>
                <label className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 mb-1">
                  <span>{field.icon}</span> {field.label}
                </label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={trackingData[field.id] || ""}
                  onChange={(e) => setTrackingData((p) => ({ ...p, [field.id]: e.target.value }))}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 placeholder:text-slate-300"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full mt-1 py-1.5 rounded-lg brand-gradient text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              {submitted ? "✓ Saved!" : "Submit Daily Update"}
            </button>
            <p className="text-[9px] text-slate-400 text-center">
              {/* API stub: POST /tracking/daily */}
              Data saved to your health timeline · API integration pending
            </p>
          </form>
        )}
      </div>

      {/* ── Memory Insights ── */}
      <div className="p-4 border-b border-slate-100">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Memory Insights
        </p>
        {/* API stub: GET /memory/insights */}
        <div className="space-y-2">
          {[
            { icon: "📅", label: "Short-term", desc: "Current session context" },
            { icon: "🧬", label: "Long-term", desc: "Health timeline (API pending)" },
            { icon: "📊", label: "Patterns", desc: "Trend detection (API pending)" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-base">{item.icon}</span>
              <div>
                <p className="text-xs font-semibold text-slate-700">{item.label}</p>
                <p className="text-[10px] text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Emergency Contacts ── */}
      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Emergency Alerts
        </p>
        {/* API stub: POST /alerts/emergency */}
        <div className="p-3 rounded-xl bg-red-50 border border-red-100">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">🚨</span>
            <p className="text-xs font-bold text-red-700">Alert System</p>
          </div>
          <p className="text-[10px] text-red-600 leading-relaxed">
            Emergency contact alerts require explicit consent and are configured in your health profile.
          </p>
          <p className="text-[9px] text-red-400 mt-1.5">
            API integration pending · Requires consent
          </p>
        </div>
      </div>
    </aside>
  );
}
