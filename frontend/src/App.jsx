import { useState } from 'react'
import './App.css'

function App() {
  const [rol, setRol] = useState('chirias')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      
      {/* STÂNGA */}
      <div style={{ background: '#0D1B2A', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: '#2A7F9E', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '500', color: '#E8EEF2' }}>IP</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#E8EEF2' }}>Integral Property</div>
            <div style={{ fontSize: '10px', color: '#4A8FA8' }}>Management</div>
          </div>
        </div>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '500', color: '#E8EEF2', lineHeight: '1.4', marginBottom: '32px' }}>
            Gestionează apartamente, chiriași și facturi dintr-un singur loc.
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#4A8FA8' }}>🏠</span>
              <span style={{ fontSize: '13px', color: '#8AAFC2' }}>Management complet apartamente</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#4A8FA8' }}>📄</span>
              <span style={{ fontSize: '13px', color: '#8AAFC2' }}>Facturi și plăți automate</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#4A8FA8' }}>🔧</span>
              <span style={{ fontSize: '13px', color: '#8AAFC2' }}>Tichete de mentenanță</span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#2A4A5E' }}>© 2026 Integral Property Management</div>
      </div>

      {/* DREAPTA */}
      <div style={{ background: '#111E2D', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '500', color: '#E8EEF2' }}>Bun venit înapoi</h2>
          <p style={{ fontSize: '13px', color: '#8AAFC2', marginTop: '6px' }}>Conectează-te la contul tău</p>
        </div>

        {/* Toggle rol */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#0D1B2A', borderRadius: '8px', overflow: 'hidden', border: '0.5px solid #1A3A50' }}>
          <button onClick={() => setRol('chirias')} style={{ padding: '12px', border: 'none', cursor: 'pointer', background: rol === 'chirias' ? '#2A7F9E' : 'transparent', color: rol === 'chirias' ? '#E8EEF2' : '#8AAFC2', fontSize: '12px', fontWeight: '500' }}>
            👤 Chiriaș
          </button>
          <button onClick={() => setRol('proprietar')} style={{ padding: '12px', border: 'none', cursor: 'pointer', background: rol === 'proprietar' ? '#2A7F9E' : 'transparent', color: rol === 'proprietar' ? '#E8EEF2' : '#8AAFC2', fontSize: '12px', fontWeight: '500' }}>
            🏠 Proprietar
          </button>
        </div>

        {/* Email */}
        <div>
          <label style={{ fontSize: '10px', color: '#8AAFC2', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Email</label>
          <div style={{ background: '#0D1B2A', border: '0.5px solid #1A3A50', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#4A8FA8' }}>✉️</span>
            <input placeholder="admin@ipm.ro" style={{ background: 'transparent', border: 'none', outline: 'none', color: '#E8EEF2', fontSize: '13px', width: '100%' }} />
          </div>
        </div>

        {/* Parolă */}
        <div>
          <label style={{ fontSize: '10px', color: '#8AAFC2', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Parolă</label>
          <div style={{ background: '#0D1B2A', border: '0.5px solid #1A3A50', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#4A8FA8' }}>🔒</span>
            <input type="password" placeholder="••••••••" style={{ background: 'transparent', border: 'none', outline: 'none', color: '#E8EEF2', fontSize: '13px', width: '100%' }} />
          </div>
        </div>

        {/* Buton */}
        <button style={{ background: '#2A7F9E', border: 'none', borderRadius: '8px', padding: '14px', color: '#E8EEF2', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
          Conectează-te
        </button>

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#4A8FA8', cursor: 'pointer' }}>
          Ai uitat parola?
        </div>
      </div>

    </div>
  )
}

export default App