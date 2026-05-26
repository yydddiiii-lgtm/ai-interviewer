import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProgressBar from '../components/interview/ProgressBar'
import QuestionCard from '../components/interview/QuestionCard'
import AnswerInput from '../components/interview/AnswerInput'
import FeedbackCard from '../components/interview/FeedbackCard'
import { generateQuestion, submitAnswer, completeSession } from '../api/sessions'
import { generateReport } from '../api/reports'

const TOTAL_QUESTIONS = 6

export default function InterviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [question, setQuestion] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [loadingQuestion, setLoadingQuestion] = useState(true)
  const [loadingFeedback, setLoadingFeedback] = useState(false)
  const [finishing, setFinishing] = useState(false)

  useEffect(() => {
    loadQuestion(0)
  }, [])

  const loadQuestion = async (index) => {
    setLoadingQuestion(true)
    setFeedback(null)
    try {
      const data = await generateQuestion(id, index)
      setQuestion(data.question)
    } finally {
      setLoadingQuestion(false)
    }
  }

  const handleSubmitAnswer = async ({ content, input_type }) => {
    if (!question) return
    setLoadingFeedback(true)
    try {
      const data = await submitAnswer(question.id, { content, input_type })
      setFeedback(data.answer)
    } finally {
      setLoadingFeedback(false)
    }
  }

  const handleNext = async () => {
    const nextIndex = currentIndex + 1
    if (nextIndex >= TOTAL_QUESTIONS) {
      await handleFinish()
    } else {
      setCurrentIndex(nextIndex)
      await loadQuestion(nextIndex)
    }
  }

  const handleFinish = async () => {
    setFinishing(true)
    try {
      await completeSession(id)
      await generateReport(id)
      navigate(`/interview/${id}/report`)
    } catch {
      setFinishing(false)
    }
  }

  const isLastQuestion = currentIndex + 1 >= TOTAL_QUESTIONS

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <ProgressBar current={currentIndex + 1} total={TOTAL_QUESTIONS} />
          </div>
          <button
            onClick={handleFinish}
            disabled={finishing}
            className="text-sm text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 px-4 py-2 rounded-xl transition-colors flex-shrink-0"
          >
            结束面试
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main area */}
          <div className="lg:col-span-3 space-y-4">
            {loadingQuestion ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 animate-pulse"/>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"/>
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2"/>
                  </div>
                </div>
              </div>
            ) : (
              <QuestionCard question={question} orderIndex={currentIndex + 1} />
            )}

            <AnswerInput
              onSubmit={handleSubmitAnswer}
              disabled={loadingFeedback || loadingQuestion || !question || !!feedback}
            />

            {/* Navigation */}
            {feedback && (
              <div className="flex justify-end fade-in-up">
                <button
                  onClick={handleNext}
                  disabled={finishing}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                >
                  {finishing ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
                        <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      生成报告中...
                    </>
                  ) : isLastQuestion ? '完成面试，查看报告 →' : '下一题 →'}
                </button>
              </div>
            )}
          </div>

          {/* Feedback panel */}
          <div className="lg:col-span-2">
            {loadingFeedback && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-4 bg-slate-100 rounded animate-pulse"/>
                  <div className="w-12 h-12 rounded-full bg-slate-100 animate-pulse"/>
                </div>
                {[1,2,3].map(i => (
                  <div key={i} className="flex gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-slate-100 animate-pulse flex-shrink-0"/>
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-slate-100 rounded animate-pulse w-1/4"/>
                      <div className="h-3 bg-slate-100 rounded animate-pulse w-full"/>
                      <div className="h-3 bg-slate-100 rounded animate-pulse w-3/4"/>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loadingFeedback && feedback && (
              <FeedbackCard feedback={feedback} />
            )}
            {!loadingFeedback && !feedback && !loadingQuestion && (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 text-center text-slate-400">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="text-sm">提交回答后，AI 点评将在这里显示</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
