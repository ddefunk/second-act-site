export default function ProgressBar({ current, total, sectionName }) {
  const percent = Math.round(((current) / total) * 100)

  return (
    <div className="w-full px-6 pt-6 pb-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-muted text-xs font-sans uppercase tracking-wider">
          {sectionName}
        </span>
        <span className="text-muted text-xs font-sans">
          {current} of {total}
        </span>
      </div>
      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-burgundy rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
