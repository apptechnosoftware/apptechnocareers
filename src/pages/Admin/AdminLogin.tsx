import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck, AlertTriangle } from 'lucide-react';
import SEO from '../../components/SEO/SEO';

const API_BASE = window.location.port === '5173' ? 'http://localhost:5000' : '';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if already logged in
    if (sessionStorage.getItem('appteknow_admin_authenticated') === 'true') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('appteknow_admin_authenticated', 'true');
        sessionStorage.setItem('appteknow_admin_token', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials. Security notification dispatched.');
        setTimeout(() => setError(''), 4000);
      }
    } catch (err) {
      setError('Connection to security terminal failed. System offline.');
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <>
      <SEO title="System Security Gateway - Administration" description="Authorized administrative personnel only." />
      <main style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'radial-gradient(circle at center, #0b0f19 0%, #020617 100%)',
        fontFamily: 'var(--font-heading)',
        color: '#f8fafc',
        padding: '20px'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '400px', 
          background: 'rgba(30, 41, 59, 0.5)', 
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)', 
          borderRadius: '24px', 
          padding: '40px 30px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '60px', 
              height: '60px', 
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
              borderRadius: '16px', 
              boxShadow: '0 0 30px rgba(37, 99, 235, 0.3)',
              marginBottom: '20px'
            }}>
              <Lock color="white" size={28} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              AppTeknow Cloud
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>
              Authorized Personnel Access Terminal
            </p>
          </div>

          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              color: '#fca5a5', 
              padding: '12px 16px', 
              borderRadius: '12px', 
              fontSize: '0.85rem', 
              marginBottom: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin" 
                  style={{ 
                    width: '100%', 
                    background: 'rgba(15, 23, 42, 0.6)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px', 
                    padding: '14px 16px 14px 44px', 
                    color: 'white', 
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }} 
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Security Key
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  style={{ 
                    width: '100%', 
                    background: 'rgba(15, 23, 42, 0.6)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px', 
                    padding: '14px 16px 14px 44px', 
                    color: 'white', 
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            <button 
              type="submit" 
              style={{ 
                marginTop: '10px', 
                background: '#3b82f6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                padding: '14px', 
                fontWeight: 700, 
                fontSize: '0.95rem', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
            >
              <ShieldCheck size={18} /> Establish Uplink
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.75rem', color: '#475569' }}>
            Secure End-to-End AES encrypted Session
          </div>

        </div>
      </main>
    </>
  );
};

export default AdminLogin;
