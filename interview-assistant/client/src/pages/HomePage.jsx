import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const features = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    color: 'bg-blue-50 text-blue-600',
    title: '个性化问题',
    desc: '根据你的岗位、公司和简历，生成高度定制化的面试题目，而不是通用题库。',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'bg-emerald-50 text-emerald-600',
    title: '即时 AI 点评',
    desc: 'AI 即时分析你的回答，提供评分与可落地的改进建议，帮你在练习中快速成长。',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    color: 'bg-purple-50 text-purple-600',
    title: '完整面试报告',
    desc: '生成结构化面试报告，包含总评分、突出优势、改进方向和每道题的详细点评。',
  },
]

const steps = [
  { num: '01', title: '填写岗位与简历', desc: '输入目标岗位名称和你的简历，AI 将据此定制专属面试题。' },
  { num: '02', title: 'AI 面试官逐题提问', desc: '进入模拟面试，AI 扮演真实面试官，支持文字或语音作答。' },
  { num: '03', title: '每题即时点评', desc: '提交回答后立即获得评分、内容点评、结构点评和改进建议。' },
  { num: '04', title: '获取完整报告', desc: '面试结束后生成完整报告，总结优势、改进点和参考答案。' },
]

export default function HomePage() {
  const { isLoggedIn } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-white pt-20 pb-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-40 translate-x-32 -translate-y-32"/>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full opacity-30 -translate-x-16 translate-y-16"/>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"/>
            基于 Claude AI · 完全免费
          </div>
          <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-5">
            AI 模拟面试，找出你的弱点，<br/>
            <span className="text-blue-600">练出你的自信</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            通过真实场景的 AI 模拟面试，获得针对性反馈，全面提升面试表现。
            上传简历，AI 即刻为你定制专属题目。
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to={isLoggedIn ? '/interview/new' : '/auth'}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
            >
              立即开始练习 →
            </Link>
            <Link to="/history" className="text-slate-600 hover:text-slate-900 font-medium px-6 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-base">
              查看历史记录
            </Link>
          </div>
          <p className="text-sm text-slate-400 mt-4">无需信用卡 · 立即开始</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">为什么选择 AI 面试教练？</h2>
            <p className="text-slate-500">针对你的简历和岗位，个性化训练，快速提升</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 hover:border-blue-100 hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">四步完成一次模拟面试</h2>
            <p className="text-slate-500">从填写信息到拿到报告，最快 15 分钟</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="text-3xl font-black text-blue-100 mb-3">{s.num}</div>
                <h3 className="text-sm font-semibold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">准备好了吗？</h2>
          <p className="text-blue-200 mb-8">输入你的目标岗位，立即开始第一次 AI 模拟面试</p>
          <Link
            to={isLoggedIn ? '/interview/new' : '/auth'}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3.5 rounded-xl text-base transition-all inline-block"
          >
            免费开始练习
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-100 text-center text-sm text-slate-400">
        © 2024 AI面试教练 · 由 Claude AI 驱动
      </footer>
    </div>
  )
}
