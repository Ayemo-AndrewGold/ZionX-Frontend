"use client";

export const SPECIALISTS = {
  pregnancy: {
    label: "Pregnancy",
    icon: "🤰",
    color: "bg-rose-50 border-rose-200 text-rose-700",
    iconBg: "bg-rose-100",
    badge: "bg-rose-100 text-rose-700",
    accent: "from-rose-400 to-pink-500",
    description: "Obstetrics, maternal nutrition, fetal development & perinatal wellbeing.",
    examples: [
      "I'm 7 months pregnant with headaches",
      "What foods should I avoid?",
      "Is spotting at 10 weeks normal?",
    ],
  },
  diabetes: {
    label: "Chronic Disease",
    icon: "🩸",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    iconBg: "bg-blue-100",
    badge: "bg-blue-100 text-blue-700",
    accent: "from-blue-400 to-cyan-500",
    description: "Diabetes, hypertension, asthma & long-term chronic condition management.",
    examples: [
      "My blood sugar is 280 mg/dL",
      "Can I eat fruit with Type 2?",
      "I missed my insulin dose",
    ],
  },
  pediatrics: {
    label: "Pediatrics",
    icon: "👶",
    color: "bg-orange-50 border-orange-200 text-orange-700",
    iconBg: "bg-orange-100",
    badge: "bg-orange-100 text-orange-700",
    accent: "from-orange-400 to-amber-500",
    description: "Infant care, child development, vaccinations & adolescent health.",
    examples: [
      "My 3-year-old has a 39°C fever",
      "When do babies start walking?",
      "Vaccination schedule for newborns",
    ],
  },
  mental_health: {
    label: "Mental Health",
    icon: "🧠",
    color: "bg-violet-50 border-violet-200 text-violet-700",
    iconBg: "bg-violet-100",
    badge: "bg-violet-100 text-violet-700",
    accent: "from-violet-400 to-purple-500",
    description: "Mood disorders, anxiety, trauma-informed care & crisis support.",
    examples: [
      "I've been feeling hopeless lately",
      "How do I manage panic attacks?",
      "Tips for better sleep with anxiety",
    ],
  },
  emergency: {
    label: "Emergency Triage",
    icon: "🚨",
    color: "bg-red-50 border-red-200 text-red-700",
    iconBg: "bg-red-100",
    badge: "bg-red-100 text-red-700",
    accent: "from-red-400 to-rose-600",
    description: "Severe symptoms, life-threatening patterns & urgent care guidance.",
    examples: [
      "Chest pain and difficulty breathing",
      "Severe allergic reaction symptoms",
      "Uncontrolled bleeding after injury",
    ],
  },
};

const FEATURES = [
  { icon: "🔀", label: "Smart Routing", desc: "Auto-routes to the right specialist" },
  { icon: "🧬", label: "Long-Term Memory", desc: "Tracks your health over time" },
  { icon: "🛡️", label: "Preventive AI", desc: "Detects patterns before they worsen" },
  { icon: "⚡", label: "Risk Scoring", desc: "Dynamic risk level assessment" },
];

export default function SpecialistCards({ onExample }) {
  return (
    <div className="flex flex-col items-center gap-8 py-8 px-4 max-w-3xl mx-auto w-full">

      {/* ── Hero ── */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl brand-gradient text-white text-2xl font-black shadow-lg pop-in select-none">
          Zx
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            How can I help you today?
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Describe your health concern and our intelligent router will direct you
            to the most appropriate specialist agent.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs text-slate-600"
            >
              <span>{f.icon}</span>
              <span className="font-medium">{f.label}</span>
            </div>
          ))}
        </div>
      </div>


      {/* ── Disclaimer ── */}
      {/* <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 max-w-lg w-full">
        <span className="text-amber-500 text-base shrink-0">⚠️</span>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          ZionX provides <strong>informational guidance only</strong> and is not a substitute
          for professional medical advice, diagnosis, or treatment. Always consult a qualified
          healthcare professional.
        </p>
      </div> */}
    </div>
  );
}
