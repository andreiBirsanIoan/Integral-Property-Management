import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  Plus,
  FileSpreadsheet,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock
} from 'lucide-react';

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
          suma: parseFloat(suma), 
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

  let facturiAfisate = [...facturi];
  if (sortOption === 'suma_desc') {
    facturiAfisate.sort((a, b) => parseFloat(b.suma || 0) - parseFloat(a.suma || 0));
  } else if (sortOption === 'suma_asc') {
    facturiAfisate.sort((a, b) => parseFloat(a.suma || 0) - parseFloat(b.suma || 0));
  }

  // --- CALCULE STATISTICI ȘI STATUS DINAMICE ---
  const totalFacturi = facturi.length;
  const platiteCount = facturi.filter(f => f.status === 'platita' || f.platita === 1 || f.platita === true).length;
  const inAsteptareCount = facturi.filter(f => f.status === 'in_asteptare' || f.status === 'asteptare').length;
  const neplatiteCount = Math.max(0, totalFacturi - platiteCount - inAsteptareCount);

  const procPlatite = totalFacturi > 0 ? Math.round((platiteCount / totalFacturi) * 100) : 0;
  const procNeplatite = totalFacturi > 0 ? Math.round((neplatiteCount / totalFacturi) * 100) : 0;
  const procInAsteptare = totalFacturi > 0 ? Math.round((inAsteptareCount / totalFacturi) * 100) : 0;

  // --- GENERARE DINAMICĂ GRAFIC BARS (Ianuarie - Mai) ---
  const sumePeLuni = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }; 
  
  facturi.forEach(f => {
    if (f.data_emitere) {
      const luna = new Date(f.data_emitere).getMonth();
      if (luna >= 0 && luna <= 4) {
        sumePeLuni[luna] += parseFloat(f.suma) || 0;
      }
    }
  });

  const valoareMaxima = Math.max(...Object.values(sumePeLuni), 1);
  const luniLitere = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai'];
  const culoriGrafic = ['#C7DFF3', '#A2C8EB', '#7BA6D6', '#4D6F97', '#2B3958'];

  const chartData = luniLitere.map((luna, index) => {
    const sumaLuna = sumePeLuni[index];
    const procentInaltime = Math.round((sumaLuna / valoareMaxima) * 100);
    return {
      luna,
      inaltime: totalFacturi > 0 && sumaLuna > 0 ? `${Math.max(8, procentInaltime)}%` : '0%',
      culoare: culoriGrafic[index]
    };
  });

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
          display: flex; flex-wrap: wrap; gap: 16px; align-items: center;
        }
        
        .dropdown-wrapper {
          position: relative;
          width: 190px;
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
        
        .modal-input::placeholder { color: #94A3B8 !important; }

        .modal-btn-cancel {
          flex: 1; padding: 12px; border-radius: 8px; border: 1px solid #CBD5E1; background: #ffffff; color: #1E293B; cursor: pointer; font-weight: 600; transition: background 0.2s;
        }
        .modal-btn-cancel:hover { background: #F1F5F9; }
        
        .modal-btn-save {
          flex: 1; padding: 12px; border-radius: 8px; border: none; background: #1E3A8A; color: #ffffff; cursor: pointer; font-weight: 600; transition: background 0.2s;
        }
        .modal-btn-save:hover { background: #172a6b; }

        @media (max-width: 1024px) {
          .facturi-container { flex-direction: column; height: auto; }
          .stats-section { width: 100%; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
        }

        @media (max-width: 768px) {
          .list-section { padding: 16px; }
          .stats-section { display: flex; flex-direction: column; margin-bottom: 80px; }
          .dropdown-wrapper { width: 100%; }
          .btn-adauga { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="facturi-container">
        
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
                  <option value="suma_desc">Sumă (Descrescător)</option>
                  <option value="suma_asc">Sumă (Crescător)</option>
                </select>
                <ChevronDown
                  size={16}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#1E293B'
                  }}
                />
              </div>

              <button onClick={() => setIsModalOpen(true)} className="btn-adauga">
                <Plus size={16} /> Adaugă factură
              </button>
            </div>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#E2E8F0', fontWeight: '500', whiteSpace: 'nowrap' }}>
              <span>{facturiAfisate.length} înregistrări</span>
              <FileSpreadsheet size={16} style={{ opacity: 0.8 }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Istoricul Plăților</h2>
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
                facturiAfisate.length === 0 ? ( <div style={{textAlign: 'center', padding: '40px 20px', color: '#CBD5E1', fontSize: '15px', fontWeight: '500'}}>Nu s-au găsit facturi emise.</div> ) : (
                facturiAfisate.map((f, index) => {
                  const dataEmiterii = f.data_emitere ? new Date(f.data_emitere) : new Date();
                  const nrFactura = `FCT-${dataEmiterii.getFullYear()}-${(f.id || index + 1).toString().padStart(4, '0')}`;

                  return (
                    <div key={f.id || index} style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.5fr 1fr', gap: '16px', alignItems: 'center', padding: '16px 10px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '14px', fontWeight: '500' }}>
                      
                      <div style={{ color: '#CBD5E1', fontSize: '12px', fontWeight: '500' }}>
                        {nrFactura}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#B8D4F4', color: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '11px', flexShrink: 0 }}>
                          {getInitials(f.nume)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                          <span style={{ fontWeight: '600', color: '#E2E8F0', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.nume || 'Nespecificat'}</span>
                          <span style={{ fontSize: '11px', color: '#CBD5E1', opacity: 0.8, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.descriere || '—'}</span>
                        </div>
                      </div>
                      
                      <div style={{ fontSize: '12px', color: '#E2E8F0', fontWeight: '500', textTransform: 'uppercase' }}>
                        {f.data_emitere ? new Date(f.data_emitere).toLocaleDateString('ro-RO', { month: 'short', year: 'numeric' }) : '—'}
                      </div>
                      
                      <div style={{ fontWeight: '700', color: '#E2E8F0', fontSize: '13px', textAlign: 'right' }}>
                        {f.suma ? `${parseFloat(f.suma).toLocaleString('ro-RO')} lei` : '0 lei'}
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="stats-section">
          
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', boxSizing: 'border-box', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '20px', right: '24px', opacity: 0.15, color: '#1A2F45' }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '15px', fontWeight: '700', color: '#1A2F45', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Încasări lunare {new Date().getFullYear()}</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', paddingBottom: '10px' }}>
              {chartData.map((bar, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', width: '16%', height: '100%' }}>
                  <div style={{ width: '100%', height: bar.inaltime, backgroundColor: bar.culoare, borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease' }}></div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              {chartData.map((bar, index) => (
                <div key={index} style={{ width: '16%', textAlign: 'center', fontSize: '11px', color: '#1A2F45', fontWeight: '700' }}>{bar.luna}</div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '15px', fontWeight: '700', color: '#1A2F45', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Status general facturi</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                  <span style={{ color: '#1A2F45', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color="#10B981" /> Plătite
                  </span>
                  <span style={{ color: '#10B981' }}>{platiteCount} ({procPlatite}%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '4px' }}>
                  <div style={{ width: `${procPlatite}%`, height: '100%', background: '#4ADE80', borderRadius: '4px', transition: 'width 0.5s' }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                  <span style={{ color: '#D97706', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={14} color="#D97706" /> Restanță
                  </span>
                  <span style={{ color: '#D97706' }}>{neplatiteCount} ({procNeplatite}%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '4px' }}>
                  <div style={{ width: `${procNeplatite}%`, height: '100%', background: '#D97706', borderRadius: '4px', transition: 'width 0.5s' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                  <span style={{ color: '#1A2F45', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#FBBF24" /> În așteptare
                  </span>
                  <span style={{ color: '#B45309' }}>{inAsteptareCount} ({procInAsteptare}%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '4px' }}>
                  <div style={{ width: `${procInAsteptare}%`, height: '100%', background: '#FBBF24', borderRadius: '4px', transition: 'width 0.5s' }}></div>
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Procesat prin</span>
              <div style={{ background: '#E2E8F0', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '600', color: '#1A2F45' }}>
                <Lock size={12} />
                Netopia Payments
              </div>
            </div>

          </div>
        </div>

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
                  placeholder="Descriere (ex: Chirie)" 
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