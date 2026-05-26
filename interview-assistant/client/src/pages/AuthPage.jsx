import { useState } from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'

export default function AuthPage() {
  const [tab, setTab] = useState('login')

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                tab === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-slate-500 hover:text-slate-700 bg-slate-50'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                tab === 'register'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-slate-500 hover:text-slate-700 bg-slate-50'
              }`}
            >
              注册
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            {tab === 'login' ? <LoginForm /> : <RegisterForm />}
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 text-center text-sm text-slate-500">
            {tab === 'login' ? (
              <>还没有账号？{' '}
                <button onClick={() => setTab('register')} className="text-blue-600 hover:text-blue-700 font-medium">
                  立即注册
                </button>
              </>
            ) : (
              <>已有账号？{' '}
                <button onClick={() => setTab('login')} className="text-blue-600 hover:text-blue-700 font-medium">
                  立即登录
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          注册即表示同意{' '}
          <a href="#" className="text-blue-500 hover:underline">服务条款</a>
          {' '}和{' '}
          <a href="#" className="text-blue-500 hover:underline">隐私政策</a>
        </p>
      </div>
    </div>
  )
}
