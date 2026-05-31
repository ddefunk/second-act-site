export default function WelcomeScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Brand mark */}
        <p className="text-muted text-sm tracking-widest uppercase mb-8 font-sans">
          Second Act Advisory Studio
        </p>

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight mb-4">
          The Second Act
          <br />
          Income Audit
        </h1>

        {/* Decorative rule */}
        <div className="flex items-center justify-center gap-4 my-6">
          <div className="h-px w-16 bg-burgundy opacity-40" />
          <div className="w-1.5 h-1.5 rounded-full bg-burgundy opacity-60" />
          <div className="h-px w-16 bg-burgundy opacity-40" />
        </div>

        {/* Subtitle */}
        <p className="font-serif text-lg md:text-xl text-charcoal mb-6 leading-relaxed">
          Discover how your experience, skills, and story could become a
          practical income path in your next chapter.
        </p>

        {/* Intro copy */}
        <p className="text-muted text-base leading-relaxed mb-10 max-w-lg mx-auto">
          You do not need to start from scratch. This audit will help you
          identify the income opportunities already sitting inside your
          experience, skills, knowledge, and life journey.
        </p>

        {/* What to expect */}
        <div className="bg-warm border border-border rounded-2xl p-6 mb-10 text-left max-w-md mx-auto">
          <p className="text-charcoal font-medium mb-3 text-sm tracking-wide uppercase">What to expect</p>
          <ul className="space-y-2">
            {[
              '10 thoughtful questions — takes about 5 minutes',
              'A personalised income archetype based on your answers',
              'Your top 3 income opportunities and a clear first step',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-muted text-sm">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy block" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="bg-burgundy hover:bg-burgundy-dark text-white font-sans font-medium text-base px-10 py-4 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          Start My Audit
        </button>

        <p className="text-muted text-xs mt-4">
          Free. No payment required.
        </p>
      </div>
    </div>
  )
}
