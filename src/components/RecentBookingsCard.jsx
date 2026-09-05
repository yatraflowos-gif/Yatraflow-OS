import { Mountain } from 'lucide-react'
import { formatINR } from '../utils/formatters'
import StatusBadge from './StatusBadge'

// Booking thumbnail is a structural placeholder (icon tile) —
// swap for founder-supplied destination imagery later without touching layout.
export default function RecentBookingsCard({ bookings, onViewAll }) {
  return (
    <div className="bg-base-900 border border-base-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-200">Recent Bookings</h2>
        {onViewAll && <button onClick={onViewAll} className="text-xs text-accent-500">View All</button>}
      </div>
      <div className="space-y-3">
        {bookings.length === 0 && <p className="text-xs text-gray-600">No bookings yet.</p>}
        {bookings.map((b) => (
          <div key={b.id} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-base-800 flex items-center justify-center shrink-0 text-accent-500">
              <Mountain size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-200 truncate">{b.title}</div>
              <div className="text-xs text-gray-500">{b.meta}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm text-gray-200">{formatINR(b.amount)}</div>
              <StatusBadge status={b.status} />
            </div>
          </div>
        ))}
      </div>
      {onViewAll && (
        <button onClick={onViewAll} className="w-full text-center text-xs text-accent-500 mt-3 pt-3 border-t border-base-800">
          View All Bookings →
        </button>
      )}
    </div>
  )
}
