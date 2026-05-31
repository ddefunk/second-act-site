import { useState } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import LeadCapture from './components/LeadCapture'
import AuditStep from './components/AuditStep'
import ResultPage from './components/ResultPage'
import { questions } from './data/questions'
import { getResults } from './utils/scoring'
import { submitLead } from './utils/submitLead'

// Update these URLs before deploying
const CONFIG = {
  skoolUrl: 'https://www.skool.com/second-act-income-lab-6876',
  bookingUrl: 'https://stan.store/OlufunkeAdeyinka/p/second-act-income-audit-review',
}

export default function App() {
  const [screen, setScreen] = useState('welcome')  // 'welcome' | 'lead' | 'audit' | 'results'
  const [leadData, setLeadData] = useState({})
  const [answers, setAnswers] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  const [results, setResults] = useState(null)

  function handleLeadSubmit(data) {
    setLeadData(data)
    setScreen('audit')
    setCurrentStep(0)
  }

  function handleAnswer(value) {
    const q = questions[currentStep]
    setAnswers((prev) => ({ ...prev, [q.id]: value }))
  }

  function handleNext() {
    const q = questions[currentStep]
    // Ensure the current answer is in state before computing
    const allAnswers = answers

    if (currentStep < questions.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      const computed = getResults(allAnswers)
      setResults(computed)
      submitLead(leadData, computed.scores, computed.primaryId, computed.secondaryId, allAnswers)
      setScreen('results')
    }
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
  }

  if (screen === 'welcome') {
    return <WelcomeScreen onStart={() => setScreen('lead')} />
  }

  if (screen === 'lead') {
    return <LeadCapture onSubmit={handleLeadSubmit} />
  }

  if (screen === 'audit') {
    const q = questions[currentStep]
    return (
      <AuditStep
        key={q.id}
        question={q}
        stepNumber={currentStep + 1}
        totalSteps={questions.length}
        answer={answers[q.id]}
        onChange={handleAnswer}
        onNext={handleNext}
        onBack={handleBack}
      />
    )
  }

  if (screen === 'results' && results) {
    return (
      <ResultPage
        leadData={leadData}
        scores={results.scores}
        primaryId={results.primaryId}
        secondaryId={results.secondaryId}
        skoolUrl={CONFIG.skoolUrl}
        bookingUrl={CONFIG.bookingUrl}
      />
    )
  }

  return null
}
