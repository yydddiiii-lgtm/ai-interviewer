import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSession } from '../api/sessions'

const tips = [
  '建议填写完整的岗位和公司，以获得更匹配的问题',
  '简历越完整，问题越精准',
  '我们会保护你的隐私安全',
]

export default function SetupPage() {
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [resume, setResume] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!jobTitle.trim() || !resume.trim()) return
    setLoading(true)
    try {
      const data = await createSession({ job_title: jobTitle, company, resume_text: resume })
      navigate(`/interview/${data.session.id}`)
    } catch {
      setLoading(false)
    }
  }

  const canSubmit = jobTitle.trim() && resume.trim()

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          {/* Left — intro */}
          <div className="md:col-span-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">创建你的专属面试</h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              填写以下信息，AI 基于你的目标岗位和简历，为你生成个性化的面试题目。
            </p>
            <ul className="space-y-3">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  目标岗位 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="例如：后端开发工程师"
                  required
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  目标公司 <span className="text-slate-400 font-normal">（可选）</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="例如：字节跳动"
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  粘贴简历 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={resume}
                  onChange={e => setResume(e.target.value)}
                  placeholder="请将你的简历内容粘贴到这里，支持从文档中复制（Ctrl / ⌘ + V）..."
                  required
                  rows={8}
                  maxLength={10000}
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="text-right text-xs text-slate-400 mt-1">{resume.length} / 10000</div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
                      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    正在准备面试...
                  </span>
                ) : '开始面试'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
