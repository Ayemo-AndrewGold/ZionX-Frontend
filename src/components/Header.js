"use client";

import { useEffect, useState } from "react";
import { checkHealth } from "@/lib/api";

export default function Header({ onToggleSidebar, sidebarOpen }) {
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
      {/* Left — sidebar toggle */}
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
      </div>

      {/* Right — Logo */}
      <div className="flex items-center gap-2.5">
        <div className="brand-gradient flex items-center justify-center w-9 h-9 rounded-xl text-white font-black text-sm select-none shadow-md">
          Zx
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-bold text-slate-900 leading-tight tracking-tight">ZionX</h1>
          <p className="text-[10px] text-slate-400 leading-tight">AI Preventive Health</p>
        </div>
      </div>
    </header>
  );
}
