// Canonical type colors — matches official Pokémon game palette
export const TYPE_COLORS = {
  Normal:   { bg: '#9099A1', text: '#fff' },
  Fire:     { bg: '#FF9C54', text: '#fff' },
  Water:    { bg: '#4D90D5', text: '#fff' },
  Electric: { bg: '#F3D23B', text: '#333' },
  Grass:    { bg: '#63BC5A', text: '#fff' },
  Ice:      { bg: '#74CEC0', text: '#fff' },
  Fighting: { bg: '#CE4069', text: '#fff' },
  Poison:   { bg: '#AB6AC8', text: '#fff' },
  Ground:   { bg: '#D97746', text: '#fff' },
  Flying:   { bg: '#8FA8DD', text: '#fff' },
  Psychic:  { bg: '#F97176', text: '#fff' },
  Bug:      { bg: '#90C12C', text: '#fff' },
  Rock:     { bg: '#C9BB8A', text: '#333' },
  Ghost:    { bg: '#5269AC', text: '#fff' },
  Dragon:   { bg: '#0A6DC4', text: '#fff' },
  Dark:     { bg: '#5A5366', text: '#fff' },
  Steel:    { bg: '#5A8EA1', text: '#fff' },
  Fairy:    { bg: '#EC8FE6', text: '#fff' },
}

export const getTypeColor = (type) =>
  TYPE_COLORS[type] ?? { bg: '#444', text: '#fff' }