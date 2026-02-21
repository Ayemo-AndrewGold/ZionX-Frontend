"use client";

import { useState } from "react";

export default function UserLogin({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();
    const id = userId.trim().toLowerCase().replace(/\s+/g, "_");
    if (id) {
      onLogin(id);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to ZionX</h2>
          <p className="text-sm text-slate-600">
            Your personal AI health assistant
          </p>
        </div>

        {/* Toggle */}
        <div className="flex gap-2 mb-6 bg-slate-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setIsNewUser(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              isNewUser
                ? "bg-white text-teal-700 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            New User
          </button>
          <button
            type="button"
            onClick={() => setIsNewUser(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              !isNewUser
                ? "bg-white text-teal-700 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Returning User
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {isNewUser ? "Create your user ID" : "Enter your user ID"}
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g., john_doe or user123"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800"
              autoFocus
              required
            />
            <p className="mt-2 text-xs text-slate-500">
              {isNewUser 
                ? "Choose a unique ID to track your health journey"
                : "Use the same ID to access your health memory"
              }
            </p>
          </div>

          {/* Info Box */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-blue-800">
                <p className="font-semibold mb-1">Your privacy matters</p>
                <p>Your health data is stored securely and tied to your user ID. Each user has their own private memory.</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            {isNewUser ? "Get Started" : "Continue"}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <p>By continuing, you agree to our Health Data Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
