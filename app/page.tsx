'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProgressBar from '@/components/ProgressBar'

interface Driver {
  id: string; name: string; birthDate: string; startDate: string
  totalSkills: number; completed: number; inProgress: number
}

export default function HomePage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [quizCount, setQuizCount] = useState(0)

  useEffect(() => {
    Promise.all([
      fetch('/api/drivers').then(r => r.json()),
      fetch('/api/quiz/questions?count=1000').then(r => r.json()),
    ]).then(([d, q]) => {
      setDrivers(Array.isArray(d) ? d : [])
      setQuizCount(Array.isArray(q) ? q.length : 0)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const totalSkills = drivers[0]?.totalSkills || 0
  const totalCompleted = drivers.reduce((a, d) => a + d.completed, 0)
  const overallPct = drivers.length > 0 && totalSkills > 0
    ? Math.round((totalCompleted / (drivers.length * totalSkills)) * 100) : 0

  return (
    <div>
      {/* Header */}
      <div style={{ padding: '24px 20px 16px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '2rem', marginBottom: 4 }}>🚗</div>
        <div style={{ fontFamily: 'Barlow Condensed', fontSize: '2rem', fontWeight: 800, letterSpacing: '0.05em' }}>
          Learn2Drive
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>
          Teen Driver Training Tracker
        </div>
        <div style={{ width: 40, height: 3, background: 'var(--accent-gold)', borderRadius: 2, margin: '10px auto 0' }} />
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="stat-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <div>
              <div className="stat-number">{drivers.length}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>Active Drivers</div>
            </div>
          </div>
          <div className="stat-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <div>
              <div className="stat-number">{overallPct}%</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>Overall Progress</div>
            </div>
          </div>
          <div className="stat-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <div>
              <div className="stat-number">{totalCompleted}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>Skills Mastered</div>
            </div>
          </div>
          <div className="stat-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <div>
              <div className="stat-number">{quizCount}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>Quiz Questions</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
            Quick Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/drivers" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>Add New Driver</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Create a new driver profile with training checklist</div>
              </div>
            </Link>
            <Link href="/quiz" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', textDecoration: 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(240,180,41,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>Take Practice Quiz</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Study for the Missouri written driver&apos;s test</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Drivers */}
        {drivers.length > 0 && (
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Recent Drivers
              </div>
              <Link href="/drivers" style={{ fontSize: 13, color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>
                View All
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {drivers.slice(0, 3).map((driver, i) => {
                const pct = driver.totalSkills > 0 ? Math.round((driver.completed / driver.totalSkills) * 100) : 0
                return (
                  <Link key={driver.id} href={`/drivers/${driver.id}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < Math.min(drivers.length, 3) - 1 ? '1px solid var(--border)' : 'none', textDecoration: 'none' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{driver.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 6 }}>{driver.completed} of {driver.totalSkills} skills completed</div>
                      <ProgressBar value={driver.completed} max={driver.totalSkills} />
                    </div>
                    <div style={{ marginLeft: 16, color: 'var(--accent-gold)', fontFamily: 'Barlow Condensed', fontSize: '1.2rem', fontWeight: 800 }}>
                      {pct}%
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {drivers.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🚦</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-secondary)', marginBottom: 8 }}>No drivers yet</div>
            <div style={{ fontSize: 14 }}>Add your first driver to get started</div>
          </div>
        )}
      </div>
    </div>
  )
}
