"use client";

import { useRef, useEffect, useState } from "react";
import { uploadDocument, transcribeAudio } from "@/lib/api";

export default function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  disabled, 
  userId = "guest",
  selectedLanguage = "yo",
  onLanguageChange
}) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcribing, setTranscribing] = useState(false);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [value]);

  // Recording timer
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await handleTranscription(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  async function handleTranscription(audioBlob) {
    setTranscribing(true);
    try {
      const transcribedText = await transcribeAudio(audioBlob, selectedLanguage);
      onChange(value + (value ? " " : "") + transcribedText);
    } catch (error) {
      console.error("Transcription error:", error);
      setUploadMessage(`✗ ${error.message}`);
      setTimeout(() => setUploadMessage(""), 5000);
    } finally {
      setTranscribing(false);
    }
  }

  function toggleRecording() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage("");

    try {
      const result = await uploadDocument(file, userId);
      setUploadMessage(`✓ ${result.message || "Report uploaded successfully!"}`);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Clear success message after 3 seconds
      setTimeout(() => setUploadMessage(""), 3000);
    } catch (error) {
      setUploadMessage(`✗ ${error.message}`);
      setTimeout(() => setUploadMessage(""), 5000);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="shrink-0 bg-white border-t border-slate-200/80 px-4 py-3">
      <div className="max-w-3xl mx-auto space-y-2">

        {/* Input card */}
        <div
          className={`rounded-2xl border transition-all shadow-sm ${
            disabled
              ? "border-slate-200 bg-slate-50"
              : "border-slate-300 bg-white focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100"
          }`}
        >
          {/* Textarea row */}
          <div className="flex items-end gap-2 px-4 pt-3 pb-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={disabled ? "ZionX is responding…" : "Describe your health concern…"}
              className="flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none py-0.5 max-h-40 disabled:cursor-not-allowed leading-relaxed"
            />

            {/* Send button */}
            <button
              onClick={onSend}
              disabled={disabled || !value.trim()}
              className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all shrink-0 mb-0.5 ${
                disabled || !value.trim()
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "brand-gradient text-white hover:opacity-90 shadow-sm"
              }`}
            >
              {disabled ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              )}
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1 px-3 pb-2 border-t border-slate-100 pt-2">
            {/* Voice input */}
            <button
              type="button"
              onClick={toggleRecording}
              disabled={disabled || transcribing}
              title={isRecording ? "Stop recording" : "Start voice input"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : transcribing
                  ? "text-slate-400 cursor-not-allowed"
                  : "text-teal-600 hover:bg-teal-50"
              }`}
            >
              {transcribing ? (
                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
              <span>
                {transcribing 
                  ? "Processing..." 
                  : isRecording 
                  ? `${recordingTime}s` 
                  : "Voice"}
              </span>
            </button>

            {/* Language selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange?.(e.target.value)}
              disabled={disabled || isRecording}
              className="px-2 py-1 rounded-lg text-xs border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors disabled:cursor-not-allowed"
              title="Select language"
            >
              <option value="yo">🇳🇬 Yoruba</option>
              <option value="ha">🇳🇬 Hausa</option>
              <option value="ig">🇳🇬 Igbo</option>
              <option value="en">🇬🇧 English</option>
            </select>

            {/* Video input stub */}
            <button
              title="Video input (coming soon)"
              disabled
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Video</span>
            </button>

            {/* Attach stub */}
            <button
              type="button"
              title="Attach medical report"
              disabled={uploading || disabled}
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                uploading || disabled
                  ? "text-slate-400 cursor-not-allowed"
                  : "text-teal-600 hover:bg-teal-50"
              }`}
            >
              {uploading ? (
                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              )}
              <span>{uploading ? "Uploading..." : "Attach Report"}</span>
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.doc,.docx,.md"
              onChange={handleFileChange}
              disabled={uploading || disabled}
              style={{ display: "none" }}
            />

            <div className="flex-1" />
            
            {/* Upload status message */}
            {uploadMessage && (
              <div
                className={`text-xs px-2 py-1 rounded ${
                  uploadMessage.startsWith("✗") 
                    ? "text-red-600 bg-red-50" 
                    : "text-green-600 bg-green-50"
                }`}
              >
                {uploadMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
