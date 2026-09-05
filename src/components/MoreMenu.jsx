import { NavLink } from 'react-router-dom'
import { FileText, Users, CreditCard, Settings as SettingsIcon, X } from 'lucide-react'

const items = [
  { to: '/quotations', label: 'Quotations', icon: FileText },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function MoreMenu({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-base-900 border-t border-base-700 rounded-t-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-300">More</span>
          <button onClick={onClose} className="text-gray-400"><X size={20} /></button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className="flex flex-col items-center gap-1 text-gray-300 text-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-base-800 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                {item.label}
              </NavLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
