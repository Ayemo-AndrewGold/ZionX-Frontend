"use client";

import { useRef, useEffect } from "react";

export default function ChatInput({ value, onChange, onSend, disabled }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [value]);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  }

  return (
    <div className="px-4 py-3 bg-white border-t border-slate-200 shrink-0">
      <div className="max-w-2xl mx-auto">
        {/* Disclaimer */}
        <p className="text-[10px] text-center text-slate-400 mb-2">
          ZionX provides informational guidance only — always consult a
          qualified healthcare professional for medical decisions.
        </p>

        {/* Input row */}
        <div
          className={`flex items-end gap-2 rounded-2xl border px-4 py-2 transition-colors ${
            disabled
              ? "border-slate-200 bg-slate-50"
              : "border-slate-300 bg-white focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100"
          }`}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              disabled ? "ZionX is responding…" : "Describe your health concern…"
            }
            className="flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none py-1 max-h-40 disabled:cursor-not-allowed"
          />

          {/* Send button */}
          <button
            onClick={onSend}
            disabled={disabled || !value.trim()}
            className={`flex items-center justify-center w-8 h-8 rounded-xl transition-colors shrink-0 mb-0.5 ${
              disabled || !value.trim()
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-teal-700 text-white hover:bg-teal-800"
            }`}
          >
            {disabled ? (
              // Spinner
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              // Arrow up
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                />
              </svg>
            )}
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-300 mt-1.5">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
