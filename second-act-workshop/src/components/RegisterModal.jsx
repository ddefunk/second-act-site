import { useEffect, useRef, useState } from 'react'
import { site } from '../data/site'
import { formatDay, formatUkTime } from '../utils/dates'
import { register } from '../utils/register'

export default function RegisterModal({ workshop, status, start, onClose }) {
  const waitlist = status !== 'upcoming'
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState('idle') // idle | sending | done | error
  const firstField = useRef(null)

  useEffect(() => {
    firstField.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  async function handleSubmit(e) {
    e.preventDefault()
    setState('sending')
    try {
      await register({ workshop, status, start, firstName: firstName.trim(), email: email.trim(), consent })
      setState('done')
    } catch {
      setState('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/60 p-0 sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-cream p-7 shadow-xl sm:rounded-3xl sm:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">{waitlist ? 'Join the waitlist' : 'Save your place'}</p>
            <h2 id="register-title" className="font-serif text-2xl leading-snug text-charcoal">{workshop.title}</h2>
            {start && !waitlist && (
              <p className="mt-1 text-sm text-muted">{formatDay(start)} · {formatUkTime(start)} · {workshop.location}</p>
            )}
          </div>
          <button type="button" onClick={onClose} className="-mr-2 -mt-1 p-2 text-2xl leading-none text-muted hover:text-charcoal" aria-label="Close">×</button>
        </div>

        {state === 'done' ? (
          <div className="space-y-4">
            <p className="font-serif text-xl text-charcoal">Thank you, {firstName || 'you are in'}.</p>
            <p className="leading-relaxed text-muted">
              {waitlist
                ? "You're on the list. I'll email you as soon as the next date is confirmed."
                : "Your place is saved. Check your inbox for a confirmation email with the joining link. If it hasn't arrived in a few minutes, look in your spam or promotions folder."}
            </p>
            <div className="rounded-2xl bg-warm p-5">
              <p className="mb-3 text-sm text-charcoal">While you wait, the free Income Audit is a useful way to prepare.</p>
              <a href={site.auditUrl} className="text-sm font-semibold text-burgundy underline underline-offset-4">Take the free Income Audit →</a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-charcoal">First name</span>
              <input ref={firstField} required value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name"
                className="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none transition focus:border-burgundy focus:ring-2 focus:ring-burgundy/15" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-charcoal">Email address</span>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                className="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none transition focus:border-burgundy focus:ring-2 focus:ring-burgundy/15" />
            </label>
            <label className="flex items-start gap-3 text-sm leading-relaxed text-muted">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-burgundy" />
              <span>I'd also like Notes from Funke, the fortnightly newsletter. Unsubscribe any time.</span>
            </label>

            {state === 'error' && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">
                Something went wrong saving your place. Please try again, or email {site.contactEmail}.
              </p>
            )}

            <button type="submit" disabled={state === 'sending'} className="btn-primary w-full disabled:opacity-60">
              {state === 'sending' ? 'Saving…' : waitlist ? 'Add me to the waitlist' : 'Save my free place'}
            </button>
            <p className="text-center text-xs text-muted">
              We'll only use your details to send workshop information.{' '}
              <a href={site.privacyUrl} className="underline underline-offset-2">Privacy policy</a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
