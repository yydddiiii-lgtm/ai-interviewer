const typeLabels = {
  behavioral: '行为面试题',
  technical: '技术面试题',
  resume_based: '简历深挖题',
  followup: '追问',
}

const typeColors = {
  behavioral: 'bg-blue-50 text-blue-700',
  technical: 'bg-purple-50 text-purple-700',
  resume_based: 'bg-emerald-50 text-emerald-700',
  followup: 'bg-amber-50 text-amber-700',
}

export default function QuestionCard({ question, orderIndex }) {
  if (!question) return null

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        {/* AI Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 flex items-center justify-center shadow-md">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="white" opacity="0.9"/>
            <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9"/>
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColors[question.question_type] || typeColors.behavioral}`}>
              {typeLabels[question.question_type] || '面试题'}
            </span>
          </div>
          <p className="text-slate-800 font-medium text-base leading-relaxed">
            {question.content}
          </p>
          <p className="text-slate-400 text-sm mt-2">提示：请使用 STAR 法则来组织你的回答。</p>
        </div>
      </div>
    </div>
  )
}
