"use client";

import { useState, useEffect } from "react";
import { getAlertsHistory, getAlertsSummary, getOnboardingProfile } from "@/lib/api";

export default function EmergencyAlerts() {
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadData();
  }, [days]);

  async function loadData() {
    try {
      setLoading(true);
      const [summaryData, alertsData, profileData] = await Promise.all([
        getAlertsSummary(days),
        getAlertsHistory(days),
        getOnboardingProfile().catch(() => ({ profile: {} })),
      ]);
      setSummary(summaryData.summary);
      setAlerts(alertsData.alerts || []);
      setProfile(profileData.profile || {});
    } catch (err) {
      console.error("Failed to load alerts data:", err);
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

  const hasEmergencyContacts = profile?.consent_given && (
    profile?.doctor?.email || 
    (profile?.loved_ones && profile.loved_ones.length > 0)
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Emergency Alerts</h1>
        <p className="text-sm text-slate-500">
          Automatic notifications sent to your emergency contacts during high-risk situations
        </p>
      </div>

      {/* Emergency Contacts Status */}
      <div className={`rounded-xl border-2 p-6 ${
        hasEmergencyContacts
          ? "bg-green-50 border-green-200"
          : "bg-orange-50 border-orange-200"
      }`}>
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
            hasEmergencyContacts ? "bg-green-100" : "bg-orange-100"
          }`}>
            {hasEmergencyContacts ? (
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold mb-1 ${
              hasEmergencyContacts ? "text-green-800" : "text-orange-800"
            }`}>
              {hasEmergencyContacts ? "Emergency System Active" : "Emergency Contacts Not Configured"}
            </h3>
            {hasEmergencyContacts ? (
              <div>
                <p className="text-sm text-green-700 mb-3">
                  ZionX can automatically notify your emergency contacts when high-risk situations are detected.
                </p>
                <div className="space-y-2">
                  {profile?.doctor?.email && (
                    <div className="text-sm text-green-700 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Doctor: {profile.doctor.name} ({profile.doctor.email})
                    </div>
                  )}
                  {profile?.loved_ones && profile.loved_ones.length > 0 && (
                    <div className="text-sm text-green-700 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {profile.loved_ones.length} loved one{profile.loved_ones.length > 1 ? "s" : ""} configured
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-orange-700 mb-3">
                  Configure emergency contacts in your profile to enable automatic alerts during medical emergencies.
                </p>
                <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors">
                  Setup Emergency Contacts
                </button>
              </div>
            )}
          </div>
        </div>
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
          <p className="text-sm text-slate-500">Loading alert history...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  Total Alerts
                </p>
                <p className="text-2xl font-bold text-slate-800">{summary.total_alerts}</p>
              </div>

              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">
                  Successful
                </p>
                <p className="text-2xl font-bold text-green-700">{summary.successful_alerts}</p>
              </div>

              <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">
                  Failed
                </p>
                <p className="text-2xl font-bold text-red-700">{summary.failed_alerts}</p>
              </div>
            </div>
          )}

          {/* Alert History */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Alert History</h2>

            {alerts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-slate-700 mb-1">No emergency alerts sent</h3>
                <p className="text-xs text-slate-500">
                  Emergency alerts will appear here when ZionX detects high-risk health situations.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border-2 ${
                      alert.success
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {alert.success ? (
                          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        <span className={`text-sm font-bold ${
                          alert.success ? "text-green-700" : "text-red-700"
                        }`}>
                          {alert.success ? "Alert Sent Successfully" : "Alert Failed"}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatDate(alert.timestamp)}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-slate-700">Severity:</span>{" "}
                        <span className={`font-bold uppercase ${
                          alert.severity === "high" ? "text-red-600" :
                          alert.severity === "medium" ? "text-orange-600" :
                          "text-yellow-600"
                        }`}>
                          {alert.severity}
                        </span>
                      </div>

                      {alert.symptoms && (
                        <div>
                          <span className="font-medium text-slate-700">Symptoms:</span>{" "}
                          <span className="text-slate-600">{alert.symptoms}</span>
                        </div>
                      )}

                      {alert.ai_assessment && (
                        <div>
                          <span className="font-medium text-slate-700">AI Assessment:</span>{" "}
                          <span className="text-slate-600">{alert.ai_assessment.slice(0, 150)}...</span>
                        </div>
                      )}

                      <div>
                        <span className="font-medium text-slate-700">Status:</span>{" "}
                        <span className={alert.success ? "text-green-600" : "text-red-600"}>
                          {alert.message}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Info Card */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100 p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-800 mb-1">How Emergency Alerts Work</h3>
            <p className="text-xs text-slate-600">
              When ZionX detects a high-risk health situation (based on your symptoms and conversation),
              it can automatically send email alerts to your doctor and loved ones. This ensures you get
              help quickly when you need it most. You maintain full control over who receives alerts
              through your profile settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
