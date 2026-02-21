"use client";

import { useState } from "react";

const NAV_ITEMS = [
  {
    id: "chat",
    label: "AI Chat",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    id: "tracking",
    label: "Daily Tracking",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    badge: "Soon",
  },
  {
    id: "memory",
    label: "Health Memory",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
    badge: "Soon",
  },
  {
    id: "risk",
    label: "Risk Monitor",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    badge: "Soon",
  },
  {
    id: "alerts",
    label: "Emergency Alerts",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    badge: "Soon",
  },
];

const AGENTS = [
  { key: "pregnancy",    label: "Pregnancy",       icon: "🤰", color: "text-rose-600",   bg: "bg-rose-50" },
  { key: "diabetes",     label: "Chronic Disease",  icon: "🩸", color: "text-blue-600",   bg: "bg-blue-50" },
  { key: "pediatrics",   label: "Pediatrics",       icon: "👶", color: "text-orange-600", bg: "bg-orange-50" },
  { key: "mental_health",label: "Mental Health",    icon: "🧠", color: "text-violet-600", bg: "bg-violet-50" },
  { key: "emergency",    label: "Emergency Triage", icon: "🚨", color: "text-red-600",    bg: "bg-red-50" },
];

export default function Sidebar({ activeNav = "chat", onNavChange, recentChats = [] }) {
  const [agentsExpanded, setAgentsExpanded] = useState(true);

  return (
    <aside className="flex flex-col h-full bg-white border-r border-slate-200/80 overflow-y-auto">
      {/* ── Navigation ── */}
      <nav className="px-3 pt-4 pb-2">
        <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavChange?.(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-all ${
              activeNav === item.id
                ? "nav-item-active"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span className={activeNav === item.id ? "text-teal-700" : "text-slate-400"}>
              {item.icon}
            </span>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wide">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mx-3 my-2 border-t border-slate-100" />

      {/* ── Specialist Agents ── */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setAgentsExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-2 mb-1.5"
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Specialist Agents
          </p>
          <svg
            className={`w-3 h-3 text-slate-400 transition-transform ${agentsExpanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {agentsExpanded && (
          <div className="flex flex-col gap-0.5">
            {AGENTS.map((agent) => (
              <div
                key={agent.key}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-default group"
              >
                <span className={`text-base w-7 h-7 flex items-center justify-center rounded-lg ${agent.bg} shrink-0`}>
                  {agent.icon}
                </span>
                <span className={`text-xs font-medium ${agent.color}`}>{agent.label}</span>
                <span className="ml-auto text-[9px] text-slate-300 group-hover:text-slate-400 font-medium">Active</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mx-3 my-2 border-t border-slate-100" />

      {/* ── Recent Chats ── */}
      <div className="px-3 pb-2 flex-1">
        <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Recent Chats
        </p>
        {recentChats.length === 0 ? (
          <p className="px-3 py-2 text-xs text-slate-400 italic">No recent conversations</p>
        ) : (
          recentChats.slice(0, 6).map((chat, i) => (
            <button
              key={i}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50 truncate mb-0.5"
            >
              {chat.title || "Untitled conversation"}
            </button>
          ))
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-3 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100">
          <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-bold shrink-0">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">Guest User</p>
            <p className="text-[10px] text-slate-400 truncate">No profile set up</p>
          </div>
          {/* API stub: profile settings */}
          <button className="text-slate-400 hover:text-teal-600 transition-colors" title="Settings (coming soon)">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
