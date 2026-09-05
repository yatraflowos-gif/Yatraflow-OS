export const PRIORITY_COLORS = {
  High: { dot: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/10' },
  Medium: { dot: 'bg-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  Low: { dot: 'bg-green-500', text: 'text-green-400', bg: 'bg-green-500/10' },
}

export function getPriorityStyle(priority) {
  return PRIORITY_COLORS[priority] || PRIORITY_COLORS.Medium
}

export function getTimeSlot(dateStr) {
  const d = new Date(dateStr)
  const hour = d.getHours()
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  return 'Evening'
}

export function isOverdue(dateStr, status) {
  if (status !== 'Pending') return false
  return new Date(dateStr).getTime() < Date.now()
}

export function isToday(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}
