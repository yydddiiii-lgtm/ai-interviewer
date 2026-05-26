export default function ScoreSummary({ report }) {
  const score = report.overall_score
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 10) * circumference
  const color = score >= 8 ? '#10B981' : score >= 6 ? '#3B82F6' : '#F59E0B'

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex gap-6 items-start">
      {/* Score ring */}
      <div className="relative w-28 h-28 flex-shrink-0">
        <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
          <circle cx="56" cy="56" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="7"/>
          <circle
            cx="56" cy="56" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-800 leading-none">{score}</span>
          <span className="text-sm text-slate-400 mt-0.5">/10</span>
        </div>
      </div>

      {/* Summary */}
      <div className="flex-1">
        <h3 className="text-base font-semibold text-slate-800 mb-2">综合评价</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{report.overall_summary}</p>
      </div>
    </div>
  )
}
