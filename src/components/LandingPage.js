"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import OnboardingModal from "./OnboardingModal";

/* ── Animated counter ── */
function Counter({ to, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * to));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Floating particle ── */
function Particle({ style }) {
  return (
    <div
      className="absolute rounded-full opacity-20 pointer-events-none"
      style={style}
    />
  );
}

/* ── Section fade-in wrapper ── */
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Data ── */
const AGENTS = [
  {
    icon: "🤰",
    label: "Pregnancy Agent",
    color: "from-rose-400 to-pink-500",
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    desc: "Maternal nutrition, fetal development, obstetric safety & perinatal wellbeing.",
    tags: ["Trimester Tracking", "Fetal Safety", "Nutrition"],
  },
  {
    icon: "🩸",
    label: "Chronic Disease Agent",
    color: "from-blue-400 to-cyan-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    desc: "Diabetes, hypertension, asthma & long-term chronic condition management.",
    tags: ["Blood Sugar", "Hypertension", "Medication"],
  },
  {
    icon: "👶",
    label: "Pediatrics Agent",
    color: "from-orange-400 to-amber-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    desc: "Infant care, child development milestones, vaccinations & adolescent health.",
    tags: ["Vaccinations", "Milestones", "Child Care"],
  },
  {
    icon: "🧠",
    label: "Mental Health Agent",
    color: "from-violet-400 to-purple-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    desc: "Mood disorders, anxiety, trauma-informed care & crisis escalation support.",
    tags: ["Anxiety", "Mood Tracking", "Crisis Support"],
  },
  {
    icon: "🚨",
    label: "Emergency Triage Agent",
    color: "from-red-400 to-rose-600",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    desc: "Severe symptoms, life-threatening patterns & urgent care guidance with alerts.",
    tags: ["Urgent Care", "Risk Alert", "Emergency"],
  },
];

const FEATURES = [
  {
    icon: "🔀",
    title: "Intelligent Routing",
    desc: "Your input is automatically analysed and routed to the most appropriate specialist agent using keyword detection, context analysis, and your health profile.",
    color: "from-teal-400 to-emerald-500",
  },
  {
    icon: "🧬",
    title: "Long-Term Memory",
    desc: "The system builds a persistent health timeline — tracking recurring symptoms, mood patterns, and medication history to deliver increasingly personalised guidance.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: "🛡️",
    title: "Preventive Analysis",
    desc: "Instead of reacting to crises, ZionX detects patterns before they worsen — generating preventive advice and risk score updates proactively.",
    color: "from-violet-400 to-purple-500",
  },
  {
    icon: "⚡",
    title: "Dynamic Risk Scoring",
    desc: "A real-time risk engine evaluates symptom severity, frequency, and your medical history to calculate a live risk level: Low → Moderate → High → Critical.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: "🔔",
    title: "Emergency Alerts",
    desc: "With your explicit consent, ZionX can notify your doctor and emergency contacts when a critical risk threshold is detected — with a structured medical summary.",
    color: "from-red-400 to-rose-500",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    desc: "You control your data. Emergency alerts require consent. Long-term memory can be deleted on request. All sensitive data is encrypted at rest.",
    color: "from-slate-400 to-slate-600",
  },
];

const COMPARISON = [
  { feature: "Single general model", traditional: true, zionx: false, zionxLabel: "Multi-agent specialists" },
  { feature: "No long-term memory", traditional: true, zionx: false, zionxLabel: "Persistent health timeline" },
  { feature: "Reactive responses only", traditional: true, zionx: false, zionxLabel: "Preventive AI engine" },
  { feature: "Generic advice", traditional: true, zionx: false, zionxLabel: "Context-aware routing" },
  { feature: "No risk monitoring", traditional: true, zionx: false, zionxLabel: "Dynamic risk scoring" },
  { feature: "No emergency escalation", traditional: true, zionx: false, zionxLabel: "Consent-based alerts" },
];

const STEPS = [
  { step: "01", icon: "👤", title: "Set Up Your Profile", desc: "Complete a quick health onboarding — allergies, conditions, emergency contacts. All optional, all encrypted." },
  { step: "02", icon: "💬", title: "Describe Your Concern", desc: "Type, speak, or upload. Our intelligent router instantly identifies the right specialist agent for your query." },
  { step: "03", icon: "🔀", title: "Smart Agent Routing", desc: "Your message is analysed and directed to the most appropriate specialist — Pregnancy, Chronic, Pediatric, Mental Health, or Emergency." },
  { step: "04", icon: "🧬", title: "Personalised Response", desc: "The agent responds using your health profile, conversation context, and long-term memory for safe, tailored guidance." },
  { step: "05", icon: "📊", title: "Track & Prevent", desc: "Log daily mood, symptoms, and medications. ZionX detects patterns and generates preventive alerts before issues escalate." },
];

