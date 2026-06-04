import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Plus, 
  Users, 
  FileCheck, 
  AlertTriangle, 
  Coins,
  Calendar,
  Building,
  Mail
} from 'lucide-react';

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
          email: emailUtilizator, 
          apartament_id: apartamentId, 
          data_contract: new Date().toISOString().split('T')[0],
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
        alert('Eroare de la server: ' + (errorData.error || errorData.message || 'Eroare necunoscută'));
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

  const totalChiriasi = chiriasi.length;
  const contracteActive = chiriasi.filter(c => c.activ === 1 || c.activ === true || c.activ === undefined).length;
  
  const contracteExpiraCurand = chiriasi.filter(c => {
    if (!c.data_expirare) return false;
    const dataExp = new Date(c.data_expirare);
    const azi = new Date();
    const diffTime = dataExp - azi;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  }).length;

  const numarRestante = chiriasi.filter(c => (c.restanta || 0) > 0).length;
  const sumaRestante = chiriasi.reduce((sum, c) => sum + (parseFloat(c.restanta) || 0), 0);
  const venituriTotale = chiriasi.reduce((sum, c) => sum + (parseFloat(c.chirie) || 0), 0);
  
  const luni = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
  const lunaCurenta = luni[new Date().getMonth()];

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
        
        .dropdown-wrapper {
          position: relative;
          width: 180px;
        }

        .dropdown-sort {
          padding: 10px 36px 10px 16px; border-radius: 20px; border: none; background: #E2E8F0; 
          color: #1E293B; font-weight: 600; outline: none; width: 100%; box-sizing: border-box; cursor: pointer;
          appearance: none;
        }

        .btn-adauga {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 20px; border: none; background: #E2E8F0; 
          color: #1E293B; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.2s;
        }

        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); 
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        
        .modal-card {
          background: #ffffff; padding: 32px; border-radius: 16px; width: 90%; max-width: 400px; 
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); box-sizing: border-box;
        }

        .modal-title {
          margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #1E293B;
        }

        .modal-input {
          padding: 12px; border-radius: 8px; border: 1px solid #CBD5E1; outline: none; 
          background: #ffffff !important; color: #1E293B !important; width: 100%; box-sizing: border-box; font-size: 14px;
        }
        
        .modal-input::placeholder {
          color: #94A3B8 !important;
        }

        .modal-btn-cancel {
          flex: 1; padding: 12px; border-radius: 8px; border: 1px solid #CBD5E1; background: #ffffff; color: #1E293B; cursor: pointer; font-weight: 600; transition: background 0.2s;
        }
        
        .modal-btn-cancel:hover { background: #F1F5F9; }
        
        .modal-btn-save {
          flex: 1; padding: 12px; border-radius: 8px; border: none; background: #1E3A8A; color: #ffffff; cursor: pointer; font-weight: 600; transition: background 0.2s;
        }
        
        .modal-btn-save:hover { background: #172a6b; }

        @media (max-width: 1024px) {
          .chiriasi-container { flex-direction: column; height: auto; }
          .stats-section { width: 100%; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
        }

        @media (max-width: 768px) {
          .list-section { padding: 16px; }
          .stats-section { display: flex; flex-direction: column; margin-bottom: 80px; }
          .dropdown-wrapper { width: 100%; }
          .btn-adauga { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="chiriasi-container">
        
        <div className="list-section">
          
          <div className="top-actions-wrapper">
            <div className="top-actions-inputs">
              <div className="dropdown-wrapper">
                <select 
                  className="dropdown-sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="">Sortează după...</option>
                  <option value="nume_asc">Nume (A-Z)</option>
                  <option value="nume_desc">Nume (Z-A)</option>
                </select>
                <ChevronDown 
                  size={16} 
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#1E293B', pointerEvents: 'none' }} 
                />
              </div>
              
              <button onClick={() => setIsModalOpen(true)} className="btn-adauga">
                <Plus size={18} /> Adaugă chiriaș
              </button>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#CBD5E1', whiteSpace: 'nowrap' }}>
              {chiriasiAfisati.length} chiriași
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Listă Chiriași</h2>
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
                chiriasiAfisati.length === 0 ? ( <div style={{textAlign: 'center', padding: '40px 20px', color: '#CBD5E1', fontSize: '15px', fontWeight: '500'}}>Nu s-au găsit chiriași înregistrați.</div> ) : (
                chiriasiAfisati.map((ch, index) => (
                  <div key={ch.id || index} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1.5fr 1fr', gap: '16px', alignItems: 'center', padding: '16px 10px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '14px', fontWeight: '500' }}>
                    
                    <div style={{ color: '#94A3B8', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ch.adresa || '—'}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#B8D4F4', color: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', flexShrink: 0 }}>
                        {getInitials(ch.nume)}
                      </div>
                      <span style={{ fontWeight: '600', color: '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.nume}</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <span style={{ fontSize: '12px', color: '#CBD5E1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.email}</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.telefon || '—'}</span>
                    </div>
                    
                    <div style={{ fontWeight: '700', fontSize: '13px', color: '#E2E8F0', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {ch.chirie ? `${ch.chirie.toLocaleString('ro-RO')} lei` : '0 lei'}
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="stats-section">
          <StatCard icon={<Users size={20} color="#60A5FA" />} title="TOTAL CHIRIAȘI" value={totalChiriasi} subtitle="activi în prezent" valueColor="#1A2F45" subtitleColor="#93C5FD" bg="#ffffff" />
          <StatCard icon={<FileCheck size={20} color="#059669" />} title="CONTRACTE ACTIVE" value={contracteActive} subtitle={`${contracteExpiraCurand} expiră în 30 de zile`} valueColor="#059669" subtitleColor="#34D399" bg="#ffffff" />
          <StatCard icon={<AlertTriangle size={20} color="#B45309" />} title="RESTANȚE" value={numarRestante} subtitle={`${sumaRestante.toLocaleString('ro-RO')} lei neîncasați`} valueColor="#B45309" subtitleColor="#EA580C" bg="#ffffff" />
          
          <div style={{ background: '#2E435E', borderRadius: '12px', padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', boxSizing: 'border-box', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '16px', right: '16px', opacity: 0.2 }}>
              <Coins size={40} color="#fff" />
            </div>
            <div style={{ color: '#7FA1C3', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase', textAlign: 'center' }}>{`Venituri ${lunaCurenta}`}</div>
            <div style={{ color: '#fff', fontSize: '40px', fontWeight: '800', lineHeight: 1 }}>{venituriTotale.toLocaleString('ro-RO')}</div>
            <div style={{ color: '#7FA1C3', fontSize: '12px', marginTop: '8px' }}>lei · total chirii active</div>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h2 className="modal-title">Adaugă Chiriaș</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input 
                  type="email" 
                  placeholder="Email utilizator existent" 
                  value={emailUtilizator} 
                  onChange={e => setEmailUtilizator(e.target.value)} 
                  className="modal-input" 
                />
                <input 
                  type="text" 
                  placeholder="ID Apartament" 
                  value={apartamentId} 
                  onChange={e => setApartamentId(e.target.value)} 
                  className="modal-input" 
                />
                <input 
                  type="date" 
                  placeholder="Data Expirare Contract" 
                  value={dataExpirare} 
                  onChange={e => setDataExpirare(e.target.value)} 
                  className="modal-input" 
                />
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

function StatCard({ icon, title, value, subtitle, valueColor, subtitleColor, bg }) {
  return (
    <div style={{ background: bg, borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {icon && <div style={{ marginBottom: '8px' }}>{icon}</div>}
      <div style={{ color: '#60A5FA', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '8px' }}>{title}</div>
      <div style={{ color: valueColor, fontSize: '42px', fontWeight: '800', lineHeight: '1.2' }}>{value}</div>
      <div style={{ color: subtitleColor, fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>{subtitle}</div>
    </div>
  );
}

export default Chiriasi;