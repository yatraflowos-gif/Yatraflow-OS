import { createContext, useContext, useState, useEffect } from 'react'
import { generateAllDemoData } from '../data/demoData'
import { uid } from '../utils/formatters'

const DataContext = createContext(null)
const STORAGE_KEY = 'yf_data_v1'

export function DataProvider({ children }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Backfill new collections for users with older saved data
      if (!parsed.tasks) parsed.tasks = generateAllDemoData().tasks
      if (!parsed.packages) parsed.packages = generateAllDemoData().packages
      setData(parsed)
    } else {
      const fresh = generateAllDemoData()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
      setData(fresh)
    }
  }, [])

  useEffect(() => {
    if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  // ---- Leads ----
  function addLead(lead) {
    setData((prev) => ({ ...prev, leads: [{ ...lead, id: uid('lead') }, ...prev.leads] }))
  }
  function updateLead(id, updates) {
    setData((prev) => ({
      ...prev,
      leads: prev.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }))
  }
  function deleteLead(id) {
    setData((prev) => ({ ...prev, leads: prev.leads.filter((l) => l.id !== id) }))
  }

  // ---- Follow-ups ----
  function addFollowUp(fu) {
    setData((prev) => ({ ...prev, followUps: [{ ...fu, id: uid('fu') }, ...prev.followUps] }))
  }
  function updateFollowUp(id, updates) {
    setData((prev) => ({
      ...prev,
      followUps: prev.followUps.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }))
  }
  function deleteFollowUp(id) {
    setData((prev) => ({ ...prev, followUps: prev.followUps.filter((f) => f.id !== id) }))
  }

  // ---- Quotations ----
  function addQuotation(quo) {
    setData((prev) => ({ ...prev, quotations: [{ ...quo, id: uid('quo') }, ...prev.quotations] }))
  }
  function updateQuotation(id, updates) {
    setData((prev) => ({
      ...prev,
      quotations: prev.quotations.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    }))
  }
  function deleteQuotation(id) {
    setData((prev) => ({ ...prev, quotations: prev.quotations.filter((q) => q.id !== id) }))
  }
  function convertQuotationToBooking(quotationId) {
    setData((prev) => {
      const quo = prev.quotations.find((q) => q.id === quotationId)
      if (!quo) return prev
      const newBooking = {
        id: uid('book'),
        quotationId: quo.id,
        customerName: quo.customerName,
        phone: quo.phone,
        destination: quo.destination,
        amount: quo.amount,
        status: 'Confirmed',
        travelDate: quo.validTill,
        createdAt: new Date().toISOString(),
        itinerary: [],
      }
      return {
        ...prev,
        quotations: prev.quotations.map((q) =>
          q.id === quotationId ? { ...q, status: 'Accepted' } : q
        ),
        bookings: [newBooking, ...prev.bookings],
      }
    })
  }

  // ---- Bookings ----
  function updateBooking(id, updates) {
    setData((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }))
  }
  function deleteBooking(id) {
    setData((prev) => ({ ...prev, bookings: prev.bookings.filter((b) => b.id !== id) }))
  }

  // ---- Payments ----
  function addPayment(payment) {
    setData((prev) => ({ ...prev, payments: [{ ...payment, id: uid('pay') }, ...prev.payments] }))
  }
  function updatePayment(id, updates) {
    setData((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }))
  }

  // ---- Customers ----
  function addCustomer(customer) {
    setData((prev) => ({ ...prev, customers: [{ ...customer, id: uid('cust') }, ...prev.customers] }))
  }
  function updateCustomer(id, updates) {
    setData((prev) => ({
      ...prev,
      customers: prev.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }))
  }
  function deleteCustomer(id) {
    setData((prev) => ({ ...prev, customers: prev.customers.filter((c) => c.id !== id) }))
  }

  // ---- Tasks (general, separate from follow-ups) ----
  function addTask(task) {
    setData((prev) => ({ ...prev, tasks: [{ ...task, id: uid('task') }, ...prev.tasks] }))
  }
  function updateTask(id, updates) {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }))
  }
  function deleteTask(id) {
    setData((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }))
  }

  // ---- Packages ----
  function addPackage(pkg) {
    setData((prev) => ({ ...prev, packages: [{ ...pkg, id: uid('pkg') }, ...prev.packages] }))
  }
  function updatePackage(id, updates) {
    setData((prev) => ({
      ...prev,
      packages: prev.packages.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }))
  }
  function deletePackage(id) {
    setData((prev) => ({ ...prev, packages: prev.packages.filter((p) => p.id !== id) }))
  }

  // ---- Itineraries (day plans attached to a booking) ----
  function setItineraryDays(bookingId, days) {
    setData((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) => (b.id === bookingId ? { ...b, itinerary: days } : b)),
    }))
  }

  if (!data) return null

  return (
    <DataContext.Provider
      value={{
        ...data,
        addLead, updateLead, deleteLead,
        addFollowUp, updateFollowUp, deleteFollowUp,
        addQuotation, updateQuotation, deleteQuotation, convertQuotationToBooking,
        updateBooking, deleteBooking,
        addPayment, updatePayment,
        addCustomer, updateCustomer, deleteCustomer,
        addTask, updateTask, deleteTask,
        addPackage, updatePackage, deletePackage,
        setItineraryDays,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
