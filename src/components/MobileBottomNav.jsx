import { NavLink } from 'react-router-dom'
import { LayoutGrid, MessageSquare, Clock, Briefcase, Menu } from 'lucide-react'
import { useState } from 'react'
import MoreMenu from './MoreMenu'

const items = [
  { to: '/', label: 'Home', icon: LayoutGrid, exact: true },
  { to: '/leads', label: 'Leads', icon: MessageSquare },
  { to: '/follow-ups', label: 'Follow-ups', icon: Clock },
  { to: '/bookings', label: 'Bookings', icon: Briefcase },
]

export default function MobileBottomNav() {
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-base-900 border-t border-base-700 flex items-center justify-around z-40">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 text-[11px] ${isActive ? 'text-accent-500' : 'text-gray-500'}`
              }
            >
              <Icon size={20} />
              {item.label}
            </NavLink>
          )
        })}
        <button
          onClick={() => setShowMore(true)}
          className="flex flex-col items-center gap-0.5 text-[11px] text-gray-500"
        >
          <Menu size={20} />
          More
        </button>
      </nav>
      {showMore && <MoreMenu onClose={() => setShowMore(false)} />}
    </>
  )
}
