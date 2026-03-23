'use client'
import { useMemo } from 'react'

interface CountdownProps {
  birthDate: string | Date
  targetAge?: number
}

export default function Countdown({ birthDate, targetAge = 16 }: CountdownProps) {
  const { months, days, totalDays, age, targetDate } = useMemo(() => {
    const birth = new Date(birthDate)
    const target = new Date(birth)
    target.setFullYear(birth.getFullYear() + targetAge)
    const now = new Date()

    const totalDays = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    const age = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25))

    let months = 0
    let remainDays = totalDays
    if (totalDays > 0) {
      months = Math.floor(totalDays / 30)
      remainDays = totalDays % 30
    }

    return {
      months,
      days: remainDays,
      totalDays,
      age,
      targetDate: target.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    }
  }, [birthDate, targetAge])

  if (totalDays <= 0) {
    return (
      <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem' }}>🎉</div>
        <div style={{ color: 'var(--accent-green)', fontFamily: 'Barlow Condensed', fontSize: '1.3rem', fontWeight: 800 }}>License eligible!</div>
        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>They turned {targetAge} on {targetDate}</div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: '1.1rem' }}>🎂</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>16th Birthday Countdown</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{targetDate}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 10 }}>
        {months > 0 && (
          <div className="countdown-box">
            <div className="countdown-number">{months}</div>
            <div className="countdown-label">{months === 1 ? 'Month' : 'Months'}</div>
          </div>
        )}
        <div className="countdown-box">
          <div className="countdown-number">{days}</div>
          <div className="countdown-label">{days === 1 ? 'Day' : 'Days'}</div>
        </div>
      </div>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        {age} years old &bull; {totalDays} days to go!
      </div>
    </div>
  )
}
