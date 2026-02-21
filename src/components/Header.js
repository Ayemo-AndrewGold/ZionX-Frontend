"use client";

import { useEffect, useState } from "react";
import { checkHealth } from "@/lib/api";

export default function Header({ onNewChat, onToggleSidebar, onOpenOnboarding, sidebarOpen }) {
  const [status, setStatus] = useState("checking");
  const [model, setModel] = useState(null);

  useEffect(() => {
    checkHealth().then((res) => {
      setStatus(res.ok ? "online" : "offline");
      if (res.model) setModel(res.model);
    });
    const id = setInterval(() => {
      checkHealth().then((res) => {
        setStatus(res.ok ? "online" : "offline");
        if (res.model) setModel(res.model);
      });
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  const statusMeta = {
    checking: { dot: "bg-amber-400", ring: "ring-amber-200", label: "Connecting…" },
    online:   { dot: "bg-emerald-400", ring: "ring-emerald-200", label: "Online" },
    offline:  { dot: "bg-red-400", ring: "ring-red-200", label: "Offline" },
  };
  const s = statusMeta[status];

  return (
    <header className="shrink-0 z-20 flex items-center justify-between gap-3 px-4 py-2.5 bg-white border-b border-slate-200/80 shadow-sm">
      {/* Left — sidebar toggle + brand */}
      <div className="flex items-center gap-3">
        {/* Hamburger */}
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="flex flex-col justify-center items-center w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors gap-[5px]"
        >
          <span className={`block h-0.5 bg-slate-600 transition-all duration-200 ${sidebarOpen ? "w-5 rotate-45 translate-y-[7px]" : "w-5"}`} />
          <span className={`block h-0.5 bg-slate-600 transition-all duration-200 ${sidebarOpen ? "opacity-0 w-0" : "w-4"}`} />
          <span className={`block h-0.5 bg-slate-600 transition-all duration-200 ${sidebarOpen ? "w-5 -rotate-45 -translate-y-[7px]" : "w-5"}`} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="brand-gradient flex items-center justify-center w-9 h-9 rounded-xl text-white font-black text-sm select-none shadow-md">
            Zx
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-slate-900 leading-tight tracking-tight">ZionX</h1>
            <p className="text-[10px] text-slate-400 leading-tight">AI Preventive Health</p>
          </div>
        </div>
      </div>

      {/* Centre — tagline (desktop) */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100">
        <span className="text-[11px] text-teal-700 font-medium">
          Multi-Agent · Preventive · Context-Aware
        </span>
      </div>

      {/* Right — status + actions */}
      <div className="flex items-center gap-2.5">
        {/* Status pill */}
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${
          status === "online"   ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
          status === "offline"  ? "bg-red-50 border-red-200 text-red-700" :
                                  "bg-amber-50 border-amber-200 text-amber-700"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === "online" ? "pulse-ring" : ""}`} />
          <span className="font-medium">{s.label}</span>
          {status === "online" && model && (
            <span className="opacity-60">· {model}</span>
          )}
        </div>

        {/* Health Profile button */}
        <button
          onClick={onOpenOnboarding}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="hidden sm:inline">My Profile</span>
        </button>

        {/* New chat */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg brand-gradient text-white hover:opacity-90 transition-opacity shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>
    </header>
  );
}
