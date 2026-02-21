"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@/lib/api";

export default function UserSelector({ currentUserId, onUserChange, onClose }) {
  const [users, setUsers] = useState([]);
  const [newUserId, setNewUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectUser(userId) {
    onUserChange(userId);
    onClose();
  }

  function handleCreateUser() {
    const userId = newUserId.trim();
    if (userId) {
      onUserChange(userId);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Select User</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Current User */}
          {currentUserId && (
            <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-xs font-semibold text-teal-700 mb-1">Current User</p>
              <p className="text-sm text-teal-900">{currentUserId}</p>
            </div>
          )}

          {/* Existing Users */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-700 mb-2">Existing Users</p>
            {loading ? (
              <p className="text-sm text-slate-400 italic">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No users found. Create one below.</p>
            ) : (
              <div className="space-y-2">
                {users.map((user) => (
                  <button
                    key={user.user_id}
                    onClick={() => handleSelectUser(user.user_id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      user.user_id === currentUserId
                        ? "border-teal-300 bg-teal-50"
                        : "border-slate-200 hover:border-teal-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {user.user_id.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{user.user_id}</p>
                        <p className="text-xs text-slate-500 truncate">{user.preview}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Create New User */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Create New User</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateUser()}
                placeholder="Enter user ID (e.g., john123)"
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <button
                onClick={handleCreateUser}
                disabled={!newUserId.trim()}
                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Create a new user to start a fresh health journey with separate memory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
