import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

function Navbar({ user, onLogout }) {
  const tabs = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/more-info', label: 'More Info' },
    { to: '/behavior-consultation', label: 'Behavior Consultation' },
    { to: '/schedule', label: 'Schedule an Appointment' },
  ]
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-slate-800">Rooted in Speech</Link>
        <nav className="hidden md:flex gap-4">
          {tabs.map(t => (
            <Link key={t.to} to={t.to} className="text-slate-700 hover:text-indigo-600 transition">{t.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/account" className="text-slate-700 hover:text-indigo-600">My Account</Link>
              <button onClick={onLogout} className="px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-700">Logout</button>
            </>
          ) : (
            <Link to="/account" className="px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-700">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  )
}

function Home() {
  const navigate = useNavigate()
  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-indigo-50 to-sky-50">
      <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Rooted in Speech</h1>
          <p className="text-lg text-slate-700 mb-6">Personalized speech and behavior services designed to help children and families thrive.</p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/more-info')} className="px-5 py-3 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Learn more</button>
            <button onClick={() => navigate('/schedule')} className="px-5 py-3 rounded-md bg-white text-slate-900 border hover:bg-slate-50">Schedule</button>
          </div>
        </div>
        <div className="bg-white/70 rounded-xl p-6 border">
          <h3 className="font-semibold text-slate-900 mb-2">Contact me</h3>
          <p className="text-slate-700 mb-4">Have questions? Reach out and Ill get back to you soon.</p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:hello@example.com" className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700">Email</a>
            <a href="tel:+1234567890" className="px-4 py-2 rounded-md bg-white border hover:bg-slate-50">Call</a>
          </div>
        </div>
      </div>
    </div>
  )
}

function About() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">About</h2>
      <p className="text-slate-700 leading-relaxed">Rooted in Speech provides family-centered services focusing on practical skills, empathy, and evidence-based strategies. Services include behavior consultations, therapy sessions, and collaborative care planning.</p>
    </section>
  )
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left px-4 py-3 bg-white hover:bg-slate-50 flex justify-between items-center">
        <span className="font-medium text-slate-800">{q}</span>
        <span className="text-slate-500">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="px-4 py-3 bg-slate-50 text-slate-700">{a}</div>}
    </div>
  )
}

function MoreInfo() {
  const faqs = [
    { q: 'What is a behavior consultation?', a: 'An initial meeting to understand goals, challenges, and create an actionable plan.' },
    { q: 'Do you accept insurance?', a: 'At this time, services are private-pay. We can provide documentation for reimbursement where applicable.' },
    { q: 'Where do sessions take place?', a: 'Sessions are available in-home, in-clinic, or via telehealth depending on your location and needs.' },
  ]
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">More Info</h2>
      <div className="space-y-3">
        {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
      </div>
    </section>
  )
}

function BehaviorConsultation() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Behavior Consultation</h2>
      <p className="text-slate-700 mb-4">A focused, collaborative session to assess behavior, set goals, and establish strategies. Ideal for first-time clients.</p>
      <ul className="list-disc pl-6 text-slate-700 space-y-1">
        <li>60-minute initial consultation</li>
        <li>Personalized plan and resources</li>
        <li>Follow-up recommendations</li>
      </ul>
    </section>
  )
}

