export default function StrengthsList({ strengths }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">✓</span>
        突出优势
      </h3>
      <ul className="space-y-2.5">
        {strengths.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm text-slate-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
