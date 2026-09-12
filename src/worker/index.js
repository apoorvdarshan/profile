const RESUME_ASSET_PATH = '/Apoorv_Darshan_Resume.pdf'
const RESUME_FILENAME = 'Apoorv_Darshan_Resume.pdf'

function isResumePath(pathname) {
  return pathname === '/resume' || pathname === '/resume/'
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url)

    if (!isResumePath(pathname)) {
      return env.ASSETS.fetch(request)
    }

    const assetRequest = new Request(new URL(RESUME_ASSET_PATH, request.url), request)
    const assetResponse = await env.ASSETS.fetch(assetRequest)
    if (!assetResponse.ok) return assetResponse

    const headers = new Headers(assetResponse.headers)
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Disposition', `inline; filename="${RESUME_FILENAME}"`)

    return new Response(assetResponse.body, {
      status: assetResponse.status,
      headers,
    })
  },
}
