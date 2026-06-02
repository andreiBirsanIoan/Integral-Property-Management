import { useEffect, useState } from 'react'

function Dashboard() {
  const [chiriasi, setChiriasi] = useState([])
  const [facturi, setFacturi] = useState([])
  const [tickets, setTickets] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` }

    fetch('http://localhost:5000/api/chirias', { headers })
      .then(r => r.json()).then(setChiriasi)

    fetch('http://localhost:5000/api/facturi', { headers })
      .then(r => r.json()).then(setFacturi)

    fetch('http://localhost:5000/api/tickets', { headers })
      .then(r => r.json()).then(setTickets)
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Chiriasi</h2>
      {chiriasi.map(c => (
        <div key={c.id}>{c.nume} — {c.adresa}</div>
      ))}

      <h2>Facturi</h2>
      {facturi.map(f => (
        <div key={f.id}>{f.nume} — {f.suma} RON — {f.platita ? 'Platita' : 'Neplatita'}</div>
      ))}

      <h2>Tickets</h2>
      {tickets.map(t => (
        <div key={t.id}>{t.titlu} — {t.status}</div>
      ))}
    </div>
  )
}

export default Dashboard
