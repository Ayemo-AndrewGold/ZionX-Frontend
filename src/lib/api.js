const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ─────────────────────────────────────────────────────────────────
   CHAT ENDPOINTS
───────────────────────────────────────────────────────────────── */

/**
 * Simulates streaming by sending blocking request and yielding response word by word.
 * This provides a smooth UX until backend implements true SSE streaming.
 * Yields: { token: string } | { error: string } | { done: true }
 */
export async function* streamChat(message, threadId = "default", userId = "guest") {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, thread_id: threadId, user_id: userId }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "Unknown error");
      yield { error: `Server error ${response.status}: ${text}` };
      return;
    }

    const data = await response.json();
    if (data.error) {
      yield { error: data.error };
      return;
    }

    // Simulate streaming by yielding words with small delays
    const words = data.response.split(' ');
    for (let i = 0; i < words.length; i++) {
      yield { token: (i === 0 ? '' : ' ') + words[i] };
      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    
    yield { done: true };
  } catch (err) {
    yield { error: err.message };
  }
}

/** Blocking POST /chat — returns full response string. */
export async function sendChat(message, threadId = "default", userId = "guest") {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, thread_id: threadId, user_id: userId }),
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
   MEMORY & THREADS
───────────────────────────────────────────────────────────────── */

/**
 * GET /memory?user_id=xxx
 * Returns long-term memory facts for a specific user.
 */
export async function getMemory(userId) {
  try {
    const res = await fetch(`${API_BASE}/memory?user_id=${userId}`);
    if (!res.ok) throw new Error(`Memory fetch failed: ${res.status}`);
    const data = await res.json();
    return data.facts || "";
  } catch (err) {
    console.error("[API] getMemory error:", err);
    return "";
  }
}

/**
 * DELETE /memory?user_id=xxx
 * Deletes all long-term memory for a specific user (privacy compliance).
 */
export async function deleteMemory(userId) {
  try {
    const res = await fetch(`${API_BASE}/memory?user_id=${userId}`, { 
      method: "DELETE" 
    });
    if (!res.ok) throw new Error(`Memory delete failed: ${res.status}`);
    return res.json();
  } catch (err) {
    console.error("[API] deleteMemory error:", err);
    throw err;
  }
}

/**
 * GET /threads?user_id=xxx
 * Returns list of all chat threads/sessions for a specific user.
 */
export async function getThreads(userId) {
  try {
    const res = await fetch(`${API_BASE}/threads?user_id=${userId}`);
    if (!res.ok) throw new Error(`Threads fetch failed: ${res.status}`);
    const data = await res.json();
    return data.threads || [];
  } catch (err) {
    console.error("[API] getThreads error:", err);
    return [];
  }
}

/**
 * GET /users
 * Returns list of all users with memory data.
 */
export async function getUsers() {
  try {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error(`Users fetch failed: ${res.status}`);
    const data = await res.json();
    return data.users || [];
  } catch (err) {
    console.error("[API] getUsers error:", err);
    return [];
  }
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
