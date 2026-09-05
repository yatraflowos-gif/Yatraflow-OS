import { useState, useMemo } from 'react'
import {
  CalendarClock, Clock, CalendarDays, CheckCircle2, Flag,
  Phone, MessageCircle, MessageSquare, Check, MoreVertical,
  Sun, CloudSun, Moon, Filter,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import { whatsappLink } from '../utils/formatters'
import { getPriorityStyle, getTimeSlot, isOverdue, isToday } from '../utils/priority'
import Avatar from '../components/Avatar'
import StatCardDetailed from '../components/StatCardDetailed'
import PriorityBadge from '../components/PriorityBadge'
import WorkflowStepper from '../components/WorkflowStepper'
import QuickActionCard from '../components/QuickActionCard'
import MiniCalendarPanel from '../components/MiniCalendarPanel'
import Modal from '../components/Modal'

// Ensure demo follow-ups carry a priority + reason field for this UI.
// If your DataContext generator doesn't set these yet, we default gracefully below.
function withDefaults(f) {
  return {
    priority: f.priority || 'Medium',
    reason: f.reason || 'Follow up on enquiry',
    lastConversation: f.lastConversation || 'No conversation logged yet',
    enquiryRef: f.enquiryRef || `#ENQ-${f.id?.slice(-4).toUpperCase() || '0000'}`,
    assignedTo: f.assignedTo || 'You',
    ...f,
  }
}

export default function FollowUps() {
  const { followUps: rawFollowUps, leads, updateFollowUp, addFollowUp } = useData()
  const [visibleCount, setVisibleCount] = useState({ Morning: 3, Afternoon: 3, Evening: 3 })
  const [showModal, setShowModal] = useState(false)

  const followUps = useMemo(() => rawFollowUps.map(withDefaults), [rawFollowUps])

  const today = followUps.filter((f) => isToday(f.scheduledFor) && f.status === 'Pending' && !isOverdue(f.scheduledFor, f.status))
  const overdue = followUps.filter((f) => isOverdue(f.scheduledFor, f.status))
  const upcoming = followUps.filter((f) => !isToday(f.scheduledFor) && f.status === 'Pending' && !isOverdue(f.scheduledFor, f.status))
  const completed = followUps.filter((f) => f.status === 'Done')
  const highPriority = followUps.filter((f) => f.priority === 'High' && f.status === 'Pending')

  const grouped = { Morning: [], Afternoon: [], Evening: [] }
  today.forEach((f) => grouped[getTimeSlot(f.scheduledFor)].push(f))

  const calendarItems = [...today, ...upcoming].slice(0, 5).map((f) => ({
    id: f.id,
    title: f.customerName,
    subtitle: f.reason,
    time: new Date(f.scheduledFor).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    priority: f.priority,
  }))

  function handleAdd(form) {
    addFollowUp(form)
    setShowModal(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Follow-ups</h1>
          <p className="text-sm text-gray-500">Stay on top of every conversation.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 bg-base-900 border border-base-700 text-gray-300 text-sm px-3 py-2 rounded-lg">
            <CalendarDays size={15} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-base-900 border border-base-700 text-gray-300 text-sm px-3 py-2 rounded-lg"
          >
            <Filter size={15} /> Filters
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <StatCardDetailed icon={CalendarClock} label="Due Today" value={today.length} sublabel={`${today.filter(f => f.priority === 'High').length} High Priority`} sublabelColor="text-red-400" color="blue" />
        <StatCardDetailed icon={Clock} label="Overdue" value={overdue.length} sublabel={`${overdue.filter(f => f.priority === 'High').length} High Priority`} sublabelColor="text-red-400" color="red" />
        <StatCardDetailed icon={CalendarDays} label="Upcoming" value={upcoming.length} sublabel="Next 7 Days" color="purple" />
        <StatCardDetailed icon={CheckCircle2} label="Completed" value={completed.length} sublabel="Today" color="green" />
        <StatCardDetailed icon={Flag} label="High Priority" value={highPriority.length} sublabel="Needs Attention" sublabelColor="text-amber-400" color="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-5">

          <div className="bg-base-900 border border-base-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-semibold text-gray-200">TODAY'S FOLLOW-UPS</h2>
              <span className="text-xs bg-accent-600/20 text-accent-500 px-2 py-0.5 rounded-full">{today.length}</span>
            </div>

            {['Morning', 'Afternoon', 'Evening'].map((slot) => {
              const items = grouped[slot]
              if (items.length === 0) return null
              const shown = items.slice(0, visibleCount[slot])
              const SlotIcon = slot === 'Morning' ? Sun : slot === 'Afternoon' ? CloudSun : Moon
              const timeRange = slot === 'Morning' ? '9:00 AM - 12:00 PM' : slot === 'Afternoon' ? '12:00 PM - 5:00 PM' : '5:00 PM - 9:00 PM'
              return (
                <div key={slot} className="mb-5 last:mb-0">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <SlotIcon size={14} />
                    <span className="font-medium text-gray-400">{slot}</span>
                    <span>{timeRange}</span>
                    <span className="bg-base-800 px-1.5 py-0.5 rounded text-gray-400">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {shown.map((f) => (
                      <FollowUpRow key={f.id} followUp={f} onUpdate={updateFollowUp} />
                    ))}
                  </div>
                  {items.length > shown.length && (
                    <button
                      onClick={() => setVisibleCount((v) => ({ ...v, [slot]: v[slot] + 5 }))}
                      className="text-xs text-accent-500 mt-2"
                    >
                      View all ({items.length})
                    </button>
                  )}
                </div>
              )
            })}
            {today.length === 0 && <p className="text-sm text-gray-600 text-center py-6">No follow-ups today. 🎉</p>}
          </div>

          {overdue.length > 0 && (
            <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-sm font-semibold text-red-400">OVERDUE FOLLOW-UPS</h2>
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">{overdue.length}</span>
              </div>
              <div className="space-y-2">
                {overdue.map((f) => (
                  <FollowUpRow key={f.id} followUp={f} onUpdate={updateFollowUp} overdue />
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="space-y-4">
          <MiniCalendarPanel date={new Date()} items={calendarItems} />

          <div className="bg-base-900 border border-base-700 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-400 tracking-wide mb-4">FOLLOW-UP WORKFLOW</h3>
            <WorkflowStepper />
          </div>

          <div className="bg-base-900 border border-base-700 rounded-xl p-2">
            <h3 className="text-xs font-semibold text-gray-400 tracking-wide px-2 pt-2 mb-1">QUICK ACTIONS</h3>
            <QuickActionCard icon={CalendarClock} title="Schedule Follow-up" subtitle="Plan a new follow-up" onClick={() => setShowModal(true)} />
            <QuickActionCard icon={MessageSquare} title="Follow-up Templates" subtitle="Use proven templates" />
            <QuickActionCard icon={CalendarDays} title="Follow-up Reports" subtitle="Analyze follow-up activities" />
          </div>
        </div>
      </div>

      {showModal && (
        <FollowUpFormModal leads={leads} onClose={() => setShowModal(false)} onSave={handleAdd} />
      )}
    </div>
  )
}

function FollowUpRow({ followUp: f, onUpdate, overdue }) {
  const dueTime = new Date(f.scheduledFor).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`flex flex-col lg:flex-row lg:items-center gap-3 p-3 rounded-lg border ${overdue ? 'border-red-900/40 bg-red-950/10' : 'border-base-800 bg-base-850'}`}>
      <div className="flex items-center gap-3 lg:w-48 shrink-0">
        <Avatar name={f.customerName} size="sm" />
        <div>
          <div className="text-sm text-gray-200">{f.customerName}</div>
          <div className="text-xs text-gray-500">{f.destination}</div>
          <div className="text-[11px] text-gray-600">{f.enquiryRef}</div>
        </div>
      </div>

      <div className="lg:flex-1 text-xs text-gray-500">
        <span className="text-gray-600">Last Conversation: </span>
        {f.lastConversation}
      </div>

      <div className="lg:w-40 text-xs text-gray-500">
        <span className="text-gray-600">Follow-up Reason: </span>
        {f.reason}
      </div>

      <div className="lg:w-28 text-xs">
        <div className={overdue ? 'text-red-400 font-medium' : 'text-gray-300'}>
          {overdue ? `Was Due ${dueTime}` : `${dueTime} Today`}
        </div>
        {overdue && <div className="text-[11px] text-red-500">overdue</div>}
      </div>

      <div className="lg:w-20">
        <PriorityBadge priority={f.priority} />
      </div>

      <div className="lg:w-32 flex items-center gap-1.5 text-xs text-gray-400">
        <Avatar name={f.assignedTo} size="sm" />
        {f.assignedTo}
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <a href={`tel:${f.phone}`} className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
          <Phone size={14} />
        </a>
        <a
          href={whatsappLink(f.phone, `Hi ${f.customerName}, ${f.reason}`)}
          target="_blank" rel="noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-600/20 text-green-400"
        >
          <MessageCircle size={14} />
        </a>
        <button
          onClick={() => onUpdate(f.id, { status: 'Done' })}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-600/20 text-green-400"
        >
          <Check size={14} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-base-800 text-gray-400">
          <MoreVertical size={14} />
        </button>
      </div>
    </div>
  )
}

function FollowUpFormModal({ leads, onClose, onSave }) {
  const [form, setForm] = useState({
    leadId: leads[0]?.id || '',
    type: 'Call',
    scheduledFor: '',
    status: 'Pending',
    priority: 'Medium',
    reason: '',
  })

  function handleSubmit(e) {
    e.preventDefault()
    const lead = leads.find((l) => l.id === form.leadId)
    if (!lead) return
    onSave({
      ...form,
      customerName: lead.customerName,
      phone: lead.phone,
      destination: lead.destination,
    })
  }

  return (
    <Modal title="Schedule Follow-up" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Customer / Lead</label>
          <select className="input" value={form.leadId} onChange={(e) => setForm((f) => ({ ...f, leadId: e.target.value }))}>
            {leads.map((l) => <option key={l.id} value={l.id}>{l.customerName} — {l.destination}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Type</label>
            <select className="input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              <option>Call</option>
              <option>WhatsApp</option>
              <option>Email</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Priority</label>
            <select className="input" value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Follow-up Reason</label>
          <input className="input" value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} placeholder="e.g. Share quotation" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Scheduled For</label>
          <input type="datetime-local" className="input" value={form.scheduledFor} onChange={(e) => setForm((f) => ({ ...f, scheduledFor: e.target.value }))} required />
        </div>
        <button type="submit" className="w-full bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium py-2.5 rounded-lg mt-2">
          Schedule Follow-up
        </button>
      </form>
    </Modal>
  )
            }
