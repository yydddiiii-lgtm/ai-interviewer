import { useState } from 'react'
import VoiceRecorder from './VoiceRecorder'

const MAX_CHARS = 1000

export default function AnswerInput({ onSubmit, disabled }) {
  const [text, setText] = useState('')
  const [inputType, setInputType] = useState('text')

  const handleVoiceTranscript = (transcript) => {
    setText(transcript)
    setInputType('voice')
  }

  const handleSubmit = () => {
    if (!text.trim() || disabled) return
    onSubmit({ content: text.trim(), input_type: inputType })
    setText('')
    setInputType('text')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit()
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <textarea
        value={text}
        onChange={e => { setText(e.target.value); setInputType('text') }}
        onKeyDown={handleKeyDown}
        placeholder="在这里输入你的回答..."
        disabled={disabled}
        maxLength={MAX_CHARS}
        rows={4}
        className="w-full resize-none text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
      />
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{text.length} / {MAX_CHARS}</span>
          <span className="text-xs text-slate-300">Ctrl+Enter 提交</span>
        </div>
        <div className="flex items-center gap-2">
          <VoiceRecorder onTranscript={handleVoiceTranscript} />
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || disabled}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            {disabled ? '评分中...' : '提交回答'}
          </button>
        </div>
      </div>
    </div>
  )
}
