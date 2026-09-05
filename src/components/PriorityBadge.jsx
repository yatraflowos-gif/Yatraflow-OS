import { getPriorityStyle } from '../utils/priority'

export default function PriorityBadge({ priority }) {
  const style = getPriorityStyle(priority)
  return (
    <span className={`flex items-center gap-1.5 text-xs font-medium ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {priority}
    </span>
  )
}
