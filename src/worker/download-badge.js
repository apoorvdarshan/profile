const PREFIX = '/badges/downloads/'

export function downloadBadge(request, pathname) {
  if (!pathname.startsWith(PREFIX)) return null
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } })
  }

  let match
  try {
    match = decodeURIComponent(pathname).match(/^\/badges\/downloads\/v1\/(\d{1,6}[KM]?\+?)\.svg$/)
  } catch { /* Malformed paths return 404 instead of the SPA. */ }
  if (!match) return new Response('Badge not found', { status: 404 })

  // Only a bounded numeric milestone reaches the SVG. No upstream requests or credentials.
  const label = match[1]
  const textWidth = Math.ceil(label.length * 7.2)
  const rightWidth = textWidth + 10
  const width = 15 + rightWidth
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="Downloads: ${label}">
<title>Downloads: ${label}</title>
<path fill="#555" d="M0 0h15v20H0z"/><path fill="#8B1A1A" d="M15 0h${rightWidth}v20H15z"/>
<g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
<text x="7.5" y="14">↓</text><text x="${15 + rightWidth / 2}" y="14" textLength="${textWidth}" lengthAdjust="spacingAndGlyphs">${label}</text>
</g></svg>`
  return new Response(request.method === 'HEAD' ? null : svg, { headers: {
    'Content-Type': 'image/svg+xml; charset=utf-8',
    // The version and displayed count are in the URL; a new milestone gets a new URL.
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
  } })
}
