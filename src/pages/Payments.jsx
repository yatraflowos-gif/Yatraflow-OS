import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useData } from '../context/DataContext'
import { formatINR, formatDate } from '../utils/formatters'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'

const MODE_OPTIONS = ['UPI', 'Bank Transfer', 'Cash', 'Card']

export default function Payments() {
  const { payments, bookings, addPayment } = useData()
  const [showModal, setShowModal] = useState(false)

  const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0)

  function handleAdd(form) {
    addPayment({ ...form, date: new Date().toISOString() })
    setShowModal(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Payments</h1>
          <p className="text-sm text-gray-500">Total collected: {formatINR(totalCollected)}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> Record Payment
        </button>
      </div>

      <div className="space-y-2">
        {payments.length === 0 && <div className="text-center text-sm text-gray-600 py-10">No payments recorded.</div>}
        {payments.map((p) => (
          <div key={p.id} className="bg-base-900 border border-base-700 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white">{p.customerName}</div>
              <div className="text-xs text-gray-500">{p.mode} · {formatDate(p.date)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-white">{formatINR(p.amount)}</div>
              <StatusBadge status={p.status} />
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <PaymentFormModal bookings={bookings} onClose={() => setShowModal(false)} onSave={handleAdd} />
      )}
    </div>
  )
}

function PaymentFormModal({ bookings, onClose, onSave }) {
  const [bookingId, setBookingId] = useState(bookings[0]?.id || '')
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState('UPI')
  const [status, setStatus] = useState('Paid')

  function handleSubmit(e) {
    e.preventDefault()
    const booking = bookings.find((b) => b.id === bookingId)
    if (!booking || !amount) return
    onSave({
      bookingId,
      customerName: booking.customerName,
      amount: Number(amount),
      totalAmount: booking.amount,
      mode,
      status,
    })
  }

  return (
    <Modal title="Record Payment" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Booking</label>
          <select className="input" value={bookingId} onChange={(e) => setBookingId(e.target.value)}>
            {bookings.map((b) => <option key={b.id} value={b.id}>{b.customerName} — {b.destination}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Amount (₹)</label>
          <input type="number" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Mode</label>
            <select className="input" value={mode} onChange={(e) => setMode(e.target.value)}>
              {MODE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Status</label>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Paid</option>
              <option>Pending</option>
              <option>Partial</option>
            </select>
          </div>
        </div>
        <button type="submit" className="w-full bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium py-2.5 rounded-lg mt-2">
          Save Payment
        </button>
      </form>
    </Modal>
  )
              }
