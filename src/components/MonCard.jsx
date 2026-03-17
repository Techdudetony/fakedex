import { useState } from 'react'
import TypeBadge from './TypeBadge'

export default function MonCard({ mon, onClick }) {
  const [imgError, setImgError] = useState(false)

  return (
    <button
      onClick={() => onClick(mon)}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.borderColor = 'var(--red)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(204,18,18,0.25)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Dex number — watermark style */}
      <span style={{
        position: 'absolute',
        top: '8px',
        right: '10px',
        fontFamily: 'var(--font-display)',
        fontSize: '2.2rem',
        color: 'var(--text-faint)',
        lineHeight: 1,
        userSelect: 'none',
        letterSpacing: '0.02em',
      }}>
        #{mon.dexNum}
      </span>

      {/* Sprite */}
      <div style={{
        width: '96px',
        height: '96px',
        margin: '0 auto 12px',
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
              imageRendering: 'pixelated', // crisp pixel art sprites
            }}
          />
        ) : (
          // Fallback placeholder when sprite file doesn't exist yet
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            background: 'var(--surface-2)',
            border: '2px dashed var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--text-faint)',
          }}>
            ?
          </div>
        )}
      </div>

      {/* Name */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.3rem',
        letterSpacing: '0.04em',
        color: 'var(--text)',
        marginBottom: '4px',
        lineHeight: 1.1,
      }}>
        {mon.name}
      </div>

      {/* Species */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        color: 'var(--text-dim)',
        marginBottom: '10px',
        letterSpacing: '0.04em',
      }}>
        {mon.species}
      </div>

      {/* Type badges */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <TypeBadge type={mon.type1} />
        {mon.type2 && <TypeBadge type={mon.type2} />}
      </div>

      {/* BST pill */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        padding: '3px 8px',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          color: 'var(--text-dim)',
          letterSpacing: '0.06em',
        }}>
          BST
        </span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.95rem',
          color: 'var(--blue-bright)',
          letterSpacing: '0.04em',
        }}>
          {mon.stats.bst}
        </span>
      </div>
    </button>
  )
}