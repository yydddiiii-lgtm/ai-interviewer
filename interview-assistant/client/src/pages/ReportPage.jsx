import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ScoreSummary from '../components/report/ScoreSummary'
import StrengthsList from '../components/report/StrengthsList'
import ImprovementsList from '../components/report/ImprovementsList'
import QuestionReviewList from '../components/report/QuestionReviewList'
import { getReport } from '../api/reports'

export default function ReportPage() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getReport(id)
      .then(data => {
        setReport(data.report)
        setItems(data.items)
      })
      .catch(err => {
        setError(err?.response?.data?.error || err?.message || '加载报告失败')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin w-8 h-8 text-blue-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <p className="text-slate-500 text-sm">正在生成面试报告...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <p className="text-red-600 font-medium mb-2">报告加载失败</p>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <Link to="/history" className="text-blue-600 text-sm hover:underline">← 返回历史记录</Link>
        </div>
      </div>
    )
  }

  if (!report) return null

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">面试报告</h1>
            <p className="text-sm text-slate-500 mt-0.5">生成于 {new Date(report.created_at).toLocaleString('zh-CN')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/interview/new"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              再练一次
            </Link>
            <Link
              to="/history"
              className="text-sm text-slate-600 hover:text-slate-800 border border-slate-200 px-4 py-2.5 rounded-xl transition-colors"
            >
              历史记录
            </Link>
          </div>
        </div>

        {/* Score summary */}
        <ScoreSummary report={report} />

        {/* Strengths + Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <StrengthsList strengths={report.strengths} />
          <ImprovementsList improvements={report.improvements} />
        </div>

        {/* Question review */}
        <QuestionReviewList items={items} />
      </div>
    </div>
  )
}
