import { useState, useMemo } from 'react'
import fakemon from '../data/fakemon.json'
import MonCard from '../components/MonCard'
import Navbar from '../components/Navbar'
import MonModal from '../components/MonModal'
import TypeBadge from '../components/TypeBadge'
import { getTypeColor } from '../utils/typeColors'

// Derive all unique types present in the dex, sorted alphabetically
const ALL_TYPES = [...new Set(
  fakemon.flatMap(m => [m.type1, m.type2].filter(Boolean))
)].sort()

// Sort options
const SORT_OPTIONS = [
  { value: 'id',    label: 'DEX #'  },
  { value: 'name',  label: 'NAME'   },
  { value: 'bst',   label: 'BST'    },
  { value: 'hp',    label: 'HP'     },
  { value: 'atk',   label: 'ATK'    },
  { value: 'def',   label: 'DEF'    },
  { value: 'spAtk', label: 'SP.ATK' },
  { value: 'spDef', label: 'SP.DEF' },
  { value: 'spd',   label: 'SPD'    },
]

export default function Home() {
  const [search,      setSearch]      = useState('')
  const [activeTypes,  setActiveTypes]  = useState(new Set())   // null = no filter
  const [sortBy,      setSortBy]      = useState('id')
  const [sortDir,     setSortDir]     = useState('asc')  // 'asc' | 'desc'
  const [selectedMon, setSelectedMon] = useState(null)

  // Toggle sort — clicking the same key flips direction
  const handleSort = (value) => {
    if (sortBy === value) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(value)
      setSortDir(value === 'name' ? 'asc' : 'desc') // name defaults asc, stats default desc
    }
  }

  // Toggle type filter — clicking the same type again clears it
  const handleType = (type) => {
    setActiveTypes(prev => {
      const next = new Set(prev)
      next.has(type) ? next.delete(type) : next.add(type)
      return next
    })
  }

  const clearAll = () => {
    setSearch('')
    setActiveTypes(new Set())
    setSortBy('id')
    setSortDir('asc')
  }

  const filtered = useMemo(() => {
    let result = [...fakemon]

    // Text search
    const q = search.toLowerCase().trim()
    if (q) {
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.dexNum.includes(q) ||
        m.type1.toLowerCase().includes(q) ||
        (m.type2 && m.type2.toLowerCase().includes(q)) ||
        m.species.toLowerCase().includes(q)
      )
    }

    // Type filter
    if (activeTypes.size > 0) {
      result = result.filter(m =>
        activeTypes.has(m.type1) || activeTypes.has(m.type2)
      )
    }

    // Sort
    result.sort((a, b) => {
      let valA, valB

      if (sortBy === 'name') {
        valA = a.name.toLowerCase()
        valB = b.name.toLowerCase()
        return sortDir === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA)
      }

      if (sortBy === 'id') {
        valA = a.id
        valB = b.id
      } else if (sortBy === 'bst') {
        valA = a.stats.bst
        valB = b.stats.bst
      } else {
        valA = a.stats[sortBy]
        valB = b.stats[sortBy]
      }

      return sortDir === 'asc' ? valA - valB : valB - valA
    })

    return result
  }, [search, activeTypes, sortBy, sortDir])

  const isFiltered = search || activeTypes.size > 0 || sortBy !== 'id'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar total={fakemon.length} />

      {/* ── Controls bar ────────────────────────────────────────── */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px 24px 0',
      }}>

        {/* Row 1 — Search + result count + clear */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '14px',
          flexWrap: 'wrap',
        }}>
          <input
            type="text"
            placeholder="Search by name, type, species, or dex #..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: '1',
              minWidth: '220px',
              maxWidth: '420px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '9px 14px',
              color: 'var(--text)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.04em',
              outline: 'none',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--blue)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />

          {/* Result count */}
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-faint)',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
          }}>
            {filtered.length} / {fakemon.length}
          </span>

          {/* Clear all — only shows when something is active */}
          {isFiltered && (
            <button
              onClick={clearAll}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
                color: 'var(--red)',
                background: 'none',
                border: '1px solid var(--red-dim)',
                borderRadius: '4px',
                padding: '5px 12px',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(204,18,18,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              CLEAR ALL ×
            </button>
          )}
        </div>

        {/* Row 2 — Type filter pills */}
        {/* Active type count badge */}
        {activeTypes.size > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px',
            width: '100%',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: 'var(--text-dim)',
              letterSpacing: '0.08em',
            }}>
              FILTERING BY
            </span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.9rem',
              color: 'var(--red-bright)',
              letterSpacing: '0.06em',
            }}>
              {activeTypes.size} {activeTypes.size === 1 ? 'TYPE' : 'TYPES'}
            </span>
          </div>
        )}

        {/* Type pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '14px',
        }}>
          {ALL_TYPES.map(type => {
            const { bg, text } = getTypeColor(type)
            const isActive = activeTypes.has(type)
            return (
              <button
                key={type}
                onClick={() => handleType(type)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  padding: '4px 10px',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  transition: 'opacity 0.15s, transform 0.1s',
                  backgroundColor: isActive ? bg : 'var(--surface-2)',
                  color: isActive ? text : 'var(--text-dim)',
                  outline: isActive ? `2px solid ${bg}` : '2px solid transparent',
                  outlineOffset: '2px',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.backgroundColor = bg + '44'
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'var(--surface-2)'
                }}
              >
                {/* Checkmark on active */}
                {isActive && (
                  <span style={{ fontSize: '0.55rem', lineHeight: 1 }}>✓</span>
                )}
                {type}
              </button>
            )
          })}
        </div>

        {/* Row 3 — Sort controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            color: 'var(--text-faint)',
            letterSpacing: '0.1em',
            marginRight: '2px',
          }}>
            SORT
          </span>
          {SORT_OPTIONS.map(opt => {
            const isActive = sortBy === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => handleSort(opt.value)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.06em',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: `1px solid ${isActive ? 'var(--blue)' : 'var(--border)'}`,
                  background: isActive ? 'rgba(58,111,216,0.12)' : 'var(--surface)',
                  color: isActive ? 'var(--blue-bright)' : 'var(--text-dim)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {opt.label}
                {/* Arrow indicator — only on active sort */}
                {isActive && (
                  <span style={{ fontSize: '0.55rem' }}>
                    {sortDir === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────────── */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px 48px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
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

      {/* ── Empty state ──────────────────────────────────────────── */}
      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--text-faint)',
            letterSpacing: '0.06em',
            marginBottom: '12px',
          }}>
            NO RESULTS
          </div>
          <button
            onClick={clearAll}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              color: 'var(--red)',
              background: 'none',
              border: '1px solid var(--red-dim)',
              borderRadius: '4px',
              padding: '8px 20px',
              cursor: 'pointer',
            }}
          >
            CLEAR FILTERS
          </button>
        </div>
      )}

      {/* ── Modal ───────────────────────────────────────────────── */}
      {selectedMon && (
        <MonModal mon={selectedMon} 
        onClose={() => setSelectedMon(null)}
        onNavigate={(nextMon) => setSelectedMon(nextMon)} 
      />
    )}
    </div>
  )
}