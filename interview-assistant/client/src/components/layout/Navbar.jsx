import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="white"/>
              <circle cx="12" cy="12" r="3" fill="white" opacity="0.6"/>
            </svg>
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">AI面试教练</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
          >
            功能
          </Link>
          <Link
            to="/history"
            className={`text-sm font-medium transition-colors ${isActive('/history') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
          >
            历史记录
          </Link>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">帮助中心</a>
        </div>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                to="/interview/new"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                新建面试
              </Link>
              <div className="relative group">
                <button className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm flex items-center justify-center hover:bg-blue-200 transition-colors">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </button>
                <div className="absolute right-0 top-11 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 w-40 hidden group-hover:block">
                  <div className="px-3 py-1.5 text-xs text-slate-400 border-b border-slate-100 mb-1">{user?.email}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                登录
              </Link>
              <Link
                to="/auth"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                免费开始
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
