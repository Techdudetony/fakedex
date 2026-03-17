import { useEffect } from 'react'
import { useState } from 'react'
import TypeBadge from './TypeBadge'
import StatBar from './StatBar'
import SpriteViewer from './SpriteViewer'

export default function MonModal({ mon, onClose }) {
  const [imgError, setImgError] = useState(false)
  const [viewingSprite, setViewingSprite] = useState(false)

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Prevent background scroll while modal is open
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

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.88)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(6px)',
        padding: '16px',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      {/* Panel — stop click propagation so clicking inside doesn't close */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--red)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 0 60px rgba(204,18,18,0.2), 0 24px 48px rgba(0,0,0,0.6)',
          animation: 'slideUp 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
        }}
      >
        {/* Header band */}
        <div style={{
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0a0a 100%)',
          borderBottom: '1px solid var(--border)',
          padding: '24px 24px 20px',
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-start',
        }}>

          {/* Sprite */}
          <div style={{
            width: '120px',
            height: '120px',
            flexShrink: 0,
            background: 'var(--surface-2)',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {!imgError ? (
              <img
                src={mon.sprite}
                alt={mon.name}
                onError={() => setImgError(true)}
                onClick={() => setViewingSprite(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  imageRendering: 'pixelated',
                  cursor: 'zoom-in',
                }}
              />
            ) : (
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '3rem',
                color: 'var(--text-faint)',
              }}>?</span>
            )}
          </div>

          {/* Name / meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Dex number */}
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--red)',
              letterSpacing: '0.1em',
              marginBottom: '4px',
            }}>
              #{mon.dexNum}
            </div>

            {/* Name */}
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.2rem',
              letterSpacing: '0.04em',
              color: 'var(--text)',
              lineHeight: 1,
              marginBottom: '6px',
              wordBreak: 'break-word',
            }}>
              {mon.name}
            </div>

            {/* Species */}
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: 'var(--text-dim)',
              letterSpacing: '0.04em',
              marginBottom: '12px',
            }}>
              {mon.species}
            </div>

            {/* Types */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <TypeBadge type={mon.type1} />
              {mon.type2 && <TypeBadge type={mon.type2} />}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              padding: '4px 10px',
              cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
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

        {/* Body */}
        <div style={{ padding: '20px 24px 28px' }}>

          {/* Physical stats row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            marginBottom: '20px',
          }}>
            {[
              { label: 'HEIGHT', value: mon.height },
              { label: 'WEIGHT', value: mon.weight },
              { label: 'BST',    value: mon.stats.bst },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '10px 12px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  color: 'var(--text-dim)',
                  letterSpacing: '0.08em',
                  marginBottom: '4px',
                }}>
                  {label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  color: 'var(--blue-bright)',
                  letterSpacing: '0.04em',
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Stat bars */}
          <div style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '14px 16px',
            marginBottom: '16px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--text-dim)',
              letterSpacing: '0.1em',
              marginBottom: '12px',
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
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '14px 16px',
            marginBottom: '16px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--text-dim)',
              letterSpacing: '0.1em',
              marginBottom: '12px',
            }}>
              ABILITIES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

              {/* Ability 1 */}
              {mon.ability1 && (
                <AbilityChip label={mon.ability1} />
              )}

              {/* Ability 2 */}
              {mon.ability2 && (
                <AbilityChip label={mon.ability2} />
              )}

              {/* Hidden ability */}
              {mon.abilityHidden && (
                <AbilityChip label={mon.abilityHidden} hidden />
              )}
            </div>
          </div>

          {/* Dex entry */}
          {mon.dexEntry && (
            <div style={{
              borderLeft: '3px solid var(--red-dim)',
              paddingLeft: '16px',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                fontStyle: 'italic',
                color: 'var(--text)',
                lineHeight: 1.7,
              }}>
                {mon.dexEntry}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* High-res sprite viewer */}
      {viewingSprite && (
        <SpriteViewer
          src={mon.sprite}
          name={mon.name}
          onClose={() => setViewingSprite(false)}
        />
      )}
    </div>
  )
}

// Small internal component — ability pill
function AbilityChip({ label, hidden = false }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: hidden ? 'rgba(58,111,216,0.08)' : 'var(--surface)',
      border: `1px solid ${hidden ? 'var(--blue-dim)' : 'var(--border)'}`,
      borderRadius: '5px',
      padding: '7px 12px',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        color: hidden ? 'var(--blue-bright)' : 'var(--text)',
        letterSpacing: '0.03em',
      }}>
        {label}
      </span>
      {hidden && (
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          color: 'var(--blue)',
          letterSpacing: '0.08em',
          background: 'rgba(58,111,216,0.15)',
          padding: '2px 6px',
          borderRadius: '3px',
        }}>
          HIDDEN
        </span>
      )}
    </div>
  )
}