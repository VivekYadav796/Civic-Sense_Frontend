'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import API from '@/lib/api';
import { saveAuth, isLoggedIn } from '@/lib/auth';

export default function LoginPage() {
  const router       = useRouter();
  const params       = useSearchParams();
  const [form, setForm]             = useState({ email: '', password: '' });
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    if (isLoggedIn()) router.push('/dashboard');
    if (params.get('registered')) setSuccess('Account created! Please sign in.');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      saveAuth(res.data.token, res.data.role, res.data.name, res.data.email);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#07090f',
      display: 'flex', alignItems: 'stretch',
    }}>
      {/* Left panel - branding */}
      <div style={{
        flex: 1, display: 'none',
        background: 'linear-gradient(135deg, #0d1117 0%, #131820 100%)',
        borderRight: '1px solid #1e2a3a',
        padding: '60px', flexDirection: 'column', justifyContent: 'space-between',
      }}
        className="left-panel"
      >
        <div>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #00d4ff, #00e5a0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 48,
          }}>
            <span style={{ color: '#07090f', fontWeight: 800, fontSize: 18 }}>T</span>
          </div>
          <h1 style={{
            fontSize: 42, fontWeight: 800, lineHeight: 1.15,
            background: 'linear-gradient(135deg, #e8f0fe, #8b9ab5)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 20,
          }}>
            Transparent<br/>Civic Reporting<br/>System
          </h1>
          <p style={{ color: '#4a5568', fontSize: 16, lineHeight: 1.7, maxWidth: 360 }}>
            Submit complaints, track resolutions in real time, and hold authorities accountable — all in one platform.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { icon: '⚡', text: 'Real-time status tracking' },
            { icon: '🔒', text: 'Secure JWT authentication' },
            { icon: '📊', text: 'Transparent audit logs' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ color: '#8b9ab5', fontSize: 14 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div style={{
        width: '100%', maxWidth: 480,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div className="fade-up" style={{ marginBottom: 36 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #00d4ff, #00e5a0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 24,
            }}>
              <span style={{ color: '#07090f', fontWeight: 800, fontSize: 16 }}>T</span>
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Welcome back</h2>
            <p style={{ color: '#8b9ab5', fontSize: 14 }}>Sign in to your TCRS account</p>
          </div>

          {success && (
            <div className="fade-up" style={{
              background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.2)',
              borderRadius: 10, padding: '12px 16px', color: '#00e5a0',
              fontSize: 13, marginBottom: 20,
            }}>{success}</div>
          )}

          {error && (
            <div className="fade-up" style={{
              background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.2)',
              borderRadius: 10, padding: '12px 16px', color: '#ff4d6d',
              fontSize: 13, marginBottom: 20,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="fade-up-1">
              <label style={{ color: '#8b9ab5', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email address
              </label>
              <input
                type="email" placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="fade-up-2">
              <label style={{ color: '#8b9ab5', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#4a5568', display: 'flex', padding: 0,
                }}>
                  {showPass
                    ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: 6 }}>
                <a href="/forgot-password" style={{ color: '#00d4ff', fontSize: 12 }}>Forgot password?</a>
              </div>
            </div>

            <button className="fade-up-3" type="submit" disabled={loading} style={{
              background: loading ? '#1e2a3a' : 'linear-gradient(135deg, #00d4ff, #0099cc)',
              color: loading ? '#4a5568' : '#07090f',
              borderRadius: 10, padding: '13px',
              fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', marginTop: 4,
              border: 'none', width: '100%',
            }}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <p className="fade-up-4" style={{ color: '#4a5568', fontSize: 13, textAlign: 'center', marginTop: 24 }}>
            No account?{' '}
            <a href="/register" style={{ color: '#00d4ff', fontWeight: 600 }}>Create one free</a>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .left-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
}