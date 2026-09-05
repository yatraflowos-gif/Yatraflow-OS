import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import MountainBackdrop from '../components/MountainBackdrop'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    navigate('/')
    return null
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const result = login(email, password)
      setLoading(false)
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error)
      }
    }, 400)
  }

  return (
    <div className="min-h-screen bg-base-950 relative flex items-center justify-center p-4">
      <MountainBackdrop />

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="bg-base-900/90 backdrop-blur border border-base-700 rounded-2xl p-6 shadow-2xl">
          <h1 className="text-lg font-semibold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6">Log in to manage your tours, enquiries & bookings.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@agency.com"
                  className="w-full bg-base-800 border border-base-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-gray-400">Password</label>
                <button type="button" className="text-xs text-accent-500 hover:text-accent-400">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-base-800 border border-base-700 rounded-lg pl-9 pr-9 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-500">
              <input type="checkbox" className="accent-accent-600 rounded" />
              Keep me logged in
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-500 disabled:opacity-60 transition-colors text-white text-sm font-medium py-2.5 rounded-lg"
            >
              {loading ? 'Logging in...' : (
                <>Log in <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-base-700 flex-1" />
            <span className="text-[11px] text-gray-600">DEMO MODE</span>
            <div className="h-px bg-base-700 flex-1" />
          </div>

          <p className="text-xs text-gray-600 text-center leading-relaxed">
            Any email &amp; password will log you in.<br />No account setup required for V1.
          </p>
        </div>

        <p className="text-xs text-gray-600 text-center mt-6">
          Built for Himalayan tour operators, from Himachal Pradesh 🏔️
        </p>
      </div>
    </div>
  )
}
