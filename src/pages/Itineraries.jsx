import { useState } from 'react'
import { Plus, Trash2, Map } from 'lucide-react'
import { useData } from '../context/DataContext'
import { formatDate } from '../utils/formatters'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'

export default function Itineraries() {
  const { bookings, setItineraryDays } = useData()
  const [activeBookingId, setActiveBookingId] = useState(bookings[0]?.id || null)

  const activeBooking = bookings.find((b) => b.id === activeBookingId)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Itineraries</h1>
        <p className="text-sm text-gray-500">Day-by-day trip plans linked to bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center text-sm text-gray-600 py-10">No bookings yet — itineraries appear once you have a confirmed booking.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
          <div className="space-y-2">
            {bookings.map((b) => (
              <button
                key={b.id}
                onClick={() => setActiveBookingId(b.id)}
                className={`w-full text-left p-3 rounded-xl border transition-colors ${
                  activeBookingId === b.id ? 'bg-accent-600/10 border-accent-600' : 'bg-base-900 border-base-700 hover:bg-base-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-200">{b.customerName}</span>
                  <StatusBadge status={b.status} />
                </div>
                <div className="text-xs text-gray-500 mt-1">{b.destination} · {formatDate(b.travelDate)}</div>
                <div className="text-xs text-gray-600 mt-0.5">{b.itinerary?.length || 0} days planned</div>
              </button>
            ))}
          </div>

          <div className="bg-base-900 border border-base-700 rounded-xl p-4">
            {activeBooking ? (
              <ItineraryEditor booking={activeBooking} onSave={(days) => setItineraryDays(activeBooking.id, days)} />
            ) : (
              <div className="text-sm text-gray-600 text-center py-10">Select a booking to view itinerary.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ItineraryEditor({ booking, onSave }) {
  const [days, setDays] = useState(booking.itinerary || [])
  const [showModal, setShowModal] = useState(false)

  function updateDay(index, field, value) {
    const updated = days.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    setDays(updated)
    onSave(updated)
  }

  function removeDay(index) {
    const updated = days.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }))
    setDays(updated)
    onSave(updated)
  }

  function addDay(form) {
    const updated = [...days, { day: days.length + 1, ...form }]
    setDays(updated)
    onSave(updated)
    setShowModal(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Map size={16} className="text-accent-500" /> {booking.destination} — {booking.customerName}
          </h2>
          <p className="text-xs text-gray-500">{days.length} day itinerary</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-accent-600 hover:bg-accent-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
        >
          <Plus size={14} /> Add Day
        </button>
      </div>

      <div className="space-y-3">
        {days.length === 0 && <p className="text-sm text-gray-600">No days planned yet.</p>}
        {days.map((d, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-lg bg-base-800 border border-base-700">
            <div className="w-8 h-8 rounded-full bg-accent-600/20 text-accent-500 flex items-center justify-center text-xs font-semibold shrink-0">
              {d.day}
            </div>
            <div className="flex-1 space-y-1.5">
              <input
                className="w-full bg-transparent text-sm text-gray-200 font-medium focus:outline-none"
                value={d.title}
                onChange={(e) => updateDay(i, 'title', e.target.value)}
              />
              <textarea
                className="w-full bg-transparent text-xs text-gray-500 focus:outline-none resize-none"
                rows={2}
                value={d.description}
                onChange={(e) => updateDay(i, 'description', e.target.value)}
              />
            </div>
            <button onClick={() => removeDay(i)} className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg h-fit">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {showModal && <DayFormModal onClose={() => setShowModal(false)} onSave={addDay} />}
    </div>
  )
}

function DayFormModal({ onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title) return
    onSave({ title, description })
  }

  return (
    <Modal title="Add Itinerary Day" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Title</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Arrival & local sightseeing" required />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Description</label>
          <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium py-2.5 rounded-lg mt-2">
          Add Day
        </button>
      </form>
    </Modal>
  )
}
