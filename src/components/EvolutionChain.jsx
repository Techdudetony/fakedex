import { useState, useRef } from 'react'
import fakemon from '../data/fakemon.json'
import TypeBadge from './TypeBadge'

const findByName = (name) =>
  fakemon.find(m => m.name.toLowerCase() === name.toLowerCase()) ?? null

// ── Tooltip ───────────────────────────────────────────────────────────────
function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  return (
    <div
      ref={ref}
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && text && (
        <div style={{
          position:      'absolute',
          bottom:        'calc(100% + 6px)',
          left:          '50%',
          transform:     'translateX(-50%)',
          background:    '#1a1a1a',
          border:        '1px solid var(--blue-dim)',
          borderRadius:  '4px',
          padding:       '4px 10px',
          fontFamily:    'var(--font-mono)',
          fontSize:      '0.6rem',
          color:         'var(--blue-bright)',
          letterSpacing: '0.04em',
          whiteSpace:    'nowrap',
          zIndex:        999,
          pointerEvents: 'none',
          boxShadow:     '0 4px 12px rgba(0,0,0,0.5)',
        }}>
          {text}
          <div style={{
            position:    'absolute',
            top:         '100%',
            left:        '50%',
            transform:   'translateX(-50%)',
            width:       0,
            height:      0,
            borderLeft:  '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop:   '5px solid var(--blue-dim)',
          }} />
        </div>
      )}
    </div>
  )
}

// ── Evo card ──────────────────────────────────────────────────────────────
function EvoCard({ mon, onClick, isCurrentMon, method }) {
  const [imgError, setImgError] = useState(false)
  if (!mon) return null

  const card = (
    <button
      onClick={() => !isCurrentMon && onClick(mon)}
      style={{
        background:    isCurrentMon ? 'rgba(204,18,18,0.08)' : 'var(--surface)',
        border:        `1px solid ${isCurrentMon ? 'var(--red)' : 'var(--border)'}`,
        borderRadius:  '10px',
        padding:       '10px 8px',
        cursor:        isCurrentMon ? 'default' : 'pointer',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '5px',
        width:         '110px',
        flexShrink:    0,
        transition:    'border-color 0.15s, transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => {
        if (!isCurrentMon) {
          e.currentTarget.style.borderColor = 'var(--red)'
          e.currentTarget.style.transform   = 'translateY(-2px)'
          e.currentTarget.style.boxShadow   = '0 6px 16px rgba(204,18,18,0.2)'
        }
      }}
      onMouseLeave={e => {
        if (!isCurrentMon) {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.transform   = 'translateY(0)'
          e.currentTarget.style.boxShadow   = 'none'
        }
      }}
    >
      <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!imgError ? (
          <img
            src={mon.sprite}
            alt={mon.name}
            onError={() => setImgError(true)}
            style={{
              width:          '100%',
              height:         '100%',
              objectFit:      'contain',
              imageRendering: 'pixelated',
              opacity:        isCurrentMon ? 1 : 0.85,
            }}
          />
        ) : (
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text-faint)' }}>?</span>
        )}
      </div>
      <span style={{
        fontFamily:   'var(--font-mono)',
        fontSize:     '0.62rem',
        color:        isCurrentMon ? 'var(--red-bright)' : 'var(--text)',
        textAlign:    'center',
        lineHeight:   1.3,
        whiteSpace:   'nowrap',
        overflow:     'hidden',
        textOverflow: 'ellipsis',
        width:        '100%',
      }}>
        {mon.name}
      </span>
      <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <TypeBadge type={mon.type1} />
        {mon.type2 && mon.type2 !== '-' && <TypeBadge type={mon.type2} />}
      </div>
    </button>
  )

  return method ? <Tooltip text={method}>{card}</Tooltip> : card
}

