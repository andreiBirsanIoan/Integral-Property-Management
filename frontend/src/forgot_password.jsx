import React from 'react';
import { ArrowLeft, Construction } from 'lucide-react';

function ForgotPassword() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh', background: '#1E293B', fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: '#ffffff', padding: '40px 32px', borderRadius: '12px',
        maxWidth: '360px', width: '100%', textAlign: 'center', boxSizing: 'border-box'
      }}>
        
        <Construction size={44} color="#F59E0B" style={{ marginBottom: '16px' }} />
        
        <h2 style={{ margin: '0 0 12px 0', color: '#1E293B', fontSize: '22px', fontWeight: '700' }}>
          Funcție în lucru
        </h2>
        
        <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 24px 0', lineHeight: '1.5' }}>
          Modulul pentru recuperarea parolei este în curs de dezvoltare și va fi disponibil în curând.
        </p>

        <button 
          onClick={() => window.location.href = '/'} 
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', color: '#1E3A8A', 
            fontWeight: '600', cursor: 'pointer', fontSize: '14px'
          }}
        >
          <ArrowLeft size={16} /> Înapoi la autentificare
        </button>

      </div>
    </div>
  );
}

export default ForgotPassword;