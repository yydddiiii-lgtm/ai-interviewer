import { useVoice } from '../../hooks/useVoice'

export default function VoiceRecorder({ onTranscript }) {
  const { isRecording, supported, startRecording, stopRecording } = useVoice(onTranscript)

  if (!supported) return null

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      title={isRecording ? '停止录音' : '点击讲话'}
      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
        isRecording
          ? 'bg-red-500 hover:bg-red-600 voice-active'
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        {isRecording ? (
          <rect x="6" y="6" width="12" height="12" rx="2" fill="white"/>
        ) : (
          <>
            <rect x="9" y="2" width="6" height="12" rx="3" fill="white"/>
            <path d="M5 10a7 7 0 0 0 14 0M12 19v3M9 22h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </>
        )}
      </svg>
    </button>
  )
}
