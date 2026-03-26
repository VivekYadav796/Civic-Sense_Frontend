'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import API from '@/lib/api';
import { isLoggedIn, getRole } from '@/lib/auth';
import { Complaint, AuditLog } from '@/types';

const STATUSES = ['PENDING','IN_PROGRESS','RESOLVED','REJECTED'];

export default function ComplaintDetail() {
  const router = useRouter();
  const params = useParams();
  const id     = params.id as string;

  const [complaint, setComplaint]   = useState<Complaint | null>(null);
  const [logs, setLogs]             = useState<AuditLog[]>([]);
  const [role, setRole]             = useState('');
  const [loading, setLoading]       = useState(true);
  const [updating, setUpdating]     = useState(false);
  const [remarks, setRemarks]       = useState('');
  const [newStatus, setNewStatus]   = useState('');
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    const r = getRole() || '';
    setRole(r);
    fetchComplaint();
    if (r === 'ADMIN' || r === 'AUDITOR') fetchLogs();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const res = await API.get(`/complaints/${id}`);
      setComplaint(res.data);
      setNewStatus(res.data.status);
      setRemarks(res.data.adminRemarks || '');
    } catch { router.push('/dashboard'); }
    finally { setLoading(false); }
  };

  const fetchLogs = async () => {
    try {
      const res = await API.get(`/audit/complaint/${id}`);
      setLogs(res.data);
    } catch {}
  };

  const handleUpdate = async () => {
    setUpdating(true); setError(''); setSuccess('');
    try {
      const res = await API.patch(`/complaints/admin/${id}/status`, {
        status: newStatus, adminRemarks: remarks,
      });
      setComplaint(res.data);
      setSuccess('Status updated successfully');
      fetchLogs();
    } catch (err: any) {
      setError(err.response?.data || 'Update failed');
    } finally { setUpdating(false); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#07090f' }}>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <div style={{
          width: 32, height: 32, border: '2px solid #1e2a3a',
          borderTopColor: '#00d4ff', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}/>
      </div>
    </div>
  );

  if (!complaint) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#07090f' }}>
      <Navbar />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>

        <button onClick={() => router.back()} className="fade-up" style={{
          background: 'none', border: 'none', color: '#8b9ab5',
          fontSize: 13, cursor: 'pointer', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 6, padding: 0,
        }}>
          ← Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 28, alignItems: 'flex-start' }}>
          <div className="fade-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{
                fontSize: 11, color: '#8b9ab5',
                background: '#161c26', border: '1px solid #1e2a3a',
                borderRadius: 4, padding: '3px 10px', fontWeight: 600,
              }}>
                {complaint.category}
              </span>
              <span style={{ fontSize: 11, color: '#4a5568' }}>
                #{complaint.id?.slice(-8).toUpperCase()}
              </span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{complaint.title}</h1>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#8b9ab5' }}>📍 {complaint.location}</span>
              <span style={{ fontSize: 13, color: '#8b9ab5' }}>👤 {complaint.submittedByName}</span>
              <span style={{ fontSize: 13, color: '#8b9ab5' }}>🕐 {formatDate(complaint.createdAt)}</span>
            </div>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: role === 'ADMIN' ? '1fr 1fr' : '1fr', gap: 20 }}>

          {/* Description card */}
          <div className="fade-up-1" style={{
            background: '#0d1117', border: '1px solid #1e2a3a',
            borderRadius: 16, padding: '24px',
          }}>
            <h3 style={{ fontSize: 13, color: '#8b9ab5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
              Description
            </h3>
            <p style={{ color: '#e8f0fe', fontSize: 14, lineHeight: 1.8 }}>{complaint.description}</p>

            {complaint.adminRemarks && (
              <div style={{
                marginTop: 20, padding: '14px',
                background: 'rgba(0,212,255,0.05)',
                border: '1px solid rgba(0,212,255,0.15)',
                borderRadius: 10,
              }}>
                <p style={{ fontSize: 12, color: '#00d4ff', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Admin remarks
                </p>
                <p style={{ color: '#e8f0fe', fontSize: 14, lineHeight: 1.7 }}>{complaint.adminRemarks}</p>
              </div>
            )}
          </div>

          {/* Admin update panel */}
          {role === 'ADMIN' && (
            <div className="fade-up-2" style={{
              background: '#0d1117', border: '1px solid #1e2a3a',
              borderRadius: 16, padding: '24px',
            }}>
              <h3 style={{ fontSize: 13, color: '#8b9ab5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>
                Update status
              </h3>

              {success && (
                <div style={{
                  background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.2)',
                  borderRadius: 8, padding: '8px 12px', color: '#00e5a0',
                  fontSize: 13, marginBottom: 14,
                }}>{success}</div>
              )}
              {error && (
                <div style={{
                  background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.2)',
                  borderRadius: 8, padding: '8px 12px', color: '#ff4d6d',
                  fontSize: 13, marginBottom: 14,
                }}>{error}</div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ color: '#8b9ab5', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    New status
                  </label>
                  <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: '#8b9ab5', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Remarks (optional)
                  </label>
                  <textarea
                    rows={4} placeholder="Add a note for the citizen..."
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    style={{ resize: 'none' }}
                  />
                </div>
                <button onClick={handleUpdate} disabled={updating} style={{
                  background: updating ? '#1e2a3a' : 'linear-gradient(135deg, #00d4ff, #0099cc)',
                  color: updating ? '#4a5568' : '#07090f',
                  border: 'none', borderRadius: 10, padding: '12px',
                  fontSize: 14, fontWeight: 700,
                  cursor: updating ? 'not-allowed' : 'pointer',
                }}>
                  {updating ? 'Updating...' : 'Update complaint'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Audit trail */}
        {(role === 'ADMIN' || role === 'AUDITOR') && logs.length > 0 && (
          <div className="fade-up-3" style={{
            background: '#0d1117', border: '1px solid #1e2a3a',
            borderRadius: 16, padding: '24px', marginTop: 20,
          }}>
            <h3 style={{ fontSize: 13, color: '#8b9ab5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>
              Activity trail
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {logs.map((log, i) => (
                <div key={log.id} style={{
                  display: 'flex', gap: 14,
                  paddingBottom: i < logs.length - 1 ? 16 : 0,
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: '#00d4ff', flexShrink: 0, marginTop: 4,
                    }}/>
                    {i < logs.length - 1 && (
                      <div style={{ flex: 1, width: 1, background: '#1e2a3a', marginTop: 4 }}/>
                    )}
                  </div>
                  <div style={{ paddingBottom: i < logs.length - 1 ? 8 : 0 }}>
                    <p style={{ fontSize: 13, color: '#e8f0fe', marginBottom: 2 }}>{log.description}</p>
                    <p style={{ fontSize: 11, color: '#4a5568' }}>
                      {log.performedByEmail} · {formatDate(log.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}