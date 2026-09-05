import { MessageSquare, Briefcase, CreditCard, Map } from 'lucide-react'
import { timeAgo } from '../utils/formatters'

const ICON_MAP = {
  enquiry: { icon: MessageSquare, color: 'bg-blue-500/15 text-blue-400' },
  booking: { icon: Briefcase, color: 'bg-green-500/15 text-green-400' },
  payment: { icon: CreditCard, color: 'bg-purple-500/15 text-purple-400' },
  itinerary: { icon: Map, color: 'bg-amber-500/15 text-amber-400' },
}

export default function RecentActivityCard({ items, onViewAll }) {
  return (
    <div className="bg-base-900 border border-base-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-200">Recent Activity</h2>
        {onViewAll && <button onClick={onViewAll} className="text-xs text-accent-500">View All</button>}
      </div>
      <div className="space-y-3">
        {items.length === 0 && <p className="text-xs text-gray-600">No recent activity.</p>}
        {items.map((item, i) => {
          const conf = ICON_MAP[item.type] || ICON_MAP.enquiry
          const Icon = conf.icon
          return (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${conf.color}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-200">{item.title}</div>
                <div className="text-xs text-gray-500 truncate">{item.subtitle}</div>
              </div>
              <span className="text-xs text-gray-600 shrink-0">{timeAgo(item.time)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
