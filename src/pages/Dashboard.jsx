import { useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { MessageSquare, Clock, Briefcase, IndianRupee } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { formatINR, formatDateTime } from '../utils/formatters'
import StatCardDetailed from '../components/StatCardDetailed'
import SparklineChart from '../components/SparklineChart'
import DonutChart from '../components/DonutChart'
import TrendLineChart from '../components/TrendLineChart'
import RouteMapBanner from '../components/RouteMapBanner'
import TaskChecklistCard from '../components/TaskChecklistCard'
import RecentActivityCard from '../components/RecentActivityCard'
import RecentBookingsCard from '../components/RecentBookingsCard'

// Deterministic fake sparkline series (until real historical data exists).
function fakeSeries(seed, len = 8) {
  let val = 5
  return Array.from({ length: len }).map((_, i) => {
    val += Math.sin(seed + i) * 3 + (Math.random() - 0.5) * 2
    return Math.max(1, Math.round(val))
  })
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const data = useData()
  const { leads, followUps, bookings, payments } = data
  const [doneTasks, setDoneTasks] = useState({})

  const pendingFollowUps = followUps.filter((f) => f.status === 'Pending')
  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed')
  const revenueThisMonth = payments.reduce((sum, p) => sum + (p.amount || 0), 0)

  const statusBreakdown = useMemo(() => {
    const buckets = { New: 0, Contacted: 0, 'Follow-up': 0, 'Quotation Sent': 0, Won: 0, Lost: 0 }
    leads.forEach((l) => { buckets[l.status] = (buckets[l.status] || 0) + 1 })
    return [
      { label: 'New Enquiries', value: buckets.New, color: '#2563eb' },
      { label: 'In Follow-up', value: buckets['Follow-up'], color: '#06b6d4' },
      { label: 'Proposal Sent', value: buckets['Quotation Sent'], color: '#a855f7' },
      { label: 'Won', value: buckets.Won, color: '#f59e0b' },
      { label: 'Closed / Lost', value: buckets.Lost, color: '#6b7280' },
    ]
  }, [leads])
  const totalLeads = statusBreakdown.reduce((s, b) => s + b.value, 0) || 1

  const bookingTrend = useMemo(() => {
    const labels = ['1 May', '8 May', '15 May', '22 May', '29 May']
    return labels.map((_, i) => bookings.length ? Math.max(1, Math.round((i + 1) * (bookings.length / labels.length) + Math.sin(i) * 2)) : 0)
  }, [bookings])

  const destinationCounts = useMemo(() => {
    const counts = {}
    bookings.forEach((b) => { counts[b.destination] = (counts[b.destination] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4)
  }, [bookings])
  const maxDestCount = Math.max(1, ...destinationCounts.map(([, c]) => c))
  const totalDestBookings = destinationCounts.reduce((s, [, c]) => s + c, 0) || 1
  const destColors = ['bg-blue-500', 'bg-cyan-500', 'bg-purple-500', 'bg-amber-500']

  const tasksToday = pendingFollowUps.slice(0, 4).map((f) => ({
    id: f.id,
    title: `Follow up with ${f.customerName}`,
    subtitle: f.destination,
    time: new Date(f.scheduledFor).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    done: !!doneTasks[f.id],
  }))

  const recentBookingsList = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
    .map((b) => ({
      id: b.id,
      title: `${b.destination} Trip`,
      meta: b.customerName,
      amount: b.amount,
      status: b.status,
    }))

  const recentActivity = [
    ...leads.slice(0, 2).map((l) => ({ type: 'enquiry', title: 'New enquiry received', subtitle: `${l.destination} — ${l.customerName}`, time: l.createdAt })),
    ...bookings.slice(0, 2).map((b) => ({ type: 'booking', title: 'Booking confirmed', subtitle: `${b.destination} — ${b.customerName}`, time: b.createdAt })),
    ...payments.slice(0, 1).map((p) => ({ type: 'payment', title: 'Payment received', subtitle: p.customerName, time: p.date })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)

  const topPins = destinationCounts.slice(0, 2).map(([d]) => d)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white">Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
        <p className="text-sm text-gray-500">Every Enquiry. Every Follow-up. Every Booking.</p>
      </div>

      <RouteMapBanner pointA={topPins[0] || 'Spiti Valley'} pointB={topPins[1] || 'Kedarnath'} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStatCard icon={MessageSquare} label="Total Enquiries" value={leads.length} trend="+18% from last 7 days" series={fakeSeries(1)} color="#2563eb" />
        <MiniStatCard icon={Clock} label="Follow-ups Due" value={pendingFollowUps.length} trend="+8% from last 7 days" series={fakeSeries(2)} color="#f59e0b" />
        <MiniStatCard icon={Briefcase} label="Bookings Confirmed" value={confirmedBookings.length} trend="+12% from last 7 days" series={fakeSeries(3)} color="#10b981" />
        <MiniStatCard icon={IndianRupee} label="Revenue (This Month)" value={formatINR(revenueThisMonth)} trend="+22% from last 7 days" series={fakeSeries(4)} color="#2563eb" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="bg-base-900 border border-base-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-200">Enquiries Overview</h2>
            <select className="bg-base-800 border border-base-700 text-xs text-gray-400 rounded-lg px-2 py-1">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="flex items-center gap-5">
            <DonutChart data={statusBreakdown} total={totalLeads} centerLabel="Total" />
            <div className="flex-1 space-y-2.5 min-w-0">
              {statusBreakdown.map((s) => (
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-gray-400 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    {s.label}
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className="text-gray-300">{s.value}</span>
                    <span className="bg-base-800 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">
                      {Math.round((s.value / totalLeads) * 100)}%
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-base-900 border border-base-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-200">Bookings Trend</h2>
            <select className="bg-base-800 border border-base-700 text-xs text-gray-400 rounded-lg px-2 py-1">
              <option>This Month</option>
            </select>
          </div>
          <TrendLineChart labels={['1 May', '8 May', '15 May', '22 May', '29 May']} values={bookingTrend} />
        </div>

        <TaskChecklistCard
          tasks={tasksToday}
          onToggle={(id) => setDoneTasks((d) => ({ ...d, [id]: !d[id] }))}
          onViewAll={() => navigate('/follow-ups')}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="bg-base-900 border border-base-700 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-200 mb-4">Top Destinations <span className="text-gray-500 font-normal">(This Month)</span></h2>
          <div className="space-y-4">
            {destinationCounts.length === 0 && <p className="text-xs text-gray-600">No bookings yet.</p>}
            {destinationCounts.map(([dest, count], i) => (
              <div key={dest}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-300">{dest}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-gray-400">{count} Bookings</span>
                    <span className="text-gray-500 text-xs">{Math.round((count / totalDestBookings) * 100)}%</span>
                  </span>
                </div>
                <div className="h-1.5 bg-base-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${destColors[i % destColors.length]}`} style={{ width: `${(count / maxDestCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <RecentBookingsCard bookings={recentBookingsList} onViewAll={() => navigate('/bookings')} />
        <RecentActivityCard items={recentActivity} onViewAll={() => navigate('/leads')} />
      </div>
    </div>
  )
}

function MiniStatCard({ icon: Icon, label, value, trend, series, color }) {
  return (
    <div className="bg-base-900 border border-base-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}22`, color }}>
          <Icon size={16} />
        </div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="text-xl font-semibold text-white">{value}</div>
          <div className="text-xs text-green-400 mt-0.5">{trend}</div>
        </div>
        <SparklineChart data={series} color={color} width={80} height={32} />
      </div>
    </div>
  )
                                                 }
