import { MessageSquare, Clock, FileText, Briefcase, IndianRupee } from 'lucide-react'
import { useData } from '../context/DataContext'
import { formatINR, formatDateTime, timeAgo } from '../utils/formatters'
import StatCard from '../components/StatCard'

export default function Dashboard() {
  const data = useData()
  const { leads, followUps, quotations, bookings, payments, customers } = data

  const pendingFollowUps = followUps.filter((f) => f.status === 'Pending')
  const revenueThisMonth = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed')

  const recentEnquiries = [...leads]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const upcomingFollowUps = [...pendingFollowUps]
    .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor))
    .slice(0, 5)

  const destinationCounts = bookings.reduce((acc, b) => {
    acc[b.destination] = (acc[b.destination] || 0) + 1
    return acc
  }, {})
  const popularDestinations = Object.entries(destinationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  const maxDestCount = Math.max(1, ...popularDestinations.map(([, c]) => c))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Good morning 👋</h1>
        <p className="text-sm text-gray-500">Here's what's happening with your tours today.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <StatCard icon={MessageSquare} label="New Enquiries" value={leads.length} color="blue" />
        <StatCard icon={Clock} label="Pending Follow-ups" value={pendingFollowUps.length} color="amber" />
        <StatCard icon={FileText} label="Active Quotations" value={quotations.length} color="purple" />
        <StatCard icon={Briefcase} label="Confirmed Bookings" value={confirmedBookings.length} color="green" />
        <StatCard icon={IndianRupee} label="Revenue Collected" value={formatINR(revenueThisMonth)} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-base-900 border border-base-700 rounded-xl p-4">
          <h2 className="text-sm font-medium text-gray-300 mb-3">Upcoming Follow-ups</h2>
          <div className="space-y-2">
            {upcomingFollowUps.length === 0 && (
              <p className="text-sm text-gray-600">No pending follow-ups.</p>
            )}
            {upcomingFollowUps.map((f) => (
              <div key={f.id} className="flex items-center justify-between text-sm py-1.5 border-b border-base-800 last:border-0">
                <div>
                  <div className="text-gray-200">{f.customerName}</div>
                  <div className="text-xs text-gray-500">{f.destination}</div>
                </div>
                <div className="text-xs text-gray-500">{formatDateTime(f.scheduledFor)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-base-900 border border-base-700 rounded-xl p-4">
          <h2 className="text-sm font-medium text-gray-300 mb-3">Recent Enquiries</h2>
          <div className="space-y-2">
            {recentEnquiries.map((l) => (
              <div key={l.id} className="flex items-center justify-between text-sm py-1.5 border-b border-base-800 last:border-0">
                <div>
                  <div className="text-gray-200">{l.customerName}</div>
                  <div className="text-xs text-gray-500">{l.destination}</div>
                </div>
                <div className="text-xs text-gray-500">{timeAgo(l.createdAt)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-base-900 border border-base-700 rounded-xl p-4">
          <h2 className="text-sm font-medium text-gray-300 mb-3">Popular Destinations</h2>
          <div className="space-y-3">
            {popularDestinations.length === 0 && (
              <p className="text-sm text-gray-600">No bookings yet.</p>
            )}
            {popularDestinations.map(([dest, count]) => (
              <div key={dest}>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{dest}</span>
                  <span>{count} bookings</span>
                </div>
                <div className="h-1.5 bg-base-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-500 rounded-full"
                    style={{ width: `${(count / maxDestCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-600">
        {customers.length} total customers · {bookings.length} total bookings
      </div>
    </div>
  )
}
