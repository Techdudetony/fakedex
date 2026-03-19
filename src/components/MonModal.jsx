import { useEffect, useState } from 'react'
import TypeBadge from './TypeBadge'
import StatBar from './StatBar'
import SpriteViewer from './SpriteViewer'
import EvolutionChain from './EvolutionChain'
import SilhouetteComparison from './SilhouetteComparison'

const TABS = ['INFO', 'EVOLUTION', 'MOVES']

export default function MonModal({ mon, onClose, onNavigate }) {
  const [imgError,      setImgError]      = useState(false)
  const [viewingSprite, setViewingSprite] = useState(false)
  const [activeTab,     setActiveTab]     = useState('INFO')

  // Reset tab when mon changes (e.g. navigating via evo chain)
  useEffect(() => { setActiveTab('INFO') }, [mon?.name])

  // Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!mon) return null

  const stats = [
    { key: 'hp',    delay: 100 },
    { key: 'atk',   delay: 150 },
    { key: 'def',   delay: 200 },
    { key: 'spAtk', delay: 250 },
    { key: 'spDef', delay: 300 },
    { key: 'spd',   delay: 350 },
  ]

  const hasEvolution = mon.evolvesFrom || (mon.evolvesTo && mon.evolvesTo.length > 0)

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────── */}
      <div
        onClick={onClose}
        style={{
          position:       'fixed',
          inset:          0,
          background:     'rgba(0,0,0,0.9)',
          zIndex:         200,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          padding:        '16px',
          animation:      'fadeIn 0.15s ease',
        }}
      >
        {/* ── Modal panel ────────────────────────────────────────── */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background:   'var(--surface)',
            border:       '1px solid var(--border)',
            borderRadius: '16px',
            width:        '100%',
            maxWidth:     '900px',
            maxHeight:    '90vh',
            overflow:     'hidden',
            boxShadow:    '0 0 80px rgba(0,0,0,0.8), 0 0 30px rgba(204,18,18,0.1)',
            animation:    'slideUp 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            display:      'flex',
            flexDirection: 'column',
          }}
        >
          {/* ── Two-column layout ──────────────────────────────────── */}
          <div style={{
            display:  'flex',
            flex:     1,
            overflow: 'hidden',
            // Stack on narrow viewports
            flexWrap: 'wrap',
          }}>

            {/* ── LEFT — Art panel ─────────────────────────────────── */}
            <div style={{
              width:          '380px',
              minWidth:       '380px',
              flexShrink:     0,
              background:     'linear-gradient(160deg, #0d0d0d 0%, #1a0808 60%, #0d0d1a 100%)',
              borderRight:    '1px solid var(--border)',
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'flex-end',
              padding:        '24px 20px 20px',
              position:       'relative',
              overflow:       'hidden',
            }}>
              {/* Dex number watermark */}
              <div style={{
                position:   'absolute',
                top:        '16px',
                left:       '20px',
                fontFamily: 'var(--font-display)',
                fontSize:   '4rem',
                color:      'rgba(255,255,255,0.04)',
                lineHeight: 1,
                userSelect: 'none',
                letterSpacing: '0.02em',
              }}>
                #{mon.dexNum}
              </div>

              {/* Subtle radial glow behind sprite */}
              <div style={{
                position:     'absolute',
                top:          '50%',
                left:         '50%',
                transform:    'translate(-50%, -60%)',
                width:        '220px',
                height:       '220px',
                borderRadius: '50%',
                background:   'radial-gradient(circle, rgba(204,18,18,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              {/* Sprite — large, clickable */}
              <div
                onClick={() => !imgError && setViewingSprite(true)}
                style={{
                  width:    '300px',
                  height:   '300px',
                  display:  'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  cursor:   imgError ? 'default' : 'zoom-in',
                  marginBottom: '120px',
                  flexShrink: 0,
                }}
              >
                {!imgError ? (
                  <img
                    src={mon.sprite}
                    alt={mon.name}
                    onError={() => setImgError(true)}
                    style={{
                      width:           '100%',
                      height:          '100%',
                      objectFit:       'contain',
                      imageRendering:  'pixelated',
                      filter:          'drop-shadow(0 8px 24px rgba(0,0,0,0.6))',
                      transition:      'transform 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                ) : (
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize:   '4rem',
                    color:      'var(--text-faint)',
                  }}>?</span>
                )}
              </div>

              {/* Name + types overlay */}
              <div style={{ width: '100%' }}>
                {/* Types */}
                <div style={{
                  display:        'flex',
                  gap:            '6px',
                  flexWrap:       'wrap',
                  marginBottom:   '8px',
                }}>
                  <TypeBadge type={mon.type1} />
                  {mon.type2 && mon.type2 !== '-' && <TypeBadge type={mon.type2} />}
                </div>

                {/* Name */}
                <div style={{
                  fontFamily:    'var(--font-display)',
                  fontSize:      '2rem',
                  letterSpacing: '0.04em',
                  color:         'var(--text)',
                  lineHeight:    1,
                  marginBottom:  '4px',
                }}>
                  {mon.name}
                </div>

                {/* Species + dex # */}
                <div style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '0.65rem',
                  color:         'var(--text-dim)',
                  letterSpacing: '0.04em',
                }}>
                  #{mon.dexNum} · {mon.species}
                </div>
              </div>
            </div>

            {/* ── RIGHT — Content panel ─────────────────────────────── */}
            <div style={{
              flex:           1,
              minWidth:       0,
              display:        'flex',
              flexDirection:  'column',
              overflow:       'hidden',
            }}>

              {/* Tab bar + close button */}
              <div style={{
                display:        'flex',
                alignItems:     'center',
                borderBottom:   '1px solid var(--border)',
                padding:        '0 20px',
                gap:            '4px',
                flexShrink:     0,
              }}>
                {TABS.map(tab => {
                  const isActive = activeTab === tab
                  // Dim Evolution tab if no evo data
                  const isDisabled = tab === 'EVOLUTION' && !hasEvolution
                  return (
                    <button
                      key={tab}
                      onClick={() => !isDisabled && setActiveTab(tab)}
                      style={{
                        fontFamily:     'var(--font-mono)',
                        fontSize:       '0.7rem',
                        letterSpacing:  '0.1em',
                        padding:        '14px 16px 12px',
                        background:     'none',
                        border:         'none',
                        borderBottom:   isActive
                          ? '2px solid var(--red)'
                          : '2px solid transparent',
                        color:          isDisabled
                          ? 'var(--text-faint)'
                          : isActive
                            ? 'var(--text)'
                            : 'var(--text-dim)',
                        cursor:         isDisabled ? 'default' : 'pointer',
                        transition:     'color 0.15s, border-color 0.15s',
                        marginBottom:   '-1px',
                      }}
                    >
                      {tab}
                    </button>
                  )
                })}

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Close button */}
                <button
                  onClick={onClose}
                  style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '0.65rem',
                    letterSpacing: '0.08em',
                    color:         'var(--text-dim)',
                    background:    'none',
                    border:        '1px solid var(--border)',
                    borderRadius:  '4px',
                    padding:       '4px 10px',
                    cursor:        'pointer',
                    transition:    'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--red)'
                    e.currentTarget.style.color = 'var(--red)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-dim)'
                  }}
                >
                  ESC
                </button>
              </div>

              {/* Tab content — scrollable */}
              <div style={{
                flex:       1,
                overflowY:  'auto',
                padding:    '20px',
              }}>

                {/* ── INFO TAB ─────────────────────────────────────── */}
                {activeTab === 'INFO' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Dex entry */}
                    {mon.dexEntry && (
                      <div style={{
                        borderLeft:  '3px solid var(--red-dim)',
                        paddingLeft: '14px',
                      }}>
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize:   '1rem',
                          fontStyle:  'italic',
                          color:      'var(--text)',
                          lineHeight: 1.7,
                          margin:     0,
                        }}>
                          {mon.dexEntry}
                        </p>
                      </div>
                    )}

                    {/* Physical stats + silhouette */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                    }}>
                      {/* Height / Weight */}
                      <div style={{
                        background:   'var(--surface-2)',
                        border:       '1px solid var(--border)',
                        borderRadius: '8px',
                        padding:      '14px',
                        display:      'flex',
                        flexDirection: 'column',
                        gap:          '12px',
                      }}>
                        {[
                          { label: 'HEIGHT', value: mon.height },
                          { label: 'WEIGHT', value: mon.weight },
                          { label: 'BST',    value: mon.stats.bst },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <div style={{
                              fontFamily:    'var(--font-mono)',
                              fontSize:      '0.6rem',
                              color:         'var(--text-dim)',
                              letterSpacing: '0.1em',
                              marginBottom:  '2px',
                            }}>
                              {label}
                            </div>
                            <div style={{
                              fontFamily:    'var(--font-display)',
                              fontSize:      '1.3rem',
                              color:         'var(--blue-bright)',
                              letterSpacing: '0.04em',
                            }}>
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Silhouette comparison */}
                      <div style={{
                        background:     'var(--surface-2)',
                        border:         '1px solid var(--border)',
                        borderRadius:   '8px',
                        padding:        '14px',
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                      }}>
                        <SilhouetteComparison
                          sprite={mon.sprite}
                          heightStr={mon.height}
                        />
                      </div>
                    </div>

                    {/* Base stats */}
                    <div style={{
                      background:   'var(--surface-2)',
                      border:       '1px solid var(--border)',
                      borderRadius: '8px',
                      padding:      '14px 16px',
                    }}>
                      <div style={{
                        fontFamily:    'var(--font-mono)',
                        fontSize:      '0.65rem',
                        color:         'var(--text-dim)',
                        letterSpacing: '0.1em',
                        marginBottom:  '12px',
                      }}>
                        BASE STATS
                      </div>
                      {stats.map(({ key, delay }) => (
                        <StatBar
                          key={key}
                          statKey={key}
                          value={mon.stats[key]}
                          delay={delay}
                        />
                      ))}
                    </div>

                    {/* Abilities */}
                    <div style={{
                      background:   'var(--surface-2)',
                      border:       '1px solid var(--border)',
                      borderRadius: '8px',
                      padding:      '14px 16px',
                    }}>
                      <div style={{
                        fontFamily:    'var(--font-mono)',
                        fontSize:      '0.65rem',
                        color:         'var(--text-dim)',
                        letterSpacing: '0.1em',
                        marginBottom:  '12px',
                      }}>
                        ABILITIES
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {mon.ability1 && <AbilityChip label={mon.ability1} />}
                        {mon.ability2 && <AbilityChip label={mon.ability2} />}
                        {mon.abilityHidden && <AbilityChip label={mon.abilityHidden} hidden />}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── EVOLUTION TAB ─────────────────────────────────── */}
                {activeTab === 'EVOLUTION' && (
                  <div>
                    {hasEvolution ? (
                      <EvolutionChain mon={mon} onNavigate={onNavigate} />
                    ) : (
                      <EmptyState
                        icon="◈"
                        title="NO EVOLUTION DATA"
                        subtitle="This Pokémon does not evolve."
                      />
                    )}
                  </div>
                )}

                {/* ── MOVES TAB ─────────────────────────────────────── */}
                {activeTab === 'MOVES' && (
                  <EmptyState
                    icon="⚔"
                    title="MOVES COMING SOON"
                    subtitle="Move data will be added in a future update."
                  />
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SpriteViewer — outside backdrop */}
      {viewingSprite && (
        <SpriteViewer
          src={mon.sprite}
          name={mon.name}
          onClose={() => setViewingSprite(false)}
        />
      )}
    </>
  )
}

