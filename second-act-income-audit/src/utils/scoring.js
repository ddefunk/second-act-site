import { questions } from '../data/questions'
import { archetypeOrder } from '../data/archetypes'

const CATEGORY_MAXES = {
  expertise: 100,
  readiness: 100,
  digital: 100,
  time: 100,
  visibility: 100,
}

export function calculateScores(answers) {
  const raw = { expertise: 0, readiness: 0, digital: 0, time: 0, visibility: 0 }
  const caps = { expertise: 0, readiness: 0, digital: 0, time: 0, visibility: 0 }

  for (const q of questions) {
    const answer = answers[q.id]
    if (answer === undefined || answer === null) continue

    if (q.type === 'scale') {
      const val = Number(answer)
      const score = q.scaleScores[val] ?? 0
      raw[q.scoresCategory] = Math.min(
        CATEGORY_MAXES[q.scoresCategory],
        (raw[q.scoresCategory] || 0) + score
      )
      caps[q.scoresCategory] = Math.max(caps[q.scoresCategory] || 0, 100)
    } else if (q.type === 'single') {
      const opt = q.options.find((o) => o.label === answer)
      if (opt?.scores) {
        for (const [cat, pts] of Object.entries(opt.scores)) {
          raw[cat] = (raw[cat] || 0) + pts
        }
      }
    } else if (q.type === 'multi') {
      const selected = Array.isArray(answer) ? answer : []
      const questionRaw = {}
      for (const label of selected) {
        const opt = q.options.find((o) => o.label === label)
        if (opt?.scores) {
          for (const [cat, pts] of Object.entries(opt.scores)) {
            questionRaw[cat] = (questionRaw[cat] || 0) + pts
          }
        }
      }
      // Apply per-question maxScore caps before adding to totals
      for (const [cat, pts] of Object.entries(questionRaw)) {
        const cap = q.maxScore?.[cat] ?? pts
        raw[cat] = (raw[cat] || 0) + Math.min(pts, cap)
      }
    }
  }

  // Normalise to 0–100 based on realistic maximums per category
  const realistic = {
    expertise: 84,  // sum of max contributions across relevant questions
    readiness: 88,
    digital: 100,   // scale question gives 0–100 directly
    time: 100,      // single question gives 0–100 directly
    visibility: 93,
  }

  const normalised = {}
  for (const cat of Object.keys(raw)) {
    normalised[cat] = Math.min(100, Math.round((raw[cat] / realistic[cat]) * 100))
  }

  return normalised
}

const CONDITIONS = [
  {
    id: 'consultant',
    test: (s) => s.expertise >= 65 && s.readiness >= 55,
  },
  {
    id: 'mentor',
    test: (s) => s.expertise >= 55 && s.visibility >= 60,
  },
  {
    id: 'digitalProduct',
    test: (s) => s.expertise >= 55 && s.digital >= 55,
  },
  {
    id: 'aiService',
    test: (s) => s.digital >= 65,
  },
  {
    id: 'operator',
    test: (s) => s.visibility < 50 && (s.expertise >= 45 || s.digital >= 45),
  },
  {
    id: 'starter',
    test: () => true,  // fallback
  },
]

export function matchArchetype(scores, excludeId = null) {
  for (const condition of CONDITIONS) {
    if (condition.id === excludeId) continue
    if (condition.test(scores)) return condition.id
  }
  return excludeId === 'starter' ? 'consultant' : 'starter'
}

export function getResults(answers) {
  const scores = calculateScores(answers)
  const primaryId = matchArchetype(scores)
  const secondaryId = matchArchetype(scores, primaryId)

  const preferredArchetype = getPreferredArchetype(answers)

  return {
    scores,
    primaryId: preferredArchetype || primaryId,
    secondaryId,
  }
}

function getPreferredArchetype(answers) {
  const selected = answers.incomeStyle
  if (!Array.isArray(selected) || selected.length === 0) return null

  const tally = {}
  for (const q of questions) {
    if (q.id !== 'incomeStyle') continue
    for (const label of selected) {
      const opt = q.options.find((o) => o.label === label)
      if (opt?.archetype && opt.archetype !== 'starter') {
        tally[opt.archetype] = (tally[opt.archetype] || 0) + 1
      }
    }
  }

  let top = null
  let topCount = 0
  for (const [id, count] of Object.entries(tally)) {
    if (count > topCount) {
      top = id
      topCount = count
    }
  }

  return top
}
