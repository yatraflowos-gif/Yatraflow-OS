import { MessageSquare, Phone, Clock, FileText, Briefcase } from 'lucide-react'

const STEPS = [
  { label: 'Enquiry', icon: MessageSquare, color: 'bg-blue-600' },
  { label: 'Contacted', icon: Phone, color: 'bg-cyan-600' },
  { label: 'Follow-up', icon: Clock, color: 'bg-amber-600' },
  { label: 'Quotation', icon: FileText, color: 'bg-purple-600' },
  { label: 'Booking', icon: Briefcase, color: 'bg-green-600' },
]

export default function WorkflowStepper({ counts = {} }) {
  return (
    <div className="flex items-center justify-between">
      {STEPS.map((step, i) => {
        const Icon = step.icon
        return (
          <div key={step.label} className="flex flex-col items-center gap-1.5 flex-1 relative">
            {i < STEPS.length - 1 && (
              <div className="absolute top-4 left-1/2 w-full h-px bg-base-700 z-0" />
            )}
            <div className={`w-8 h-8 rounded-full ${step.color} flex items-center justify-center text-white relative z-10`}>
              <Icon size={14} />
            </div>
            <span className="text-[10px] text-gray-500 text-center">{step.label}</span>
          </div>
        )
      })}
    </div>
  )
}
