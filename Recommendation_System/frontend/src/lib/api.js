// Base API URL
// - In development, Vite dev server will proxy "/api" to your local backend.
// - In production (Vercel), set VITE_API_BASE to your Render backend origin,
//   e.g. "https://your-backend.onrender.com".
const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function apiFetch(path, options = {}) {
  let url
  if (path.startsWith('http')) {
    url = path
  } else if (path.startsWith('/')) {
    // Absolute path from the app perspective. If it's an API path, prepend API_BASE.
    if (path.startsWith('/api')) {
      url = `${API_BASE}${path}`
    } else {
      url = path
    }
  } else {
    // Relative path: treat as relative to "/api" on the configured backend
    const base = API_BASE || ''
    url = `${base}/api/${path}`
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