// ── Ability chip ──────────────────────────────────────────────────────────
function AbilityChip({ label, hidden = false }) {
  return (
    <div style={{
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'space-between',
      background:      hidden ? 'rgba(58,111,216,0.08)' : 'var(--surface)',
      border:          `1px solid ${hidden ? 'var(--blue-dim)' : 'var(--border)'}`,
      borderRadius:    '5px',
      padding:         '8px 14px',
    }}>
      <span style={{
        fontFamily:    'var(--font-mono)',
        fontSize:      '0.8rem',
        color:         hidden ? 'var(--blue-bright)' : 'var(--text)',
        letterSpacing: '0.03em',
      }}>
        {label}
      </span>
      {hidden && (
        <span style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '0.6rem',
          color:         'var(--blue)',
          letterSpacing: '0.08em',
          background:    'rgba(58,111,216,0.15)',
          padding:       '2px 8px',
          borderRadius:  '3px',
        }}>
          HIDDEN
        </span>
      )}
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────
function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '60px 20px',
      gap:            '12px',
      textAlign:      'center',
    }}>
      <div style={{
        fontSize:   '2.5rem',
        color:      'var(--text-faint)',
        lineHeight: 1,
      }}>
        {icon}
      </div>
      <div style={{
        fontFamily:    'var(--font-display)',
        fontSize:      '1.2rem',
        color:         'var(--text-faint)',
        letterSpacing: '0.08em',
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize:   '0.7rem',
        color:      'var(--text-faint)',
        lineHeight: 1.5,
      }}>
        {subtitle}
      </div>
    </div>
  )
}