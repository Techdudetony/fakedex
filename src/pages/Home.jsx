import { useState, useMemo } from 'react'
import fakemon from '../data/fakemon.json'
import MonCard from '../components/MonCard'
import Navbar from '../components/Navbar'
import MonModal from '../components/MonModal'

export default function Home() {
  const [search, setSearch] = useState('')
  const [selectedMon, setSelectedMon] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return fakemon
    return fakemon.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.dexNum.includes(q) ||
      m.type1.toLowerCase().includes(q) ||
      (m.type2 && m.type2.toLowerCase().includes(q)) ||
      m.species.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar total={fakemon.length} />

      {/* Search bar */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px 24px 16px',
      }}>
        <input
          type="text"
          placeholder="Search by name, type, or dex number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '480px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '10px 16px',
            color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            letterSpacing: '0.04em',
            outline: 'none',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--blue)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <span style={{
          marginLeft: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-faint)',
          letterSpacing: '0.06em',
        }}>
          {filtered.length} / {fakemon.length}
        </span>
      </div>

      {/* Grid */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px 48px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '12px',
      }}>
        {filtered.map((mon, i) => (
          <div
            key={mon.id}
            style={{
              animation: 'fadeInUp 0.3s ease both',
              animationDelay: `${Math.min(i * 0.02, 0.6)}s`,
            }}
          >
            <MonCard mon={mon} onClick={setSelectedMon} />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          color: 'var(--text-faint)',
          letterSpacing: '0.06em',
        }}>
          NO RESULTS FOR "{search.toUpperCase()}"
        </div>
      )}

      {/* Full detail modal */}
      {selectedMon && (
        <MonModal mon={selectedMon} onClose={() => setSelectedMon(null)} />
      )}
    </div>
  )
}