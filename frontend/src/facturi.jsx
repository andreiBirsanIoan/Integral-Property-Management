import React, { useState, useEffect } from 'react';

function Facturi() {
  const [facturi, setFacturi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [chiriasId, setChiriasId] = useState('');
  const [suma, setSuma] = useState('');
  const [descriere, setDescriere] = useState('');

  const getInitials = (nume) => {
    if (!nume) return '-';
    const parts = nume.trim().split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  };

  const fetchFacturi = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/facturi', { 
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) setFacturi(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturi();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/facturi', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          chirias_id: chiriasId, 
          suma: suma, 
          descriere: descriere 
        })
      });

      if (response.ok) {
        setIsModalOpen(false);
        setChiriasId(''); 
        setSuma(''); 
        setDescriere('');
        fetchFacturi();
      } else {
        const errorData = await response.json();
        alert('Eroare: ' + errorData.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isPlatita = (status) => status === 1 || status === true;
  
  let facturiAfisate = [...facturi];
  if (sortOption === 'suma_desc') {
    facturiAfisate.sort((a, b) => parseFloat(b.suma || 0) - parseFloat(a.suma || 0));
  } else if (sortOption === 'suma_asc') {
    facturiAfisate.sort((a, b) => parseFloat(a.suma || 0) - parseFloat(b.suma || 0));
  }

  const platiteCount = facturi.filter(f => isPlatita(f.platita)).length || 31;
  const neplatiteCount = facturi.length > 0 ? facturi.length - platiteCount : 5;
  const inAsteptareCount = 1;
  const total = (platiteCount + neplatiteCount + inAsteptareCount) || 1;
  
  const procPlatite = Math.round((platiteCount / total) * 100) || 86;
  const procNeplatite = Math.round((neplatiteCount / total) * 100) || 11;
  const procInAsteptare = Math.round((inAsteptareCount / total) * 100) || 3;

  const chartData = [
    { luna: 'Ian', inaltime: '55%', culoare: '#C7DFF3' },
    { luna: 'Feb', inaltime: '85%', culoare: '#A2C8EB' },
    { luna: 'Mar', inaltime: '45%', culoare: '#7BA6D6' },
    { luna: 'Apr', inaltime: '85%', culoare: '#4D6F97' },
    { luna: 'Mai', inaltime: '85%', culoare: '#2B3958' },
  ];

  return (
    <>
      <style>{`
        .facturi-container {
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

        /* --- STILURI MODAL REPARATE --- */
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
        /* ------------------------------- */

        @media (max-width: 1024px) {
          .facturi-container {
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

      <div className="facturi-container">
        
        <div className="list-section">
          
          <div className="top-actions-wrapper">
            <div className="top-actions-inputs">
              <select 
                className="dropdown-sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sortează după...</option>
                <option value="suma_desc">Sumă (Descrescător)</option>
                <option value="suma_asc">Sumă (Crescător)</option>
              </select>
              <button onClick={() => setIsModalOpen(true)} className="btn-adauga">
                + Adaugă factură
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#CBD5E1', fontWeight: '500', whiteSpace: 'nowrap' }}>
              {facturi.length > 0 ? facturiAfisate.length : 36} înregistrări
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Istoricul Plăților</h2>
            <span style={{ color: '#93C5FD', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>Vezi toate</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', paddingRight: '5px' }}>
            <div style={{ minWidth: '650px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.5fr 1fr', gap: '16px', padding: '0 10px 12px 10px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: '#CBD5E1', textTransform: 'uppercase' }}>
                <div>NR. FACTURĂ</div>
                <div>CHIRIAȘI</div>
                <div>PERIOADĂ</div>
                <div style={{ textAlign: 'right' }}>SUMĂ</div>
              </div>

              {loading ? ( <div style={{textAlign: 'center', padding: '40px 20px'}}>Se încarcă datele...</div> ) : 
                facturiAfisate.length === 0 ? ( <div style={{textAlign: 'center', padding: '40px 20px', color: '#CBD5E1', fontSize: '15px', fontWeight: '500'}}>Nu s-au găsit facturi.</div> ) : (
                facturiAfisate.map((f, index) => {
                  const dataEmiterii = new Date(f.data_emitere || Date.now());
                  const nrFactura = `FCT-${dataEmiterii.getFullYear()}-${(f.id || index + 5031).toString().padStart(4, '0')}`;

                  return (
                    <div key={f.id || index} style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.5fr 1fr', gap: '16px', alignItems: 'center', padding: '16px 10px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '14px', fontWeight: '500' }}>
                      
                      <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '500' }}>
                        {nrFactura}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#B8D4F4', color: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '11px', flexShrink: 0 }}>
                          {getInitials(f.nume)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                          <span style={{ fontWeight: '600', color: '#E2E8F0', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.nume || 'Nespecificat'}</span>
                          <span style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.descriere || 'Ap. 7B'}</span>
                        </div>
                      </div>
                      
                      <div style={{ fontSize: '12px', color: '#E2E8F0', fontWeight: '500', textTransform: 'uppercase' }}>
                        {f.data_emitere ? new Date(f.data_emitere).toLocaleDateString('ro-RO', { month: 'short', year: 'numeric' }) : 'MAI - 2026'}
                      </div>
                      
                      <div style={{ fontWeight: '700', color: '#E2E8F0', fontSize: '13px', textAlign: 'right' }}>
                        {f.suma ? `${parseFloat(f.suma).toLocaleString('ro-RO')} lei` : '750 lei'}
                      </div>

                    </div>
                  );
                })
              )}
            </div>
            
            {facturiAfisate.length > 0 && (
              <div style={{ textAlign: 'center', padding: '20px 0 10px', fontSize: '12px', color: '#CBD5E1', fontWeight: '500' }}>
                &lt; 1 din 3 &gt;
              </div>
            )}
          </div>
        </div>

        <div className="stats-section">
          
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '700', color: '#1A2F45' }}>Încasări lunare 2026</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', paddingBottom: '10px' }}>
              {chartData.map((bar, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', width: '16%', height: '100%' }}>
                  <div style={{ width: '100%', height: bar.inaltime, backgroundColor: bar.culoare, borderRadius: '2px 2px 0 0' }}></div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              {chartData.map((bar, index) => (
                <div key={index} style={{ width: '16%', textAlign: 'center', fontSize: '11px', color: '#1A2F45', fontWeight: '600' }}>{bar.luna}</div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '700', color: '#1A2F45' }}>Status facturi mai</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                  <span style={{ color: '#1A2F45' }}>Plătite</span>
                  <span style={{ color: '#10B981' }}>{platiteCount} ({procPlatite}%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '4px' }}>
                  <div style={{ width: `${procPlatite}%`, height: '100%', background: '#4ADE80', borderRadius: '4px', transition: 'width 0.5s' }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                  <span style={{ color: '#D97706' }}>Restanță</span>
                  <span style={{ color: '#D97706' }}>{neplatiteCount} ({procNeplatite}%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '4px' }}>
                  <div style={{ width: `${procNeplatite}%`, height: '100%', background: '#D97706', borderRadius: '4px', transition: 'width 0.5s' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                  <span style={{ color: '#1A2F45' }}>În așteptare</span>
                  <span style={{ color: '#FBBF24' }}>{inAsteptareCount} ({procInAsteptare}%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '4px' }}>
                  <div style={{ width: `${procInAsteptare}%`, height: '100%', background: '#FBBF24', borderRadius: '4px', transition: 'width 0.5s' }}></div>
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Procesat prin</span>
              <div style={{ background: '#E2E8F0', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '600', color: '#1A2F45' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Netopia Payments
              </div>
            </div>

          </div>
        </div>

        {/* ADAUGARE */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h2 className="modal-title">Adaugă Factură Nouă</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input 
                  type="number" 
                  placeholder="ID Chiriaș" 
                  value={chiriasId} 
                  onChange={e => setChiriasId(e.target.value)} 
                  className="modal-input" 
                />
                <input 
                  type="number" 
                  placeholder="Suma (lei)" 
                  value={suma} 
                  onChange={e => setSuma(e.target.value)} 
                  className="modal-input" 
                />
                <input 
                  type="text" 
                  placeholder="Descriere (ex: Chirie mai)" 
                  value={descriere} 
                  onChange={e => setDescriere(e.target.value)} 
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

export default Facturi;