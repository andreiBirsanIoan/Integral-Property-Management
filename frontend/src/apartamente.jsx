import React, { useState, useEffect } from 'react';

function Apartamente() {
  const [apartamente, setApartamente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [adresa, setAdresa] = useState('');
  const [etaj, setEtaj] = useState('');
  const [numarCamere, setNumarCamere] = useState(1);
  const [pretChirie, setPretChirie] = useState('');
  const [observatii, setObservatii] = useState('');

  const getTokenData = () => {
    const token = localStorage.getItem('token');
    if (!token) return {};
    return JSON.parse(window.atob(token.split('.')[1]));
  };

  const fetchApartamente = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/apartamente', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) setApartamente(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartamente();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const proprietar_id = getTokenData().id || null; 

    try {
      const response = await fetch('http://localhost:5000/api/apartamente', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          adresa, 
          etaj: etaj ? parseInt(etaj) : null, 
          numar_camere: parseInt(numarCamere), 
          pret_chirie: pretChirie ? parseFloat(pretChirie) : 0, 
          proprietar_id, 
          observatii 
        })
      });

      if (response.ok) {
        setIsModalOpen(false);
        setAdresa(''); 
        setEtaj(''); 
        setNumarCamere(1);
        setPretChirie('');
        setObservatii('');
        fetchApartamente(); 
      } else {
        const errorData = await response.json();
        alert('Eroare: ' + (errorData.error || 'Serverul a respins cererea.'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getInitials = (nume) => {
    if (!nume) return '-';
    const parts = nume.trim().split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  };

  let apartamenteAfisate = [...apartamente];
  if (sortOption === 'adresa_asc') {
    apartamenteAfisate.sort((a, b) => (a.adresa || '').localeCompare(b.adresa || ''));
  } else if (sortOption === 'adresa_desc') {
    apartamenteAfisate.sort((a, b) => (b.adresa || '').localeCompare(a.adresa || ''));
  }

  const totalApartamente = apartamente.length;
  const apartamenteOcupate = apartamente.filter(a => a.nume).length;
  const apartamenteLibere = totalApartamente - apartamenteOcupate;
  const rataOcupare = totalApartamente > 0 ? Math.round((apartamenteOcupate / totalApartamente) * 100) : 0;
  const venituriTotale = apartamente.reduce((sum, ap) => sum + (ap.pret_chirie || 0), 0);

  return (
    <>
      <style>{`
        .apartamente-container {
          display: flex; gap: 24px; width: 100%; height: 100%; box-sizing: border-box;
        }

        .list-section {
          flex: 1; min-width: 0; background: rgba(100, 116, 139, 0.85); backdrop-filter: blur(10px);
          border-radius: 12px; padding: 24px; color: #fff; box-shadow: 0 8px 16px rgba(0,0,0,0.15);
          display: flex; flex-direction: column; box-sizing: border-box;
        }

        .stats-section {
          width: 320px; flex-shrink: 0; display: flex; flex-direction: column; gap: 24px; box-sizing: border-box;
        }

        .top-actions-wrapper {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;
        }
        
        .top-actions-left {
          display: flex; gap: 16px; align-items: center; flex-wrap: wrap;
        }
        
        .dropdown-sort {
          padding: 10px 16px; border-radius: 20px; border: none; background: #E2E8F0; 
          color: #1E293B; font-weight: 600; outline: none; width: 180px; cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231E293B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat; background-position: right 12px center; background-size: 16px;
        }

        .btn-adauga {
          padding: 10px 20px; border-radius: 20px; border: none; background: #E2E8F0; 
          color: #1E293B; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.2s;
        }

        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); 
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        
        .modal-content {
          background: #fff; padding: 32px; border-radius: 16px; width: 90%; max-width: 400px; 
          color: #1A2F45; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); box-sizing: border-box;
        }

        .modal-input {
          padding: 12px; border-radius: 8px; border: 1px solid #CBD5E1; outline: none; background: #fff; color: #1E293B; width: 100%; box-sizing: border-box; font-size: 14px;
        }

        .modal-btn-cancel {
          flex: 1; padding: 12px; border-radius: 8px; border: 1px solid #CBD5E1; background: #fff; color: #1E293B; cursor: pointer; font-weight: 600;
        }
        
        .modal-btn-save {
          flex: 1; padding: 12px; border-radius: 8px; border: none; background: #1E3A8A; color: #fff; cursor: pointer; font-weight: 600;
        }

        @media (max-width: 1024px) {
          .apartamente-container { flex-direction: column; height: auto; }
          .stats-section { width: 100%; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
        }

        @media (max-width: 768px) {
          .list-section { padding: 16px; }
          .stats-section { display: flex; flex-direction: column; margin-bottom: 80px; }
          .top-actions-wrapper { flex-direction: column-reverse; align-items: flex-start; }
          .top-actions-left { width: 100%; flex-direction: column; align-items: stretch; }
          .dropdown-sort { width: 100%; }
        }
      `}</style>

      <div className="apartamente-container">
        
        <div className="list-section">
          
          <div className="top-actions-wrapper">
            <div className="top-actions-left">
              <select 
                className="dropdown-sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sortează după...</option>
                <option value="adresa_asc">Adresă (A-Z)</option>
                <option value="adresa_desc">Adresă (Z-A)</option>
              </select>
              <button onClick={() => setIsModalOpen(true)} className="btn-adauga">
                + Adaugă apartament
              </button>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#E2E8F0', whiteSpace: 'nowrap' }}>
              {apartamenteAfisate.length} apartamente
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Listă apartamente</h2>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', paddingRight: '5px' }}>
            <div style={{ minWidth: '650px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: '16px', padding: '0 10px 12px 10px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: '#CBD5E1', textTransform: 'uppercase' }}>
                <div>APARTAMENT</div>
                <div>CHIRIAȘI</div>
                <div style={{ textAlign: 'center' }}>CAMERE</div>
                <div>CHIRIE</div>
                <div style={{ textAlign: 'center' }}>STATUS</div>
              </div>

              {loading ? ( <div style={{textAlign: 'center', padding: '40px 20px'}}>Se încarcă datele...</div> ) : 
                apartamenteAfisate.length === 0 ? ( <div style={{textAlign: 'center', padding: '40px 20px', color: '#CBD5E1', fontSize: '15px', fontWeight: '500'}}>Nu s-au găsit apartamente înregistrate.</div> ) : (
                apartamenteAfisate.map((ap, index) => (
                  <div key={ap.id || index} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: '16px', alignItems: 'center', padding: '16px 10px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '14px', fontWeight: '500' }}>
                    
                    <div style={{ color: '#CBD5E1', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ap.adresa} {ap.etaj ? `· Et. ${ap.etaj}` : ''}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                      {ap.nume ? (
                        <>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#B8D4F4', color: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', flexShrink: 0 }}>
                            {getInitials(ap.nume)}
                          </div>
                          <span style={{ fontWeight: '600', color: '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ap.nume}</span>
                        </>
                      ) : (
                        <>
                          <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', color: '#1A2F45', flexShrink: 0 }}>—</div>
                          <span style={{ color: '#1A2F45', fontWeight: '900', fontSize: '16px' }}>—</span>
                        </>
                      )}
                    </div>
                    
                    <div style={{ textAlign: 'center', color: '#E2E8F0', fontWeight: '600', fontSize: '13px' }}>{ap.numar_camere || '-'}</div>
                    <div style={{ color: '#E2E8F0', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}>{ap.pret_chirie || 0} lei</div>
                    
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', width: '70px', textAlign: 'center', flexShrink: 0, background: ap.nume ? '#A7F3D0' : '#FDBA74', color: ap.nume ? '#065F46' : '#92400E' }}>
                        {ap.nume ? 'Ocupat' : 'Liber'}
                      </span>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="stats-section">
          <StatCard title="TOTAL APARTAMENTE" value={totalApartamente} subtitle="Înregistrate în sistem" valueColor="#1A2F45" subtitleColor="#93C5FD" bg="#ffffff" />
          <StatCard title="OCUPATE" value={`${rataOcupare}%`} subtitle="Rată de ocupare" valueColor="#059669" subtitleColor="#34D399" bg="#ffffff" />
          <StatCard title="LIBERE" value={apartamenteLibere} subtitle="Disponibile" valueColor="#B45309" subtitleColor="#EA580C" bg="#ffffff" />
          
          <div style={{ background: '#2E435E', borderRadius: '12px', padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
            <div style={{ color: '#7FA1C3', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase', textAlign: 'center' }}>Total Chirie Lunară</div>
            <div style={{ color: '#fff', fontSize: '40px', fontWeight: '800', lineHeight: 1 }}>{venituriTotale.toLocaleString('ro-RO')}</div>
            <div style={{ color: '#7FA1C3', fontSize: '12px', marginTop: '8px' }}>lei potențiali</div>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '700' }}>Adaugă Apartament</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="text" placeholder="Adresa (ex: Str. Florilor 10)" value={adresa} onChange={e => setAdresa(e.target.value)} className="modal-input" />
                <input type="number" placeholder="Etaj" value={etaj} onChange={e => setEtaj(e.target.value)} className="modal-input" />
                <input type="number" placeholder="Număr Camere" value={numarCamere} onChange={e => setNumarCamere(e.target.value)} className="modal-input" />
                <input type="number" placeholder="Preț Chirie (lei)" value={pretChirie} onChange={e => setPretChirie(e.target.value)} className="modal-input" />
                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button onClick={() => setIsModalOpen(false)} className="modal-btn-cancel">Anulează</button>
                  <button onClick={handleSave} className="modal-btn-save">Salvează</button>
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

export default Apartamente;