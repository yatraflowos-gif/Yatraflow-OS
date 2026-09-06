import { createContext, useContext, useState, useEffect } from 'react'
import { generateAllDemoData } from '../data/demoData'
import { uid } from '../utils/formatters'

const DataContext = createContext(null)

const STORAGE_KEY = 'yf_data_v1'

export function DataProvider({ children }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)

      if (stored) {
        const parsed = JSON.parse(stored)

        // Make sure all collections exist
        const demo = generateAllDemoData()

        const completeData = {
          customers: parsed.customers || demo.customers,
          leads: parsed.leads || demo.leads,
          followUps: parsed.followUps || demo.followUps,
          quotations: parsed.quotations || demo.quotations,
          bookings: parsed.bookings || demo.bookings,
          payments: parsed.payments || demo.payments,
          tasks: parsed.tasks || demo.tasks,
          packages: parsed.packages || demo.packages,
        }

        setData(completeData)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(completeData))
      } else {
        const fresh = generateAllDemoData()

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(fresh)
        )

        setData(fresh)
      }
    } catch (err) {
      console.error('YatraFlow DataContext Error:', err)
      setError(err)
    }
  }, [])

  useEffect(() => {
    if (data) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(data)
        )
      } catch (err) {
        console.error('Could not save YatraFlow data:', err)
      }
    }
  }, [data])

  // -------------------------
  // Loading / Error
  // -------------------------

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          padding: '24px',
          fontFamily: 'Arial, sans-serif',
          background: '#f8fafc',
          color: '#111827',
        }}
      >
        <h2>YatraFlow loading error</h2>

        <p>
          Something went wrong while loading your demo data.
        </p>

        <pre
          style={{
            whiteSpace: 'pre-wrap',
            background: '#ffffff',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'auto',
          }}
        >
          {error.message}
        </pre>
      </div>
    )
  }

  if (!data) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial, sans-serif',
          background: '#f8fafc',
          color: '#111827',
          fontSize: '18px',
        }}
      >
        Loading YatraFlow...
      </div>
    )
  }

  // -------------------------
  // Leads
  // -------------------------

  function addLead(lead) {
    setData((prev) => ({
      ...prev,
      leads: [
        {
          ...lead,
          id: uid('lead'),
        },
        ...prev.leads,
      ],
    }))
  }

  function updateLead(id, updates) {
    setData((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) =>
        lead.id === id
          ? { ...lead, ...updates }
          : lead
      ),
    }))
  }

  function deleteLead(id) {
    setData((prev) => ({
      ...prev,
      leads: prev.leads.filter(
        (lead) => lead.id !== id
      ),
    }))
  }

  // -------------------------
  // Follow Ups
  // -------------------------

  function addFollowUp(followUp) {
    setData((prev) => ({
      ...prev,
      followUps: [
        {
          ...followUp,
          id: uid('fu'),
        },
        ...prev.followUps,
      ],
    }))
  }

  function updateFollowUp(id, updates) {
    setData((prev) => ({
      ...prev,
      followUps: prev.followUps.map((followUp) =>
        followUp.id === id
          ? { ...followUp, ...updates }
          : followUp
      ),
    }))
  }

  function deleteFollowUp(id) {
    setData((prev) => ({
      ...prev,
      followUps: prev.followUps.filter(
        (followUp) => followUp.id !== id
      ),
    }))
  }

  // -------------------------
  // Quotations
  // -------------------------

  function addQuotation(quotation) {
    setData((prev) => ({
      ...prev,
      quotations: [
        {
          ...quotation,
          id: uid('quo'),
        },
        ...prev.quotations,
      ],
    }))
  }

  function updateQuotation(id, updates) {
    setData((prev) => ({
      ...prev,
      quotations: prev.quotations.map((quotation) =>
        quotation.id === id
          ? { ...quotation, ...updates }
          : quotation
      ),
    }))
  }

  function deleteQuotation(id) {
    setData((prev) => ({
      ...prev,
      quotations: prev.quotations.filter(
        (quotation) => quotation.id !== id
      ),
    }))
  }

  function convertQuotationToBooking(quotationId) {
    setData((prev) => {
      const quotation = prev.quotations.find(
        (q) => q.id === quotationId
      )

      if (!quotation) {
        return prev
      }

      const newBooking = {
        id: uid('book'),
        quotationId: quotation.id,
        customerName: quotation.customerName,
        phone: quotation.phone,
        destination: quotation.destination,
        amount: quotation.amount,
        status: 'Confirmed',
        travelDate: quotation.validTill,
        createdAt: new Date().toISOString(),
        itinerary: [],
      }

      return {
        ...prev,

        quotations: prev.quotations.map((q) =>
          q.id === quotationId
            ? {
                ...q,
                status: 'Accepted',
              }
            : q
        ),

        bookings: [
          newBooking,
          ...prev.bookings,
        ],
      }
    })
  }

  // -------------------------
  // Bookings
  // -------------------------

  function updateBooking(id, updates) {
    setData((prev) => ({
      ...prev,
      bookings: prev.bookings.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              ...updates,
            }
          : booking
      ),
    }))
  }

  function deleteBooking(id) {
    setData((prev) => ({
      ...prev,
      bookings: prev.bookings.filter(
        (booking) => booking.id !== id
      ),
    }))
  }

  // -------------------------
  // Payments
  // -------------------------

  function addPayment(payment) {
    setData((prev) => ({
      ...prev,
      payments: [
        {
          ...payment,
          id: uid('pay'),
        },
        ...prev.payments,
      ],
    }))
  }

  function updatePayment(id, updates) {
    setData((prev) => ({
      ...prev,
      payments: prev.payments.map((payment) =>
        payment.id === id
          ? {
              ...payment,
              ...updates,
            }
          : payment
      ),
    }))
  }

  // -------------------------
  // Customers
  // -------------------------

  function addCustomer(customer) {
    setData((prev) => ({
      ...prev,
      customers: [
        {
          ...customer,
          id: uid('cust'),
        },
        ...prev.customers,
      ],
    }))
  }

  function updateCustomer(id, updates) {
    setData((prev) => ({
      ...prev,
      customers: prev.customers.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              ...updates,
            }
          : customer
      ),
    }))
  }

  function deleteCustomer(id) {
    setData((prev) => ({
      ...prev,
      customers: prev.customers.filter(
        (customer) => customer.id !== id
      ),
    }))
  }

  // -------------------------
  // Tasks
  // -------------------------

  function addTask(task) {
    setData((prev) => ({
      ...prev,
      tasks: [
        {
          ...task,
          id: uid('task'),
        },
        ...prev.tasks,
      ],
    }))
  }

  function updateTask(id, updates) {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
            }
          : task
      ),
    }))
  }

  function deleteTask(id) {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter(
        (task) => task.id !== id
      ),
    }))
  }

  // -------------------------
  // Packages
  // -------------------------

  function addPackage(pkg) {
    setData((prev) => ({
      ...prev,
      packages: [
        {
          ...pkg,
          id: uid('pkg'),
        },
        ...prev.packages,
      ],
    }))
  }

  function updatePackage(id, updates) {
    setData((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg) =>
        pkg.id === id
          ? {
              ...pkg,
              ...updates,
            }
          : pkg
      ),
    }))
  }

  function deletePackage(id) {
    setData((prev) => ({
      ...prev,
      packages: prev.packages.filter(
        (pkg) => pkg.id !== id
      ),
    }))
  }

  // -------------------------
  // Itinerary
  // -------------------------

  function setItineraryDays(bookingId, days) {
    setData((prev) => ({
      ...prev,
      bookings: prev.bookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              itinerary: days,
            }
          : booking
      ),
    }))
  }

  return (
    <DataContext.Provider
      value={{
        ...data,

        addLead,
        updateLead,
        deleteLead,

        addFollowUp,
        updateFollowUp,
        deleteFollowUp,

        addQuotation,
        updateQuotation,
        deleteQuotation,
        convertQuotationToBooking,

        updateBooking,
        deleteBooking,

        addPayment,
        updatePayment,

        addCustomer,
        updateCustomer,
        deleteCustomer,

        addTask,
        updateTask,
        deleteTask,

        addPackage,
        updatePackage,
        deletePackage,

        setItineraryDays,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)

  if (!context) {
    throw new Error(
      'useData must be used within DataProvider'
    )
  }

  return context
}
