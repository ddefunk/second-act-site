import { useEffect, useState } from 'react'

export default function Countdown({ target }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = target.getTime() - now
  if (diff <= 0) {
    return <p className="mt-6 rounded-2xl bg-burgundy p-4 text-center text-sm font-medium text-white">We're live now</p>
  }

  const units = [
    ['Days', Math.floor(diff / 86400000)],
    ['Hours', Math.floor(diff / 3600000) % 24],
    ['Mins', Math.floor(diff / 60000) % 60],
    ['Secs', Math.floor(diff / 1000) % 60],
  ]

  return (
    <div className="mt-6" aria-label="Time until the workshop starts">
      <p className="mb-3 text-xs uppercase tracking-widest text-muted">Starts in</p>
      <div className="grid grid-cols-4 gap-2">
        {units.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-warm py-3 text-center">
            <p className="font-serif text-2xl tabular-nums text-burgundy">{String(value).padStart(2, '0')}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
