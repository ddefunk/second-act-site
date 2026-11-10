const UK_TZ = 'Europe/London'

// Turn '2026-12-06T19:00' (UK wall-clock time) into a real Date, handling GMT/BST.
export function ukTimeToDate(local) {
  if (!local) return null
  const [d, t = '00:00'] = local.split('T')
  const [y, m, day] = d.split('-').map(Number)
  const [hh, mm] = t.split(':').map(Number)
  const guess = Date.UTC(y, m - 1, day, hh, mm)
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: UK_TZ, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).formatToParts(new Date(guess))
  const get = (type) => Number(parts.find((p) => p.type === type).value)
  const asUk = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'))
  return new Date(guess - (asUk - guess))
}

export function formatDay(date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: UK_TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(date)
}

export function formatUkTime(date) {
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: UK_TZ, hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(date).replace(':00', '').replace(' ', '')
  const zone = new Intl.DateTimeFormat('en-GB', { timeZone: UK_TZ, timeZoneName: 'short' })
    .formatToParts(date).find((p) => p.type === 'timeZoneName').value
  return `${time} ${zone === 'GMT+1' ? 'BST' : zone}`
}

// "7:00 pm in your time zone" — only shown when the visitor is outside the UK.
export function formatVisitorTime(date) {
  const visitorTz = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (!visitorTz || visitorTz === UK_TZ) return null
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  }).format(date)
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} minutes`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (!m) return h === 1 ? '1 hour' : `${h} hours`
  return m === 30 ? `${h}½ hours` : `${h} hr ${m} min`
}

// 'upcoming' | 'tba' | 'past'
export function getStatus(workshop, now = new Date()) {
  const start = ukTimeToDate(workshop.startsAt)
  if (!start) return { status: 'tba', start: null }
  const end = new Date(start.getTime() + (workshop.durationMinutes || 60) * 60000)
  return { status: now > end ? 'past' : 'upcoming', start }
}
