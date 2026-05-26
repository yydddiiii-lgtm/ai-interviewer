import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSessions } from '../api/sessions'

const jobColors = [
  'bg-blue-100 text-blue-600',
  'bg-purple-100 text-purple-600',
  'bg-emerald-100 text-emerald-600',
  'bg-amber-100 text-amber-600',
  'bg-rose-100 text-rose-600',
]

function JobIcon({ title, index }) {
  const color = jobColors[index % jobColors.length]
  const initial = title?.[0] || '?'
  return (
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center font-bold text-base flex-shrink-0`}>
      {initial}
    </div>
  )
}

function SessionCard({ session, index }) {
  const navigate = useNavigate()
  const isCompleted = session.status === 'completed'

  return (
    <div
      onClick={() => isCompleted ? navigate(`/interview/${session.id}/report`) : navigate(`/interview/${session.id}`)}
      className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center gap-4 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
    >
      <JobIcon title={session.job_title} index={index} />

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-800 text-sm truncate">{session.job_title}</div>
        <div className="text-xs text-slate-400 mt-0.5">{session.company || '公司未填写'}</div>
      </div>

      <div className="hidden sm:block text-xs text-slate-400 text-right flex-shrink-0">
        <div>{new Date(session.created_at).toLocaleDateString('zh-CN')}</div>
        <div className="mt-0.5">
          共 {session.question_count} 题 · {session.duration_minutes} 分钟
        </div>
      </div>

      <div className="flex-shrink-0">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
        }`}>
          {isCompleted ? '已完成' : '进行中'}
        </span>
      </div>

      <div className="text-right flex-shrink-0 w-16">
        {session.overall_score != null ? (
          <span className="text-lg font-bold text-slate-800">
            {session.overall_score}<span className="text-xs text-slate-400 font-normal">/10</span>
          </span>
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </div>

      <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24">
        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSessions().then(data => setSessions(data.sessions)).finally(() => setLoading(false))
  }, [])

  const completed = sessions.filter(s => s.status === 'completed')
  const avgScore = completed.length
    ? (completed.reduce((sum, s) => sum + (s.overall_score || 0), 0) / completed.length).toFixed(1)
    : '--'

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">历史记录</h1>
          <Link
            to="/interview/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            新建面试
          </Link>
        </div>

        {/* Stats */}
        {!loading && sessions.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: '总面试次数', value: sessions.length },
              { label: '已完成', value: completed.length },
              { label: '平均得分', value: avgScore },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 px-4 py-3 text-center">
                <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse"/>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded animate-pulse w-1/3"/>
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-1/5"/>
                </div>
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-slate-500 text-sm mb-4">还没有面试记录</p>
            <Link to="/interview/new" className="text-blue-600 text-sm font-medium hover:underline">
              开始第一次模拟面试 →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session, i) => (
              <SessionCard key={session.id} session={session} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
