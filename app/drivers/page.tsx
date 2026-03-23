'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProgressBar from '@/components/ProgressBar'

interface Driver {
  id: string; name: string; birthDate: string; startDate: string
  totalSkills: number; completed: number; inProgress: number
}

function daysUntil16(birthDate: string, nowTimestamp: number) {
  const birth = new Date(birthDate)
  const target = new Date(birth)
  target.setFullYear(birth.getFullYear() + 16)
  const diff = Math.ceil((target.getTime() - nowTimestamp) / 86400000)
  return Math.max(0, diff)
}

function AddDriverModal({ onClose, onAdd }: { onClose: () => void; onAdd: (d: Driver) => void }) {
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!name.trim() || !birthDate) { setError('Name and birth date are required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), birthDate, startDate }),
      })
      if (!res.ok) throw new Error('Failed')
      const driver = await res.json()
      onAdd(driver)
      onClose()
    } catch { setError('Failed to create driver. Please try again.') }
    finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.5rem', fontWeight: 800 }}>Add New Driver</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--accent-red)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: 'var(--accent-red)', fontSize: 14 }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Driver Name</label>
            <input className="input" placeholder="e.g. Sarah" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Date of Birth</label>
            <input className="input" type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Training Start Date</label>
            <input className="input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} onClick={handleSubmit} disabled={saving}>
            {saving ? 'Creating...' : 'Create Driver Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [nowTimestamp] = useState(() => Date.now())

  useEffect(() => {
    fetch('/api/drivers').then(r => r.json()).then(d => setDrivers(Array.isArray(d) ? d : [])).finally(() => setLoading(false))
  }, [])

  async function deleteDriver(id: string, name: string) {
    if (!confirm(`Delete ${name}? This will remove all their progress data.`)) return
    await fetch(`/api/drivers/${id}`, { method: 'DELETE' })
    setDrivers(prev => prev.filter(d => d.id !== id))
  }

  const filtered = drivers.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-title">Drivers</div>
          <div className="page-subtitle">Manage driver profiles and training</div>
        </div>
        <button className="btn-primary" style={{ padding: '10px 14px', fontSize: 13 }} onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Driver
        </button>
      </div>

      <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input className="input" placeholder="Search drivers..." value={search} onChange={e => setSearch(e.target.value)} />

        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🚦</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-secondary)', marginBottom: 8 }}>
              {search ? 'No drivers found' : 'No drivers yet'}
            </div>
            <div style={{ fontSize: 14 }}>
              {search ? 'Try a different search' : 'Tap + Add Driver to get started'}
            </div>
          </div>
        )}

        {filtered.map(driver => {
          const days = daysUntil16(driver.birthDate, nowTimestamp)
          const age = Math.floor((nowTimestamp - new Date(driver.birthDate).getTime()) / (365.25 * 86400000))

          return (
            <div key={driver.id} className="card" style={{ overflow: 'hidden' }}>
              <Link href={`/drivers/${driver.id}`} style={{ display: 'block', padding: '16px', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                    👤
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>{driver.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      Age {age} &bull; Started {new Date(driver.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {days > 0 && (
                      <div style={{ background: 'var(--accent-gold)', color: '#070d1a', borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap' }}>
                        {days} DAYS TO 16
                      </div>
                    )}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>
                <ProgressBar value={driver.completed} max={driver.totalSkills} showLabel />
                <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                  <span style={{ fontSize: 12, color: 'var(--accent-green)' }}>✓ {driver.completed} done</span>
                  {driver.inProgress > 0 && <span style={{ fontSize: 12, color: 'var(--accent-gold)' }}>⏳ {driver.inProgress} in progress</span>}
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{driver.totalSkills - driver.completed - driver.inProgress} remaining</span>
                </div>
              </Link>
              <div style={{ borderTop: '1px solid var(--border)', padding: '10px 16px', display: 'flex', gap: 8 }}>
                <Link href={`/training?driver=${driver.id}`} style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'var(--bg-elevated)', borderRadius: 8, textDecoration: 'none', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>
                  📋 Training
                </Link>
                <button onClick={() => deleteDriver(driver.id, driver.name)}
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 14px', color: 'var(--accent-red)', cursor: 'pointer', fontSize: 13 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <AddDriverModal
          onClose={() => setShowModal(false)}
          onAdd={() => {
            // Reload to get totalSkills
            fetch('/api/drivers').then(r => r.json()).then(data => setDrivers(Array.isArray(data) ? data : []))
          }}
        />
      )}
    </div>
  )
}
