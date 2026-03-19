import { heightToFeet } from '../utils/parseHeight'

const PERSON_HEIGHT_FT = 5 + 11/12
const MAX_DISPLAY_PX   = 140

export default function SilhouetteComparison({ sprite, heightStr }) {
  const monHeightFt = heightToFeet(heightStr)

  // ── DEBUG ──────────────────────────────────────────────────
  console.group(`[SilhouetteComparison] ${heightStr}`)
  console.log('heightStr input:   ', heightStr)
  console.log('monHeightFt:       ', monHeightFt, 'ft')
  console.log('PERSON_HEIGHT_FT:  ', PERSON_HEIGHT_FT, 'ft')
  // ──────────────────────────────────────────────────────────

  const personPx = Math.min(MAX_DISPLAY_PX, MAX_DISPLAY_PX) // always 140 — bug #1
  const monPx    = monHeightFt
    ? Math.min(MAX_DISPLAY_PX * 2, (monHeightFt / PERSON_HEIGHT_FT) * personPx)
    : personPx

  const tallest   = Math.max(personPx, monPx)
  const scale     = MAX_DISPLAY_PX / tallest
  const finalPerson = personPx * scale
  const finalMon    = monPx * scale

  // ── DEBUG ──────────────────────────────────────────────────
  console.log('personPx (pre-scale):', personPx)
  console.log('monPx (pre-scale):   ', monPx)
  console.log('tallest:             ', tallest)
  console.log('scale factor:        ', scale)
  console.log('finalPerson (px):    ', Math.round(finalPerson))
  console.log('finalMon (px):       ', Math.round(finalMon))
  console.log('ratio mon/person:    ', (finalMon / finalPerson).toFixed(3))
  console.groupEnd()
  // ──────────────────────────────────────────────────────────

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'center',
      gap:           '8px',
    }}>
      <div style={{
        fontFamily:    'var(--font-mono)',
        fontSize:      '0.6rem',
        color:         'var(--text-dim)',
        letterSpacing: '0.1em',
      }}>
        SIZE COMPARISON
      </div>

      <div style={{
        display:    'flex',
        alignItems: 'flex-end',
        gap:        '24px',
        height:     `${MAX_DISPLAY_PX + 16}px`,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <svg
            width={Math.round(finalPerson * 0.4)}
            height={Math.round(finalPerson)}
            viewBox="0 0 40 100"
            fill="rgba(255,255,255,0.15)"
          >
            <circle cx="20" cy="10" r="8" />
            <rect x="12" y="20" width="16" height="28" rx="3" />
            <rect x="4"  y="22" width="7"  height="22" rx="3" />
            <rect x="29" y="22" width="7"  height="22" rx="3" />
            <rect x="12" y="50" width="7"  height="28" rx="3" />
            <rect x="21" y="50" width="7"  height="28" rx="3" />
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text-faint)' }}>
            5'11"
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <img
            src={sprite}
            alt="size comparison"
            style={{
              height:         `${Math.round(finalMon)}px`,
              width:          'auto',
              objectFit:      'contain',
              filter:         'brightness(0) invert(0.15)',
              imageRendering: 'pixelated',
            }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text-faint)' }}>
            {heightStr}
          </span>
        </div>
      </div>
    </div>
  )
}