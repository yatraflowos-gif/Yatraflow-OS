import { useState } from 'react'
import { Plus, Phone, MessageCircle, Trash2, X } from 'lucide-react'
import { useData } from '../context/DataContext'
import { formatINR, formatDate, whatsappLink, uid } from '../utils/formatters'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'

const STATUS_OPTIONS = ['New', 'Contacted', 'Follow-up', 'Quotation Sent', 'Won', 'Lost']
const SOURCE_OPTIONS = ['Website', 'WhatsApp', 'Instagram', 'Referral', 'Email']

export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useData()
  const [filter, setFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'All' ? leads : leads.filter((l) => l.status === filter)

  function openNew() {
    setSelected(null)
    setShowModal(true)
  }
  function openEdit(lead) {
    setSelected(lead)
    setShowModal(true)
  }

  function handleSave(formData) {
    if (selected) {
      updateLead(selected.id, formData)
    } else {
      addLead({ ...formData, createdAt: new Date().toISOString() })
    }
    setShowModal(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Enquiries</h1>
          <p className="text-sm text-gray-500">{leads.length} total enquiries</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> New Enquiry
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {['All', ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border ${
              filter === s
                ? 'bg-accent-600 border-accent-600 text-white'
                : 'bg-base-900 border-base-700 text-gray-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center text-sm text-gray-600 py-10">No enquiries found.</div>
        )}
        {filtered.map((lead) => (
          <div
            key={lead.id}
            className="bg-base-900 border border-base-700 rounded-xl p-4 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="cursor-pointer flex-1" onClick={() => openEdit(lead)}>
                <div className="text-sm font-medium text-white">{lead.customerName}</div>
                <div className="text-xs text-gray-500">{lead.destination} · {lead.travellers} travellers</div>
              </div>
              <StatusBadge status={lead.status} />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatDate(lead.travelDate)} · {formatINR(lead.budget)}</span>
              <span>{lead.source}</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center gap-1 text-xs bg-base-800 hover:bg-base-700 text-gray-300 px-3 py-1.5 rounded-lg"
              >
                <Phone size={13} /> Call
              </a>
              <a
                href={whatsappLink(lead.phone, `Hi ${lead.customerName}, following up on your ${lead.destination} enquiry.`)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs bg-green-600/15 hover:bg-green-600/25 text-green-400 px-3 py-1.5 rounded-lg"
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
              <button
                onClick={() => deleteLead(lead.id)}
                className="ml-auto flex items-center gap-1 text-xs text-red-400 hover:bg-red-500/10 px-2 py-1.5 rounded-lg"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <LeadFormModal
          lead={selected}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function LeadFormModal({ lead, onClose, onSave }) {
  const [form, setForm] = useState(
    lead || {
      customerName: '',
      phone: '',
      destination: '',
      travelDate: '',
      travellers: 1,
      budget: '',
      source: 'Website',
      status: 'New',
      notes: '',
    }
  )

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.customerName || !form.phone) return
    onSave({ ...form, budget: Number(form.budget) || 0, travellers: Number(form.travellers) || 1 })
  }

  return (
    <Modal title={lead ? 'Edit Enquiry' : 'New Enquiry'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Field label="Customer Name">
          <input className="input" value={form.customerName} onChange={(e) => update('customerName', e.target.value)} required />
        </Field>
        <Field label="Phone">
          <input className="input" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
        </Field>
        <Field label="Destination">
          <input className="input" value={form.destination} onChange={(e) => update('destination', e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Travel Date">
            <input type="date" className="input" value={form.travelDate?.slice(0, 10) || ''} onChange={(e) => update('travelDate', e.target.value)} />
          </Field>
          <Field label="Travellers">
            <input type="number" min="1" className="input" value={form.travellers} onChange={(e) => update('travellers', e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Budget (₹)">
            <input type="number" className="input" value={form.budget} onChange={(e) => update('budget', e.target.value)} />
          </Field>
          <Field label="Source">
            <select className="input" value={form.source} onChange={(e) => update('source', e.target.value)}>
              {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Status">
          <select className="input" value={form.status} onChange={(e) => update('status', e.target.value)}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Notes">
          <textarea className="input" rows={2} value={form.notes} onChange={(e) => update('notes', e.target.value)} />
        </Field>
        <button type="submit" className="w-full bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium py-2.5 rounded-lg mt-2">
          {lead ? 'Save Changes' : 'Create Enquiry'}
        </button>
      </form>
    </Modal>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      {children}
    </div>
  )
          }
