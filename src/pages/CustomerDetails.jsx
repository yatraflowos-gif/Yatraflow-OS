import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useData } from '../context/DataContext'
import { formatINR, formatDate, whatsappLink } from '../utils/formatters'
import StatusBadge from '../components/StatusBadge'

export default function CustomerDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { customers, leads, bookings, quotations, updateCustomer } = useData()

  const customer = customers.find((c) => c.id === id)
  const [notes, setNotes] = useState(customer?.notes || '')

  if (!customer) {
    return (
      <div className="text-center text-gray-500 py-20">
        Customer not found.
        <div className="mt-3">
          <button onClick={() => navigate('/customers')} className="text-accent-500 text-sm">
            Back to Customers
          </button>
        </div>
      </div>
    )
  }

  const customerLeads = leads.filter((l) => l.customerId === customer.id || l.customerName === customer.name)
  const customerBookings = bookings.filter((b) => b.customerName === customer.name)
  const customerQuotations = quotations.filter((q) => q.customerName === customer.name)

  function saveNotes() {
    updateCustomer(customer.id, { notes })
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <button onClick={() => navigate('/customers')} className="flex items-center gap-1 text-sm text-gray-400">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-base-900 border border-base-700 rounded-xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent-600/20 text-accent-500 flex items-center justify-center text-xl font-medium">
            {customer.name[0]}
          </div>
          <div>
            <div className="text-lg font-semibold text-white">{customer.name}</div>
            <div className="text-sm text-gray-500">{customer.location}</div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <a href={`tel:${customer.phone}`} className="flex items-center gap-1 text-xs bg-base-800 hover:bg-base-700 text-gray-300 px-3 py-1.5 rounded-lg">
            <Phone size={13} /> {customer.phone}
          </a>
          <a
            href={whatsappLink(customer.phone, `Hi ${customer.name}, `)}
            target="_blank" rel="noreferrer"
            className="flex items-center gap-1 text-xs bg-green-600/15 hover:bg-green-600/25 text-green-400 px-3 py-1.5 rounded-lg"
          >
            <MessageCircle size={13} /> WhatsApp
          </a>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-base-800">
          <div>
            <div className="text-xs text-gray-500">Total Trips</div>
            <div className="text-sm font-medium text-white">{customer.totalTrips}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Total Spend</div>
            <div className="text-sm font-medium text-white">{formatINR(customer.totalSpend)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Status</div>
            <div className="text-sm font-medium text-white">{customer.loyalCustomer ? 'Loyal' : 'Regular'}</div>
          </div>
        </div>
      </div>

      <div className="bg-base-900 border border-base-700 rounded-xl p-4">
        <h2 className="text-sm font-medium text-gray-300 mb-2">Notes</h2>
        <textarea
          className="input"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={saveNotes}
          placeholder="Add notes about this customer..."
        />
      </div>

      <div className="bg-base-900 border border-base-700 rounded-xl p-4">
        <h2 className="text-sm font-medium text-gray-300 mb-2">Enquiries</h2>
        {customerLeads.length === 0 && <p className="text-xs text-gray-600">No enquiries yet.</p>}
        <div className="space-y-2">
          {customerLeads.map((l) => (
            <div key={l.id} className="flex justify-between text-sm py-1.5 border-b border-base-800 last:border-0">
              <span className="text-gray-300">{l.destination}</span>
              <StatusBadge status={l.status} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-base-900 border border-base-700 rounded-xl p-4">
        <h2 className="text-sm font-medium text-gray-300 mb-2">Quotations</h2>
        {customerQuotations.length === 0 && <p className="text-xs text-gray-600">No quotations yet.</p>}
        <div className="space-y-2">
          {customerQuotations.map((q) => (
            <div key={q.id} className="flex justify-between text-sm py-1.5 border-b border-base-800 last:border-0">
              <span className="text-gray-300">{q.destination} — {formatINR(q.amount)}</span>
              <StatusBadge status={q.status} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-base-900 border border-base-700 rounded-xl p-4">
        <h2 className="text-sm font-medium text-gray-300 mb-2">Bookings</h2>
        {customerBookings.length === 0 && <p className="text-xs text-gray-600">No bookings yet.</p>}
        <div className="space-y-2">
          {customerBookings.map((b) => (
            <div key={b.id} className="flex justify-between text-sm py-1.5 border-b border-base-800 last:border-0">
              <span className="text-gray-300">{b.destination} — {formatDate(b.travelDate)}</span>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
