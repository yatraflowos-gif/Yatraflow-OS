import { useMemo } from 'react'
import { useData } from '../context/DataContext'
import { formatINR } from '../utils/formatters'
import DonutChart from '../components/DonutChart'
import TrendLineChart from '../components/TrendLineChart'
import StatCardDetailed from '../components/StatCardDetailed'
import { MessageSquare, Briefcase, IndianRupee, TrendingUp } from 'lucide-react'

export default function Reports() {
  const { leads, bookings, payments, quotations } = useData()

  const totalRevenue = payments.reduce((s, p) => s + (p.amount || 0), 0)
  const conversionRate = leads.length ? Math.round((leads.filter((l) => l.status === 'Won').length / leads.length) * 100) : 0
  const avgBookingValue = bookings.length ? Math.round(bookings.reduce((s, b) => s + b.amount, 0) / bookings.length) : 0

  const sourceBreakdown = useMemo(() => {
    const buckets = {}
    leads.forEach((l) => { buckets[l.source] = (buckets[l.source] || 0) + 1 })
    const colors = ['#2563eb', '#06b6d4', '#a855f7', '#f59e0b', '#10b981']
    return Object.entries(buckets).map(([label, value], i) => ({ label, value, color: colors[i % colors.length] }))
  }, [leads])
  const totalSourceLeads = sourceBreakdown.reduce((s, b) => s + b.value, 0) || 1

  const revenueTrend = useMemo(() => {
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    return labels.map((_, i) => Math.round((totalRevenue / 4) * (i + 1) * (0.7 + Math.random() * 0.6)) || 0)
  }, [totalRevenue])

  const quotationStatus = useMemo(() => {
    const buckets = { Draft: 0, Sent: 0, Accepted: 0, Rejected: 0 }
    quotations.forEach((q) => { buckets[q.status] = (buckets[q.status] || 0) + 1 })
    return buckets
  }, [quotations])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white">Reports & Analytics</h1>
        <p className="text-sm text-gray-500">Business performance at a glance</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <StatCardDetailed icon={MessageSquare} label="Total Enquiries" value={leads.length} color="blue" />
        <StatCardDetailed icon={TrendingUp} label="Conversion Rate" value={`${conversionRate}%`} color="green" />
        <StatCardDetailed icon={Briefcase} label="Avg Booking Value" value={formatINR(avgBookingValue)} color="purple" />
        <StatCardDetailed icon={IndianRupee} label="Total Revenue" value={formatINR(totalRevenue)} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-base-900 border border-base-700 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-200 mb-4">Revenue Trend (This Month)</h2>
          <TrendLineChart labels={['Week 1', 'Week 2', 'Week 3', 'Week 4']} values={revenueTrend} color="#10b981" />
        </div>

        <div className="bg-base-900 border border-base-700 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-200 mb-4">Enquiry Source Breakdown</h2>
          <div className="flex items-center gap-5">
            <DonutChart data={sourceBreakdown} total={totalSourceLeads} centerLabel="Leads" />
            <div className="flex-1 space-y-2">
              {sourceBreakdown.map((s) => (
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-gray-400">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.label}
                  </span>
                  <span className="text-gray-300">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-base-900 border border-base-700 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-gray-200 mb-4">Quotation Funnel</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(quotationStatus).map(([status, count]) => (
            <div key={status} className="bg-base-800 rounded-lg p-3 text-center">
              <div className="text-xl font-semibold text-white">{count}</div>
              <div className="text-xs text-gray-500 mt-1">{status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
