const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ─────────────────────────────────────────────────────────────────
   AUTHENTICATION HELPERS
───────────────────────────────────────────────────────────────── */

/** Get authentication headers if user is logged in */
function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  if (token) {
    return {
      "Authorization": `Bearer ${token}`
    };
  }
  return {};
}

/** Get current user ID from localStorage */
export function getCurrentUserId() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userId") || null;
  }
  return null;
}

/** Check if user is logged in */
export function isLoggedIn() {
  return getCurrentUserId() !== null;
}

/** Logout user by clearing localStorage */
export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
  }
}

/** Get current username */
export function getCurrentUsername() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("username") || null;
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────────
   AUTHENTICATION ENDPOINTS
───────────────────────────────────────────────────────────────── */

/** POST /auth/register - Register a new user */
export async function registerUser(username, password, email = null) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Registration failed");
  return data;
}

/** POST /auth/login - Login user and get session token */
export async function loginUser(username, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Login failed");
  return data;
}

/** POST /auth/logout - Logout user and invalidate session */
export async function logoutUserAPI() {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Logout failed");
  logoutUser(); // Clear local storage
  return await response.json();
}

/** GET /auth/verify - Verify if current session is valid */
export async function verifySession() {
  const response = await fetch(`${API_BASE}/auth/verify`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) return false;
  const data = await response.json();
  return data.ok === true;
}

/** GET /auth/me - Get current user info */
export async function getCurrentUser() {
  const response = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Not authenticated");
  const data = await response.json();
  return data.user;
}

/* ─────────────────────────────────────────────────────────────────
   CHAT ENDPOINTS
───────────────────────────────────────────────────────────────── */

/** POST /chat — returns full response object with risk assessment. */
export async function sendChat(message, threadId = "default") {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({ message, thread_id: threadId }),
  });
  if (!response.ok) throw new Error(`Server error ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  // Return full object: { response, risk_level, urgency }
  return data;
}

/* ─────────────────────────────────────────────────────────────────
   HEALTH CHECK
───────────────────────────────────────────────────────────────── */

/** GET /health */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return { ok: false };
    return { ok: true, ...(await res.json()) };
  } catch {
    return { ok: false };
  }
}

/* ─────────────────────────────────────────────────────────────────
   ONBOARDING ENDPOINTS
───────────────────────────────────────────────────────────────── */

/**
 * POST /onboarding/profile
 * Saves the user's health profile for personalised AI guidance.
 * @param {Object} profileData - { allergies, medications_to_avoid, blood_group, conditions, ongoing_issues, emergency_contacts, language, output_mode }
 */
export async function saveOnboardingProfile(profileData) {
  const res = await fetch(`${API_BASE}/onboarding/profile`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(profileData),
  });
  if (!res.ok) throw new Error(`Profile save failed: ${res.status}`);
  return res.json();
}

/**
 * GET /onboarding/profile
 * Gets the user's onboarding profile.
 */
export async function getOnboardingProfile() {
  const res = await fetch(`${API_BASE}/onboarding/profile`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to get profile: ${res.status}`);
  return res.json();
}

/**
 * POST /upload — Upload a medical document for AI fact extraction.
 * @param {File} file - The document file to upload
 * @param {string|null} userId - Optional user ID (used when not authenticated)
 * @returns {Promise<{ok: boolean, message: string, user_id: string}>}
 */
export async function uploadDocument(file, userId = null) {
  const formData = new FormData();
  formData.append("file", file);
  if (userId) formData.append("user_id", userId);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Upload failed: ${res.status}`);
  }
  return res.json();
}

/* ─────────────────────────────────────────────────────────────────
   DAILY TRACKING ENDPOINTS
───────────────────────────────────────────────────────────────── */

/**
 * POST /tracking/daily
 * Submits daily health tracking data (mood, symptoms, energy, medications).
 * @param {Object} trackingData - { mood, symptoms, energy, medications, notes }
 */
export async function submitDailyTracking(trackingData) {
  const res = await fetch(`${API_BASE}/tracking/daily`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(trackingData),
  });
  if (!res.ok) throw new Error(`Tracking submit failed: ${res.status}`);
  return res.json();
}

/**
 * GET /tracking/history
 * Gets user's tracking history.
 * @param {number} days - Number of days to retrieve (optional)
 */
export async function getTrackingHistory(days = null) {
  const url = days 
    ? `${API_BASE}/tracking/history?days=${days}`
    : `${API_BASE}/tracking/history`;
  
  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to get tracking history: ${res.status}`);
  return res.json();
}

/**
 * GET /tracking/summary
 * Gets formatted summary of recent tracking data.
 * @param {number} days - Number of days to summarize (default: 7)
 */
export async function getTrackingSummary(days = 7) {
  const res = await fetch(`${API_BASE}/tracking/summary?days=${days}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to get tracking summary: ${res.status}`);
  return res.json();
}

/* ─────────────────────────────────────────────────────────────────
   MEMORY ENDPOINTS
───────────────────────────────────────────────────────────────── */

/**
 * GET /memory — returns the user's long-term memory facts.
 * Reshapes the response into { insights, patterns } for the UI.
 */
export async function getMemoryInsights() {
  const res = await fetch(`${API_BASE}/memory`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Memory fetch failed: ${res.status}`);
  const data = await res.json();
  // facts is a newline-delimited string; split into an array for the UI
  const insights = data.facts
    ? data.facts.split("\n").filter((line) => line.trim())
    : [];
  return { insights, patterns: [] };
}

/**
 * DELETE /memory?user_id=xxx — permanently deletes all memory for a user.
 * @param {string} userId — the user's ID (available from getCurrentUserId())
 */
export async function deleteMemory(userId) {
  const res = await fetch(`${API_BASE}/memory?user_id=${encodeURIComponent(userId)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Memory delete failed: ${res.status}`);
  return res.json();
}

/* ─────────────────────────────────────────────────────────────────
   VOICE INTERACTION (Speech-to-Text & Text-to-Speech)
───────────────────────────────────────────────────────────────── */

/**
 * POST /speech/transcribe
 * Convert audio to text (Speech-to-Text)
 * @param {Blob} audioBlob - The audio recording
 * @param {string} language - Language code (yo, ha, ig, en)
 */
export async function transcribeAudio(audioBlob, language = "yo") {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  formData.append("language", language);

  const response = await fetch(`${API_BASE}/speech/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error(`Transcription failed: ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.text;
}

/**
 * POST /speech/generate
 * Convert text to audio (Text-to-Speech) with translation.
 * Backend process: English text → translate to target language → generate speech
 * Example: English text + language='yo' → translates to Yoruba → Yoruba speech
 * @param {string} text - English text to convert to speech (will be translated first)
 * @param {string} language - Target language code (yo, ha, ig, en)
 */
export async function generateSpeech(text, language = "yo") {
  const response = await fetch(`${API_BASE}/speech/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language, format: "mp3" }),
  });

  if (!response.ok) throw new Error(`Speech generation failed: ${response.status}`);
  return response.blob();
}

/**
 * GET /speech/languages
 * Get list of supported languages for voice interaction
 */
export async function getSupportedLanguages() {
  const response = await fetch(`${API_BASE}/speech/languages`);
  if (!response.ok) throw new Error(`Failed to fetch languages: ${response.status}`);
  const data = await response.json();
  return data.languages;
}