function Account() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [orders, setOrders] = useState([])
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    if (user) {
      fetch(`${API_BASE}/api/orders?user_id=${user.id}`).then(r => r.json()).then(setOrders)
      fetch(`${API_BASE}/api/appointments?user_id=${user.id}`).then(r => r.json()).then(setAppointments)
    }
  }, [user])

  const submit = async (e) => {
    e.preventDefault()
    if (mode === 'register') {
      const r = await fetch(`${API_BASE}/api/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) })
      if (!r.ok) { alert('Registration failed'); return }
      const data = await r.json(); localStorage.setItem('user', JSON.stringify(data)); setUser(data)
    } else {
      const r = await fetch(`${API_BASE}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, password: form.password }) })
      if (!r.ok) { alert('Login failed'); return }
      const data = await r.json(); localStorage.setItem('user', JSON.stringify(data)); setUser(data)
    }
  }

  const logout = () => { localStorage.removeItem('user'); setUser(null) }

  if (!user) {
    return (
      <section className="max-w-md mx-auto px-4 py-12">
        <div className="border rounded-xl p-6 bg-white">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{mode === 'register' ? 'Create account' : 'Sign in'}</h2>
          <p className="text-slate-600 mb-6">Access your appointments and orders.</p>
          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-slate-700">Name</label>
                <input className="w-full border rounded-md px-3 py-2" value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} required />
              </div>
            )}
            <div>
              <label className="block text-sm text-slate-700">Email</label>
              <input type="email" className="w-full border rounded-md px-3 py-2" value={form.email} onChange={e=>setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm text-slate-700">Password</label>
              <input type="password" className="w-full border rounded-md px-3 py-2" value={form.password} onChange={e=>setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="w-full py-2 rounded-md bg-slate-900 text-white">{mode === 'register' ? 'Create account' : 'Sign in'}</button>
          </form>
          <div className="text-sm text-center mt-4">
            {mode === 'register' ? (
              <button className="text-indigo-600" onClick={()=>setMode('login')}>Have an account? Sign in</button>
            ) : (
              <button className="text-indigo-600" onClick={()=>setMode('register')}>New here? Create account</button>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-slate-900">My Account</h2>
        <button onClick={logout} className="px-4 py-2 rounded-md bg-slate-900 text-white">Logout</button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-6 bg-white">
          <h3 className="text-xl font-semibold mb-3">Past Appointments</h3>
          {appointments.length === 0 ? <p className="text-slate-600">No appointments yet.</p> : (
            <ul className="space-y-3">
              {appointments.map(a => (
                <li key={a.id} className="border rounded-md p-3">
                  <div className="font-medium text-slate-800">{a.service_title}</div>
                  <div className="text-sm text-slate-600">{new Date(a.start_time_iso).toLocaleString()}</div>
                  <div className="text-sm text-slate-600">Status: {a.status}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border rounded-xl p-6 bg-white">
          <h3 className="text-xl font-semibold mb-3">Past Orders</h3>
          {orders.length === 0 ? <p className="text-slate-600">No orders yet.</p> : (
            <ul className="space-y-3">
              {orders.map(o => (
                <li key={o.id} className="border rounded-md p-3">
                  <div className="font-medium text-slate-800">Order #{o.id.slice(-6)}</div>
                  <div className="text-sm text-slate-600">Amount: ${(o.amount_cents/100).toFixed(2)}</div>
                  <div className="text-sm text-slate-600">Status: {o.status}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

function Schedule() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [services, setServices] = useState([])
  const [serviceId, setServiceId] = useState('')
  const [selectedService, setSelectedService] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/services`).then(r => r.json()).then(data => {
      setServices(data)
      if (data.length) { setServiceId(data[0].id); setSelectedService(data[0]) }
    })
  }, [])

  useEffect(() => {
    const svc = services.find(s => s.id === serviceId)
    setSelectedService(svc || null)
  }, [serviceId, services])

  const submit = async (e) => {
    e.preventDefault()
    if (!user) { alert('Please sign in first.'); return }
    if (!selectedService || !date || !time) { alert('Choose service, date and time'); return }
    setSubmitting(true)
    try {
      const startIso = new Date(`${date}T${time}:00`).toISOString()
      // create appointment
      const ar = await fetch(`${API_BASE}/api/appointments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id, service_id: selectedService.id, service_title: selectedService.title, start_time_iso: startIso, duration_minutes: selectedService.duration_minutes }) })
      if (!ar.ok) { const t = await ar.text(); throw new Error(t || 'Failed to create appointment') }
      // create order
      const or = await fetch(`${API_BASE}/api/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id, items: [{ service_id: selectedService.id, service_title: selectedService.title, quantity: 1, price_cents: selectedService.price_cents }] }) })
      const order = await or.json()
      setConfirmation({ order_id: order.order_id, amount_cents: order.amount_cents })
    } catch (e) {
      alert(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Schedule an Appointment</h2>
      {!user && (
        <div className="mb-6 p-3 rounded-md border bg-amber-50 text-amber-900">Please sign in from the top right to book.</div>
      )}
      <form onSubmit={submit} className="space-y-6 bg-white border rounded-xl p-6">
        <div>
          <label className="block text-sm text-slate-700 mb-1">Select a service</label>
          <select className="w-full border rounded-md px-3 py-2" value={serviceId} onChange={e=>setServiceId(e.target.value)}>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.title} — ${(s.price_cents/100).toFixed(2)} • {s.duration_minutes} min</option>
            ))}
          </select>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Choose a date</label>
            <input type="date" className="w-full border rounded-md px-3 py-2" value={date} onChange={e=>setDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Choose a time</label>
            <input type="time" className="w-full border rounded-md px-3 py-2" value={time} onChange={e=>setTime(e.target.value)} />
          </div>
        </div>
        {selectedService && (
          <div className="text-slate-700">
            <div className="font-medium">Summary</div>
            <div>{selectedService.title} • {selectedService.duration_minutes} minutes</div>
            <div className="">Total: <span className="font-semibold">${(selectedService.price_cents/100).toFixed(2)}</span></div>
          </div>
        )}
        <button disabled={submitting} className="px-5 py-3 rounded-md bg-slate-900 text-white disabled:opacity-60">{submitting ? 'Booking…' : 'Confirm and Checkout'}</button>
        {confirmation && (
          <div className="p-3 rounded-md bg-emerald-50 border text-emerald-900">
            Appointment booked! Order #{confirmation.order_id.slice(-6)} for ${(confirmation.amount_cents/100).toFixed(2)} created.
          </div>
        )}
      </form>
    </section>
  )
}

function AppShell() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const handleLogout = () => { localStorage.removeItem('user'); setUser(null) }

  useEffect(() => {
    const onStorage = () => {
      const raw = localStorage.getItem('user'); setUser(raw ? JSON.parse(raw) : null)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar user={user} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/more-info" element={<MoreInfo />} />
          <Route path="/behavior-consultation" element={<BehaviorConsultation />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-600">© {new Date().getFullYear()} Rooted in Speech</div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  )
}
