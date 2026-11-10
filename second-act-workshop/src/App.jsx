import { useEffect, useState } from 'react'
import { FEATURED_WORKSHOP, getWorkshop, workshops } from './data/workshops'
import { site } from './data/site'
import { getStatus } from './utils/dates'
import WorkshopPage from './components/WorkshopPage'
import RegisterModal from './components/RegisterModal'

function slugFromUrl() {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '')
  const query = new URLSearchParams(window.location.search).get('w')
  return path || query || FEATURED_WORKSHOP
}

export default function App() {
  const workshop = getWorkshop(slugFromUrl())
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (workshop) document.title = `${workshop.title} | Free Workshop | ${site.brandName}`
  }, [workshop])

  if (!workshop) return <NotFound />

  const { status, start } = getStatus(workshop)

  function openRegistration() {
    if (workshop.registration?.type === 'link' && status === 'upcoming') {
      window.open(workshop.registration.url, '_blank', 'noopener')
    } else {
      setModalOpen(true)
    }
  }

  return (
    <>
      <WorkshopPage workshop={workshop} status={status} start={start} onRegister={openRegistration} />
      {modalOpen && (
        <RegisterModal workshop={workshop} status={status} start={start} onClose={() => setModalOpen(false)} />
      )}
    </>
  )
}

function NotFound() {
  return (
    <main className="container-page flex min-h-screen flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow mb-4">{site.brandName}</p>
      <h1 className="section-heading mb-6">That workshop page doesn't exist.</h1>
      <p className="mb-8 text-muted">These are the workshops currently available:</p>
      <ul className="space-y-3">
        {workshops.map((w) => (
          <li key={w.slug}>
            <a className="font-serif text-xl text-burgundy underline-offset-4 hover:underline" href={`/${w.slug}`}>
              {w.title}
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
