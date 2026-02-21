"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Header from "./Header";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import SpecialistCards from "./SpecialistCards";
import { streamChat, detectSpecialist } from "@/lib/api";

/** Generate a simple UUID v4 without external deps */
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

  const bottomRef = useRef(null);
  const abortRef = useRef(null); // for future abort support

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    // Add user message
    appendMessage({
      id: uuid(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    });

    // Add placeholder AI message (thinking)
    const aiId = uuid();
    appendMessage({
      id: aiId,
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
          updateLastAiMessage({
            content: `⚠️ ${chunk.error}`,
            streaming: false,
            thinking: false,
          });
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

      // Finalize
      updateLastAiMessage({ streaming: false, thinking: false });
    } catch (err) {
      updateLastAiMessage({
        content: `⚠️ Connection error: ${err.message}`,
        streaming: false,
        thinking: false,
      });
    } finally {
      setStreaming(false);
    }
  }

  function handleNewChat() {
    if (streaming) return; // don't allow reset mid-stream
    setMessages([]);
    setInput("");
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <Header onNewChat={handleNewChat} />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          /* Empty state — specialist cards */
          <SpecialistCards onExample={(ex) => setInput(ex)} />
        ) : (
          <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-5">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
        {/* Anchor for scrolling when on empty state */}
        {isEmpty && <div ref={bottomRef} />}
      </div>

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        disabled={streaming}
      />
    </div>
  );
}
