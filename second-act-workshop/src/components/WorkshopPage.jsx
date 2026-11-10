import { site } from '../data/site'
import { formatDay, formatDuration, formatUkTime, formatVisitorTime } from '../utils/dates'
import Countdown from './Countdown'
import Faq from './Faq'

export default function WorkshopPage({ workshop: w, status, start, onRegister }) {
  const isOpen = status === 'upcoming'
  const isFree = /free/i.test(w.price)
  const ctaLabel = isOpen ? (isFree ? 'Save my free place' : 'Reserve my place') : 'Join the waitlist'
  const ctaNote = isOpen
    ? isFree ? 'No payment required. Just your name and email.' : w.price
    : status === 'past'
      ? 'This session has taken place. Join the list to hear about the next one.'
      : 'Date to be announced. Join the list and you will be the first to know.'

  const when = start
    ? { day: formatDay(start), time: formatUkTime(start), visitor: formatVisitorTime(start) }
    : null

  const details = [
    { label: 'Date', value: when ? when.day : 'To be announced' },
    when && { label: 'Time', value: when.time },
    { label: 'Length', value: formatDuration(w.durationMinutes) },
    { label: 'Where', value: w.location },
    { label: 'Cost', value: w.price },
  ].filter(Boolean)

  const cta = { label: ctaLabel, note: ctaNote, onClick: onRegister }

  const faqs = [...(w.faqs || []), ...site.sharedFaqs]
  if (w.replayNote) faqs.push({ q: 'Will there be a replay?', a: w.replayNote })
  faqs.push({
    q: 'How long is the session?',
    a: `About ${formatDuration(w.durationMinutes)}. Please set aside the full time, as this is a working session with short exercises rather than a talk.`,
  })

  return (
    <div className="min-h-screen bg-cream">
      {/* ---------- Top bar ---------- */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-cream/90 backdrop-blur">
        <div className="container-page flex items-center justify-between gap-4 py-3">
          <a href={site.mainSiteUrl} className="flex items-center gap-3">
            <span className="flex h-10 w-12 items-center justify-center rounded-md bg-burgundy"><img src={site.logo} alt={site.brandName} className="h-8 w-auto" /></span>
            <span className="hidden font-serif text-lg text-charcoal sm:inline">{site.brandName}</span>
          </a>
          <div className="flex items-center gap-4">
            {when && <span className="hidden text-sm text-muted md:inline">{when.day} · {when.time}</span>}
            <button type="button" onClick={onRegister} className="rounded-full bg-burgundy px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-burgundy-dark">
              {isOpen ? 'Register' : 'Waitlist'}
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-burgundy/5" />
        <div className="container-page relative grid gap-12 py-14 md:grid-cols-[1.25fr_1fr] md:items-center md:py-20">
          <div>
            <p className="eyebrow mb-2">Free live workshop</p>
            <p className="mb-6 text-sm text-muted">{w.audience}</p>
            <p className="mb-3 font-serif text-xl italic text-burgundy">{w.title}</p>
            <h1 className="mb-6 font-serif text-4xl leading-[1.12] text-charcoal md:text-5xl">{w.headline}</h1>
            <p className="mb-8 text-lg leading-relaxed text-muted">{w.subheadline}</p>
            <Cta {...cta} align="start" />
          </div>

          <aside className="rounded-3xl border border-border bg-white p-7 shadow-sm">
            <p className="eyebrow mb-5">Workshop details</p>
            <dl className="divide-y divide-border">
              {details.map((d) => (
                <div key={d.label} className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm text-muted">{d.label}</dt>
                  <dd className="text-right font-medium text-charcoal">{d.value}</dd>
                </div>
              ))}
            </dl>
            {when?.visitor && <p className="mt-3 text-xs text-muted">That is {when.visitor} where you are.</p>}
            {isOpen && <Countdown target={start} />}
            {!isOpen && (
              <p className="mt-6 rounded-2xl bg-warm p-4 text-sm leading-relaxed text-charcoal">
                {status === 'past'
                  ? 'This session has already taken place. The next date will be shared with the waitlist first.'
                  : 'The date for this workshop is being finalised. Join the waitlist to hear as soon as places open.'}
              </p>
            )}
          </aside>
        </div>
      </section>

      {/* ---------- What you'll discover ---------- */}
      <section className="border-y border-border bg-warm py-16 md:py-24">
        <div className="container-page">
          <p className="eyebrow mb-3 text-center">Inside the workshop, you'll discover</p>
          <h2 className="section-heading mb-12 text-center">
            {numberWord(w.discover.length)} things we'll work through together.
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {w.discover.map((item, i) => (
              <article key={item.title} className="rounded-2xl border border-border bg-cream p-7">
                <p className="mb-4 font-serif text-3xl text-burgundy/40">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mb-3 font-serif text-xl leading-snug text-charcoal">{item.title}</h3>
                <p className="leading-relaxed text-muted">{item.body}</p>
              </article>
            ))}
          </div>
          <Cta {...cta} className="mt-12" />
        </div>
      </section>

      {/* ---------- Problem ---------- */}
      <section className="py-16 md:py-24">
        <div className="container-page max-w-3xl">
          <h2 className="section-heading mb-8">{w.problem.heading}</h2>
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            {w.problem.paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
          <p className="mt-8 border-l-2 border-burgundy pl-5 font-serif text-xl italic text-charcoal">{w.problem.closing}</p>
        </div>
      </section>

      {/* ---------- Outcomes + quote ---------- */}
      <section className="bg-burgundy py-16 text-cream md:py-24">
        <div className="container-page grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cream/70">By the end of the session</p>
            <h2 className="mb-8 font-serif text-3xl leading-tight md:text-4xl">You'll leave with more than inspiration.</h2>
            <ul className="space-y-4">
              {w.outcomes.map((o) => (
                <li key={o} className="flex gap-4 leading-relaxed">
                  <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-cream" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
          <figure className="rounded-3xl border border-cream/20 bg-burgundy-dark/60 p-8">
            <blockquote className="mb-5 font-serif text-2xl italic leading-snug">“{site.host.quote}”</blockquote>
            <figcaption className="text-sm text-cream/75">{site.host.name}, {site.brandName}</figcaption>
          </figure>
        </div>
        <Cta {...cta} light className="mt-14" />
      </section>

      {/* ---------- Method ---------- */}
      <section className="py-16 md:py-24">
        <div className="container-page">
          <p className="eyebrow mb-3 text-center">The Second Act Method</p>
          <h2 className="section-heading mx-auto mb-4 max-w-2xl text-center">From experience to something you can build on.</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center leading-relaxed text-muted">
            Everything I do follows five stages, so you can move from exploring possibilities to testing a real offer without trying to do everything at once. This workshop focuses on the highlighted {w.methodStages.length > 1 ? 'stages' : 'stage'}.
          </p>
          <ol className="grid gap-3 sm:grid-cols-5">
            {site.method.map((stage, i) => {
              const active = w.methodStages.includes(stage.id)
              return (
                <li key={stage.id} className={`rounded-2xl border p-5 text-center transition ${active ? 'border-burgundy bg-burgundy text-cream shadow-md' : 'border-border bg-white text-charcoal'}`}>
                  <p className={`mb-2 text-xs font-semibold tracking-widest ${active ? 'text-cream/70' : 'text-burgundy/50'}`}>0{i + 1}</p>
                  <p className="mb-1 font-serif text-2xl">{stage.name}</p>
                  <p className={`text-sm leading-snug ${active ? 'text-cream/85' : 'text-muted'}`}>{stage.line}</p>
                  {active && <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider">This workshop</p>}
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* ---------- Host ---------- */}
      <section className="border-y border-border bg-warm py-16 md:py-24">
        <div className="container-page grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
            <img src={site.host.photo} alt={site.host.photoAlt} className="aspect-[4/5] w-full object-cover object-top" loading="lazy" />
          </div>
          <div>
            <p className="eyebrow mb-3">Meet your host</p>
            <h2 className="section-heading mb-2">Hello, I'm {site.host.knownAs}.</h2>
            <p className="mb-6 text-sm text-muted">{site.host.role}</p>
            <div className="space-y-4 leading-relaxed text-charcoal/85">
              {site.host.bio.map((p) => <p key={p}>{p}</p>)}
            </div>
            <Cta {...cta} align="start" className="mt-8" />
          </div>
        </div>
      </section>

      {/* ---------- For you if / leave at the door ---------- */}
      <section className="py-16 md:py-24">
        <div className="container-page grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-white p-8">
            <p className="eyebrow mb-3">This workshop is for you if</p>
            <h2 className="mb-6 font-serif text-2xl text-charcoal">Does any of this sound familiar?</h2>
            <ul className="space-y-4">
              {w.forYou.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-charcoal/85">
                  <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-burgundy" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-warm p-8">
            <p className="eyebrow mb-3">Good news</p>
            <h2 className="mb-6 font-serif text-2xl text-charcoal">You don't need any of this to join.</h2>
            <ul className="space-y-4">
              {w.notNeeded.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-muted">
                  <CrossIcon className="mt-1 h-5 w-5 shrink-0 text-muted/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-serif italic text-charcoal">Just come willing to look honestly at what you already have.</p>
          </div>
        </div>
        <Cta {...cta} className="mt-12" />
      </section>

      {/* ---------- Gifts ---------- */}
      {w.gifts?.length > 0 && (
        <section className="border-y border-border bg-warm py-16 md:py-24">
          <div className="container-page">
            <p className="eyebrow mb-3 text-center">Included when you register</p>
            <h2 className="section-heading mb-12 text-center">Free resources to work with.</h2>
            <div className={`grid gap-5 ${w.gifts.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
              {w.gifts.map((g) => (
                <article key={g.title} className="rounded-2xl border border-border bg-cream p-7">
                  <GiftIcon className="mb-4 h-7 w-7 text-burgundy" />
                  <h3 className="mb-2 font-serif text-xl text-charcoal">{g.title}</h3>
                  <p className="leading-relaxed text-muted">{g.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Testimonials ---------- */}
      {site.testimonials.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container-page">
            <p className="eyebrow mb-3 text-center">What clients say</p>
            <h2 className="section-heading mb-12 text-center">In their words.</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {site.testimonials.map((t) => (
                <figure key={t.name} className="flex flex-col rounded-2xl border border-border bg-white p-7">
                  <blockquote className="mb-6 flex-1 font-serif text-lg italic leading-relaxed text-charcoal">“{t.quote}”</blockquote>
                  <figcaption>
                    <p className="font-medium text-charcoal">{t.name}</p>
                    <p className="text-sm text-muted">{t.detail}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- FAQ ---------- */}
      <section className="border-t border-border bg-warm py-16 md:py-24">
        <div className="container-page max-w-3xl">
          <h2 className="section-heading mb-10 text-center">Questions you might be asking.</h2>
          <Faq items={faqs} />
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="bg-burgundy py-20 text-center text-cream md:py-28">
        <div className="container-page max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cream/70">{w.title}</p>
          <h2 className="mb-6 font-serif text-3xl leading-tight md:text-5xl">{w.finalCta.heading}</h2>
          <p className="mb-6 text-lg leading-relaxed text-cream/85">{w.finalCta.body}</p>
          <p className="mb-10 text-sm text-cream/75">
            {details.filter((d) => d.label !== 'Cost' || !isFree).map((d) => d.value).join('  ·  ')}
            {isFree && '  ·  Free to attend'}
          </p>
          <Cta {...cta} light />
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="bg-charcoal py-12 text-sm text-white/60">
        <div className="container-page space-y-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="max-w-md text-white/80">
              Not ready for a workshop? Start with the{' '}
              <a href={site.auditUrl} className="text-white underline underline-offset-4">free Second Act Income Audit</a>{' '}
              or <a href={site.conversationUrl} className="text-white underline underline-offset-4">have a conversation with Funke</a>.
            </p>
            <ul className="flex gap-5">
              {site.social.map((s) => (
                <li key={s.label}><a href={s.url} className="hover:text-white">{s.label}</a></li>
              ))}
            </ul>
          </div>
          <p className="text-xs leading-relaxed text-white/45">{site.disclaimer}</p>
          <p className="text-xs leading-relaxed">
            {site.legalName}, trading as {site.brandName} · Registered in England and Wales · Company No. {site.companyNumber} ·{' '}
            <a href={site.privacyUrl} className="hover:text-white">Privacy policy</a> ·{' '}
            <a href={site.termsUrl} className="hover:text-white">Terms of use</a> · © {new Date().getFullYear()} {site.legalName}
          </p>
        </div>
      </footer>
    </div>
  )
}

function Cta({ label, note, onClick, light = false, align = 'center', className = '' }) {
  return (
    <div className={`flex flex-col gap-3 ${align === 'start' ? 'items-start text-left' : 'items-center text-center'} ${className}`}>
      <button type="button" onClick={onClick} className={light ? 'btn-light' : 'btn-primary'}>
        {label} <span aria-hidden="true">→</span>
      </button>
      <p className={`text-xs ${light ? 'text-cream/80' : 'text-muted'}`}>{note}</p>
    </div>
  )
}

function numberWord(n) {
  return ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'][n] || String(n)
}

export function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeOpacity="0.4" />
      <path d="M6 10.5l2.5 2.5L14 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CrossIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function GiftIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </svg>
  )
}
