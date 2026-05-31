const STORAGE_KEY = 'secondact_audit_result'
const DEBUG_KEY   = 'secondact_submit_debug'
const API_ENDPOINT = 'https://audit.secondactadvisory.co.uk/save-lead.php'

export async function submitLead(leadData, scores, primaryId, secondaryId, answers) {
  const payload = {
    leadData,
    scores,
    primaryId,
    secondaryId,
    answers,
    completedAt: new Date().toISOString(),
  }

  // Always save locally as a backup
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch (_) {}

  // Send to Hostinger database
  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const text = await res.text()
    localStorage.setItem(DEBUG_KEY, JSON.stringify({
      status: res.status,
      ok: res.ok,
      body: text,
      timestamp: new Date().toISOString(),
    }))
  } catch (err) {
    localStorage.setItem(DEBUG_KEY, JSON.stringify({
      error: err.message,
      timestamp: new Date().toISOString(),
    }))
  }
}

export function getSavedResult() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (_) {
    return null
  }
}
