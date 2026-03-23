'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Countdown from '@/components/Countdown'
import ProgressBar from '@/components/ProgressBar'

type Status = 'not_started' | 'in_progress' | 'completed'
type Filter = 'all' | 'not_started' | 'in_progress' | 'completed'

interface Skill {
  id: string; title: string; description: string; orderIndex: number
  progress: { status: Status; completedAt?: string } | null
}
interface Phase {
  id: string; orderIndex: number; title: string; description: string
  skills: Skill[]; completed: number; inProgress: number
}
interface Driver { id: string; name: string; birthDate: string; totalSkills: number; completed: number; inProgress: number }
interface DriverStats { totalSkills: number; completed: number; inProgress: number; remaining: number }

const STATUS_ICON: Record<Status, string> = { completed: '✓', in_progress: '⏳', not_started: '○' }
const STATUS_COLOR: Record<Status, string> = { completed: 'var(--accent-green)', in_progress: 'var(--accent-gold)', not_started: 'var(--text-muted)' }
const STATUS_CYCLE: Record<Status, Status> = { not_started: 'in_progress', in_progress: 'completed', completed: 'not_started' }

function TrainingContent() {
  const searchParams = useSearchParams()
  const initDriver = searchParams.get('driver') || ''

  const [drivers, setDrivers] = useState<Driver[]>([])
  const [selectedId, setSelectedId] = useState(initDriver)
  const [phases, setPhases] = useState<Phase[]>([])
  const [driverInfo, setDriverInfo] = useState<{ driver: Driver; stats: DriverStats } | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [openPhases, setOpenPhases] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/drivers').then(r => r.json()).then(data => {
      const list = Array.isArray(data) ? data : []
      setDrivers(list)
      setSelectedId((current) => current || list[0]?.id || '')
    })
  }, [])

  useEffect(() => {
    if (!selectedId) return
    void (async () => {
      try {
        const response = await fetch(`/api/drivers/${selectedId}`)
        const data = await response.json()
        setPhases(data.phases || [])
        setDriverInfo({ driver: data.driver, stats: data.stats })
      } finally {
        setLoading(false)
      }
    })()
  }, [selectedId])

  async function updateSkill(skillId: string, status: Status) {
    await fetch(`/api/drivers/${selectedId}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillId, status }),
    })
    setPhases(prev => prev.map(phase => ({
      ...phase,
      skills: phase.skills.map(s =>
        s.id === skillId
          ? { ...s, progress: { ...s.progress, status, completedAt: status === 'completed' ? new Date().toISOString() : undefined } }
          : s
      ),
      completed: phase.skills.filter(s => (s.id === skillId ? status : s.progress?.status || 'not_started') === 'completed').length,
      inProgress: phase.skills.filter(s => (s.id === skillId ? status : s.progress?.status || 'not_started') === 'in_progress').length,
    })))
  }

  function togglePhase(id: string) {
    setOpenPhases(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filterCounts = {
    all: phases.reduce((a, p) => a + p.skills.length, 0),
    not_started: phases.reduce((a, p) => a + p.skills.filter(s => !s.progress || s.progress.status === 'not_started').length, 0),
    in_progress: phases.reduce((a, p) => a + p.skills.filter(s => s.progress?.status === 'in_progress').length, 0),
    completed: phases.reduce((a, p) => a + p.skills.filter(s => s.progress?.status === 'completed').length, 0),
  }

  const stats = driverInfo?.stats
  const totalSkills = stats?.totalSkills || 0

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Training</div>
        <div className="page-subtitle">Track driving skills progress</div>
      </div>

      <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Driver selector */}
        {drivers.length > 1 && (
          <select className="input" value={selectedId} onChange={e => setSelectedId(e.target.value)} style={{ fontWeight: 600 }}>
            {drivers.map(d => (
              <option key={d.id} value={d.id}>{d.name} — {d.completed} of {d.totalSkills} complete</option>
            ))}
          </select>
        )}
        {drivers.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>🚦</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No drivers yet</div>
            <Link href="/drivers" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>+ Add a Driver</Link>
          </div>
        )}

        {driverInfo && (
          <>
            {/* Countdown */}
            <div className="card" style={{ padding: 16 }}>
              <Countdown birthDate={driverInfo.driver.birthDate} />
            </div>

            {/* Phase scrubber */}
            <div className="card" style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: 0, overflowX: 'auto', paddingBottom: 2 }}>
                {phases.map((phase) => {
                  const pct = phase.skills.length > 0 ? (phase.completed / phase.skills.length) : 0
                  const isActive = openPhases.has(phase.id)
                  return (
                    <button key={phase.id} onClick={() => togglePhase(phase.id)}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '6px 10px', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: pct === 1 ? 'var(--accent-green)' : phase.inProgress > 0 ? 'var(--accent-gold)' : isActive ? 'var(--accent-blue)' : 'var(--bg-elevated)', color: (pct === 1 || phase.inProgress > 0) ? '#070d1a' : isActive ? 'white' : 'var(--text-muted)', fontFamily: 'Barlow Condensed', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {phase.orderIndex}
                      </div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)' }}>{Math.round(pct * 100)}%</div>
                    </button>
                  )
                })}
              </div>
              <div style={{ marginTop: 8 }}>
                <ProgressBar value={stats?.completed || 0} max={totalSkills} height={5} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                  <span>{stats?.completed || 0} / {totalSkills}</span>
                  <span>{totalSkills > 0 ? Math.round(((stats?.completed || 0) / totalSkills) * 100) : 0}%</span>
                </div>
              </div>
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
              {(['all', 'not_started', 'in_progress', 'completed'] as Filter[]).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${filter === f ? 'var(--accent-blue)' : 'var(--border)'}`, background: filter === f ? 'rgba(59,130,246,0.15)' : 'transparent', color: filter === f ? 'var(--accent-blue)' : 'var(--text-muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0 }}>
                  {f === 'all' ? `All (${filterCounts.all})` : f === 'not_started' ? `Not Started (${filterCounts.not_started})` : f === 'in_progress' ? `In Progress (${filterCounts.in_progress})` : `Completed (${filterCounts.completed})`}
                </button>
              ))}
            </div>

            {/* Phases */}
            {loading && <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>Loading...</div>}
            {!loading && phases.map(phase => {
              const filteredSkills = phase.skills.filter(s => {
                if (filter === 'all') return true
                const status = s.progress?.status || 'not_started'
                return status === filter
              })
              if (filter !== 'all' && filteredSkills.length === 0) return null
              const isOpen = openPhases.has(phase.id)
              const pct = phase.skills.length > 0 ? Math.round((phase.completed / phase.skills.length) * 100) : 0

              return (
                <div key={phase.id} className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }} onClick={() => togglePhase(phase.id)}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: pct === 100 ? 'var(--accent-green)' : phase.inProgress > 0 ? 'var(--accent-gold)' : 'var(--bg-elevated)', color: (pct === 100 || phase.inProgress > 0) ? '#070d1a' : 'var(--text-muted)', fontFamily: 'Barlow Condensed', fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {phase.orderIndex}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{phase.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{phase.description}</div>
                      <div style={{ marginTop: 6 }}><ProgressBar value={phase.completed} max={phase.skills.length} /></div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{phase.completed} of {phase.skills.length} tasks complete</div>
                    </div>
                    {isOpen
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>}
                  </div>
                  {isOpen && (
                    <div style={{ borderTop: '1px solid var(--border)' }}>
                      {filteredSkills.map((skill, si) => {
                        const status: Status = skill.progress?.status as Status || 'not_started'
                        return (
                          <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: si < filteredSkills.length - 1 ? '1px solid var(--border)' : 'none' }}>
                            <button onClick={() => updateSkill(skill.id, STATUS_CYCLE[status])}
                              style={{ width: 28, height: 28, borderRadius: 8, border: `1.5px solid ${STATUS_COLOR[status]}`, background: status === 'completed' ? STATUS_COLOR[status] : 'transparent', color: status === 'completed' ? '#070d1a' : STATUS_COLOR[status], fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {STATUS_ICON[status]}
                            </button>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: status === 'completed' ? 'line-through' : 'none' }}>{skill.title}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{skill.description}</div>
                              {status === 'completed' && skill.progress?.completedAt && (
                                <div style={{ fontSize: 11, color: 'var(--accent-green)', marginTop: 2 }}>
                                  ✓ {new Date(skill.progress.completedAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}

export default function TrainingPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20, color: 'var(--text-muted)' }}>Loading...</div>}>
      <TrainingContent />
    </Suspense>
  )
}
