"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import SpecialistCards from "./SpecialistCards";
import RiskPanel from "./RiskPanel";
import OnboardingModal from "./OnboardingModal";
import { SPECIALISTS } from "./SpecialistCards";
import { streamChat, detectSpecialist } from "@/lib/api";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [threadId] = useState(() => uuid());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("chat");
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [activeSpecialist, setActiveSpecialist] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Responsive: collapse sidebar/panel on small screens
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
        setPanelOpen(false);
      } else if (window.innerWidth < 1200) {
        setPanelOpen(false);
        setSidebarOpen(true);
      } else {
        setSidebarOpen(true);
        setPanelOpen(true);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const appendMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const updateLastAiMessage = useCallback((updater) => {
    setMessages((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === "assistant") {
          copy[i] = typeof updater === "function" ? updater(copy[i]) : { ...copy[i], ...updater };
          break;
        }
      }
      return copy;
    });
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");

    const specialist = detectSpecialist(text);
    if (specialist) setActiveSpecialist(specialist);

    appendMessage({ id: uuid(), role: "user", content: text, timestamp: Date.now() });

    appendMessage({
      id: uuid(),
      role: "assistant",
      content: "",
      streaming: true,
      thinking: true,
      specialist,
      timestamp: Date.now(),
    });

    setStreaming(true);

    try {
      let accumulated = "";
      let firstToken = true;

      for await (const chunk of streamChat(text, threadId)) {
        if (chunk.done) break;
        if (chunk.error) {
          updateLastAiMessage({ content: `⚠️ ${chunk.error}`, streaming: false, thinking: false });
          break;
        }
        if (chunk.token) {
          accumulated += chunk.token;
          if (firstToken) { firstToken = false; updateLastAiMessage({ thinking: false }); }
          updateLastAiMessage({ content: accumulated });
        }
      }
      updateLastAiMessage({ streaming: false, thinking: false });
    } catch (err) {
      updateLastAiMessage({ content: `⚠️ Connection error: ${err.message}`, streaming: false, thinking: false });
    } finally {
      setStreaming(false);
    }
  }

  function handleNewChat() {
    if (streaming) return;
    setMessages([]);
    setInput("");
    setActiveSpecialist(null);
  }

  const isEmpty = messages.length === 0;
  const currentSpecialist = activeSpecialist ? SPECIALISTS[activeSpecialist] : null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100">

      {/* ── Header ── */}
      <Header
        onNewChat={handleNewChat}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onOpenOnboarding={() => setOnboardingOpen(true)}
        sidebarOpen={sidebarOpen}
      />

      {/* ── Body: Sidebar + Chat + Panel ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <div
          className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
            sidebarOpen ? "w-[260px]" : "w-0"
          }`}
        >
          {sidebarOpen && (
            <Sidebar
              activeNav={activeNav}
              onNavChange={setActiveNav}
              recentChats={[]}
            />
          )}
        </div>

        {/* Main chat area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {isEmpty ? (
              <SpecialistCards onExample={(ex) => setInput(ex)} />
            ) : (
              <div className="max-w-3xl mx-auto w-full px-4 py-6 flex flex-col gap-5">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={bottomRef} />
              </div>
            )}
            {isEmpty && <div ref={bottomRef} />}
          </div>

          {/* Input */}
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            disabled={streaming}
          />
        </main>

        {/* Right panel — Risk & Tracking */}
        <div
          className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
            panelOpen ? "w-[300px]" : "w-0"
          }`}
        >
          {panelOpen && (
            <RiskPanel currentSpecialist={currentSpecialist} />
          )}
        </div>

        {/* Panel toggle button (always visible) */}
        <button
          onClick={() => setPanelOpen((v) => !v)}
          title={panelOpen ? "Hide panel" : "Show health panel"}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-5 h-12 bg-white border border-slate-200 rounded-l-lg flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors shadow-sm"
          style={{ right: panelOpen ? "300px" : "0" }}
        >
          <svg
            className={`w-3 h-3 transition-transform ${panelOpen ? "rotate-0" : "rotate-180"}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Onboarding Modal ── */}
      <OnboardingModal open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
    </div>
  );
}
