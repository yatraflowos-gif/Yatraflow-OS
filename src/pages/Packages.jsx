import { useState } from 'react'
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'
import { useData } from '../context/DataContext'
import { formatINR } from '../utils/formatters'
import Modal from '../components/Modal'

export default function Packages() {
  const { packages, addPackage, updatePackage, deletePackage } = useData()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)

  function openNew() {
    setEditing(null)
    setShowModal(true)
  }
  function openEdit(pkg) {
    setEditing(pkg)
    setShowModal(true)
  }
  function handleSave(form) {
    if (editing) {
      updatePackage(editing.id, form)
    } else {
      addPackage(form)
    }
    setShowModal(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Packages</h1>
          <p className="text-sm text-gray-500">{packages.length} tour packages</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> New Package
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {packages.map((p) => (
          <div key={p.id} className="bg-base-900 border border-base-700 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="text-sm font-medium text-white">{p.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin size={12} /> {p.destination} · {p.duration}
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-md ${p.active ? 'bg-green-500/15 text-green-400' : 'bg-gray-500/15 text-gray-400'}`}>
                {p.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{p.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">{formatINR(p.price)}</span>
              <div className="flex gap-1.5">
                <button onClick={() => openEdit(p)} className="text-gray-400 hover:bg-base-800 p-1.5 rounded-lg">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deletePackage(p.id)} className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <PackageFormModal pkg={editing} onClose={() => setShowModal(false)} onSave={handleSave} />
      )}
    </div>
  )
}

function PackageFormModal({ pkg, onClose, onSave }) {
  const [form, setForm] = useState(
    pkg || { name: '', destination: '', duration: '', price: '', description: '', active: true }
  )

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.destination) return
    onSave({ ...form, price: Number(form.price) || 0 })
  }

  return (
    <Modal title={pkg ? 'Edit Package' : 'New Package'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Package Name</label>
          <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Destination</label>
            <input className="input" value={form.destination} onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))} required />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Duration</label>
            <input className="input" placeholder="4N / 5D" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Price (₹)</label>
          <input type="number" className="input" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Description</label>
          <textarea className="input" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-400">
          <input type="checkbox" className="accent-accent-600" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
          Active (visible to sales team)
        </label>
        <button type="submit" className="w-full bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium py-2.5 rounded-lg mt-2">
          {pkg ? 'Save Changes' : 'Create Package'}
        </button>
      </form>
    </Modal>
  )
}
