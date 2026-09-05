export function formatINR(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0'
  return '₹' + Number(amount).toLocaleString('en-IN')
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function whatsappLink(phone, message = '') {
  const cleanPhone = String(phone).replace(/[^0-9]/g, '')
  const withCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`
  const text = encodeURIComponent(message)
  return `https://wa.me/${withCountry}${text ? `?text=${text}` : ''}`
}

export function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const diffMs = Date.now() - d.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}
