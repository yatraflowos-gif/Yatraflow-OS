import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export default function TopBar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const data = useData()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const results = query.trim()
    ? [
        ...data.customers
          .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query))
          .map((c) => ({ type: 'Customer', label: c.name, id: c.id, path: `/customers/${c.id}` })),
        ...data.leads
          .filter((l) => l.destination.toLowerCase().includes(query.toLowerCase()) || l.customerName.toLowerCase().includes(query.toLowerCase()))
          .map((l) => ({ type: 'Enquiry', label: `${l.customerName} — ${l.destination}`, id: l.id, path: '/leads' })),
        ...data.quotations
          .filter((q) => q.customerName.toLowerCase().includes(query.toLowerCase()))
          .map((q) => ({ type: 'Quotation', label: `${q.customerName} — ${q.destination}`, id: q.id, path: '/quotations' })),
        ...data.bookings
          .filter((b) => b.customerName.toLowerCase().includes(query.toLowerCase()))
          .map((b) => ({ type: 'Booking', label: `${b.customerName} — ${b.destination}`, id: b.id, path: '/bookings' })),
      ].slice(0, 8)
    : []

  return (
    <header className="h-16 border-b border-base-700 bg-base-900 flex items-center gap-3 px-4 md:px-6 sticky top-0 z-30">
      <button className="md:hidden text-gray-300" onClick={onMenuClick}>
        <Menu size={22} />
      </button>

      <div className="relative flex-1 max-w-xl">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowResults(true)
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
          placeholder="Search enquiries, bookings, customers..."
          className="w-full bg-base-800 border border-base-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
        />
        {showResults && results.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-base-800 border border-base-700 rounded-lg shadow-xl overflow-hidden z-40">
            {results.map((r) => (
              <button
                key={r.type + r.id}
                onClick={() => {
                  navigate(r.path)
                  setQuery('')
                  setShowResults(false)
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-base-700 flex items-center justify-between"
              >
                <span className="text-gray-200">{r.label}</span>
                <span className="text-xs text-gray-500">{r.type}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="relative text-gray-400 hover:text-gray-200">
        <Bell size={20} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-600 rounded-full text-[10px] flex items-center justify-center text-white">
          {data.followUps.filter((f) => f.status === 'Pending').length}
        </span>
      </button>

      <div className="relative">
        <button
          onClick={() => setShowMenu((s) => !s)}
          className="w-9 h-9 rounded-full bg-accent-600 flex items-center justify-center text-white text-sm font-medium"
        >
          {user?.name?.[0] || 'U'}
        </button>
        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-44 bg-base-800 border border-base-700 rounded-lg shadow-xl overflow-hidden z-40">
            <div className="px-3 py-2 text-xs text-gray-500 border-b border-base-700">{user?.email}</div>
            <button
              onClick={logout}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-base-700"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
