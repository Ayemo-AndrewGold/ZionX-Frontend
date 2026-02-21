"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import OnboardingModal from "./OnboardingModal";
import UserLogin from "./UserLogin";
import { SPECIALISTS } from "./SpecialistCards";
import { streamChat, detectSpecialist, getThreads, getMemory } from "@/lib/api";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// Local storage keys
const STORAGE_CHATS = "zionx_chats";
const STORAGE_CURRENT_THREAD = "zionx_current_thread";
const STORAGE_USER_ID = "zionx_user_id";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [userId, setUserId] = useState(() => {
    // Try to restore user ID from localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_USER_ID) || null;
    }
    return null;
  });
  const [threadId, setThreadId] = useState(() => {
    // Try to restore last thread ID from localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_CURRENT_THREAD) || uuid();
    }
    return uuid();
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("chat");
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [activeSpecialist, setActiveSpecialist] = useState(null);
  const [recentChats, setRecentChats] = useState([]);
  const [memoryFacts, setMemoryFacts] = useState("");
  const [showUserLogin, setShowUserLogin] = useState(false);

  const bottomRef = useRef(null);

  // Check if user is logged in
  useEffect(() => {
    if (!userId) {
      setShowUserLogin(true);
    }
  }, [userId]);

  // Handle user login
  function handleUserLogin(newUserId) {
    setUserId(newUserId);
    localStorage.setItem(STORAGE_USER_ID, newUserId);
    setShowUserLogin(false);
  }

  // Handle user logout
  function handleUserLogout() {
    setUserId(null);
    localStorage.removeItem(STORAGE_USER_ID);
    setMessages([]);
    setRecentChats([]);
    setShowUserLogin(true);
  }

  // Load chats from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_CHATS);
      if (stored) {
        try {
          const chats = JSON.parse(stored);
          setRecentChats(chats);
          
          // Load messages for current thread
          const currentChat = chats.find((c) => c.threadId === threadId);
          if (currentChat?.messages) {
            setMessages(currentChat.messages);
          }
        } catch (err) {
          console.error("Error loading chats:", err);
        }
      }
    }
  }, []);

  // Save current thread ID to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_CURRENT_THREAD, threadId);
    }
  }, [threadId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save chats to localStorage whenever messages or recentChats change
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      const chatIndex = recentChats.findIndex((c) => c.threadId === threadId);
      const title = messages.find((m) => m.role === "user")?.content.slice(0, 50) || "New conversation";
      
      const updatedChat = {
        threadId,
        title,
        lastUpdated: Date.now(),
        messages,
      };

      let updatedChats;
      if (chatIndex >= 0) {
        updatedChats = [...recentChats];
        updatedChats[chatIndex] = updatedChat;
      } else {
        updatedChats = [updatedChat, ...recentChats];
      }

      // Keep only last 20 chats
      updatedChats = updatedChats.slice(0, 20);
      
      setRecentChats(updatedChats);
      localStorage.setItem(STORAGE_CHATS, JSON.stringify(updatedChats));
    }
  }, [messages, threadId]);

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

  async function handleSend() {
    const text = input.trim();
    if (!text || streaming || !userId) return;
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

      for await (const chunk of streamChat(text, threadId, userId)) {
        if (chunk.done) break;
        if (chunk.error) {
          updateLastAiMessage({ content: `⚠️ ${chunk.error}`, streaming: false, thinking: false });
          break;
        }
        if (chunk.token) {
          accumulated += chunk.token;
          if (firstToken) { 
            firstToken = false; 
            updateLastAiMessage({ thinking: false }); 
          }
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
    const newThreadId = uuid();
    setThreadId(newThreadId);
    setMessages([]);
    setInput("");
    setActiveSpecialist(null);
  }

  function handleSelectChat(chat) {
    if (streaming) return;
    setThreadId(chat.threadId);
    setMessages(chat.messages || []);
    setInput("");
    setActiveSpecialist(null);
  }

  async function loadMemoryForCurrentThread() {
    if (!userId) return;
    try {
      const facts = await getMemory(userId);
      setMemoryFacts(facts);
    } catch (err) {
      console.error("Error loading memory:", err);
      setMemoryFacts("Error loading memory");
    }
  }

  // Load memory when switching to memory view
  useEffect(() => {
    if (activeNav === "memory" && userId) {
      loadMemoryForCurrentThread();
    }
  }, [activeNav, userId]);

  const isEmpty = messages.length === 0;
  const currentSpecialist = activeSpecialist ? SPECIALISTS[activeSpecialist] : null;

  // Don't render main UI until user is logged in
  if (!userId) {
    return <UserLogin onLogin={handleUserLogin} />;
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
              onSelectChat={handleSelectChat}
              onLogout={handleUserLogout}
              recentChats={recentChats}
              currentThreadId={threadId}
              currentUserId={userId}
            />
          )}
        </div>

        {/* Main chat area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">

          {/* Render different content based on activeNav */}
          {activeNav === "chat" ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto">
                {isEmpty ? (
                  <div className="h-full flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                      <h2 className="text-2xl font-semibold text-slate-700 mb-2">ZionX</h2>
                      <p className="text-slate-500 text-sm">Ready when you are.</p>
                    </div>
                  </div>
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
            </>
          ) : activeNav === "memory" ? (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">Long-term Health Memory</h2>
                <p className="text-sm text-slate-600 mb-6">
                  This is what ZionX remembers about your health journey for personalized care.
                </p>
                
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  {memoryFacts ? (
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-slate-700 font-sans text-sm leading-relaxed">
                        {memoryFacts}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">No long-term memory stored yet for this conversation.</p>
                  )}
                </div>

                <button
                  onClick={() => setActiveNav("chat")}
                  className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Back to Chat
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">Coming Soon</h2>
                <p className="text-slate-600">This feature is under development.</p>
                <button
                  onClick={() => setActiveNav("chat")}
                  className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Back to Chat
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Onboarding Modal ── */}
      <OnboardingModal open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
    </div>
  );
}
