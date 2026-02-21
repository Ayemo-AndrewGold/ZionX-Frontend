export const SPECIALISTS = {
  pregnancy: {
    label: "Pregnancy",
    icon: "🤰",
    color: "bg-rose-50 border-rose-200 text-rose-700",
    iconBg: "bg-rose-100",
    badge: "bg-rose-100 text-rose-700",
    description:
      "Obstetrics, maternal nutrition, fetal development & perinatal wellbeing.",
    examples: [
      "I'm 7 months pregnant with headaches",
      "What foods should I avoid?",
      "Is spotting at 10 weeks normal?",
    ],
  },
  diabetes: {
    label: "Diabetes",
    icon: "🩸",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    iconBg: "bg-blue-100",
    badge: "bg-blue-100 text-blue-700",
    description:
      "Type 1, Type 2 & gestational diabetes, insulin therapy & metabolic health.",
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
    description:
      "Infant care, child development, vaccinations & adolescent health.",
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
    description:
      "Mood disorders, anxiety, trauma-informed care & crisis support.",
    examples: [
      "I've been feeling hopeless lately",
      "How do I manage panic attacks?",
      "Tips for better sleep with anxiety",
    ],
  },
};

export default function SpecialistCards({ onExample }) {
  return (
    <div className="flex flex-col items-center gap-8 py-8 px-4 max-w-2xl mx-auto w-full">
      {/* Hero */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-700 text-white text-2xl mb-4 shadow-lg">
          Zx
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          How can I help you today?
        </h2>
        <p className="mt-2 text-sm text-slate-500 max-w-md">
          Describe your concern and I&apos;ll route it to the most appropriate
          specialist agent below.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {Object.entries(SPECIALISTS).map(([key, spec]) => (
          <div
            key={key}
            className={`rounded-2xl border p-4 ${spec.color} flex flex-col gap-3`}
          >
            {/* Header */}
            <div className="flex items-center gap-2">
              <span
                className={`text-xl w-9 h-9 flex items-center justify-center rounded-xl ${spec.iconBg}`}
              >
                {spec.icon}
              </span>
              <span className="font-semibold text-sm">{spec.label} Advisor</span>
            </div>

            {/* Description */}
            <p className="text-xs leading-relaxed opacity-80">
              {spec.description}
            </p>

            {/* Example prompts */}
            <div className="flex flex-col gap-1">
              {spec.examples.map((example) => (
                <button
                  key={example}
                  onClick={() => onExample(example)}
                  className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-white/60 hover:bg-white/90 transition-colors border border-white/40 truncate"
                >
                  &quot;{example}&quot;
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-400 text-center max-w-sm">
        ZionX provides informational guidance only and is not a substitute for
        professional medical advice, diagnosis, or treatment.
      </p>
    </div>
  );
}
