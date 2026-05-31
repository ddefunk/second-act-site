import ProgressBar from './ProgressBar'

export default function AuditStep({
  question,
  stepNumber,
  totalSteps,
  answer,
  onChange,
  onNext,
  onBack,
}) {
  const hasAnswer =
    question.type === 'multi'
      ? Array.isArray(answer) && answer.length > 0
      : answer !== undefined && answer !== null && answer !== ''

  function toggleMulti(label) {
    const current = Array.isArray(answer) ? answer : []
    if (current.includes(label)) {
      onChange(current.filter((l) => l !== label))
    } else {
      onChange([...current, label])
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <ProgressBar
        current={stepNumber}
        total={totalSteps}
        sectionName={question.section}
      />

      <div className="flex-1 flex items-start justify-center px-6 pb-16 pt-4">
        <div className="max-w-xl w-full">
          {/* Question */}
          <div className="mb-8">
            <p className="text-muted text-xs uppercase tracking-widest mb-3 font-sans">
              Question {stepNumber}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal leading-snug mb-3">
              {question.question}
            </h2>
            {question.hint && (
              <p className="text-muted text-sm">{question.hint}</p>
            )}
          </div>

          {/* Answer area */}
          <div className="mb-10">
            {question.type === 'multi' && (
              <MultiSelect
                options={question.options}
                selected={Array.isArray(answer) ? answer : []}
                onToggle={toggleMulti}
              />
            )}

            {question.type === 'single' && (
              <SingleSelect
                options={question.options}
                selected={answer}
                onSelect={onChange}
              />
            )}

            {question.type === 'scale' && (
              <ScaleSelect
                min={question.scaleMin}
                max={question.scaleMax}
                labels={question.scaleLabels}
                selected={answer}
                onSelect={onChange}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {stepNumber > 1 && (
              <button
                onClick={onBack}
                className="px-6 py-3 rounded-full border border-border text-charcoal text-sm font-medium hover:border-burgundy/50 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={onNext}
              disabled={!hasAnswer}
              className={`flex-1 py-4 rounded-full text-base font-medium transition-colors duration-200 ${
                hasAnswer
                  ? 'bg-burgundy hover:bg-burgundy-dark text-white'
                  : 'bg-border text-muted cursor-not-allowed'
              }`}
            >
              {stepNumber === totalSteps ? 'See My Results' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MultiSelect({ options, selected, onToggle }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.label)
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onToggle(opt.label)}
            className={`text-left px-4 py-3.5 rounded-xl border text-sm transition-border ${
              isSelected
                ? 'bg-burgundy/5 border-burgundy text-charcoal font-medium'
                : 'bg-white border-border text-charcoal hover:border-burgundy/40'
            }`}
          >
            <span
              className={`inline-block w-4 h-4 rounded border-2 mr-3 align-middle transition-colors shrink-0 ${
                isSelected ? 'bg-burgundy border-burgundy' : 'border-border'
              }`}
              style={{ verticalAlign: 'text-bottom' }}
            />
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function SingleSelect({ options, selected, onSelect }) {
  return (
    <div className="space-y-3">
      {options.map((opt) => {
        const isSelected = selected === opt.label
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onSelect(opt.label)}
            className={`w-full text-left px-4 py-4 rounded-xl border text-sm transition-border ${
              isSelected
                ? 'bg-burgundy/5 border-burgundy text-charcoal font-medium'
                : 'bg-white border-border text-charcoal hover:border-burgundy/40'
            }`}
          >
            <span
              className={`inline-block w-4 h-4 rounded-full border-2 mr-3 align-middle transition-colors ${
                isSelected ? 'bg-burgundy border-burgundy' : 'border-border'
              }`}
            />
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function ScaleSelect({ min, max, labels, selected, onSelect }) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => i + min)

  return (
    <div>
      <div className="flex gap-2 justify-between mb-3">
        {steps.map((val) => {
          const isSelected = Number(selected) === val
          return (
            <button
              key={val}
              type="button"
              onClick={() => onSelect(val)}
              className={`flex-1 py-4 rounded-xl border text-base font-serif font-medium transition-border ${
                isSelected
                  ? 'bg-burgundy border-burgundy text-white'
                  : 'bg-white border-border text-charcoal hover:border-burgundy/50'
              }`}
            >
              {val}
            </button>
          )
        })}
      </div>
      <div className="flex justify-between">
        <span className="text-muted text-xs">{labels.min}</span>
        <span className="text-muted text-xs">{labels.max}</span>
      </div>
    </div>
  )
}
