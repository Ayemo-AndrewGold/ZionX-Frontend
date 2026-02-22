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

/** POST /chat — returns full response string. */
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
  return data.response;
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
   ONBOARDING  (API stub — integrate when backend is ready)
───────────────────────────────────────────────────────────────── */

/**
 * POST /onboarding/profile
 * Saves the user's health profile for personalised AI guidance.
 * @param {Object} profileData - { name, age, bloodGroup, allergies, avoidMeds, conditions, doctorEmail, emergencyContact, consentAlerts }
 */
export async function saveOnboardingProfile(profileData) {
  // TODO: uncomment when backend endpoint is ready
  // const res = await fetch(`${API_BASE}/onboarding/profile`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(profileData),
  // });
  // if (!res.ok) throw new Error(`Profile save failed: ${res.status}`);
  // return res.json();
  console.log("[API STUB] saveOnboardingProfile:", profileData);
  return { ok: true };
}

/**
 * POST /onboarding/documents
 * Uploads a medical document for AI summarisation.
 * @param {FormData} formData - contains the file
 */
export async function uploadMedicalDocument(formData) {
  // TODO: uncomment when backend endpoint is ready
  // const res = await fetch(`${API_BASE}/onboarding/documents`, {
  //   method: "POST",
  //   body: formData,
  // });
  // if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  // return res.json();
  console.log("[API STUB] uploadMedicalDocument");
  return { ok: true, summary: "Document summary pending API integration." };
}

/* ─────────────────────────────────────────────────────────────────
   DAILY TRACKING  (API stub)
───────────────────────────────────────────────────────────────── */

/**
 * POST /tracking/daily
 * Submits daily health tracking data (mood, symptoms, energy, medications).
 * @param {Object} trackingData - { mood, symptoms, energy, meds, threadId }
 */
export async function submitDailyTracking(trackingData) {
  // TODO: uncomment when backend endpoint is ready
  // const res = await fetch(`${API_BASE}/tracking/daily`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(trackingData),
  // });
  // if (!res.ok) throw new Error(`Tracking submit failed: ${res.status}`);
  // return res.json();
  console.log("[API STUB] submitDailyTracking:", trackingData);
  return { ok: true };
}

/* ─────────────────────────────────────────────────────────────────
   RISK ASSESSMENT  (API stub)
───────────────────────────────────────────────────────────────── */

/**
 * GET /risk/score?thread_id=xxx
 * Returns the current dynamic risk score for a user session.
 * @param {string} threadId
 * @returns {{ level: "low"|"moderate"|"high"|"critical", score: number }}
 */
export async function getRiskScore(threadId) {
  // TODO: uncomment when backend endpoint is ready
  // const res = await fetch(`${API_BASE}/risk/score?thread_id=${threadId}`);
  // if (!res.ok) throw new Error(`Risk score fetch failed: ${res.status}`);
  // return res.json();
  console.log("[API STUB] getRiskScore:", threadId);
  return { level: "low", score: 20 };
}

/* ─────────────────────────────────────────────────────────────────
   MEMORY  (API stub)
───────────────────────────────────────────────────────────────── */

/**
 * POST /upload
 * Upload a document to add to user's long-term memory.
 * @param {File} file - The document file to upload
 * @param {string} userId - The user ID (optional if authenticated)
 * @returns {Promise<{ok: boolean, message: string, user_id: string}>}
 */
export async function uploadDocument(file, userId = null) {
  const formData = new FormData();
  formData.append("file", file);
  if (userId) {
    formData.append("user_id", userId);
  }

  const response = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: getAuthHeaders(), // Auth headers added, no Content-Type for FormData
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed: ${response.status}`);
  }

  return response.json();
}

/**
 * GET /memory/insights?thread_id=xxx
 * Returns long-term memory insights and health patterns.
 */
export async function getMemoryInsights(threadId) {
  // TODO: uncomment when backend endpoint is ready
  // const res = await fetch(`${API_BASE}/memory/insights?thread_id=${threadId}`);
  // if (!res.ok) throw new Error(`Memory fetch failed: ${res.status}`);
  // return res.json();
  console.log("[API STUB] getMemoryInsights:", threadId);
  return { insights: [], patterns: [] };
}

/**
 * DELETE /memory?thread_id=xxx
 * Deletes all long-term memory for a user (privacy compliance).
 */
export async function deleteMemory(threadId) {
  // TODO: uncomment when backend endpoint is ready
  // const res = await fetch(`${API_BASE}/memory?thread_id=${threadId}`, { method: "DELETE" });
  // if (!res.ok) throw new Error(`Memory delete failed: ${res.status}`);
  // return res.json();
  console.log("[API STUB] deleteMemory:", threadId);
  return { ok: true };
}

/* ─────────────────────────────────────────────────────────────────
   EMERGENCY ALERTS  (API stub)
───────────────────────────────────────────────────────────────── */

/**
 * POST /alerts/emergency
 * Sends emergency alert to doctor and emergency contact (requires consent).
 * @param {Object} payload - { threadId, riskLevel, summary, timestamp }
 */
export async function sendEmergencyAlert(payload) {
  // TODO: uncomment when backend endpoint is ready
  // const res = await fetch(`${API_BASE}/alerts/emergency`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error(`Alert failed: ${res.status}`);
  // return res.json();
  console.log("[API STUB] sendEmergencyAlert:", payload);
  return { ok: true };
}

/* ─────────────────────────────────────────────────────────────────
   LOCAL SPECIALIST DETECTION  (keyword-based, no API needed)
───────────────────────────────────────────────────────────────── */

export function detectSpecialist(text) {
  const t = text.toLowerCase();
  if (/pregnan|trimester|fetal|obstetric|labour|labor|midwife|baby|birth|maternal|womb/.test(t))
    return "pregnancy";
  if (/diabet|insulin|glucose|blood sugar|hypoglycemi|hyperglycemi|hba1c|endocrin|hypertension|asthma|chronic/.test(t))
    return "diabetes";
  if (/child|infant|toddler|newborn|paediatric|pediatric|adolescent|teen|vaccin|milestone/.test(t))
    return "pediatrics";
  if (/depress|anxiety|mental|stress|mood|therapy|psychiatr|trauma|burnout|suicid|self.harm|sleep disorder/.test(t))
    return "mental_health";
  if (/emergency|severe|critical|chest pain|can't breathe|unconscious|bleeding|stroke|heart attack/.test(t))
    return "emergency";
  return null;
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
