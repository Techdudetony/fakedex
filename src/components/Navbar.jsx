import logo from '../assets/fakedex-logo.png'

export default function Navbar({ total }) {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(8,8,8,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src={logo} alt="FakeDex" style={{ height: '40px', width: '40px', objectFit: 'contain' }} />
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.8rem',
          letterSpacing: '0.06em',
          background: 'linear-gradient(135deg, var(--red-bright), var(--red))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
        }}>
          FakeDex
        </span>
      </div>

      {/* Entry count */}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        color: 'var(--text-dim)',
        letterSpacing: '0.08em',
      }}>
        {total} ENTRIES
      </span>
    </nav>
  )
}