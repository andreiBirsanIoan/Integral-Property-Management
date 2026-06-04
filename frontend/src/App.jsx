import { useState } from 'react';
import './App.css';

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
        setPagina('login');
        setEmail(emailReg);
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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

        .app-wrapper {
          display: flex;
          height: 100vh;
          width: 100%;
          font-family: 'Inter', sans-serif;
          margin: 0; padding: 0;
        }

        /* --- PARTEA STÂNGĂ --- */
        .left-side {
          width: 45%;
          background-color: #0A1124;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 50px 8%;
          box-sizing: border-box;
          color: #fff;
        }

        .left-content {
          margin: auto 0;
          max-width: 420px;
        }

        .logo-img {
          width: 200px;
          margin-bottom: 60px;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          font-weight: 500;
          line-height: 1.3;
          margin-bottom: 40px;
          color: #fff;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .feature-icon {
          color: #CBA57A; /* Auriu/Bronz */
        }

        .feature-text {
          font-size: 15px;
          color: #E2E8F0;
          font-weight: 400;
        }

        .footer-text {
          font-size: 11px;
          color: #64748B;
        }

        /* --- PARTEA DREAPTĂ --- */
        .right-side {
          width: 55%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url('/background.jpeg');
          background-size: cover;
          background-position: center;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(240, 244, 248, 0.88);
          backdrop-filter: blur(6px);
        }

        .form-box {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 600;
          color: #1A2F45;
          margin: 0 0 8px 0;
          text-align: center;
        }

        .form-subtitle {
          font-size: 14px;
          color: #64748B;
          margin: 0 0 32px 0;
          text-align: center;
        }

        /* Selector Rol (Pill unit) */
        .role-switcher {
          display: inline-flex;
          align-items: center;
          background: #D4E1EE;
          border: 1px solid #A8C1D6;
          border-radius: 30px;
          margin-bottom: 32px;
          overflow: hidden;
        }

        .role-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          background: transparent;
          color: #1A2F45;
          transition: all 0.2s ease;
        }

        .role-btn.active {
          background: #E8F0F8;
          font-weight: 600;
        }

        .role-divider {
          width: 1px;
          height: 20px;
          background-color: #A8C1D6;
        }

        /* Input-uri */
        .input-group {
          width: 100%;
          margin-bottom: 20px;
          text-align: left;
        }

        .input-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #1A2F45;
          margin-bottom: 8px;
          margin-left: 2px;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          background: #D4E1EE;
          border: 1px solid #A1B9CE;
          border-radius: 8px;
          padding: 14px 16px;
          gap: 12px;
        }

        .input-field {
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
          color: #1A2F45;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
        }

        .input-field::placeholder {
          color: #829AB1;
        }

        .input-icon {
          color: #64748B;
        }

        /* Buton Submit */
        .submit-btn {
          width: 100%;
          background-color: #121C30;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 16px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s;
        }

        .submit-btn:hover {
          background-color: #1A294A;
        }

        /* Link-uri jos */
        .footer-links {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 12px;
          color: #829AB1;
          text-align: center;
        }

        .action-link {
          color: #1A2F45;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .app-wrapper { flex-direction: column; }
          .left-side { width: 100%; padding: 40px 24px; height: auto; }
          .right-side { width: 100%; flex: 1; padding: 40px 24px; }
        }
      `}</style>

      <div className="app-wrapper">
        
        {/* JUMĂTATEA STÂNGĂ */}
        <div className="left-side">
          <div className="left-content">
            <img src="/logo.png" alt="Integral Property Management" className="logo-img" />
            
            <h1 className="hero-title">
              Gestionează apartamente, chiriași și facturi dintr-un singur loc.
            </h1>
            
            <div>
              <div className="feature-item">
                <svg className="feature-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
                <span className="feature-text">Management complet apartamente</span>
              </div>
              <div className="feature-item">
                <svg className="feature-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <span className="feature-text">Facturi și plăți automate</span>
              </div>
              <div className="feature-item">
                <svg className="feature-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                <span className="feature-text">Tichete de mentenanță</span>
              </div>
            </div>
          </div>
          <div className="footer-text">
            © 2026 Integral Property Management
          </div>
        </div>

        {/* JUMĂTATEA DREAPTĂ */}
        <div className="right-side">
          <div className="overlay"></div>
          
          <div className="form-box">
            {pagina === 'login' ? (
              <>
                <h2 className="form-title">Bun venit înapoi!</h2>
                <p className="form-subtitle">Conectează-te la contul tău</p>

                <div className="role-switcher">
                  <button onClick={() => setRol('chirias')} className={`role-btn ${rol === 'chirias' ? 'active' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Chiriaș
                  </button>
                  <div className="role-divider"></div>
                  <button onClick={() => setRol('proprietar')} className={`role-btn ${rol === 'proprietar' ? 'active' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    Proprietar
                  </button>
                </div>

                <div className="input-group">
                  <label className="input-label">Email</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ipm.com" className="input-field" />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Parola</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <input type="password" value={parola} onChange={(e) => setParola(e.target.value)} placeholder="••••••••" className="input-field" />
                  </div>
                </div>

                <button onClick={handleLogin} className="submit-btn">Autentificare</button>

                <div className="footer-links">
                  <span>Ai uitat parola?</span>
                  <span>Nu ai cont? <span onClick={() => setPagina('register')} className="action-link">Înregistrează-te.</span></span>
                </div>
              </>
            ) : (
              <>
                <h2 className="form-title">Creează cont</h2>
                <p className="form-subtitle">Completează datele de mai jos</p>

                <div className="role-switcher">
                  <button onClick={() => setRol('chirias')} className={`role-btn ${rol === 'chirias' ? 'active' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Chiriaș
                  </button>
                  <div className="role-divider"></div>
                  <button onClick={() => setRol('proprietar')} className={`role-btn ${rol === 'proprietar' ? 'active' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    Proprietar
                  </button>
                </div>

                <div className="input-group" style={{ marginBottom: '14px' }}>
                  <label className="input-label">Nume complet</label>
                  <div className="input-wrapper" style={{ padding: '10px 16px' }}>
                    <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <input value={numeReg} onChange={(e) => setNumeReg(e.target.value)} placeholder="Maria Ionescu" className="input-field" />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '14px' }}>
                  <label className="input-label">Email</label>
                  <div className="input-wrapper" style={{ padding: '10px 16px' }}>
                    <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <input value={emailReg} onChange={(e) => setEmailReg(e.target.value)} placeholder="maria@ipm.ro" className="input-field" />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '14px' }}>
                  <label className="input-label">Telefon</label>
                  <div className="input-wrapper" style={{ padding: '10px 16px' }}>
                    <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <input value={telefonReg} onChange={(e) => setTelefonReg(e.target.value)} placeholder="0700 000 000" className="input-field" />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Parola</label>
                  <div className="input-wrapper" style={{ padding: '10px 16px' }}>
                    <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <input type="password" value={parolaReg} onChange={(e) => setParolaReg(e.target.value)} placeholder="••••••••" className="input-field" />
                  </div>
                </div>

                <button onClick={handleRegister} className="submit-btn">Creează cont</button>

                <div className="footer-links">
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