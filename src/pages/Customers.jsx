import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { formatINR } from '../utils/formatters'
import Modal from '../components/Modal'

export default function Customers() {
  const { customers, addCustomer } = useData()
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query)
  )

  function handleAdd(form) {
    addCustomer({ ...form, totalTrips: 0, totalSpend: 0, loyalCustomer: false, createdAt: new Date().toISOString(), notes: '' })
    setShowModal(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Customers</h1>
          <p className="text-sm text-gray-500">{customers.length} total customers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> New Customer
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers..."
          className="input pl-9"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/customers/${c.id}`)}
            className="bg-base-900 border border-base-700 rounded-xl p-4 cursor-pointer hover:border-accent-600/50"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-accent-600/20 text-accent-500 flex items-center justify-center font-medium">
                {c.name[0]}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{c.name}</div>
                <div className="text-xs text-gray-500">{c.phone}</div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{c.totalTrips} trips</span>
              <span>{formatINR(c.totalSpend)}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && <CustomerFormModal onClose={() => setShowModal(false)} onSave={handleAdd} />}
    </div>
  )
}

function CustomerFormModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', location: '' })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.phone) return
    onSave(form)
  }

  return (
    <Modal title="New Customer" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Name</label>
          <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Phone</label>
          <input className="input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Email</label>
          <input className="input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Location</label>
          <input className="input" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
        </div>
        <button type="submit" className="w-full bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium py-2.5 rounded-lg mt-2">
          Add Customer
        </button>
      </form>
    </Modal>
  )
}
