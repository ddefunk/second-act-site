import { site } from '../data/site'

export async function register({ workshop, status, start, firstName, email, consent }) {
  const payload = {
    workshopSlug: workshop.slug,
    workshopTitle: workshop.title,
    startsAt: start ? start.toISOString() : null,
    waitlist: status !== 'upcoming',
    firstName,
    email,
    marketingConsent: consent,
    source: new URLSearchParams(window.location.search).get('utm_source') || '',
    submittedAt: new Date().toISOString(),
  }

  const res = await fetch(site.registrationEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Registration failed (${res.status})`)
  return res.json().catch(() => ({}))
}
