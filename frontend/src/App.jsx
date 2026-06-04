import { useState } from 'react';

function App() {
  const [rol, setRol] = useState('chirias');
  const [pagina, setPagina] = useState('login');
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');

  const [numeReg, setNumeReg] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [parolaReg, setParolaReg] = useState('');
  const [telefonReg, setTelefonReg] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nume: numeReg, email: emailReg, parola: parolaReg, telefon: telefonReg, rol })
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.clear();
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        localStorage.setItem('nume', data.nume || numeReg); 
        localStorage.setItem('rol', data.rol || rol);
        localStorage.setItem('email', emailReg); 
        window.location.href = '/dashboard';
      } else {
        alert(data.eroare || 'Eroare la înregistrare');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, parola })
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('nume', data.nume); 
        localStorage.setItem('rol', data.rol);
        localStorage.setItem('email', email); 
        window.location.href = '/dashboard';
      } else {
        alert(data.eroare || 'Eroare la autentificare');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
       html, body, #root {
  margin: 0 !important; padding: 0 !important;
  width: 100vw !important; min-height: 100vh !important;
  overflow: auto; background-color: #0B1320; 
}

        .layout-container {
  display: flex; width: 100vw; min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

        .left-panel {
          width: 44%;
          background-color: #0B1320; 
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 60px 80px; color: #fff;
        }

        .left-content {
          margin: auto 0;
          max-width: 420px;
        }

        .logo-img {
          width: 280px; 
          margin-bottom: 60px;
          margin-left: -15px; 
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 500;
          line-height: 1.4;
          margin: 0 0 50px 0;
          color: #F8FAFC;
        }

        .feature-list { display: flex; flex-direction: column; gap: 32px; }

        .feature-item { display: flex; align-items: center; gap: 20px; }

        .feature-icon {
          stroke: #D4AF37; stroke-width: 1.5;
          width: 26px; height: 26px; fill: none;
        }

        .feature-text {
          font-size: 15px; color: #E2E8F0; font-weight: 400;
        }

        .footer-text { font-size: 11px; color: #94A3B8; }

        .right-panel {
          width: 56%; position: relative;
          display: flex; align-items: center; justify-content: center;
          background: url('/background.jpeg') center/cover no-repeat;
        }

        .overlay {
          position: absolute; inset: 0;
          background: rgba(235, 240, 246, 0.88);
          backdrop-filter: blur(4px);
        }

        .form-container {
          position: relative; z-index: 1;
          width: 100%; max-width: 380px;
          display: flex; flex-direction: column;
        }

        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px; font-weight: 600; color: #162032;
          margin: 0 0 6px 0; text-align: center;
        }

        .form-subtitle {
          font-family: 'Playfair Display', serif;
          font-size: 15px; color: #4B5A6D;
          margin: 0 0 36px 0; text-align: center; font-style: italic;
        }

        .tabs-container {
          display: flex; justify-content: center; margin-bottom: 36px;
        }

        .role-tabs {
          display: flex; align-items: stretch; 
          background: transparent;
          border: 1px solid #A1B2C3;
          border-radius: 20px;
          overflow: hidden;
          background-color: #CFDEEB; 
        }

        .role-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 24px;
          font-size: 14px; font-weight: 500; color: #162032;
          background: transparent; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif;
        }

        .role-btn.active {
          font-weight: 600;
        }

        .tab-divider {
          width: 1px; background-color: #A1B2C3;
        }

        .input-group { margin-bottom: 24px; }

        .input-label {
          display: block; font-size: 13px; font-weight: 600;
          color: #162032; margin-bottom: 8px; font-family: 'Playfair Display', serif;
        }

        .input-box {
          display: flex; align-items: center; gap: 12px;
          background: #CFDEEB; 
          border: 1px solid #A1B2C3;
          border-radius: 6px;
          padding: 14px 16px;
        }

        .input-icon {
          width: 18px; height: 18px;
          stroke: #4B5A6D; stroke-width: 1.5; fill: none;
        }

        .input-box input {
          width: 100%; background: transparent; border: none; outline: none;
          font-size: 14px; color: #162032; font-family: 'Inter', sans-serif;
        }

        .input-box input::placeholder { color: #6F8197; font-size: 13px; }

        .submit-btn {
          width: 220px; margin: 16px auto 0 auto; display: block;
          background-color: #162032; 
          color: #FFFFFF; border: none; border-radius: 6px;
          padding: 14px; font-size: 14px; font-weight: 500;
          cursor: pointer; font-family: 'Inter', sans-serif;
          transition: background 0.2s;
        }

        .submit-btn:hover { background-color: #23314A; }

        .form-footer {
          margin-top: 24px; display: flex; flex-direction: column;
          align-items: center; gap: 8px; font-size: 11px; color: #6F8197;
        }

        .forgot-pass {
          font-family: 'Playfair Display', serif; font-style: italic;
          color: #6F8197; font-size: 12px; cursor: pointer; margin-bottom: 2px;
        }

        .action-link {
          color: #4B5A6D; font-weight: 600; cursor: pointer; text-decoration: underline;
        }

        @media (max-width: 1024px) { .left-panel { padding: 40px; } }
        @media (max-width: 768px) {
  .layout-container { flex-direction: column; height: auto; }
  .left-panel { display: none; }
  .right-panel { width: 100%; min-height: 100vh; padding: 40px 24px; }
}


      `}</style>

      <div className="layout-container">
        
        <div className="left-panel">
          <div className="left-content">
            <img src="/logo.png" alt="Integral Property Management" className="logo-img" />
            
            <h1 className="hero-title">
              Gestionează apartamente,<br />chiriași și facturi dintr-un singur<br />loc.
            </h1>
            
            <div className="feature-list">
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                  <path d="M9 22v-4h6v4"></path>
                  <path d="M8 6h.01"></path><path d="M16 6h.01"></path>
                  <path d="M12 6h.01"></path><path d="M12 10h.01"></path>
                  <path d="M12 14h.01"></path><path d="M16 10h.01"></path>
                  <path d="M16 14h.01"></path><path d="M8 10h.01"></path>
                  <path d="M8 14h.01"></path>
                </svg>
                <span className="feature-text">Management complet apartamente</span>
              </div>
              
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span className="feature-text">Facturi și plăți automate</span>
              </div>
              
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span className="feature-text">Tichete de mentenanță</span>
              </div>
            </div>
          </div>
          <div className="footer-text">
            © 2026 Integral Property Management
          </div>
        </div>

        <div className="right-panel">
          <div className="overlay"></div>
          
          <div className="form-container">
            {pagina === 'login' ? (
              <>
                <h2 className="form-title">Bun venit înapoi!</h2>
                <p className="form-subtitle">Conectează-te la contul tău</p>

                <div className="tabs-container">
                  <div className="role-tabs">
                    <button onClick={() => setRol('chirias')} className={`role-btn ${rol === 'chirias' ? 'active' : ''}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      Chiriaș
                    </button>
                    <div className="tab-divider"></div>
                    <button onClick={() => setRol('proprietar')} className={`role-btn ${rol === 'proprietar' ? 'active' : ''}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                      Proprietar
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Email</label>
                  <div className="input-box">
                    <svg className="input-icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@imp.com" />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Parola</label>
                  <div className="input-box">
                    <svg className="input-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <input type="password" value={parola} onChange={(e) => setParola(e.target.value)} placeholder="••••••••" />
                  </div>
                </div>

                <button onClick={handleLogin} className="submit-btn">Autentificare</button>

                <div className="form-footer">
                  <span className="forgot-pass">Ai uitat parola?</span>
                  <span>Nu ai cont? <span onClick={() => setPagina('register')} className="action-link">Înregistrează-te.</span></span>
                </div>
              </>
            ) : (
              <>
                <h2 className="form-title">Creează cont</h2>
                <p className="form-subtitle">Completează datele de mai jos</p>

                <div className="tabs-container">
                  <div className="role-tabs">
                    <button onClick={() => setRol('chirias')} className={`role-btn ${rol === 'chirias' ? 'active' : ''}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      Chiriaș
                    </button>
                    <div className="tab-divider"></div>
                    <button onClick={() => setRol('proprietar')} className={`role-btn ${rol === 'proprietar' ? 'active' : ''}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                      Proprietar
                    </button>
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <label className="input-label">Nume complet</label>
                  <div className="input-box" style={{ padding: '12px 16px' }}>
                    <svg className="input-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <input value={numeReg} onChange={(e) => setNumeReg(e.target.value)} placeholder="Maria Ionescu" />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <label className="input-label">Email</label>
                  <div className="input-box" style={{ padding: '12px 16px' }}>
                    <svg className="input-icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <input value={emailReg} onChange={(e) => setEmailReg(e.target.value)} placeholder="maria@ipm.ro" />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <label className="input-label">Telefon</label>
                  <div className="input-box" style={{ padding: '12px 16px' }}>
                    <svg className="input-icon" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <input value={telefonReg} onChange={(e) => setTelefonReg(e.target.value)} placeholder="0700 000 000" />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Parola</label>
                  <div className="input-box" style={{ padding: '12px 16px' }}>
                    <svg className="input-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <input type="password" value={parolaReg} onChange={(e) => setParolaReg(e.target.value)} placeholder="••••••••" />
                  </div>
                </div>

                <button onClick={handleRegister} className="submit-btn">Creează cont</button>

                <div className="form-footer">
                  <span>Ai deja cont? <span onClick={() => setPagina('login')} className="action-link">Conectează-te.</span></span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;