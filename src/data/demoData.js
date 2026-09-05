import { uid } from '../utils/formatters'

const destinations = ['Manali', 'Leh Ladakh', 'Spiti Valley', 'Shimla', 'Kashmir', 'Kedarnath', 'Dharamshala', 'Rishikesh']
const sources = ['Website', 'WhatsApp', 'Instagram', 'Referral', 'Email']
const statuses = ['New', 'Contacted', 'Follow-up', 'Quotation Sent', 'Won', 'Lost']
const names = [
  'Rahul Sharma', 'Neha Verma', 'Amit Joshi', 'Pooja Mehta', 'Vikram Singh',
  'Arjun Patel', 'Sneha Iyer', 'Rohit Chauhan', 'Meera Kapoor', 'Dev Sharma',
  'Karan Mehta', 'Gupta Family', 'Delhi Corporate Group', 'Amit Family', 'Neha Group'
]

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomPhone() {
  return `9${Math.floor(100000000 + Math.random() * 899999999)}`
}

function daysAgoISO(days) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function daysFromNowISO(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export function generateCustomers(count = 15) {
  return Array.from({ length: count }).map((_, i) => ({
    id: uid('cust'),
    name: names[i % names.length],
    phone: randomPhone(),
    email: `customer${i + 1}@example.com`,
    location: randomFrom(['Delhi', 'Mumbai', 'Bangalore', 'Chandigarh', 'Pune']),
    totalTrips: Math.floor(Math.random() * 5),
    totalSpend: Math.floor(Math.random() * 200000),
    loyalCustomer: Math.random() > 0.7,
    createdAt: daysAgoISO(Math.floor(Math.random() * 200)),
    notes: '',
  }))
}

export function generateLeads(customers, count = 12) {
  return Array.from({ length: count }).map((_, i) => {
    const customer = randomFrom(customers)
    return {
      id: uid('lead'),
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      destination: randomFrom(destinations),
      travelDate: daysFromNowISO(Math.floor(Math.random() * 60) + 5),
      travellers: Math.floor(Math.random() * 8) + 1,
      budget: (Math.floor(Math.random() * 20) + 2) * 10000,
      source: randomFrom(sources),
      status: randomFrom(statuses),
      assignedTo: randomFrom(['Neha Verma', 'Rohit Negi', 'Anjali Thakur', 'Sandeep R.']),
      lastContact: daysAgoISO(Math.floor(Math.random() * 10)),
      nextFollowUp: daysFromNowISO(Math.floor(Math.random() * 7) + 1),
      notes: 'Interested in adventure activities. Needs itinerary with cost breakdown.',
      createdAt: daysAgoISO(Math.floor(Math.random() * 30)),
    }
  })
}

export function generateFollowUps(leads, count = 8) {
  return Array.from({ length: count }).map((_, i) => {
    const lead = randomFrom(leads)
    return {
      id: uid('fu'),
      leadId: lead.id,
      customerName: lead.customerName,
      phone: lead.phone,
      destination: lead.destination,
      type: randomFrom(['Call', 'WhatsApp', 'Email']),
      scheduledFor: daysFromNowISO(Math.floor(Math.random() * 5)),
      status: randomFrom(['Pending', 'Done', 'Missed']),
      notes: '',
    }
  })
}

export function generateQuotations(leads, count = 8) {
  return Array.from({ length: count }).map((_, i) => {
    const lead = randomFrom(leads)
    const amount = lead.budget || 50000
    return {
      id: uid('quo'),
      leadId: lead.id,
      customerName: lead.customerName,
      phone: lead.phone,
      destination: lead.destination,
      amount,
      status: randomFrom(['Draft', 'Sent', 'Accepted', 'Rejected']),
      validTill: daysFromNowISO(10),
      createdAt: daysAgoISO(Math.floor(Math.random() * 15)),
      items: [
        { label: 'Accommodation', amount: Math.floor(amount * 0.4) },
        { label: 'Transport', amount: Math.floor(amount * 0.3) },
        { label: 'Activities', amount: Math.floor(amount * 0.2) },
        { label: 'Misc', amount: Math.floor(amount * 0.1) },
      ],
    }
  })
}

export function generateBookings(quotations, count = 6) {
  return quotations.slice(0, count).map((q) => ({
    id: uid('book'),
    quotationId: q.id,
    customerName: q.customerName,
    phone: q.phone,
    destination: q.destination,
    amount: q.amount,
    status: randomFrom(['Confirmed', 'Pending', 'Cancelled', 'Hold']),
    travelDate: daysFromNowISO(Math.floor(Math.random() * 40) + 5),
    createdAt: daysAgoISO(Math.floor(Math.random() * 10)),
  }))
}

export function generatePayments(bookings, count = 5) {
  return bookings.slice(0, count).map((b) => ({
    id: uid('pay'),
    bookingId: b.id,
    customerName: b.customerName,
    amount: Math.floor(b.amount * 0.5),
    totalAmount: b.amount,
    mode: randomFrom(['UPI', 'Bank Transfer', 'Cash', 'Card']),
    status: randomFrom(['Paid', 'Pending', 'Partial']),
    date: daysAgoISO(Math.floor(Math.random() * 10)),
  }))
}

export function generateAllDemoData() {
  const customers = generateCustomers(15)
  const leads = generateLeads(customers, 12)
  const followUps = generateFollowUps(leads, 8)
  const quotations = generateQuotations(leads, 8)
  const bookings = generateBookings(quotations, 6)
  const payments = generatePayments(bookings, 5)
  return { customers, leads, followUps, quotations, bookings, payments }
}
