"use client";

import { useState } from "react";

const STEPS = [
  { id: "personal",   label: "Personal",   icon: "👤" },
  { id: "medical",    label: "Medical",    icon: "🩺" },
  { id: "emergency",  label: "Emergency",  icon: "🚨" },
];

const BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−", "Unknown"];

const CONDITIONS = [
  "Diabetes", "Hypertension", "Asthma", "Heart Disease",
  "Pregnancy", "Mental Health Condition", "Kidney Disease", "Other",
];

export default function OnboardingModal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", age: "", bloodGroup: "",
    allergies: "", avoidMeds: "",
    conditions: [], otherConditions: "",
    doctorEmail: "", emergencyContact: "",
    consentAlerts: false,
  });
  const [saved, setSaved] = useState(false);

  if (!open) return null;

  function update(key, val) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  function toggleCondition(c) {
    setForm((p) => ({
      ...p,
      conditions: p.conditions.includes(c)
        ? p.conditions.filter((x) => x !== c)
        : [...p.conditions, c],
    }));
  }

  /* API stub: POST /onboarding/profile */
  function handleSave() {
    // TODO: await saveOnboardingProfile(form)
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden pop-in">

        {/* Header */}
        <div className="brand-gradient px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Health Profile Setup</h2>
              <p className="text-xs opacity-75 mt-0.5">Personalise your AI health assistant</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mt-4">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setStep(i)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  i === step ? "bg-white text-teal-700" : "bg-white/20 text-white/80 hover:bg-white/30"
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-4">

          {/* ── Step 0: Personal ── */}
          {step === 0 && (
            <>
              <Field label="Full Name" icon="👤">
                <input
                  type="text" placeholder="Your name (optional)"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Age" icon="🎂">
                <input
                  type="number" placeholder="Your age"
                  value={form.age}
                  onChange={(e) => update("age", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Blood Group" icon="🩸">
                <select value={form.bloodGroup} onChange={(e) => update("bloodGroup", e.target.value)} className={inputCls}>
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="Known Allergies" icon="⚠️">
                <textarea
                  rows={2} placeholder="e.g. Penicillin, Peanuts, Latex…"
                  value={form.allergies}
                  onChange={(e) => update("allergies", e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              </Field>
              <Field label="Medications to Avoid" icon="🚫">
                <textarea
                  rows={2} placeholder="e.g. Aspirin, NSAIDs…"
                  value={form.avoidMeds}
                  onChange={(e) => update("avoidMeds", e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </>
          )}

          {/* ── Step 1: Medical ── */}
          {step === 1 && (
            <>
              <Field label="Existing Conditions" icon="🏥">
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {CONDITIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCondition(c)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border text-left transition-all ${
                        form.conditions.includes(c)
                          ? "bg-teal-50 border-teal-400 text-teal-700 font-semibold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Other Health Issues" icon="📋">
                <textarea
                  rows={3} placeholder="Describe any ongoing health issues or conditions…"
                  value={form.otherConditions}
                  onChange={(e) => update("otherConditions", e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              </Field>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-xs text-blue-700 font-semibold mb-1">📎 Medical Document Upload</p>
                <p className="text-[11px] text-blue-600">
                  Upload feature coming soon — AI will summarize your medical reports automatically.
                </p>
                {/* API stub: POST /onboarding/documents */}
              </div>
            </>
          )}

          {/* ── Step 2: Emergency ── */}
          {step === 2 && (
            <>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-800 font-semibold mb-1">⚠️ Consent Required</p>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Emergency alerts are only sent with your explicit consent. You can revoke this at any time.
                </p>
              </div>
              <Field label="Doctor Email" icon="👨‍⚕️">
                <input
                  type="email" placeholder="doctor@hospital.com"
                  value={form.doctorEmail}
                  onChange={(e) => update("doctorEmail", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Emergency Contact" icon="📞">
                <input
                  type="text" placeholder="Family member name & email"
                  value={form.emergencyContact}
                  onChange={(e) => update("emergencyContact", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consentAlerts}
                  onChange={(e) => update("consentAlerts", e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-400"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I consent to ZionX sending emergency alerts to my doctor and emergency contact when a
                  <strong> critical risk level</strong> is detected.
                </span>
              </label>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>

          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <span key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === step ? "bg-teal-600 w-4" : "bg-slate-300"}`} />
            ))}
          </div>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-4 py-2 text-xs font-semibold rounded-lg brand-gradient text-white hover:opacity-90 transition-opacity"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-lg brand-gradient text-white hover:opacity-90 transition-opacity"
            >
              {saved ? "✓ Saved!" : "Save Profile"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 placeholder:text-slate-300 text-slate-700";

function Field({ label, icon, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
        <span>{icon}</span> {label}
        <span className="ml-auto text-[10px] font-normal text-slate-400">Optional</span>
      </label>
      {children}
    </div>
  );
}
