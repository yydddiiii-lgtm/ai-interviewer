import { useState } from 'react'

const scoreColor = (score) => {
  if (score >= 8) return 'text-emerald-600 bg-emerald-50'
  if (score >= 6) return 'text-blue-600 bg-blue-50'
  return 'text-amber-600 bg-amber-50'
}

function ReviewItem({ item, index }) {
  const [open, setOpen] = useState(false)
  const { question, answer } = item

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 bg-white hover:bg-slate-50 transition-colors text-left"
      >
        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
          {index + 1}
        </span>
        <span className="flex-1 text-sm font-medium text-slate-700 line-clamp-1">{question.content}</span>
        <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${scoreColor(answer.score)}`}>
          {answer.score}/10
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-4 bg-slate-50 border-t border-slate-100 space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">你的回答</p>
            <p className="text-sm text-slate-700">{answer.content}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <p className="text-xs font-semibold text-slate-400 mb-1">内容点评</p>
              <p className="text-xs text-slate-600">{answer.feedback_content}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <p className="text-xs font-semibold text-slate-400 mb-1">结构点评</p>
              <p className="text-xs text-slate-600">{answer.feedback_structure}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <p className="text-xs font-semibold text-slate-400 mb-1">改进建议</p>
              <p className="text-xs text-slate-600">{answer.feedback_improvement}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function QuestionReviewList({ items }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">答题回顾</h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <ReviewItem key={item.question.id} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}
