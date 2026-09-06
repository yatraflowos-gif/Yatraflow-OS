import { useState } from 'react'
import { Plus, Send, CheckCircle2, Trash2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { formatINR, formatDate } from '../utils/formatters'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'

export default function Quotations() {
  const { quotations, leads, addQuotation, updateQuotation, deleteQuotation, convertQuotationToBooking } = useData()
  const [showModal, setShowModal] = useState(false)

  function handleAdd(form) {
    addQuotation(form)
    setShowModal(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Quotations</h1>
          <p className="text-sm text-gray-500">{quotations.length} total quotations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> New Quotation
        </button>
      </div>

      <div className="space-y-2">
        {quotations.map((q) => (
          <div key={q.id} className="bg-base-900 border border-base-700 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-medium text-white">{q.customerName}</div>
                <div className="text-xs text-gray-500">{q.destination}</div>
              </div>
              <StatusBadge status={q.status} />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span>{formatINR(q.amount)}</span>
              <span>Valid till {formatDate(q.validTill)}</span>
            </div>
            <div className="mt-2 space-y-1">
              {q.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-xs text-gray-600">
                  <span>{item.label}</span>
                  <span>{formatINR(item.amount)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-3">
              {q.status === 'Draft' && (
                <button
                  onClick={() => updateQuotation(q.id, { status: 'Sent' })}
                  className="flex items-center gap-1 text-xs bg-purple-600/15 text-purple-400 px-3 py-1.5 rounded-lg"
                >
                  <Send size={13} /> Send
                </button>
              )}
              {(q.status === 'Sent' || q.status === 'Draft') && (
                <button
                  onClick={() => convertQuotationToBooking(q.id)}
                  className="flex items-center gap-1 text-xs bg-green-600/15 text-green-400 px-3 py-1.5 rounded-lg"
                >
                  <CheckCircle2 size={13} /> Mark Won & Convert
                </button>
              )}
              <button
                onClick={() => deleteQuotation(q.id)}
                className="ml-auto flex items-center gap-1 text-xs text-red-400 hover:bg-red-500/10 px-2 py-1.5 rounded-lg"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <QuotationFormModal leads={leads} onClose={() => setShowModal(false)} onSave={handleAdd} />
      )}
    </div>
  )
}

function QuotationFormModal({ leads, onClose, onSave }) {
  const [leadId, setLeadId] = useState(leads[0]?.id || '')
  const [items, setItems] = useState([
    { label: 'Accommodation', amount: '' },
    { label: 'Transport', amount: '' },
    { label: 'Activities', amount: '' },
  ])
  const [validTill, setValidTill] = useState('')

  function updateItem(i, field, value) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)))
  }
  function addItemRow() {
    setItems((prev) => [...prev, { label: '', amount: '' }])
  }

  function handleSubmit(e) {
    e.preventDefault()
    const lead = leads.find((l) => l.id === leadId)
    if (!lead) return
    const cleanItems = items
      .filter((it) => it.label && it.amount)
      .map((it) => ({ label: it.label, amount: Number(it.amount) }))
    const amount = cleanItems.reduce((sum, it) => sum + it.amount, 0)
    onSave({
      leadId,
      customerName: lead.customerName,
      phone: lead.phone,
      destination: lead.destination,
      amount,
      items: cleanItems,
      status: 'Draft',
      validTill: validTill || new Date(Date.now() + 10 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <Modal title="New Quotation" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Customer / Lead</label>
          <select className="input" value={leadId} onChange={(e) => setLeadId(e.target.value)}>
            {leads.map((l) => <option key={l.id} value={l.id}>{l.customerName} — {l.destination}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Line Items</label>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="Label"
                  value={item.label}
                  onChange={(e) => updateItem(i, 'label', e.target.value)}
                />
                <input
                  className="input w-28"
                  type="number"
                  placeholder="₹"
                  value={item.amount}
                  onChange={(e) => updateItem(i, 'amount', e.target.value)}
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={addItemRow} className="text-xs text-accent-500 mt-2">
            + Add line item
          </button>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Valid Till</label>
          <input type="date" className="input" value={validTill} onChange={(e) => setValidTill(e.target.value)} />
        </div>

        <button type="submit" className="w-full bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium py-2.5 rounded-lg mt-2">
          Create Quotation
        </button>
      </form>
    </Modal>
  )
}
