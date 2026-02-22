"use client";

import { useState } from "react";

const NAV_ITEMS = [
  {
    id: "chat",
    label: "New Chat",
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
  },
  {
    id: "memory",
    label: "Health Memory",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    id: "risk",
    label: "Risk Monitor",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    id: "alerts",
    label: "Emergency Alerts",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
];

const AGENTS = [
  { key: "pregnancy",    label: "Pregnancy",       icon: "🤰", color: "text-rose-600",   bg: "bg-rose-50" },
  { key: "diabetes",     label: "Chronic Disease",  icon: "🩸", color: "text-blue-600",   bg: "bg-blue-50" },
  { key: "pediatrics",   label: "Pediatrics",       icon: "👶", color: "text-orange-600", bg: "bg-orange-50" },
  { key: "mental_health",label: "Mental Health",    icon: "🧠", color: "text-violet-600", bg: "bg-violet-50" },
  { key: "emergency",    label: "Emergency Triage", icon: "🚨", color: "text-red-600",    bg: "bg-red-50" },
];

export default function Sidebar({ activeNav = "chat", onNavChange, onNewChat, onOpenProfile, onLogout, username, recentChats = [], onChatSelect }) {
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
            onClick={() => item.id === "chat" ? onNewChat?.() : onNavChange?.(item.id)}
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

      {/* ── Memory Insights ── */}
      <div className="px-3 pb-2">
        <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Long-term Memory
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
            <span className="text-base">🧬</span>
            <div>
              <p className="text-xs font-semibold text-slate-700">Long-term</p>
              <p className="text-[10px] text-slate-400">Health timeline (API pending)</p>
            </div>
          </div>
        </div>
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
              key={chat.thread_id || i}
              onClick={() => onChatSelect?.(chat.thread_id)}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 truncate mb-0.5 transition-colors"
              title={chat.title || "Untitled conversation"}
            >
              <div className="truncate font-medium">{chat.title || "Untitled conversation"}</div>
              {chat.last_message && (
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {chat.last_message}
                </div>
              )}
            </button>
          ))
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-3 border-t border-slate-100 mt-auto">
        <button
          onClick={onOpenProfile}
          className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 hover:border-teal-200 hover:bg-gradient-to-r hover:from-teal-100 hover:to-blue-100 transition-all mb-2"
        >
          <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-bold shrink-0">
            {username ? username.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {username || "Guest"}
            </p>
            <p className="text-[10px] text-slate-400 truncate">View profile</p>
          </div>
          {/* Profile icon */}
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
        
        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}
