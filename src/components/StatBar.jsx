import { useEffect, useState } from "react"

const STAT_COLORS = {
    hp:     '#4CAF50',
    atk:    '#F44336',
    def:    '#2196F3',
    spAtk:  '#FF9800',
    spDef:  '#9C27B0',
    spd:    '#00BCD4',
}

const STAT_LABELS = {
    hp:     'HP',
    atk:    'ATK',
    def:    'DEF',
    spAtk:  'SP.A',
    spDef:  'SP.D',
    spd:    'SPD',
}

const MAX_STAT = 255

export default function StatBar({ statKey, value, delay = 0 }) {
    const [filled, setFilled] = useState(false)

    // Start at 0 width, then trigger fill after mount + staggered delay
    useEffect(() => {
        const timer = setTimeout(() => setFilled(true), delay)
        return () => clearTimeout(timer) // cleanup if component unmounts
    }, [delay])

    const pct = Math.min((value / MAX_STAT) * 100, 100)
    const color = STAT_COLORS[statKey] ?? '#888'
    const label = STAT_LABELS[statKey] ?? statKey

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px'
        }}>
            {/* Label */}
            <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-dim)',
                width: '32px',
                textAlign: 'right',
                flexShrink: 0,
                letterSpacing: '0.05em',
            }}>
                {label}
            </span>

            {/* Track */}
            <div style={{
                flex: 1,
                height: '5px',
                backgroundColor: 'var(--border)',
                borderRadius: '3px',
                overflow: 'hidden',
            }}>
                {/* Fill — starts at 0, animates to full width when filled=true */}
                <div style={{
                    width: filled ? `${pct}%` : '0%',
                    height: '100%',
                    backgroundColor: color,
                    borderRadius: '3px',
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: `0 0 6px ${color}88`,
                }} />
            </div>

            {/* Value */}
            <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text)',
                width: '28px',
                flexShrink: 0,
            }}>
                {value}
            </span>
        </div>
    )
}