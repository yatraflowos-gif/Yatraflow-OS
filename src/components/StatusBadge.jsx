const colorMap = {
  New: 'bg-blue-500/15 text-blue-400',
  Contacted: 'bg-cyan-500/15 text-cyan-400',
  'Follow-up': 'bg-amber-500/15 text-amber-400',
  'Quotation Sent': 'bg-purple-500/15 text-purple-400',
  Won: 'bg-green-500/15 text-green-400',
  Lost: 'bg-red-500/15 text-red-400',
  Draft: 'bg-gray-500/15 text-gray-400',
  Sent: 'bg-purple-500/15 text-purple-400',
  Accepted: 'bg-green-500/15 text-green-400',
  Rejected: 'bg-red-500/15 text-red-400',
  Confirmed: 'bg-green-500/15 text-green-400',
  Pending: 'bg-amber-500/15 text-amber-400',
  Cancelled: 'bg-red-500/15 text-red-400',
  Hold: 'bg-orange-500/15 text-orange-400',
  Done: 'bg-green-500/15 text-green-400',
  Missed: 'bg-red-500/15 text-red-400',
  Paid: 'bg-green-500/15 text-green-400',
  Partial: 'bg-amber-500/15 text-amber-400',
}

export default function StatusBadge({ status }) {
  const cls = colorMap[status] || 'bg-gray-500/15 text-gray-400'
  return (
    <span className={`text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap ${cls}`}>
      {status}
    </span>
  )
}
