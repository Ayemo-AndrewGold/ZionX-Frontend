"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import OnboardingModal from "./OnboardingModal";
import LoginModal from "./LoginModal";
import DailyTracking from "./DailyTracking";
import HealthMemory from "./HealthMemory";
import RiskMonitor from "./RiskMonitor";
import EmergencyAlerts from "./EmergencyAlerts";
import { SPECIALISTS } from "./SpecialistCards";
import { sendChat, isLoggedIn, getCurrentUserId, getCurrentUsername, logoutUser, getChatHistory, getRecentChats } from "@/lib/api";
import { detectSpecialist, uuid } from "@/lib/utils";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [threadId, setThreadId] = useState(() => uuid());
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("chat");
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [activeSpecialist, setActiveSpecialist] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("yo"); // Default to Yoruba
  const [recentChats, setRecentChats] = useState([]);

  const bottomRef = useRef(null);

  // Check authentication on mount
  useEffect(() => {
    if (isLoggedIn()) {
      setUserId(getCurrentUserId());
      setUsername(getCurrentUsername());
    } else {
      // Show login modal if not logged in
      setLoginModalOpen(true);
    }
  }, []);

  // Load chat history when userId and threadId are available
  useEffect(() => {
    async function loadHistory() {
      if (!userId || !threadId) return;
      
      try {
        const history = await getChatHistory(threadId);
        if (history && history.length > 0) {
          // Convert backend message format to component format
          const formattedMessages = history.map(msg => ({
            id: uuid(),
            role: msg.role,
            content: msg.content,
            timestamp: Date.now(),
            streaming: false,
            thinking: false
          }));
          setMessages(formattedMessages);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
        // Don't show error to user, just start with empty chat
      }
    }
    
    loadHistory();
  }, [userId, threadId]);

  // Load recent chats when user logs in
  useEffect(() => {
    async function loadRecentChats() {
      if (!userId) return;
      
      try {
        const chats = await getRecentChats(10);
        setRecentChats(chats);
      } catch (err) {
        console.error("Failed to load recent chats:", err);
        // Don't show error, just keep empty array
      }
    }
    
    loadRecentChats();
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Responsive: collapse sidebar on small screens
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
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

  const handleLoginSuccess = useCallback((user) => {
    setUserId(user.user_id);
    setUsername(user.username);
    setLoginModalOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logoutUser();
    setUserId(null);
    setUsername(null);
    setMessages([]);
    setLoginModalOpen(true);
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
      const result = await sendChat(text, threadId);
      updateLastAiMessage({ 
        content: result.response, 
        streaming: false, 
        thinking: false,
        risk_level: result.risk_level,
        urgency: result.urgency
      });
      
      // Refresh recent chats after sending a message
      try {
        const chats = await getRecentChats(10);
        setRecentChats(chats);
      } catch (err) {
        console.error("Failed to refresh recent chats:", err);
      }
    } catch (err) {
      updateLastAiMessage({ 
        content: `⚠️ Connection error: ${err.message}`, 
        streaming: false, 
        thinking: false 
      });
    } finally {
      setStreaming(false);
    }
  }

  function handleChatSelect(selectedThreadId) {
    if (streaming) return;
    
    // Switch to the selected thread
    setThreadId(selectedThreadId);
    setMessages([]);
    setInput("");
    setActiveSpecialist(null);
    setActiveNav("chat");
  }

  function handleNewChat() {
    if (streaming) return;
    // Create a new thread ID
    setThreadId(uuid());
    setMessages([]);
    setInput("");
    setActiveSpecialist(null);
    setActiveNav("chat"); // Return to chat view
  }

  function renderMainContent() {
    // Render based on active navigation
    switch (activeNav) {
      case "tracking":
        return (
          <div className="flex-1 overflow-y-auto">
            <DailyTracking />
          </div>
        );
      case "memory":
        return (
          <div className="flex-1 overflow-y-auto">
            <HealthMemory />
          </div>
        );
      case "risk":
        return (
          <div className="flex-1 overflow-y-auto">
            <RiskMonitor />
          </div>
        );
      case "alerts":
        return (
          <div className="flex-1 overflow-y-auto">
            <EmergencyAlerts />
          </div>
        );
      case "chat":
      default:
        // Render chat interface
        return (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              {isEmpty ? (
                <div className="h-full flex items-center justify-center px-4">
                  <div className="text-center max-w-md">
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Wellah</h2>
                    <p className="text-slate-500 text-sm">Ready when you are.</p>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto w-full px-4 py-6 flex flex-col gap-5">
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} language={selectedLanguage} />
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
              userId={userId}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </>
        );
    }
  }

  const isEmpty = messages.length === 0;
  const currentSpecialist = activeSpecialist ? SPECIALISTS[activeSpecialist] : null;

  // Don't render chat if not logged in
  if (!userId) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-slate-100">
        <LoginModal
          open={loginModalOpen}
          onClose={() => {}}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100">

      {/* ── Header ── */}
      <Header
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
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
              onNewChat={handleNewChat}
              onOpenProfile={() => setOnboardingOpen(true)}
              onLogout={handleLogout}
              username={username}
              recentChats={recentChats}
              onChatSelect={handleChatSelect}
            />
          )}
        </div>

        {/* Main area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          {renderMainContent()}
        </main>
      </div>

      {/* ── Onboarding Modal ── */}
      <OnboardingModal open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
      
      {/* ── Login Modal ── */}
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
