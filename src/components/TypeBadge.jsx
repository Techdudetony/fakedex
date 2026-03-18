import { getTypeColor } from '../utils/typeColors'

export default function TypeBadges({ type }) {
    if (!type) return null

    const { bg, text } = getTypeColor(type)

    return (
        <span
            style={{
                backgroundColor: bg,
                color: text,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                padding: '2px 8px',
                borderRadius: '3px',
                textTransform: 'uppercase',
                display: 'inline-block',
                lineHeight: 1.6,
            }}
            >
                {type}
            </span>
    )
}