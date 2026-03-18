import { useState } from 'react'
import fakemon from '../data/fakemon.json'
import TypeBadge from './TypeBadge'

const findByName = (name) =>
  fakemon.find(m => m.name.toLowerCase() === name.toLowerCase()) ?? null

// ── Small clickable evo card ──────────────────────────────────────────────
function EvoCard({ mon, onClick, isCurrentMon }) {
  const [imgError, setImgError] = useState(false)
  if (!mon) return null

  return (
    <button
      onClick={() => !isCurrentMon && onClick(mon)}
      style={{
        background: isCurrentMon ? 'rgba(204,18,18,0.08)' : 'var(--surface)',
        border: `1px solid ${isCurrentMon ? 'var(--red-dim)' : 'var(--border)'}`,
        borderRadius: '8px',
        padding: '10px 8px',
        cursor: isCurrentMon ? 'default' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '5px',
        width: '130px',
        flexShrink: 0,
        transition: 'border-color 0.15s, transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => {
        if (!isCurrentMon) {
          e.currentTarget.style.borderColor = 'var(--red)'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(204,18,18,0.2)'
        }
      }}
      onMouseLeave={e => {
        if (!isCurrentMon) {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {/* Sprite */}
      <div style={{
        width: '72px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {!imgError ? (
          <img
            src={mon.sprite}
            alt={mon.name}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              imageRendering: 'pixelated',
              opacity: isCurrentMon ? 1 : 0.85,
            }}
          />
        ) : (
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            color: 'var(--text-faint)',
          }}>?</span>
        )}
      </div>

      {/* Name */}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: isCurrentMon ? 'var(--red-bright)' : 'var(--text)',
        letterSpacing: '0.02em',
        textAlign: 'center',
        lineHeight: 1.3,
        wordBreak: 'break-word',
        width: '100%',
      }}>
        {mon.name}
      </span>

      {/* Types */}
      <div style={{
        display: 'flex',
        gap: '2px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <TypeBadge type={mon.type1} />
        {mon.type2 && mon.type2 !== '-' && <TypeBadge type={mon.type2} />}
      </div>
    </button>
  )
}

// ── Arrow with method label above ─────────────────────────────────────────
function Arrow({ method }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '3px',
      padding: '0 2px',
      flexShrink: 0,
      minWidth: '64px',
    }}>
      {method && (
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--blue-bright)',
          letterSpacing: '0.03em',
          textAlign: 'center',
          lineHeight: 1.3,
          maxWidth: '72px',
        }}>
          {method}
        </span>
      )}
      <span style={{
        color: 'var(--text-faint)',
        fontSize: '2rem',
        lineHeight: 1,
      }}>→</span>
    </div>
  )
}

// ── Recursive chain node ──────────────────────────────────────────────────
function ChainNode({ node, currentMon, onNavigate }) {
  const isCurrent = node.mon.name.toLowerCase() === currentMon.name.toLowerCase()
  const hasBranch = node.children.length > 1
  const hasNext   = node.children.length > 0

  // Find the method label going from this node into a named child
  const getMethod = (parentMon, childName) => {
    const match = parentMon.evoMethods?.find(
      e => e.into.toLowerCase() === childName.toLowerCase()
    )
    return match?.method ?? null
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      <EvoCard mon={node.mon} onClick={onNavigate} isCurrentMon={isCurrent} />

      {hasNext && (
        hasBranch ? (
          // ── Branched fork ───────────────────────────────────────────────
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Vertical stem line */}
            <div style={{
              width: '2px',
              alignSelf: 'stretch',
              background: 'var(--border)',
              margin: '12px 0',
              flexShrink: 0,
            }} />

            {/* Each branch */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              {node.children.map(child => (
                <div
                  key={child.mon.name}
                  style={{ display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  {/* Horizontal tick */}
                  <div style={{
                    width: '10px',
                    height: '2px',
                    background: 'var(--border)',
                    flexShrink: 0,
                  }} />
                  <Arrow method={getMethod(node.mon, child.mon.name)} />
                  <ChainNode
                    node={child}
                    currentMon={currentMon}
                    onNavigate={onNavigate}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          // ── Linear ─────────────────────────────────────────────────────
          <>
            <Arrow method={getMethod(node.mon, node.children[0].mon.name)} />
            <ChainNode
              node={node.children[0]}
              currentMon={currentMon}
              onNavigate={onNavigate}
            />
          </>
        )
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export default function EvolutionChain({ mon, onNavigate }) {
  // Walk up to the root
  const getRoot = (m, visited = new Set()) => {
    if (visited.has(m.name)) return m
    visited.add(m.name)
    if (!m.evolvesFrom) return m
    const parent = findByName(m.evolvesFrom)
    return parent ? getRoot(parent, visited) : m
  }

  // Build recursive tree
  const buildChain = (current, visited = new Set()) => {
    if (!current || visited.has(current.name)) return null
    visited.add(current.name)
    const children = (current.evolvesTo ?? [])
      .map(name => findByName(name))
      .filter(Boolean)
      .map(child => buildChain(child, new Set(visited)))
      .filter(Boolean)
    return { mon: current, children }
  }

  const root  = getRoot(mon)
  const chain = buildChain(root)

  // Don't render for standalone Fakemon with no evo data
  const isStandalone = !mon.evolvesFrom && (!mon.evolvesTo || mon.evolvesTo.length === 0)
  if (!chain || isStandalone) return null

  return (
    <div style={{
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '14px 16px',
      marginTop: '16px',
      overflowX: 'auto',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
        letterSpacing: '0.1em',
        marginBottom: '14px',
      }}>
        EVOLUTION CHAIN
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 'max-content' }}>
        <ChainNode node={chain} currentMon={mon} onNavigate={onNavigate} />
      </div>
    </div>
  )
}