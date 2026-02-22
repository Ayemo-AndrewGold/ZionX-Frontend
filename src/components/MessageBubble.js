"use client";

import { useState, useRef } from "react";
import { SPECIALISTS } from "./SpecialistCards";
import { generateSpeech } from "@/lib/api";

/* ── Inline bold/italic renderer ── */
function renderInline(text) {
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let last = 0, match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[0].startsWith("**")) parts.push(<strong key={match.index}>{match[2]}</strong>);
    else parts.push(<em key={match.index}>{match[3]}</em>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : text;
}

/* ── Markdown-like text renderer ── */
function FormattedText({ text }) {
  const lines = text.split("\n");
  return (
    <div className="flex flex-col gap-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;

        const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const cls =
            level === 1 ? "text-base font-bold text-slate-900 mt-2" :
            level === 2 ? "text-sm font-bold text-slate-800 mt-1.5" :
                          "text-sm font-semibold text-slate-700 mt-1";
          return <p key={i} className={cls}>{renderInline(headingMatch[2])}</p>;
        }

        const bulletMatch = line.match(/^[\-\*•]\s+(.+)/);
        if (bulletMatch) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
              <p className="text-sm leading-relaxed">{renderInline(bulletMatch[1])}</p>
            </div>
          );
        }

        const numberedMatch = line.match(/^(\d+)\.\s+(.+)/);
        if (numberedMatch) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs font-bold text-teal-600 shrink-0 mt-0.5 w-5 text-right">
                {numberedMatch[1]}.
              </span>
              <p className="text-sm leading-relaxed">{renderInline(numberedMatch[2])}</p>
            </div>
          );
        }

        return <p key={i} className="text-sm leading-relaxed">{renderInline(line)}</p>;
      })}
    </div>
  );
}

/* ── Specialist routing badge ── */
function RoutingBadge({ specialist }) {
  const spec = SPECIALISTS[specialist];
  if (!spec) return null;
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${spec.badge}`}>
      <span>{spec.icon}</span>
      <span>{spec.label} Agent</span>
    </div>
  );
}

/* ── Thinking dots ── */
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1 px-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-slate-300"
          style={{ animation: `blink 1.2s ${i * 0.2}s ease-in-out infinite` }}
        />
      ))}
    </div>
  );
}

/* ── Copy button ── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy response"
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600"
    >
      {copied ? (
        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

/* ── Voice playback button ── */
function VoiceButton({ text, language = "yo" }) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const languageNames = {
    'yo': 'Yoruba',
    'ha': 'Hausa',
    'ig': 'Igbo',
    'en': 'English'
  };

  const handlePlay = async () => {
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }

    setLoading(true);
    try {
      const audioBlob = await generateSpeech(text, language);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setPlaying(false);
        setLoading(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
      setPlaying(true);
    } catch (error) {
      console.error("Voice playback error:", error);
      alert("Failed to play voice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const langName = languageNames[language] || language;
  const tooltip = playing 
    ? "Stop voice" 
    : `Play in ${langName}${language !== 'en' ? ' (auto-translated)' : ''}`;

  const languageFlags = {
    'yo': '🇳🇬',
    'ha': '🇳🇬',
    'ig': '🇳🇬',
    'en': '🇬🇧'
  };

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={handlePlay}
        disabled={loading}
        title={tooltip}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-teal-600 disabled:cursor-not-allowed"
      >
        {loading ? (
          <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : playing ? (
          <svg className="w-3.5 h-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
      {language !== 'en' && (
        <span 
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-slate-400 font-medium"
          title={langName}
        >
          {languageFlags[language]} {language.toUpperCase()}
        </span>
      )}
    </div>
  );
}

/* ── Main MessageBubble ── */
export default function MessageBubble({ message, language = "yo" }) {
  const isUser = message.role === "user";
  const isThinking = message.thinking === true;

  return (
    <div className={`message-enter flex w-full ${isUser ? "justify-end" : "justify-start"}`}>

      {/* AI avatar */}
      {!isUser && (
        <div className="flex items-end mr-2 mb-1 shrink-0">
          <div className="brand-gradient w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-black select-none shadow-sm">
            Zx
          </div>
        </div>
      )}

      <div className={`group flex flex-col gap-1.5 max-w-[82%] ${isUser ? "items-end" : "items-start"}`}>

        {/* Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isUser
              ? "brand-gradient text-white rounded-br-sm"
              : "bg-white border border-slate-200/80 text-slate-800 rounded-bl-sm"
          }`}
        >
          {isThinking ? (
            <ThinkingDots />
          ) : isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className={message.streaming ? "cursor-blink" : ""}>
              <FormattedText text={message.content || ""} />
            </div>
          )}
        </div>

        {/* Meta row: badge + timestamp + voice + copy */}
        <div className={`flex items-center gap-2 px-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          {message.specialist && !isUser && (
            <RoutingBadge specialist={message.specialist} />
          )}
          {message.timestamp && (
            <span className="text-[10px] text-slate-400">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          {!isUser && !isThinking && message.content && (
            <>
              <VoiceButton text={message.content} language={language} />
              <CopyButton text={message.content} />
            </>
          )}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex items-end ml-2 mb-1 shrink-0">
          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-bold select-none">
            You
          </div>
        </div>
      )}
    </div>
  );
}
