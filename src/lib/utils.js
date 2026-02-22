/**
 * Client-side utilities — pure functions with no API or browser-storage dependencies.
 */

/**
 * Generate a UUID v4.
 * Used to create unique conversation thread IDs on the client.
 */
export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Detect the specialist domain from free-form text using keyword matching.
 * Used to show a contextual specialist card in the UI.
 * @param {string} text
 * @returns {"pregnancy"|"diabetes"|"pediatrics"|"mental_health"|"emergency"|null}
 */
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
