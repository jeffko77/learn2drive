'use client'
import { useCallback, useEffect, useState, use } from 'react'
import Link from 'next/link'
import Countdown from '@/components/Countdown'
import ProgressBar from '@/components/ProgressBar'

type Status = 'not_started' | 'in_progress' | 'completed'

interface Skill {
  id: string; title: string; description: string; orderIndex: number
  progress: { status: Status; notes?: string; feedback?: string; completedAt?: string } | null
}
interface Phase {
  id: string; orderIndex: number; title: string; description: string
  skills: Skill[]; completed: number; inProgress: number
}
interface Driver { id: string; name: string; birthDate: string; startDate: string }
interface Stats { totalSkills: number; completed: number; inProgress: number; remaining: number }
interface Log { id: string; date: string; duration: number; location?: string; notes?: string }
interface Note { id: string; content: string; createdAt: string }

const STATUS_CYCLE: Record<Status, Status> = {
  not_started: 'in_progress',
  in_progress: 'completed',
  completed: 'not_started',
}
const STATUS_ICON: Record<Status, string> = {
  completed: '✓', in_progress: '⏳', not_started: '○',
}
const STATUS_COLOR: Record<Status, string> = {
  completed: 'var(--accent-green)', in_progress: 'var(--accent-gold)', not_started: 'var(--text-muted)',
}