// ── Vertical arrow ────────────────────────────────────────────────────────
function VerticalArrow() {
  return (
    <div style={{
      display:    'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding:    '2px 0',
      color:      'var(--text-faint)',
      fontSize:   '1.1rem',
      lineHeight: 1,
      userSelect: 'none',
    }}>↓</div>
  )
}

// ── Linear vertical chain ─────────────────────────────────────────────────
function LinearChain({ nodes, currentMon, onNavigate, getMethod }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      {nodes.map((node, i) => {
        const method = i > 0 ? getMethod(nodes[i - 1].mon, node.mon.name) : null
        return (
          <div key={node.mon.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            {i > 0 && <VerticalArrow />}
            <EvoCard
              mon={node.mon}
              onClick={onNavigate}
              isCurrentMon={node.mon.name.toLowerCase() === currentMon.name.toLowerCase()}
              method={method}
            />
          </div>
        )
      })}
    </div>
  )
}

// ── Fork layout (2–3 branches) ────────────────────────────────────────────
function ForkLayout({ parentNode, currentMon, onNavigate, getMethod }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <EvoCard
        mon={parentNode.mon}
        onClick={onNavigate}
        isCurrentMon={parentNode.mon.name.toLowerCase() === currentMon.name.toLowerCase()}
      />
      <div style={{ width: '2px', height: '20px', background: 'var(--border)' }} />
      <div style={{ position: 'relative', display: 'flex', gap: '16px' }}>
        <div style={{
          position:   'absolute',
          top:        0,
          left:       '55px',
          right:      '55px',
          height:     '2px',
          background: 'var(--border)',
        }} />
        {parentNode.children.map(child => (
          <div key={child.mon.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '2px', height: '16px', background: 'var(--border)' }} />
            <EvoCard
              mon={child.mon}
              onClick={onNavigate}
              isCurrentMon={child.mon.name.toLowerCase() === currentMon.name.toLowerCase()}
              method={getMethod(parentNode.mon, child.mon.name)}
            />
            {child.children.length > 0 && (
              <>
                <VerticalArrow />
                <EvoCard
                  mon={child.children[0].mon}
                  onClick={onNavigate}
                  isCurrentMon={child.children[0].mon.name.toLowerCase() === currentMon.name.toLowerCase()}
                  method={getMethod(child.mon, child.children[0].mon.name)}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Circular burst (4+ branches) ──────────────────────────────────────────
function CircularBurst({ parentNode, currentMon, onNavigate, getMethod }) {
  const children = parentNode.children
  const count    = children.length
  const radius   = Math.max(160, count * 28)
  const cardW    = 90
  const cardH    = 130
  const totalW   = radius * 2 + cardW
  const totalH   = radius * 2 + cardH
  const cx       = totalW / 2
  const cy       = totalH / 2

  return (
    <div style={{ position: 'relative', width: `${totalW}px`, height: `${totalH}px`, margin: '0 auto' }}>
      {/* SVG connector lines */}
      <svg
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        width={totalW}
        height={totalH}
      >
        {children.map((_, i) => {
          const angle = (i / count) * 2 * Math.PI - Math.PI / 2
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={cx + Math.cos(angle) * radius}
              y2={cy + Math.sin(angle) * radius}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          )
        })}
      </svg>

      {/* Center parent */}
      <div style={{
        position:  'absolute',
        left:      `${cx - cardW / 2}px`,
        top:       `${cy - cardH / 2}px`,
        zIndex:    2,
      }}>
        <EvoCard
          mon={parentNode.mon}
          onClick={onNavigate}
          isCurrentMon={parentNode.mon.name.toLowerCase() === currentMon.name.toLowerCase()}
        />
      </div>

      {/* Branch cards */}
      {children.map((child, i) => {
        const angle  = (i / count) * 2 * Math.PI - Math.PI / 2
        const method = getMethod(parentNode.mon, child.mon.name)
        return (
          <div
            key={child.mon.name}
            style={{
              position: 'absolute',
              left:     `${cx + Math.cos(angle) * radius - cardW / 2}px`,
              top:      `${cy + Math.sin(angle) * radius - cardH / 2}px`,
              zIndex:   2,
            }}
          >
            <EvoCard
              mon={child.mon}
              onClick={onNavigate}
              isCurrentMon={child.mon.name.toLowerCase() === currentMon.name.toLowerCase()}
              method={method}
            />
          </div>
        )
      })}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function EvolutionChain({ mon, onNavigate }) {
  const getRoot = (m, visited = new Set()) => {
    if (visited.has(m.name)) return m
    visited.add(m.name)
    if (!m.evolvesFrom) return m
    const parent = findByName(m.evolvesFrom)
    return parent ? getRoot(parent, visited) : m
  }

  const buildChain = (current, visited = new Set()) => {
    if (!current || visited.has(current.name)) return null
    visited.add(current.name)
    const children = (current.evolvesTo ?? [])
      .map(n => findByName(n))
      .filter(Boolean)
      .map(c => buildChain(c, new Set(visited)))
      .filter(Boolean)
    return { mon: current, children }
  }

  const getMethod = (parentMon, childName) =>
    parentMon.evoMethods?.find(
      e => e.into.toLowerCase() === childName.toLowerCase()
    )?.method ?? null

  const flattenLinear = (node, acc = []) => {
    acc.push(node)
    if (node.children.length === 1) flattenLinear(node.children[0], acc)
    return acc
  }

  const findBranchNode = (node) => {
    if (node.children.length > 1) return node
    if (node.children.length === 1) return findBranchNode(node.children[0])
    return null
  }

  const isStandalone = !mon.evolvesFrom && (!mon.evolvesTo || mon.evolvesTo.length === 0)
  if (isStandalone) return null

  const root  = getRoot(mon)
  const chain = buildChain(root)
  if (!chain) return null

  const branchNode  = findBranchNode(chain)
  const branchCount = branchNode?.children.length ?? 0
  const isCircular  = branchCount >= 4
  const isFork      = branchCount >= 2 && branchCount <= 3
  const isLinear    = branchCount === 0

  const preBranchNodes = branchNode
    ? flattenLinear(chain).filter(n =>
        !branchNode.children.some(c => c.mon.name === n.mon.name) &&
        n.mon.name !== branchNode.mon.name
      )
    : flattenLinear(chain)

  return (
    <div style={{
      background:   'var(--surface-2)',
      border:       '1px solid var(--border)',
      borderRadius: '8px',
      padding:      '20px',
      overflow:     'auto',
      maxHeight:    'calc(90vh - 120px)'
    }}>
      <div style={{
        fontFamily:    'var(--font-mono)',
        fontSize:      '0.65rem',
        color:         'var(--text-dim)',
        letterSpacing: '0.1em',
        marginBottom:  '20px',
      }}>
        EVOLUTION CHAIN
      </div>

      <div style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        gap:            '4px',
        width:          '100%',
        paddingBottom:  '20px',
      }}>
        {preBranchNodes.length > 0 && !isLinear && (
          <>
            <LinearChain
              nodes={preBranchNodes}
              currentMon={mon}
              onNavigate={onNavigate}
              getMethod={getMethod}
            />
            <VerticalArrow />
          </>
        )}
        {isLinear && (
          <LinearChain
            nodes={flattenLinear(chain)}
            currentMon={mon}
            onNavigate={onNavigate}
            getMethod={getMethod}
          />
        )}
        {isFork && branchNode && (
          <ForkLayout
            parentNode={branchNode}
            currentMon={mon}
            onNavigate={onNavigate}
            getMethod={getMethod}
          />
        )}
        {isCircular && branchNode && (
          <CircularBurst
            parentNode={branchNode}
            currentMon={mon}
            onNavigate={onNavigate}
            getMethod={getMethod}
          />
        )}
      </div>
    </div>
  )
}