import { NavLink } from 'react-router-dom'
import {
  LayoutGrid, MessageSquare, Clock, FileText, Briefcase,
  Users, CreditCard, Settings as SettingsIcon, X
} from 'lucide-react'
import { useData } from '../context/DataContext'
import Logo from './Logo'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, exact: true },
  { to: '/leads', label: 'Enquiries', icon: MessageSquare, countKey: 'leads' },
  { to: '/follow-ups', label: 'Follow-ups', icon: Clock, countKey: 'followUps' },
  { to: '/quotations', label: 'Quotations', icon: FileText, countKey: 'quotations' },
  { to: '/bookings', label: 'Bookings', icon: Briefcase, countKey: 'bookings' },
  { to: '/customers', label: 'Customers', icon: Users, countKey: 'customers' },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function Sidebar({ isOpen, onClose }) {
  const data = useData()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-base-900 border-r border-base-700
        transform transition-transform duration-200 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-base-700">
          <Logo />
          <button className="md:hidden text-gray-400" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const count = item.countKey ? data[item.countKey]?.length : null
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${isActive
                    ? 'bg-accent-600/20 text-accent-500 font-medium'
                    : 'text-gray-400 hover:bg-base-800 hover:text-gray-200'}`
                }
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.label}
                </span>
                {count !== null && count !== undefined && (
                  <span className="text-xs bg-base-700 text-gray-300 px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
