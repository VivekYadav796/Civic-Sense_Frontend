'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed]           = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);

  useEffect(() => { if (isLoggedIn()) router.push('/dashboard'); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (!agreed) return setError('Please accept the terms and conditions');

    setLoading(true);
    try {
      await API.post('/auth/register', {
        name: form.name, email: form.email, password: form.password,
      });
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data || 'Registration failed');
    } finally { setLoading(false); }
  };

  const EyeBtn = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
    <button type="button" onClick={toggle} style={{
      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
      background: 'none', border: 'none', cursor: 'pointer',
      color: '#4a5568', display: 'flex', padding: 0,
    }}>
      {show
        ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  );

  return (
    <div style={{
      minHeight: '100vh', background: '#07090f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div className="fade-up" style={{
        width: '100%', maxWidth: 420,
        background: '#0d1117', border: '1px solid #1e2a3a',
        borderRadius: 20, padding: '40px 36px',
      }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, #00d4ff, #00e5a0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <span style={{ color: '#07090f', fontWeight: 800, fontSize: 16 }}>T</span>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Create account</h2>
          <p style={{ color: '#8b9ab5', fontSize: 14 }}>Join the civic reporting platform</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.2)',
            borderRadius: 10, padding: '10px 14px', color: '#ff4d6d',
            fontSize: 13, marginBottom: 18,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Name */}
          <div>
            <label style={{ color: '#8b9ab5', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full name</label>
            <input
              type="text" placeholder="Vivek Yadav"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ color: '#8b9ab5', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email address</label>
            <input
              type="email" placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ color: '#8b9ab5', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required style={{ paddingRight: 44 }}
              />
              <EyeBtn show={showPass} toggle={() => setShowPass(!showPass)} />
            </div>
          </div>

          {/* Confirm */}
          <div>
            <label style={{ color: '#8b9ab5', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirm password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'} placeholder="Repeat password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                required style={{
                  paddingRight: 44,
                  borderColor: form.confirm && form.confirm !== form.password ? 'rgba(255,77,109,0.5)' : undefined,
                }}
              />
              <EyeBtn show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
            </div>
            {form.confirm && form.confirm !== form.password && (
              <p style={{ color: '#ff4d6d', fontSize: 11, marginTop: 4 }}>Passwords do not match</p>
            )}
          </div>

          {/* Terms */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox" checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              style={{ width: 15, height: 15, marginTop: 2, accentColor: '#00d4ff', flexShrink: 0 }}
            />
            <span style={{ color: '#8b9ab5', fontSize: 13, lineHeight: 1.5 }}>
              I agree to the{' '}
              <a href="/terms" style={{ color: '#00d4ff' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" style={{ color: '#00d4ff' }}>Privacy Policy</a>
            </span>
          </label>

          <button type="submit" disabled={loading || !agreed} style={{
            background: (loading || !agreed) ? '#1e2a3a' : 'linear-gradient(135deg, #00d4ff, #0099cc)',
            color: (loading || !agreed) ? '#4a5568' : '#07090f',
            borderRadius: 10, padding: '13px',
            fontSize: 15, fontWeight: 700,
            cursor: (loading || !agreed) ? 'not-allowed' : 'pointer',
            border: 'none', width: '100%', marginTop: 4,
          }}>
            {loading ? 'Creating account...' : 'Create account →'}
          </button>
        </form>

        <p style={{ color: '#4a5568', fontSize: 13, textAlign: 'center', marginTop: 20 }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#00d4ff', fontWeight: 600 }}>Sign in</a>
        </p>
      </div>
    </div>
  );
}