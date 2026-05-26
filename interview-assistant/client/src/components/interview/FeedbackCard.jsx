function ScoreCircle({ score }) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 10) * circumference
  const color = score >= 8 ? '#10B981' : score >= 6 ? '#3B82F6' : '#F59E0B'

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="4"/>
        <circle
          cx="32" cy="32" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-slate-800 leading-none">{score}</span>
        <span className="text-xs text-slate-400">/10</span>
      </div>
    </div>
  )
}

export default function FeedbackCard({ feedback }) {
  if (!feedback) return null

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden fade-in-up">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">AI 点评</span>
        <ScoreCircle score={feedback.score} />
      </div>

      <div className="p-5 space-y-4">
        {/* Content feedback */}
        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-red-400"/>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">内容点评</p>
            <p className="text-sm text-slate-700 leading-relaxed">{feedback.feedback_content}</p>
          </div>
        </div>

        {/* Structure feedback */}
        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-blue-400"/>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">结构点评</p>
            <p className="text-sm text-slate-700 leading-relaxed">{feedback.feedback_structure}</p>
          </div>
        </div>

        {/* Improvement */}
        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400"/>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">改进建议</p>
            <p className="text-sm text-slate-700 leading-relaxed">{feedback.feedback_improvement}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
