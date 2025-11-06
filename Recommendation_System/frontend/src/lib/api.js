const API_BASE = '/api'

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`
  console.log('[API] Request:', {
    path,
    url,
    method: options.method || 'GET',
    hasBody: !!options.body
  })
  
  try {
    const res = await fetch(url, options)
    
    console.log('[API] Response:', {
      status: res.status,
      ok: res.ok,
      statusText: res.statusText
    })
    
    const contentType = res.headers.get('content-type') || ''
    let data = null
    if (contentType.includes('application/json')) {
      data = await res.json().catch(() => null)
    } else {
      data = await res.text().catch(() => null)
    }
    
    if (!res.ok) {
      const message = (data && (data.detail || data.message)) || `Request failed: ${res.status}`
      console.error('[API] Error:', message, data)
      throw new Error(message)
    }
    
    console.log('[API] Success:', data)
    return data
  } catch (error) {
    console.error('[API] Fetch failed:', error)
    throw error
  }
}
