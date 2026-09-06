import { useState } from 'react'
import { Phone, MessageCircle } from 'lucide-react'
import { useData } from '../context/DataContext'
import { formatINR, formatDate, whatsappLink } from '../utils/formatters'
import StatusBadge from '../components/StatusBadge'

const STATUS_OPTIONS = ['Confirmed', 'Pending', 'Hold', 'Cancelled']

export default function Bookings() {
  const { bookings, updateBooking } = useData()
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? bookings : bookings.filter((b) => b.status === filter)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Bookings</h1>
        <p className="text-sm text-gray-500">{bookings.length} total bookings</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {['All', ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border ${
              filter === s ? 'bg-accent-600 border-accent-600 text-white' : 'bg-base-900 border-base-700 text-gray-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && <div className="text-center text-sm text-gray-600 py-10">No bookings found.</div>}
        {filtered.map((b) => (
          <div key={b.id} className="bg-base-900 border border-base-700 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-medium text-white">{b.customerName}</div>
                <div className="text-xs text-gray-500">{b.destination}</div>
              </div>
              <StatusBadge status={b.status} />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span>{formatINR(b.amount)}</span>
              <span>Travel: {formatDate(b.travelDate)}</span>
            </div>
            <div className="flex items-center gap-2 pt-3 flex-wrap">
              <a href={`tel:${b.phone}`} className="flex items-center gap-1 text-xs bg-base-800 hover:bg-base-700 text-gray-300 px-3 py-1.5 rounded-lg">
                <Phone size={13} /> Call
              </a>
              <a
                href={whatsappLink(b.phone, `Hi ${b.customerName}, confirming details for your ${b.destination} trip.`)}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-1 text-xs bg-green-600/15 hover:bg-green-600/25 text-green-400 px-3 py-1.5 rounded-lg"
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
              <select
                value={b.status}
                onChange={(e) => updateBooking(b.id, { status: e.target.value })}
                className="ml-auto bg-base-800 border border-base-700 text-xs text-gray-300 rounded-lg px-2 py-1.5"
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
