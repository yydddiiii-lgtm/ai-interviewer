export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
        第 {current} 题 / 共 {total} 题
      </span>
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm text-slate-400 whitespace-nowrap">{pct}%</span>
    </div>
  )
}
