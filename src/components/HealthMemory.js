"use client";

import { useState, useEffect } from "react";
import { getMemoryInsights, uploadDocument } from "@/lib/api";

export default function HealthMemory() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadInsights();
  }, []);

  async function loadInsights() {
    try {
      setLoading(true);
      const data = await getMemoryInsights();
      setInsights(data.insights || []);
    } catch (err) {
      console.error("Failed to load memory insights:", err);
      setMessage({ type: "error", text: `Failed to load insights: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setMessage({ type: "", text: "" });

      await uploadDocument(file);
      setMessage({ type: "success", text: "✓ Document uploaded and processed successfully!" });

      // Reload insights
      setTimeout(() => loadInsights(), 1000);
    } catch (err) {
      setMessage({ type: "error", text: `Upload failed: ${err.message}` });
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset file input
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Health Memory</h1>
        <p className="text-sm text-slate-500">
          Your personalized health timeline built from conversations and medical documents
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Upload Medical Documents</h2>
        <p className="text-sm text-slate-600 mb-4">
          Upload medical reports, prescriptions, or lab results. ZionX will automatically extract
          and remember important health facts.
        </p>

        <label className="block">
          <input
            type="file"
            accept=".txt,.pdf,.docx,.md"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <div className="flex items-center justify-center w-full p-6 border-2 border-dashed border-slate-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all cursor-pointer">
            {uploading ? (
              <div className="text-sm text-slate-600">
                <svg className="animate-spin h-5 w-5 inline-block mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing document...
              </div>
            ) : (
              <div className="text-center">
                <svg className="w-10 h-10 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-slate-600">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PDF, DOCX, TXT, MD (max 10MB)
                </p>
              </div>
            )}
          </div>
        </label>

        {message.text && (
          <div className={`mt-4 p-3 rounded-lg ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {message.text}
          </div>
        )}
      </div>

      {/* Memory Insights */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Your Health Timeline</h2>
          <button
            onClick={loadInsights}
            disabled={loading}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 text-teal-600 mx-auto mb-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm text-slate-500">Loading your health timeline...</p>
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-slate-700 mb-1">No health memories yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start chatting with ZionX or upload medical documents to build your personalized health timeline.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{insight}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100 p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-800 mb-1">How Health Memory Works</h3>
            <p className="text-xs text-slate-600">
              ZionX automatically learns from your conversations and uploaded documents. It remembers
              important health facts like allergies, medications, past conditions, and test results.
              This helps provide more personalized and accurate health guidance over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
