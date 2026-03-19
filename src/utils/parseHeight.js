export function heightToFeet(heightStr) {
  if (!heightStr) {
    console.warn('[parseHeight] heightStr is null/empty')
    return null
  }

  const match = heightStr.match(/(\d+)'(\d+)/)

  if (!match) {
    console.warn('[parseHeight] No match for pattern feet\'inches in:', JSON.stringify(heightStr))
    return null
  }

  const feet   = parseInt(match[1])
  const inches = parseInt(match[2])
  const result = feet + inches / 12

  console.log(`[parseHeight] "${heightStr}" → ${feet}ft ${inches}in → ${result.toFixed(3)}ft`)
  return result
}