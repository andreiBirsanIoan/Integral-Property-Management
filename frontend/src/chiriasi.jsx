import React, { useState, useEffect } from 'react';

function Chiriasi() {
  const [chiriasi, setChiriasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [emailUtilizator, setEmailUtilizator] = useState('');
  const [apartamentId, setApartamentId] = useState('');
  const [dataExpirare, setDataExpirare] = useState('');

  const getInitials = (nume) => {
    if (!nume) return '-';
    const parts = nume.trim().split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  };

  const fetchChiriasi = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/chirias', { 
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) setChiriasi(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChiriasi();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/chirias', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          email_utilizator: emailUtilizator, 
          apartament_id: apartamentId, 
          data_expirare: dataExpirare 
        })
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEmailUtilizator(''); 
        setApartamentId(''); 
        setDataExpirare('');
        fetchChiriasi();
      } else {
        const errorData = await response.json();
        alert('Eroare: ' + errorData.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  let chiriasiAfisati = [...chiriasi];
  if (sortOption === 'nume_asc') {
    chiriasiAfisati.sort((a, b) => (a.nume || '').localeCompare(b.nume || ''));
  } else if (sortOption === 'nume_desc') {
    chiriasiAfisati.sort((a, b) => (b.nume || '').localeCompare(a.nume || ''));
  }

  return (
    <>
      <style>{`
        .chiriasi-container {
          display: flex; gap: 24px; width: 100%; height: 100%; box-sizing: border-box;
        }

        .list-section {
          flex: 1; min-width: 0; background: rgba(95, 113, 135, 0.85); backdrop-filter: blur(10px);
          border-radius: 12px; padding: 24px; color: #fff; box-shadow: 0 8px 16px rgba(0,0,0,0.15);
          display: flex; flex-direction: column; box-sizing: border-box;
        }

        .stats-section {
          width: 320px; flex-shrink: 0; display: flex; flex-direction: column; gap: 24px; box-sizing: border-box;
        }

        .top-actions-wrapper {
          display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; margin-bottom: 24px; gap: 16px;
        }
        
        .top-actions-inputs {
          display: flex; flex-wrap: wrap; gap: 16px; flex: 1 1 auto;
        }
        
        .dropdown-sort {
          padding: 10px 16px; border-radius: 20px; border: none; background: #E2E8F0; 
          color: #1E293B; font-weight: 600; outline: none; width: 180px; box-sizing: border-box; cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231E293B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
        }

        .btn-adauga {
          padding: 10px 20px; border-radius: 20px; border: none; background: #E2E8F0; 
          color: #1E293B; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.2s;
        }

        @media (max-width: 1024px) {
          .chiriasi-container {
            flex-direction: column; 
            height: auto;
          }
          .stats-section {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .list-section {
            padding: 16px;
          }
          .stats-section {
            display: flex;
            flex-direction: column;
            margin-bottom: 80px; 
          }
          .dropdown-sort {
            width: 100%;
          }
          .btn-adauga {
            width: 100%;
          }
        }
      `}</style>

      <div className="chiriasi-container">
        
        <div className="list-section">
          
          <div className="top-actions-wrapper">
            <div className="top-actions-inputs">
              <select 
                className="dropdown-sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sortează după...</option>
                <option value="nume_asc">Nume (A-Z)</option>
                <option value="nume_desc">Nume (Z-A)</option>
              </select>
              <button onClick={() => setIsModalOpen(true)} className="btn-adauga">
                + Adaugă chiriaș
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#CBD5E1', fontWeight: '500', whiteSpace: 'nowrap' }}>
              {chiriasi.length > 0 ? chiriasiAfisati.length : 36} chiriași
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Listă Chiriași</h2>
            <span style={{ color: '#93C5FD', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>Vezi toate</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', paddingRight: '5px' }}>
            <div style={{ minWidth: '650px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1.5fr 1fr', gap: '16px', padding: '0 10px 12px 10px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: '#CBD5E1', textTransform: 'uppercase' }}>
                <div>APARTAMENT</div>
                <div>CHIRIAȘI</div>
                <div>CONTACT</div>
                <div style={{ textAlign: 'right' }}>CHIRIE</div>
              </div>

              {loading ? ( <div style={{textAlign: 'center', padding: '40px 20px'}}>Se încarcă datele...</div> ) : 
                chiriasiAfisati.length === 0 ? ( <div style={{textAlign: 'center', padding: '40px 20px', color: '#CBD5E1', fontSize: '15px', fontWeight: '500'}}>Nu s-au găsit chiriași.</div> ) : (
                chiriasiAfisati.map((ch, index) => (
                  <div key={ch.id || index} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1.5fr 1fr', gap: '16px', alignItems: 'center', padding: '16px 10px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '14px', fontWeight: '500' }}>
                    
                    <div style={{ color: '#94A3B8', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ch.adresa || 'Ap. 7, Bl. 2, Et. 1'}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#B8D4F4', color: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', flexShrink: 0 }}>
                        {getInitials(ch.nume)}
                      </div>
                      <span style={{ fontWeight: '600', color: '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.nume}</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <span style={{ fontSize: '12px', color: '#CBD5E1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.email}</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.telefon || '0771 876 111'}</span>
                    </div>
                    
                    <div style={{ fontWeight: '700', fontSize: '13px', color: '#E2E8F0', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {ch.chirie ? `${ch.chirie} lei` : '750 lei'}
                    </div>

                  </div>
                ))
              )}
            </div>
            
            {chiriasiAfisati.length > 0 && (
              <div style={{ textAlign: 'center', padding: '20px 0 10px', fontSize: '12px', color: '#CBD5E1', fontWeight: '500' }}>
                &lt; 1 din 3 &gt;
              </div>
            )}
          </div>
        </div>

        <div className="stats-section">
          <StatCard title="TOTAL CHIRIAȘI" value={chiriasi.length > 0 ? chiriasi.length : 36} subtitle="activi în prezent" valueColor="#1A2F45" subtitleColor="#93C5FD" bg="#ffffff" />
          <StatCard title="CONTRACTE ACTIVE" value={chiriasi.length > 0 ? chiriasi.filter(c => c.activ === 1 || c.activ === true).length : 31} subtitle="5 expiră în 30 de zile" valueColor="#059669" subtitleColor="#34D399" bg="#ffffff" />
          <StatCard title="RESTANȚE" value="6" subtitle="10.048 lei neîncasați" valueColor="#B45309" subtitleColor="#EA580C" bg="#ffffff" />
          
          <div style={{ background: '#2E435E', borderRadius: '12px', padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
            <div style={{ color: '#7FA1C3', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase', textAlign: 'center' }}>Venituri Mai</div>
            <div style={{ color: '#fff', fontSize: '40px', fontWeight: '800', lineHeight: 1 }}>23.568</div>
            <div style={{ color: '#7FA1C3', fontSize: '12px', marginTop: '8px' }}>lei · 79% colectat</div>
          </div>
        </div>

        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '400px', color: '#1A2F45', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', boxSizing: 'border-box' }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>Adaugă Chiriaș</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="email" placeholder="Email utilizator existent" value={emailUtilizator} onChange={e => setEmailUtilizator(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none' }} />
                <input type="text" placeholder="ID Apartament" value={apartamentId} onChange={e => setApartamentId(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none' }} />
                <input type="date" placeholder="Data Expirare Contract" value={dataExpirare} onChange={e => setDataExpirare(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none' }} />
                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', cursor: 'pointer', fontWeight: '600' }}>Anulează</button>
                  <button onClick={handleSave} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#1E3A8A', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>Salvează</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function StatCard({ title, value, subtitle, valueColor, subtitleColor, bg }) {
  return (
    <div style={{ background: bg, borderRadius: '12px', padding: '28px 24px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <div style={{ color: '#60A5FA', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '12px' }}>{title}</div>
      <div style={{ color: valueColor, fontSize: '42px', fontWeight: '800', lineHeight: '1.2' }}>{value}</div>
      <div style={{ color: subtitleColor, fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>{subtitle}</div>
    </div>
  );
}

export default Chiriasi;