function SkillRow({ skill, onUpdate }: { skill: Skill; onUpdate: (skillId: string, status: Status) => void }) {
  const [expanded, setExpanded] = useState(false)
  const status: Status = skill.progress?.status as Status || 'not_started'

  function cycleStatus(e: React.MouseEvent) {
    e.stopPropagation()
    onUpdate(skill.id, STATUS_CYCLE[status])
  }

  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}>
        <button onClick={cycleStatus}
          style={{ width: 28, height: 28, borderRadius: 8, border: `1.5px solid ${STATUS_COLOR[status]}`, background: status === 'completed' ? STATUS_COLOR[status] : 'transparent', color: status === 'completed' ? '#070d1a' : STATUS_COLOR[status], fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
          {STATUS_ICON[status]}
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: status === 'completed' ? 'line-through' : 'none' }}>
            {skill.title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{skill.description}</div>
          {status === 'completed' && skill.progress?.completedAt && (
            <div style={{ fontSize: 11, color: 'var(--accent-green)', marginTop: 2 }}>
              Completed {new Date(skill.progress.completedAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
            </div>
          )}
        </div>
        {expanded
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        }
      </div>
      {expanded && (
        <div style={{ padding: '0 16px 12px', marginLeft: 40 }}>
          {skill.progress?.notes && (
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: '8px 12px', marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Notes</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{skill.progress.notes}</div>
            </div>
          )}
          {skill.progress?.feedback && (
            <div style={{ background: 'rgba(240,180,41,0.06)', border: '1px solid rgba(240,180,41,0.15)', borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-gold-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Feedback</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{skill.progress.feedback}</div>
            </div>
          )}
          {!skill.progress?.notes && !skill.progress?.feedback && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>Tap status icon to cycle: not started → in progress → completed</div>
          )}
        </div>
      )}
    </div>
  )
}

function PhaseAccordion({ phase, onUpdate }: { phase: Phase; onUpdate: (skillId: string, status: Status) => void }) {
  const [open, setOpen] = useState(false)
  const pct = phase.skills.length > 0 ? Math.round((phase.completed / phase.skills.length) * 100) : 0
  const allDone = pct === 100

  return (
    <div className="card" style={{ overflow: 'hidden', marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: allDone ? 'var(--accent-green)' : phase.inProgress > 0 ? 'var(--accent-gold)' : 'var(--bg-elevated)', color: allDone ? '#070d1a' : phase.inProgress > 0 ? '#070d1a' : 'var(--text-muted)', fontFamily: 'Barlow Condensed', fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {phase.orderIndex}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{phase.title}</span>
            {allDone && <span style={{ fontSize: 14 }}>✅</span>}
            {!allDone && phase.inProgress > 0 && <span style={{ fontSize: 14 }}>⏳</span>}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{phase.description}</div>
          <div style={{ marginTop: 6 }}>
            <ProgressBar value={phase.completed} max={phase.skills.length} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{phase.completed} of {phase.skills.length} tasks complete</div>
        </div>
        {open
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        }
      </div>
      {open && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {phase.skills.map(skill => (
            <SkillRow key={skill.id} skill={skill} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [driver, setDriver] = useState<Driver | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [phases, setPhases] = useState<Phase[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [tab, setTab] = useState<'training' | 'logs' | 'notes'>('training')
  const [loading, setLoading] = useState(true)
  // Log form
  const [logDuration, setLogDuration] = useState('30')
  const [logLocation, setLogLocation] = useState('')
  const [logNotes, setLogNotes] = useState('')
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0])
  const [savingLog, setSavingLog] = useState(false)
  // Note form
  const [noteContent, setNoteContent] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  // Edit modal
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBirth, setEditBirth] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/drivers/${id}`)
      if (!res.ok) return
      const data = await res.json()
      setDriver(data.driver)
      setStats(data.stats)
      setPhases(data.phases)
      setLogs(data.drivingLogs)
      setNotes(data.notes)
      setEditName(data.driver.name)
      setEditBirth(new Date(data.driver.birthDate).toISOString().split('T')[0])
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { void load() }, [load])

  async function updateSkill(skillId: string, status: Status) {
    await fetch(`/api/drivers/${id}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillId, status }),
    })
    // Optimistic update
    setPhases(prev => prev.map(phase => ({
      ...phase,
      skills: phase.skills.map(skill =>
        skill.id === skillId
          ? { ...skill, progress: { ...skill.progress, status, completedAt: status === 'completed' ? new Date().toISOString() : undefined } }
          : skill
      ),
      completed: phase.skills.filter(s => {
        const newStatus = s.id === skillId ? status : (s.progress?.status || 'not_started')
        return newStatus === 'completed'
      }).length,
      inProgress: phase.skills.filter(s => {
        const newStatus = s.id === skillId ? status : (s.progress?.status || 'not_started')
        return newStatus === 'in_progress'
      }).length,
    })))
    setStats(prev => {
      if (!prev) return prev
      const oldStatus = phases.flatMap(p => p.skills).find(s => s.id === skillId)?.progress?.status || 'not_started'
      let { completed, inProgress, remaining } = prev
      if (oldStatus === 'completed') completed--
      else if (oldStatus === 'in_progress') inProgress--
      else remaining--
      if (status === 'completed') completed++
      else if (status === 'in_progress') inProgress++
      else remaining++
      return { ...prev, completed, inProgress, remaining }
    })
  }

  async function addLog() {
    if (!logDuration) return
    setSavingLog(true)
    const res = await fetch(`/api/drivers/${id}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: logDate, duration: parseInt(logDuration), location: logLocation, notes: logNotes }),
    })
    const log = await res.json()
    setLogs(prev => [log, ...prev])
    setLogDuration('30'); setLogLocation(''); setLogNotes('')
    setSavingLog(false)
  }

  async function deleteLog(logId: string) {
    await fetch(`/api/drivers/${id}/logs`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ logId }) })
    setLogs(prev => prev.filter(l => l.id !== logId))
  }

  async function addNote() {
    if (!noteContent.trim()) return
    setSavingNote(true)
    const res = await fetch(`/api/drivers/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: noteContent }),
    })
    const note = await res.json()
    setNotes(prev => [note, ...prev])
    setNoteContent('')
    setSavingNote(false)
  }

  async function deleteNote(noteId: string) {
    await fetch(`/api/drivers/${id}/notes`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ noteId }) })
    setNotes(prev => prev.filter(n => n.id !== noteId))
  }

  async function saveEdit() {
    await fetch(`/api/drivers/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: editName, birthDate: editBirth }) })
    setDriver(prev => prev ? { ...prev, name: editName, birthDate: editBirth } : prev)
    setEditing(false)
  }

  const totalDrivingMinutes = logs.reduce((a, l) => a + l.duration, 0)

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-muted)' }}>Loading...</div>
  if (!driver || !stats) return <div style={{ padding: 20, color: 'var(--text-muted)' }}>Driver not found. <Link href="/drivers" style={{ color: 'var(--accent-blue)' }}>Back to Drivers</Link></div>

  return (
    <div>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/drivers" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Drivers
        </Link>
        <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Driver name & training since */}
        <div>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: '2rem', fontWeight: 800 }}>{driver.name}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Training since {new Date(driver.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Countdown */}
        <div className="card" style={{ padding: 16 }}>
          <Countdown birthDate={driver.birthDate} />
        </div>

        {/* Stats */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Overall Progress</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{stats.completed} / {stats.totalSkills}</span>
            </div>
            <ProgressBar value={stats.completed} max={stats.totalSkills} height={6} />
            <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              {stats.totalSkills > 0 ? Math.round((stats.completed / stats.totalSkills) * 100) : 0}%
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div style={{ textAlign: 'center', padding: '10px 8px', background: 'rgba(34,197,94,0.08)', borderRadius: 8 }}>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-green)' }}>{stats.completed}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Completed</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px 8px', background: 'rgba(240,180,41,0.08)', borderRadius: 8 }}>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{stats.inProgress}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>In Progress</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px 8px', background: 'var(--bg-elevated)', borderRadius: 8 }}>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{stats.remaining}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Remaining</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-bar">
          {(['training', 'logs', 'notes'] as const).map(t => (
            <button key={t} className={`tab-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}
              style={{ textTransform: 'capitalize' }}>
              {t === 'training' ? 'Training' : t === 'logs' ? `Driving Log${logs.length ? ` (${logs.length})` : ''}` : `Notes${notes.length ? ` (${notes.length})` : ''}`}
            </button>
          ))}
        </div>

        {/* Training Tab */}
        {tab === 'training' && (
          <div>
            {phases.map(phase => (
              <PhaseAccordion key={phase.id} phase={phase} onUpdate={updateSkill} />
            ))}
          </div>
        )}

        {/* Driving Log Tab */}
        {tab === 'logs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Log Driving Session</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Date</label>
                    <input className="input" type="date" value={logDate} onChange={e => setLogDate(e.target.value)} style={{ fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Duration (min)</label>
                    <input className="input" type="number" value={logDuration} onChange={e => setLogDuration(e.target.value)} min="1" style={{ fontSize: 13 }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Location (optional)</label>
                  <input className="input" placeholder="e.g. Neighborhood streets" value={logLocation} onChange={e => setLogLocation(e.target.value)} style={{ fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Notes (optional)</label>
                  <textarea className="input" placeholder="How did it go?" value={logNotes} onChange={e => setLogNotes(e.target.value)} rows={2} style={{ resize: 'vertical', fontSize: 13 }} />
                </div>
                <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={addLog} disabled={savingLog}>
                  {savingLog ? 'Saving...' : '+ Log Session'}
                </button>
              </div>
            </div>

            {logs.length > 0 && (
              <div className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Session History</div>
                  <div style={{ fontSize: 13, color: 'var(--accent-gold)', fontWeight: 700 }}>
                    {Math.floor(totalDrivingMinutes / 60)}h {totalDrivingMinutes % 60}m total
                  </div>
                </div>
                {logs.map((log, i) => (
                  <div key={log.id} style={{ padding: '10px 0', borderBottom: i < logs.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{log.duration} min</span>
                        {log.location && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {log.location}</span>}
                      </div>
                      {log.notes && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{log.notes}</div>}
                    </div>
                    <button onClick={() => deleteLog(log.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {logs.length === 0 && (
              <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>No driving sessions logged yet</div>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {tab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Add Note</div>
              <textarea className="input" placeholder="Instructor notes, observations, feedback..." value={noteContent} onChange={e => setNoteContent(e.target.value)} rows={3} style={{ resize: 'vertical', marginBottom: 10 }} />
              <button className="btn-primary" style={{ justifyContent: 'center', width: '100%' }} onClick={addNote} disabled={savingNote || !noteContent.trim()}>
                {savingNote ? 'Saving...' : '+ Add Note'}
              </button>
            </div>
            {notes.map((note) => (
              <div key={note.id} className="card" style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                    {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{note.content}</div>
                </div>
                <button onClick={() => deleteNote(note.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                </button>
              </div>
            ))}
            {notes.length === 0 && (
              <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>No notes yet</div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="modal-sheet" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.4rem', fontWeight: 800 }}>Edit Driver</div>
              <button onClick={() => setEditing(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Name</label>
                <input className="input" value={editName} onChange={e => setEditName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Date of Birth</label>
                <input className="input" type="date" value={editBirth} onChange={e => setEditBirth(e.target.value)} />
              </div>
              <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
