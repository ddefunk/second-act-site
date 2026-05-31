import { archetypes } from '../data/archetypes'
import CTASection from './CTASection'

const SCORE_LABELS = {
  expertise: 'Expertise Strength',
  readiness: 'Income Readiness',
  digital: 'Digital Confidence',
  time: 'Time Capacity',
  visibility: 'Visibility Confidence',
}

export default function ResultPage({
  leadData,
  scores,
  primaryId,
  secondaryId,
  skoolUrl,
  bookingUrl,
}) {
  const primary = archetypes[primaryId] || archetypes.starter
  const secondary = archetypes[secondaryId]

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header band */}
      <div className="bg-burgundy text-white px-6 py-12 text-center">
        <p className="text-burgundy-light/80 text-xs tracking-widest uppercase mb-4 font-sans">
          Second Act Advisory Studio
        </p>
        <p className="text-white/70 text-base mb-2 font-sans">
          Your Second Act Income Audit result
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight">
          {leadData.firstName
            ? `Here is what we found, ${leadData.firstName}.`
            : 'Here is what we found.'}
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-10 space-y-10">
        {/* Primary archetype */}
        <div className="bg-white border border-border rounded-2xl p-8">
          <span className="inline-block bg-burgundy/10 text-burgundy text-xs font-medium uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            {primary.badge}
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-2">
            {primary.title}
          </h2>
          <p className="text-muted italic text-base mb-5 font-serif">
            {primary.tagline}
          </p>
          <p className="text-charcoal text-base leading-relaxed">
            {primary.summary}
          </p>
        </div>

        {/* Scores */}
        <div className="bg-warm border border-border rounded-2xl p-7">
          <h3 className="font-serif text-lg text-charcoal mb-5">
            Your Audit Scores
          </h3>
          <div className="space-y-4">
            {Object.entries(SCORE_LABELS).map(([key, label]) => {
              const val = scores[key] ?? 0
              return (
                <div key={key}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-charcoal text-sm">{label}</span>
                    <span className="text-burgundy text-sm font-medium">{val}</span>
                  </div>
                  <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-burgundy rounded-full transition-all duration-700"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Three-column detail cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DetailCard
            title="Top Income Paths"
            icon="✦"
            items={primary.incomePaths}
            accent
          />
          <DetailCard
            title="Your Strengths"
            icon="◆"
            items={primary.strengths}
          />
          <DetailCard
            title="What to Work On"
            icon="◇"
            items={primary.blockers}
          />
        </div>

        {/* First step callout */}
        <div className="border-l-4 border-burgundy bg-white rounded-r-2xl px-7 py-6">
          <p className="text-muted text-xs uppercase tracking-widest mb-3 font-sans">
            Your suggested first step
          </p>
          <p className="font-serif text-lg text-charcoal leading-relaxed">
            &ldquo;{primary.firstStep}&rdquo;
          </p>
        </div>

        {/* Secondary archetype mention */}
        {secondary && secondary.id !== primary.id && (
          <div className="bg-warm border border-border rounded-2xl p-6">
            <p className="text-muted text-xs uppercase tracking-widest mb-2 font-sans">
              Secondary strength identified
            </p>
            <p className="text-charcoal text-base">
              You also showed strong signals of being a{' '}
              <span className="font-medium text-burgundy">{secondary.title}</span>.{' '}
              {secondary.tagline}
            </p>
          </div>
        )}

        {/* CTA */}
        <CTASection
          ctaText={primary.ctaText}
          skoolUrl={skoolUrl}
          bookingUrl={bookingUrl}
        />

        {/* Footer note */}
        <p className="text-center text-muted text-xs pb-4">
          Second Act Advisory Studio &mdash; secondactadvisory.co.uk
        </p>
      </div>
    </div>
  )
}

function DetailCard({ title, icon, items, accent }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? 'bg-burgundy/5 border-burgundy/20' : 'bg-white border-border'}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-burgundy text-xs">{icon}</span>
        <h4 className="font-sans font-medium text-charcoal text-sm uppercase tracking-wide">
          {title}
        </h4>
      </div>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-charcoal text-sm leading-snug">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-burgundy shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