export default function LandingPage() {
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="brand-gradient w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-lg">
                Zx
              </div>
              <div>
                <span className="font-bold text-white text-base">ZionX</span>
                <span className="hidden sm:inline text-slate-400 text-xs ml-2">AI Preventive Health</span>
              </div>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#agents" className="hover:text-white transition-colors">Agents</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#compare" className="hover:text-white transition-colors">Compare</a>
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOnboardingOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-700 text-slate-300 hover:border-teal-500 hover:text-teal-400 transition-all"
              >
                Set Up Profile
              </button>
              <Link
                href="/chat"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl brand-gradient text-white hover:opacity-90 transition-opacity shadow-lg"
              >
                Launch App
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              {/* Mobile menu toggle */}
              <button
                className="md:hidden ml-1 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                onClick={() => setMobileMenuOpen(v => !v)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-800 py-3 space-y-1">
              {["#features", "#agents", "#how-it-works", "#compare"].map((href) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors capitalize"
                >
                  {href.replace("#", "").replace(/-/g, " ")}
                </a>
              ))}
              <button
                onClick={() => { setOnboardingOpen(true); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Set Up Profile
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

        {/* Background gradient mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-600/5 rounded-full blur-3xl" />
        </div>

        {/* Floating particles */}
        {[
          { width: 6, height: 6, background: "#14b8a6", top: "15%", left: "10%", animation: "float 6s ease-in-out infinite" },
          { width: 4, height: 4, background: "#6366f1", top: "25%", right: "15%", animation: "float 8s ease-in-out infinite 1s" },
          { width: 8, height: 8, background: "#f59e0b", bottom: "30%", left: "8%", animation: "float 7s ease-in-out infinite 2s" },
          { width: 5, height: 5, background: "#ec4899", top: "60%", right: "10%", animation: "float 9s ease-in-out infinite 0.5s" },
          { width: 3, height: 3, background: "#10b981", bottom: "20%", right: "25%", animation: "float 5s ease-in-out infinite 3s" },
          { width: 7, height: 7, background: "#8b5cf6", top: "40%", left: "5%", animation: "float 10s ease-in-out infinite 1.5s" },
        ].map((p, i) => <Particle key={i} style={p} />)}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-semibold mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 pulse-ring" />
            Multi-Agent AI Health System · Hackathon 2026
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6">
            <span className="text-white">From Data to</span>
            <br />
            <span className="gradient-text">Prevention.</span>
            <br />
            <span className="text-slate-300 text-3xl sm:text-4xl md:text-5xl font-bold">AI as Your Personal Health Assistant.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-5">
            ZionX routes your health concerns to <strong className="text-slate-200">specialized AI agents</strong>,
            builds a <strong className="text-slate-200">long-term health memory</strong>, detects patterns,
            and delivers <strong className="text-slate-200">preventive guidance</strong> — before problems escalate.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/chat"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl brand-gradient text-white font-bold text-base hover:opacity-90 transition-all shadow-xl shadow-teal-500/20 hover:shadow-teal-500/30 hover:-translate-y-0.5"
            >
              Start Your Health Chat
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <button
              onClick={() => setOnboardingOpen(true)}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-slate-700 text-slate-300 font-semibold text-base hover:border-teal-500/50 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Set Up Health Profile
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
              System Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              How ZionX Works
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              From your first message to preventive alerts — here&apos;s the full journey.
            </p>
          </FadeIn>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/50 via-indigo-500/30 to-transparent" />

            <div className="space-y-10">
              {STEPS.map((step, i) => (
                <FadeIn key={step.step} delay={i * 100}>
                  <div className={`relative flex items-start gap-6 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                    {/* Step node */}
                    <div className="relative z-10 shrink-0 w-16 h-16 rounded-2xl brand-gradient flex flex-col items-center justify-center shadow-xl shadow-teal-500/20">
                      <span className="text-[10px] font-bold text-teal-200 leading-none">{step.step}</span>
                      <span className="text-xl leading-none mt-0.5">{step.icon}</span>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 ${i % 2 === 0 ? "" : "sm:text-right"}`}>
                      <h3 className="font-bold text-white text-base mb-1.5">{step.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>



 

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="border-t border-slate-800/80 py-8 px-4 sm:px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="brand-gradient w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs">Zx</div>
            <span className="text-sm font-bold text-slate-400">ZionX</span>
            <span className="text-slate-700 text-xs">· AI Preventive Health Assistant</span>
          </div>
          <p className="text-xs text-slate-600 text-center">
            Informational guidance only — not a substitute for professional medical advice.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>Built for Hackathon 2026</span>
            <span>·</span>
            <span>Multi-Agent System</span>
          </div>
        </div>
      </footer>

      {/* ── Onboarding Modal ── */}
      <OnboardingModal open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
    </div>
  );
}
