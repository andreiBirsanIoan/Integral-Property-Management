import React, { useEffect, useState } from 'react';
import Apartamente from './apartamente';
import Chiriasi from './chiriasi';
import Facturi from './facturi';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Receipt, 
  Wrench, 
  FileText, 
  Settings,
  Search,
  Bell
} from 'lucide-react';

function Dashboard() {
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/';
    }
  }, [token]);

  const [activeTab, setActiveTab] = useState('Acasă');
  const [chiriasi, setChiriasi] = useState([]);
  const [facturi, setFacturi] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!token) {
    return null;
  }

  const getProfileFromToken = () => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (e) {
      return {};
    }
  };

  const tokenData = getProfileFromToken();
  let userData = {};
  
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) userData = JSON.parse(storedUser);
  } catch (e) {}

  const numeProprietar = tokenData.nume || userData.nume || localStorage.getItem('nume') || 'Utilizator Nou';
  const emailProprietar = tokenData.email || userData.email || localStorage.getItem('email') || 'fara.email@ipm.ro';
  const rolProprietar = tokenData.rol || userData.rol || localStorage.getItem('rol') || 'Proprietar';

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch('http://localhost:5000/api/chirias', { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('http://localhost:5000/api/facturi', { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('http://localhost:5000/api/tickets', { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([c, f, t]) => {
      if (Array.isArray(c)) setChiriasi(c);
      if (Array.isArray(f)) setFacturi(f);
      if (Array.isArray(t)) setTickets(t);
      setLoading(false);
    });
  }, [token]);

  const getInitials = (nume) => {
    if (!nume || nume.trim() === '') return '-';
    const parts = nume.trim().split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  };

  const menuItems = [
    { name: 'Acasă', icon: <LayoutDashboard size={22} strokeWidth={2} /> },
    { name: 'Apartamente', icon: <Building2 size={22} strokeWidth={2} /> },
    { name: 'Chiriași', icon: <Users size={22} strokeWidth={2} /> },
    { name: 'Facturi', icon: <Receipt size={22} strokeWidth={2} /> },
    { name: 'Mentenanță', icon: <Wrench size={22} strokeWidth={2} /> },
    { name: 'Acte', icon: <FileText size={22} strokeWidth={2} /> }
  ];

  const chiriasiActivi = chiriasi.length;
  const facturiNeplătite = facturi.filter(f => !f.platita || f.platita === 0).length;
  const ticheteDeschise = tickets.filter(t => t.status?.toLowerCase() === 'deschis' || t.status?.toLowerCase() === 'open').length;
  const venituri = facturi.filter(f => f.platita || f.platita === 1).reduce((sum, f) => sum + parseFloat(f.suma || 0), 0);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const renderContent = () => {
    if (loading) return <div style={{ color: '#1E293B', padding: '24px' }}>Se procesează datele...</div>;

    if (activeTab === 'Apartamente') return <Apartamente />;
    if (activeTab === 'Chiriași') return <Chiriasi />;
    if (activeTab === 'Facturi') return <Facturi />;
    
    if (activeTab !== 'Acasă') return <div style={{ padding: '24px' }}>Secțiunea {activeTab} este în curs de dezvoltare.</div>;

    return (
      <div className="content-container">
        <div className="top-layout">
          <div className="profile-card">
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#B8D4F4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '700', color: '#1E3A8A', marginBottom: '16px' }}>
              {getInitials(numeProprietar)}
            </div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#1A2F45', textAlign: 'center', fontWeight: '700' }}>{numeProprietar}</h2>
            <div style={{ color: '#8AAFC2', fontSize: '13px', fontWeight: '500', marginBottom: '12px' }}>{rolProprietar}</div>
            
            <div style={{ background: '#A7F3D0', color: '#065F46', padding: '4px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'lowercase', marginBottom: '32px' }}>
              contract activ
            </div>
            
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <ProfileRow label="Email" value={emailProprietar} />
              <ProfileRow label="Telefon" value="Neconfigurat" />
              <ProfileRow label="Contract" value="Activ" />
              <ProfileRow label="Expiră" value="-" noBorder />
            </div>
          </div>

          <div className="stats-grid">
            <StatCard topText="CHIRIAȘI ACTIVI" value={chiriasiActivi} bottomText="Înregistrați în sistem" bottomColor="#10B981" />
            <StatCard topText="FACTURI NEPLĂTITE" value={facturiNeplătite} bottomText="Care necesită atenție" bottomColor="#F59E0B" />
            <StatCard topText="TICHETE DESCHISE" value={ticheteDeschise} bottomText="În curs de rezolvare" bottomColor="#60A5FA" />
            
            <div style={{ background: '#2E435E', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
              <div style={{ color: '#7FA1C3', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase', textAlign: 'center' }}>Venituri Total</div>
              <div style={{ color: '#fff', fontSize: '32px', fontWeight: '800', lineHeight: 1 }}>{venituri.toLocaleString('ro-RO')}</div>
              <div style={{ color: '#7FA1C3', fontSize: '11px', marginTop: '8px' }}>lei încasați</div>
            </div>
          </div>
        </div>

        <div className="bottom-layout">
          <div className="recent-invoices glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '16px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#1A2F45', fontSize: '16px', fontWeight: '700' }}>Facturi recente</h3>
              <span onClick={() => setActiveTab('Facturi')} style={{ color: '#93C5FD', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>Vezi toate</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', padding: '0 10px 10px 10px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: '#CBD5E1' }}>
              <div>CHIRIAȘ</div>
              <div>SUMĂ</div>
              <div style={{ textAlign: 'center' }}>STATUS</div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {facturi.length > 0 ? (
                facturi.map((f, i) => {
                  const platitaLabel = f.platita ? 'Plătit' : 'Neplătit';
                  const getStatusStyle = (s) => {
                    if (s === 'Plătit') return { bg: '#A7F3D0', text: '#065F46' };
                    return { bg: '#FBAF5C', text: '#fff' };
                  };
                  const sStyle = getStatusStyle(platitaLabel);

                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', alignItems: 'center', padding: '14px 10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <div style={{ width: '32px', height: '32px', flexShrink: 0, borderRadius: '50%', background: '#B8D4F4', color: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>
                          {getInitials(f.nume)}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ color: '#1A2F45', fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.nume || 'Necunoscut'}</div>
                          <div style={{ color: '#CBD5E1', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.descriere || 'Factură'}</div>
                        </div>
                      </div>
                      <div style={{ color: '#1A2F45', fontWeight: '700', fontSize: '13px' }}>{f.suma} lei</div>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <span style={{ background: sStyle.bg, color: sStyle.text, padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '600', width: '100%', maxWidth: '80px', textAlign: 'center' }}>
                          {platitaLabel}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8', fontSize: '13px', fontStyle: 'italic' }}>
                  Nicio factură înregistrată.
                </div>
              )}
            </div>
          </div>

          <div className="urgent-tickets glass-panel dark-glass">
            <h3 style={{ margin: '0 0 20px 0', color: '#111827', fontSize: '16px', fontWeight: '700' }}>Tichete mentenanță</h3>
            
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '5px' }}>
              {tickets.length > 0 ? (
                tickets.map((t, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', boxSizing: 'border-box', borderLeft: '4px solid #1E293B' }}>
                    <div style={{ color: '#111827', fontWeight: '700', fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.titlu || 'Tichet'}</div>
                    <div style={{ color: '#64748B', fontSize: '11px', marginBottom: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.nume || 'Fără detalii'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '600' }}>
                      <span style={{ color: t.status === 'Deschis' ? '#F59E0B' : '#10B981' }}>{t.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#CBD5E1', fontSize: '13px', fontStyle: 'italic' }}>
                  Niciun tichet de mentenanță.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        .app-wrapper {
          display: flex; height: 100vh; width: 100%; font-family: "Inter", "Segoe UI", sans-serif;
          margin: 0; padding: 0; overflow: hidden; background-color: #E6EDF5; box-sizing: border-box;
        }
        .sidebar {
          width: 250px; flex-shrink: 0; background: #0B132B; display: flex; flex-direction: column;
          color: #fff; z-index: 10; box-sizing: border-box;
        }
        .main-area {
          flex: 1; display: flex; flex-direction: column; position: relative; overflow: hidden; min-width: 0; box-sizing: border-box;
        }
        .top-bar {
          background: #0B132B; margin: 24px 24px 0 24px; border-radius: 8px; padding: 16px 24px;
          flex-shrink: 0; display: flex; justify-content: space-between; align-items: center; color: #fff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1); position: relative; z-index: 2; box-sizing: border-box;
        }
        .scrollable-content {
          position: relative; z-index: 2; flex: 1; overflow-y: auto; overflow-x: hidden; padding: 24px;
          display: flex; flex-direction: column; box-sizing: border-box;
        }
        .content-container {
          display: flex; flex-direction: column; gap: 24px; box-sizing: border-box;
        }
        .top-layout {
          display: flex; gap: 24px; min-width: 0;
        }
        .profile-card {
          background: #fff; border-radius: 16px; padding: 32px 24px; width: 280px; flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0,0,0,0.03); display: flex; flex-direction: column; align-items: center; box-sizing: border-box;
        }
        .stats-grid {
          flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; min-width: 0;
        }
        .bottom-layout {
          display: flex; gap: 24px; min-height: 350px; min-width: 0;
        }
        .glass-panel {
          flex: 2; background: rgba(102, 120, 140, 0.85); backdrop-filter: blur(10px);
          border-radius: 16px; padding: 24px; display: flex; flex-direction: column; box-sizing: border-box; min-width: 0;
        }
        .urgent-tickets { flex: 1.2; }
        .mobile-bottom-nav { display: none; }
        .desktop-logo { padding: 30px 20px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; }
        .top-bar-breadcrumb-icon { display: none; }

        @media (max-width: 768px) {
          .app-wrapper { flex-direction: column; background-color: #EAF0F6; }
          .sidebar { display: none; }
          .top-bar { margin: 16px; padding: 12px 16px; justify-content: flex-start; gap: 12px; }
          .top-bar-breadcrumb-icon { display: block; color: #D4AF37; }
          .top-bar-actions { display: none; }
          
          .main-area { margin-bottom: 70px; }
          .scrollable-content { padding: 16px; }
          .content-container { gap: 16px; }
          
          .top-layout { flex-direction: column; }
          .profile-card { width: 100%; padding: 24px; }
          
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
          
          .bottom-layout { flex-direction: column; min-height: auto; gap: 16px; }
          .glass-panel { padding: 16px; border-radius: 12px; }
          .dark-glass { background: #6A7B8E; }
          
          .mobile-bottom-nav {
            display: flex; position: fixed; bottom: 0; left: 0; right: 0; height: 70px;
            background: #0B132B; z-index: 100; justify-content: space-around; align-items: center;
            padding: 0 10px; box-shadow: 0 -4px 10px rgba(0,0,0,0.1);
          }
          .nav-item {
            padding: 10px; border-radius: 10px; color: #9CA3AF; cursor: pointer; transition: all 0.2s;
          }
          .nav-item.active {
            background: #5277A4; color: #fff;
          }
        }
      `}</style>

      <div className="app-wrapper">

        <div className="sidebar">
          <div className="desktop-logo">
            <img src="/logo.png" alt="Integral Property Management" style={{ width: '120px', marginBottom: '10px', objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1, paddingTop: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {menuItems.map(item => {
              const isActive = activeTab === item.name;
              return (
                <div key={item.name} onClick={() => setActiveTab(item.name)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 30px', cursor: 'pointer',
                    background: isActive ? '#1F2937' : 'transparent', 
                    borderLeft: isActive ? '3px solid #D4AF37' : '3px solid transparent',
                    color: isActive ? '#fff' : '#9CA3AF', 
                    fontSize: '14px', fontWeight: '500', transition: 'all 0.2s'
                  }}>
                  <span style={{ color: isActive ? '#fff' : '#9CA3AF', display: 'flex' }}>{item.icon}</span> 
                  {item.name}
                </div>
              );
            })}
          </div>
          <div onClick={() => setActiveTab('Setări')}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px', padding: '20px 30px', cursor: 'pointer', flexShrink: 0,
              background: activeTab === 'Setări' ? '#1F2937' : 'transparent', 
              borderLeft: activeTab === 'Setări' ? '3px solid #D4AF37' : '3px solid transparent',
              color: activeTab === 'Setări' ? '#fff' : '#9CA3AF', fontSize: '14px', fontWeight: '500'
            }}>
            <span style={{ display: 'flex' }}>
              <Settings size={22} strokeWidth={2} />
            </span> 
            Setări
          </div>
        </div>

        <div className="main-area">
          
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/background.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(235, 240, 245, 0.75)', zIndex: 1 }}></div>

          <div className="top-bar">
            <Building2 className="top-bar-breadcrumb-icon" size={20} strokeWidth={2} />
            
            <div style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <span style={{ fontWeight: '600', color: '#9CA3AF' }}>Proprietari / </span> 
              <span style={{ fontWeight: '500' }}>{numeProprietar}</span>
            </div>
            
            <div className="top-bar-actions" style={{ display: 'flex', gap: '20px', color: '#fff', cursor: 'pointer', flexShrink: 0 }}>
              <Search size={20} strokeWidth={2} />
              <Bell size={20} strokeWidth={2} />
              <div onClick={handleLogout}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </div>
            </div>
          </div>

          <div className="scrollable-content">
            {renderContent()}
          </div>

        </div>

        <div className="mobile-bottom-nav">
          {menuItems.map(item => (
            <div 
              key={item.name} 
              className={`nav-item ${activeTab === item.name ? 'active' : ''}`}
              onClick={() => setActiveTab(item.name)}
            >
              {item.icon}
            </div>
          ))}
          <div 
              className={`nav-item ${activeTab === 'Setări' ? 'active' : ''}`}
              onClick={() => setActiveTab('Setări')}
            >
              <Settings size={22} strokeWidth={2} />
          </div>
        </div>

      </div>
    </>
  );
}

function ProfileRow({ label, value, noBorder }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: noBorder ? 'none' : '1px solid #F3F4F6', fontSize: '12px' }}>
      <span style={{ color: '#9CA3AF', fontWeight: '500', flexShrink: 0, marginRight: '10px' }}>{label}</span>
      <span style={{ color: '#111827', fontWeight: '600', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
    </div>
  );
}

function StatCard({ topText, value, bottomText, bottomColor }) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '16px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', boxSizing: 'border-box' }}>
      <div style={{ color: '#7FA1C3', fontSize: '10px', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '16px', textAlign: 'center', textTransform: 'uppercase' }}>{topText}</div>
      <div style={{ color: '#1A2F45', fontSize: '36px', fontWeight: '800', lineHeight: 1 }}>{value}</div>
      <div style={{ color: bottomColor, fontSize: '11px', marginTop: '12px', fontWeight: '600', textAlign: 'center', whiteSpace: 'nowrap' }}>{bottomText}</div>
    </div>
  );
}

export default Dashboard;