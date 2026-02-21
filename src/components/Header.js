"use client";

import { useEffect, useState } from "react";
import { checkHealth } from "@/lib/api";

export default function Header({ onNewChat }) {
  const [status, setStatus] = useState("checking"); // "checking" | "online" | "offline"
  const [model, setModel] = useState(null);

  useEffect(() => {
    checkHealth().then((res) => {
      setStatus(res.ok ? "online" : "offline");
      if (res.model) setModel(res.model);
    });

    // re-check every 30 s
    const id = setInterval(() => {
      checkHealth().then((res) => {
        setStatus(res.ok ? "online" : "offline");
        if (res.model) setModel(res.model);
      });
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  const statusColors = {
    checking: "bg-amber-400",
    online: "bg-emerald-400",
    offline: "bg-red-400",
  };

  const statusLabels = {
    checking: "Connecting…",
    online: "Online",
    offline: "Offline",
  };

  return (
    <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200 shadow-sm shrink-0 z-10">
      {/* Logo + brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal-700 text-white font-bold text-base select-none">
          Zx
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-900 leading-tight">
            ZionX
          </h1>
          <p className="text-xs text-slate-500 leading-tight">
            Specialized AI Healthcare
          </p>
        </div>
      </div>

      {/* Actions + status */}
      <div className="flex items-center gap-4">
        {/* Status pill */}
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${statusColors[status]}`}
          />
          <span className="text-xs text-slate-500">
            {statusLabels[status]}
            {status === "online" && model && (
              <span className="ml-1 text-slate-400">· {model}</span>
            )}
          </span>
        </div>

        {/* New chat button */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-teal-700 text-white hover:bg-teal-800 transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          New chat
        </button>
      </div>
    </header>
  );
}
