export default function CTASection({ ctaText, bookingUrl }) {
  function handleDownload() {
    window.print()
  }

  return (
    <div className="bg-warm border border-border rounded-2xl p-8 text-center">
      <p className="font-serif text-lg text-charcoal leading-relaxed mb-6 max-w-lg mx-auto">
        {ctaText}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={bookingUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-burgundy hover:bg-burgundy-dark text-white font-medium py-3.5 px-7 rounded-full text-sm transition-colors duration-200 no-print"
        >
          Book Your Personal Audit Review
        </a>

        <button
          onClick={handleDownload}
          className="bg-white hover:bg-warm border border-border text-charcoal font-medium py-3.5 px-7 rounded-full text-sm transition-colors duration-200 no-print"
        >
          Download My Result
        </button>
      </div>
    </div>
  )
}
