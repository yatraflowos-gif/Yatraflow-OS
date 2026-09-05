import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) {
    navigate('/')
    return null
  }

  function handleSubmit(e) {
    e.preventDefault()
    const result = login(email, password)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-base-950 flex items-center justify-center p-4">
      {/* Login template placeholder — replace with founder-supplied login page design once provided.
          Auth logic below is fully wired and can be reused with any visual template. */}
      <div className="w-full max-w-sm bg-base-900 border border-base-700 rounded-2xl p-6">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <h1 className="text-lg font-semibold text-white text-center mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Log in to manage your tours</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@agency.com"
              className="w-full bg-base-800 border border-base-700 rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-accent-500"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-base-800 border border-base-700 rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-accent-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent-600 hover:bg-accent-500 transition-colors text-white text-sm font-medium py-2.5 rounded-lg"
          >
            Log in
          </button>
        </form>
        <p className="text-xs text-gray-600 text-center mt-5">
          Demo mode — any email & password will log you in.
        </p>
      </div>
    </div>
  )
}
