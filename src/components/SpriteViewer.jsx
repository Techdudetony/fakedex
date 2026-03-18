import { useEffect } from 'react'

export default function SpriteViewer({ src, name, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 400, // above the modal (z:200)
        background: 'rgba(0,0,0,0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.15s ease',
        cursor: 'zoom-out',
      }}
    >
      {/* Name label */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.4rem',
        letterSpacing: '0.08em',
        color: 'var(--text-dim)',
        marginBottom: '16px',
        userSelect: 'none',
      }}>
        {name}
      </div>

      {/* Full-res image */}
      <img
        src={src}
        alt={name}
        onClick={e => e.stopPropagation()} // clicking image doesn't close
        style={{
          maxWidth: '90vw',
          maxHeight: '80vh',
          objectFit: 'contain',
          imageRendering: 'auto', // smooth scaling for high-res art
          borderRadius: '8px',
          animation: 'slideUp 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'default',
        }}
      />

      {/* Hint */}
      <div style={{
        marginTop: '20px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        color: 'var(--text-faint)',
        letterSpacing: '0.1em',
        userSelect: 'none',
      }}>
        CLICK ANYWHERE TO CLOSE · ESC
      </div>
    </div>
  )
}