const API_BASE = '/api'

export async function apiFetch(path, options = {}) {
  let url
  if (path.startsWith('http')) {
    url = path
  } else if (path.startsWith('/')) {
    // Absolute path provided, leave as-is (works for both /api/* and root auth endpoints)
    url = path
  } else {
    // Fallback: treat as relative to API base
    url = `${API_BASE}/${path}`
  }
  console.log('[API] Request:', {
    path,
    url,
    method: options.method || 'GET',
    hasBody: !!options.body
  })
  
  try {
    // Merge headers and inject Authorization if available
    const mergedHeaders = { ...(options.headers || {}) }
    if (!mergedHeaders.Authorization) {
      try {
        const t = localStorage.getItem('token')
        if (t) mergedHeaders.Authorization = `Bearer ${t}`
      } catch {}
    }
    const fetchOptions = { ...options, headers: mergedHeaders }

    const res = await fetch(url, fetchOptions)
    
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
