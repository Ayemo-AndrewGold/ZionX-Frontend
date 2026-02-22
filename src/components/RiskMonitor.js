"use client";

import { useState, useEffect } from "react";
import { getRiskHistory, getRiskSummary } from "@/lib/api";

const RISK_COLORS = {
  high: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
  medium: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
  low: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
};

const URGENCY_LABELS = {
  emergency: { label: "Emergency", icon: "🚨", color: "text-red-600" },
  urgent: { label: "Urgent", icon: "⚠️", color: "text-orange-600" },
  routine: { label: "Routine", icon: "📋", color: "text-blue-600" },
  monitoring: { label: "Monitoring", icon: "👀", color: "text-slate-600" },
};

export default function RiskMonitor() {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadData();
  }, [days]);

  async function loadData() {
    try {
      setLoading(true);
      const [summaryData, historyData] = await Promise.all([
        getRiskSummary(days),
        getRiskHistory(days),
      ]);
      setSummary(summaryData.summary);
      setHistory(historyData.assessments || []);
    } catch (err) {
      console.error("Failed to load risk data:", err);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Risk Monitor</h1>
        <p className="text-sm text-slate-500">
          Track health risk assessments from your conversations with ZionX
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {[7, 14, 30, 90].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              days === d
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
            }`}
          >
            {d} days
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <svg className="animate-spin h-8 w-8 text-teal-600 mx-auto mb-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-slate-500">Loading risk assessments...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  Total Assessments
                </p>
                <p className="text-2xl font-bold text-slate-800">{summary.total_assessments}</p>
              </div>

              <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">
                  High Risk
                </p>
                <p className="text-2xl font-bold text-red-700">{summary.high_risk_count}</p>
              </div>

              <div className="bg-orange-50 rounded-lg border border-orange-200 p-4">
                <p className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">
                  Medium Risk
                </p>
                <p className="text-2xl font-bold text-orange-700">{summary.medium_risk_count}</p>
              </div>

              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">
                  Low Risk
                </p>
                <p className="text-2xl font-bold text-green-700">{summary.low_risk_count}</p>
              </div>
            </div>
          )}

          {/* High Risk Events */}
          {summary && summary.high_risk_events && summary.high_risk_events.length > 0 && (
            <div className="bg-red-50 rounded-xl border-2 border-red-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 className="text-lg font-semibold text-red-800">Recent High-Risk Events</h2>
              </div>
              <div className="space-y-3">
                {summary.high_risk_events.map((event, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border border-red-200">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-slate-500">{formatDate(event.timestamp)}</span>
                      {event.emergency_alert_sent && (
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                          Alert Sent
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mb-2">
                      <span className="font-medium">Concern:</span> {event.user_message}
                    </p>
                    {event.urgency && (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${URGENCY_LABELS[event.urgency]?.color || "text-slate-600"}`}>
                          {URGENCY_LABELS[event.urgency]?.icon} {URGENCY_LABELS[event.urgency]?.label || event.urgency}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assessment History */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Assessment Timeline</h2>

            {history.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-slate-700 mb-1">No risk assessments yet</h3>
                <p className="text-xs text-slate-500">
                  Risk assessments will appear here as you chat with ZionX about health concerns.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((assessment, i) => {
                  const riskColor = RISK_COLORS[assessment.risk_level] || RISK_COLORS.low;
                  const urgencyInfo = URGENCY_LABELS[assessment.urgency] || {};

                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border ${riskColor.bg} ${riskColor.border}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${riskColor.dot}`}></div>
                          <span className={`text-xs font-bold uppercase tracking-wide ${riskColor.text}`}>
                            {assessment.risk_level} Risk
                          </span>
                          {assessment.urgency && (
                            <span className={`text-xs font-medium ${urgencyInfo.color || "text-slate-600"}`}>
                              {urgencyInfo.icon} {urgencyInfo.label || assessment.urgency}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">
                          {formatDate(assessment.timestamp)}
                        </span>
                      </div>

                      <p className="text-sm text-slate-700 mb-2">
                        <span className="font-medium">Query:</span> {assessment.user_message || "N/A"}
                      </p>

                      {assessment.emergency_alert_sent && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          Emergency alert sent to contacts
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
