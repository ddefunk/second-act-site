import { useState } from 'react'

const AGE_RANGES = ['40 to 49', '50 to 59', '60 and above']

const SEASONS = [
  'Employed (full-time or part-time)',
  'Self-employed or running a business',
  'Stay-at-home parent or carer',
  'On a career break',
  'Retired or semi-retired',
  'Looking for a transition or change',
  'Other',
]

export default function LeadCapture({ onSubmit }) {
  const [form, setForm] = useState({
    firstName: '',
    email: '',
    ageRange: '',
    season: '',
  })
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Please enter your first name.'
    if (!form.email.trim()) e.email = 'Please enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Please enter a valid email address.'
    if (!form.ageRange) e.ageRange = 'Please select your age range.'
    if (!form.season) e.season = 'Please select your current season.'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSubmit(form)
  }

  return (
    <div className="min-h-screen bg-cream flex items-start justify-center px-6 py-12">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-muted text-sm tracking-widest uppercase mb-4 font-sans">
            Second Act Advisory Studio
          </p>
          <h2 className="font-serif text-3xl text-charcoal mb-3">
            Before we begin
          </h2>
          <p className="text-muted text-base leading-relaxed">
            Tell us a little about yourself so we can personalise your results.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* First name */}
          <div>
            <label className="block text-charcoal font-medium mb-2 text-sm">
              First name
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) =>
                setForm((f) => ({ ...f, firstName: e.target.value }))
              }
              placeholder="e.g. Sarah"
              className={`w-full bg-white border rounded-xl px-4 py-3 text-charcoal text-base outline-none focus:ring-2 focus:ring-burgundy/30 transition ${
                errors.firstName ? 'border-red-400' : 'border-border'
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-charcoal font-medium mb-2 text-sm">
              Email address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="you@example.com"
              className={`w-full bg-white border rounded-xl px-4 py-3 text-charcoal text-base outline-none focus:ring-2 focus:ring-burgundy/30 transition ${
                errors.email ? 'border-red-400' : 'border-border'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
            <p className="text-muted text-xs mt-1.5">
              Your results will be sent here. We respect your privacy.
            </p>
          </div>

          {/* Age range */}
          <div>
            <label className="block text-charcoal font-medium mb-3 text-sm">
              Age range
            </label>
            <div className="flex flex-wrap gap-3">
              {AGE_RANGES.map((range) => (
                <button
                  type="button"
                  key={range}
                  onClick={() =>
                    setForm((f) => ({ ...f, ageRange: range }))
                  }
                  className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-border ${
                    form.ageRange === range
                      ? 'bg-burgundy border-burgundy text-white'
                      : 'bg-white border-border text-charcoal hover:border-burgundy/50'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            {errors.ageRange && (
              <p className="text-red-500 text-xs mt-1.5">{errors.ageRange}</p>
            )}
          </div>

          {/* Current season */}
          <div>
            <label className="block text-charcoal font-medium mb-3 text-sm">
              Your current season of life
            </label>
            <div className="space-y-2">
              {SEASONS.map((season) => (
                <button
                  type="button"
                  key={season}
                  onClick={() =>
                    setForm((f) => ({ ...f, season }))
                  }
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-border ${
                    form.season === season
                      ? 'bg-burgundy/5 border-burgundy text-charcoal'
                      : 'bg-white border-border text-charcoal hover:border-burgundy/40'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 rounded-full border-2 mr-3 align-middle transition-colors ${
                      form.season === season
                        ? 'bg-burgundy border-burgundy'
                        : 'border-border'
                    }`}
                  />
                  {season}
                </button>
              ))}
            </div>
            {errors.season && (
              <p className="text-red-500 text-xs mt-1.5">{errors.season}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-burgundy hover:bg-burgundy-dark text-white font-medium py-4 rounded-full text-base transition-colors duration-200 mt-2"
          >
            Continue to the Audit
          </button>
        </form>
      </div>
    </div>
  )
}
