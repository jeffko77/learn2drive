interface ProgressBarProps {
  value: number
  max: number
  color?: string
  height?: number
  showLabel?: boolean
}

export default function ProgressBar({ value, max, color, height = 4, showLabel = false }: ProgressBarProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  const barColor = color || (pct === 100 ? 'var(--accent-green)' : pct > 0 ? 'var(--accent-gold)' : 'var(--border)')

  return (
    <div>
      <div style={{ height, background: 'var(--border)', borderRadius: height / 2, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: barColor,
            borderRadius: height / 2,
            transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{value} / {max}</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pct}%</span>
        </div>
      )}
    </div>
  )
}
