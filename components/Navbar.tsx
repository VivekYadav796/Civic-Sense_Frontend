'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getName, getRole, logout } from '@/lib/auth';

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const [name, setName]   = useState('');
  const [role, setRole]   = useState('');
  const [open, setOpen]   = useState(false);

  useEffect(() => {
    setName(getName() || '');
    setRole(getRole() || '');
  }, []);

  const links = [
    { href: '/dashboard',          label: 'Dashboard',  roles: ['CITIZEN','ADMIN','AUDITOR'] },
    { href: '/complaints/new',     label: 'New Report', roles: ['CITIZEN','ADMIN'] },
    { href: '/admin/complaints',   label: 'All Reports',roles: ['ADMIN','AUDITOR'] },
    { href: '/audit',              label: 'Audit Logs', roles: ['ADMIN','AUDITOR'] },
  ].filter(l => l.roles.includes(role));

  const roleColor: Record<string,string> = {
    CITIZEN: '#00e5a0', ADMIN: '#00d4ff', AUDITOR: '#a78bfa'
  };

  return (
    <nav style={{
      background: 'rgba(13,17,23,0.95)',
      borderBottom: '1px solid #1e2a3a',
      backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 100,
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
      }}>
        {/* Logo */}
        <div
          onClick={() => router.push('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #00d4ff, #00e5a0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#07090f', fontWeight: 800, fontSize: 13 }}>T</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '0.5px' }}>TCRS</span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4 }}>
          {links.map(l => (
            <button key={l.href} onClick={() => router.push(l.href)} style={{
              background: pathname === l.href ? 'rgba(0,212,255,0.1)' : 'transparent',
              color: pathname === l.href ? '#00d4ff' : '#8b9ab5',
              border: 'none', borderRadius: 8,
              padding: '6px 14px', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* User menu */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setOpen(!open)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#161c26', border: '1px solid #1e2a3a',
            borderRadius: 10, padding: '6px 12px',
            cursor: 'pointer', color: '#e8f0fe',
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'linear-gradient(135deg, #00d4ff22, #00e5a022)',
              border: `1.5px solid ${roleColor[role] || '#1e2a3a'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: roleColor[role] || '#8b9ab5',
            }}>
              {name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{name || 'User'}</span>
            <span style={{
              fontSize: 10, color: roleColor[role] || '#8b9ab5',
              background: `${roleColor[role] || '#8b9ab5'}15`,
              border: `1px solid ${roleColor[role] || '#8b9ab5'}30`,
              borderRadius: 4, padding: '1px 6px', fontWeight: 600,
            }}>
              {role}
            </span>
          </button>

          {open && (
            <div style={{
              position: 'absolute', right: 0, top: '110%',
              background: '#161c26', border: '1px solid #1e2a3a',
              borderRadius: 10, overflow: 'hidden', minWidth: 140,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}>
              <button onClick={logout} style={{
                width: '100%', padding: '10px 16px', textAlign: 'left',
                background: 'transparent', color: '#ff4d6d',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,77,109,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}