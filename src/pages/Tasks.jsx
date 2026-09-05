import { useState } from 'react'
import { Plus, Check, Trash2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { formatDate } from '../utils/formatters'
import PriorityBadge from '../components/PriorityBadge'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useData()
  const [filter, setFilter] = useState('Pending')
  const [showModal, setShowModal] = useState(false)

  const filtered = filter === 'All' ? tasks : tasks.filter((t) => t.status === filter)

  function handleAdd(form) {
    addTask({ ...form, createdAt: new Date().toISOString() })
    setShowModal(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Tasks</h1>
          <p className="text-sm text-gray-500">{tasks.filter((t) => t.status === 'Pending').length} pending tasks</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> New Task
        </button>
      </div>

      <div className="flex gap-2">
        {['Pending', 'Done', 'All'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs border ${
              filter === s ? 'bg-accent-600 border-accent-600 text-white' : 'bg-base-900 border-base-700 text-gray-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && <div className="text-center text-sm text-gray-600 py-10">No tasks here.</div>}
        {filtered.map((t) => (
          <div key={t.id} className="bg-base-900 border border-base-700 rounded-xl p-4 flex items-center gap-3">
            <button
              onClick={() => updateTask(t.id, { status: t.status === 'Done' ? 'Pending' : 'Done' })}
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                t.status === 'Done' ? 'bg-green-600 border-green-600' : 'border-base-600'
              }`}
            >
              {t.status === 'Done' && <Check size={12} className="text-white" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className={`text-sm ${t.status === 'Done' ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{t.title}</div>
              <div className="text-xs text-gray-500">Due {formatDate(t.dueDate)}</div>
            </div>
            <PriorityBadge priority={t.priority} />
            <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
              <Avatar name={t.assignedTo} size="sm" />
            </div>
            <button onClick={() => deleteTask(t.id)} className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg shrink-0">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {showModal && <TaskFormModal onClose={() => setShowModal(false)} onSave={handleAdd} />}
    </div>
  )
}

function TaskFormModal({ onClose, onSave }) {
  const [form, setForm] = useState({ title: '', priority: 'Medium', status: 'Pending', dueDate: '', assignedTo: 'You' })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title) return
    onSave(form)
  }

  return (
    <Modal title="New Task" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Title</label>
          <input className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Priority</label>
            <select className="input" value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Due Date</label>
            <input type="date" className="input" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
          </div>
        </div>
        <button type="submit" className="w-full bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium py-2.5 rounded-lg mt-2">
          Add Task
        </button>
      </form>
    </Modal>
  )
}
