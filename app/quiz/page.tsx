'use client'
import { useEffect, useState } from 'react'

interface Question {
  id: string; topic: string; questionText: string
  optionA: string; optionB: string; optionC: string; optionD: string
  correctAnswer: string; explanation?: string
}

const TOPICS = [
  'Alcohol, Drugs, and Driving', 'Hand Signals', 'Highway Driving',
  'Missouri Driver License Requirements', 'Parking Regulations', 'Pavement Markings',
  'Point System and Violations', 'Roundabouts', 'Rules of the Road',
  'Safe Driving', 'Sharing the Road', 'Traffic Signs and Signals',
]

const TOPIC_COUNTS: Record<string, number> = {
  'Rules of the Road': 15, 'Safe Driving': 18, 'Traffic Signs and Signals': 13,
  'Alcohol, Drugs, and Driving': 9, 'Sharing the Road': 10,
  'Missouri Driver License Requirements': 6, 'Highway Driving': 5,
  'Parking Regulations': 5, 'Pavement Markings': 5,
  'Point System and Violations': 8, 'Roundabouts': 3, 'Hand Signals': 3,
}

type QuizMode = 'home' | 'quiz' | 'result'

function QuizRunner({ questions, onDone }: {
  questions: Question[]; onDone: (score: number, total: number) => void
}) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)

  const q = questions[current]
  if (!q) return null

  const opts: { key: string; text: string }[] = [
    { key: 'A', text: q.optionA }, { key: 'B', text: q.optionB },
    { key: 'C', text: q.optionC }, { key: 'D', text: q.optionD },
  ]

  function selectAnswer(key: string) {
    if (revealed) return
    setSelected(key)
    setRevealed(true)
    if (key === q.correctAnswer) setScore(s => s + 1)
  }

  function next() {
    if (current + 1 >= questions.length) {
      onDone(score + (selected === q.correctAnswer ? 1 : 0), questions.length)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  const pct = Math.round((current / questions.length) * 100)

  return (
    <div style={{ padding: 20 }}>
      {/* Progress */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Question {current + 1} of {questions.length}</span>
          <span style={{ fontSize: 13, color: 'var(--accent-gold)', fontWeight: 700 }}>{score} correct</span>
        </div>
        <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent-blue)', borderRadius: 3, transition: 'width 0.3s' }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{q.topic}</div>
      </div>

      {/* Question */}
      <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.45, marginBottom: 20, color: 'var(--text-primary)' }}>
        {q.questionText}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {opts.map(opt => {
          let cls = 'quiz-option'
          if (revealed) {
            if (opt.key === q.correctAnswer) cls += ' correct'
            else if (opt.key === selected) cls += ' incorrect'
          } else if (opt.key === selected) {
            cls += ' selected'
          }
          return (
            <div key={opt.key} className={cls} onClick={() => selectAnswer(opt.key)}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>
                {opt.key}
              </div>
              <span style={{ fontSize: 15, fontWeight: 500 }}>{opt.text}</span>
              {revealed && opt.key === q.correctAnswer && (
                <span style={{ marginLeft: 'auto', color: 'var(--accent-green)', fontSize: 18 }}>✓</span>
              )}
              {revealed && opt.key === selected && opt.key !== q.correctAnswer && (
                <span style={{ marginLeft: 'auto', color: 'var(--accent-red)', fontSize: 18 }}>✗</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Explanation */}
      {revealed && q.explanation && (
        <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-blue)', marginBottom: 6 }}>Explanation</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{q.explanation}</div>
        </div>
      )}

      {revealed && (
        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 16 }} onClick={next}>
          {current + 1 >= questions.length ? 'See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  )
}

function ResultScreen({ score, total, topic, onRetry, onHome }: {
  score: number; total: number; topic: string | null; onRetry: () => void; onHome: () => void
}) {
  const pct = Math.round((score / total) * 100)
  const passed = pct >= 80
  useEffect(() => {
    fetch('/api/quiz/results', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, total, topic }),
    })
  }, [score, total, topic])

  return (
    <div style={{ padding: 30, textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>{passed ? '🎉' : '📚'}</div>
      <div style={{ fontFamily: 'Barlow Condensed', fontSize: '3.5rem', fontWeight: 800, color: passed ? 'var(--accent-green)' : 'var(--accent-gold)', lineHeight: 1 }}>
        {pct}%
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, marginTop: 8, marginBottom: 4 }}>
        {score} / {total} correct
      </div>
      <div style={{ fontSize: 15, color: passed ? 'var(--accent-green)' : 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>
        {passed ? '✓ Passing score! You\'re ready for the DMV.' : 'Keep studying — 80% needed to pass.'}
      </div>
      {topic && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Topic: {topic}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 300, margin: '0 auto' }}>
        <button className="btn-primary" style={{ justifyContent: 'center', fontSize: 16 }} onClick={onRetry}>
          Try Again
        </button>
        <button className="btn-secondary" style={{ justifyContent: 'center', fontSize: 15 }} onClick={onHome}>
          Back to Quiz Center
        </button>
      </div>
    </div>
  )
}

export default function QuizPage() {
  const [mode, setMode] = useState<QuizMode>('home')
  const [questions, setQuestions] = useState<Question[]>([])
  const [activeTopic, setActiveTopic] = useState<string | null>(null)
  const [lastScore, setLastScore] = useState({ score: 0, total: 0 })
  const [loadingQuiz, setLoadingQuiz] = useState(false)
  const [recentResults, setRecentResults] = useState<{ score: number; total: number; topic: string | null; createdAt: string }[]>([])
  const [quizType, setQuizType] = useState<'written' | 'signs' | 'driving'>('written')

  useEffect(() => {
    fetch('/api/quiz/results').then(r => r.json()).then(d => setRecentResults(Array.isArray(d) ? d.slice(0, 5) : []))
  }, [mode])

  async function startQuiz(topic: string | null, count = 25) {
    setLoadingQuiz(true)
    const url = topic ? `/api/quiz/questions?topic=${encodeURIComponent(topic)}&count=${count}` : `/api/quiz/questions?count=${count}`
    const qs = await fetch(url).then(r => r.json())
    setQuestions(Array.isArray(qs) ? qs : [])
    setActiveTopic(topic)
    setMode('quiz')
    setLoadingQuiz(false)
  }

  function handleDone(score: number, total: number) {
    setLastScore({ score, total })
    setMode('result')
  }

  if (mode === 'quiz') {
    return (
      <div>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setMode('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Quit
          </button>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.3rem', fontWeight: 800 }}>
            {activeTopic || 'Practice Test'}
          </div>
        </div>
        <QuizRunner questions={questions} onDone={handleDone} />
      </div>
    )
  }

  if (mode === 'result') {
    return (
      <div>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          <div className="page-title">Results</div>
        </div>
        <ResultScreen score={lastScore.score} total={lastScore.total} topic={activeTopic}
          onRetry={() => startQuiz(activeTopic)}
          onHome={() => setMode('home')} />
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Quiz Center</div>
        <div className="page-subtitle">Missouri DMV Test Prep</div>
      </div>

      <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Test type selector */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Test Types</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {(['written', 'signs', 'driving'] as const).map(type => (
              <button key={type} onClick={() => setQuizType(type)}
                style={{ padding: '12px 8px', borderRadius: 10, border: `1.5px solid ${quizType === type ? 'var(--accent-blue)' : 'var(--border)'}`, background: quizType === type ? 'rgba(59,130,246,0.12)' : 'var(--bg-card)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{type === 'written' ? '📝' : type === 'signs' ? '🛑' : '🚗'}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: quizType === type ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                  {type === 'written' ? 'Written Test' : type === 'signs' ? 'Road Signs' : 'Driving Test'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {type === 'written' ? 'DMV knowledge' : type === 'signs' ? 'Sign recognition' : 'Behind-wheel eval'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {quizType === 'written' && (
          <>
            {/* Practice test */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ fontSize: '1.2rem' }}>🎯</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Practice Test</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>25 questions, like the real test</div>
                </div>
              </div>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 16 }}
                onClick={() => startQuiz(null, 25)} disabled={loadingQuiz}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {loadingQuiz ? 'Loading...' : 'Start 25-Question Test'}
              </button>
              <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                Pass with 80% (20/25) to be ready for the DMV!
              </div>
            </div>

            {/* Topics */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Practice by Topic</div>
              <div className="card" style={{ overflow: 'hidden' }}>
                {TOPICS.map((topic, i) => (
                  <button key={topic} onClick={() => startQuiz(topic, TOPIC_COUNTS[topic] || 10)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: 'none', border: 'none', borderBottom: i < TOPICS.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{topic}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>
                        {TOPIC_COUNTS[topic] || '?'} Q
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {quizType === 'signs' && (
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🛑</div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Road Signs Quiz</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              Road signs questions are mixed into the written test. Practice the Written Test above to study sign recognition questions.
            </div>
            <button className="btn-primary" style={{ justifyContent: 'center', margin: '0 auto' }}
              onClick={() => startQuiz('Traffic Signs and Signals', 13)}>
              Start Signs Quiz
            </button>
          </div>
        )}

        {quizType === 'driving' && (
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🚗</div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Behind-the-Wheel Evaluation</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              Track driving skills from the Training tab. The driving test checklist covers all 8 phases of the curriculum.
            </div>
            <a href="/training" style={{ display: 'inline-flex' }}>
              <button className="btn-primary" style={{ justifyContent: 'center' }}>Go to Training →</button>
            </a>
          </div>
        )}

        {/* Your Stats */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Your Stats</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="stat-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
              <div>
                <div className="stat-number">{recentResults.length}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>Tests Taken</div>
              </div>
            </div>
            <div className="stat-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <div>
                <div className="stat-number">
                  {recentResults.length > 0
                    ? Math.round(recentResults.reduce((a, r) => a + (r.score / r.total) * 100, 0) / recentResults.length)
                    : 0}%
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>Avg Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent results */}
        {recentResults.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Recent Results</div>
            <div className="card" style={{ overflow: 'hidden' }}>
              {recentResults.map((r, i) => {
                const pct = Math.round((r.score / r.total) * 100)
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < recentResults.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{r.topic || 'Practice Test'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {r.score}/{r.total}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Barlow Condensed', fontSize: '1.3rem', fontWeight: 800, color: pct >= 80 ? 'var(--accent-green)' : 'var(--accent-gold)' }}>
                      {pct}%
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
