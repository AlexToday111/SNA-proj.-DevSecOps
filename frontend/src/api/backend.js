const PREFIX = import.meta.env.VITE_API_PREFIX ?? '/backend'

async function readJson(res, route) {
  if (!res.ok) {
    throw new Error(`${route} failed: ${res.status}`)
  }

  return res.json()
}

export async function fetchHealth() {
  const res = await fetch(`${PREFIX}/health`, { method: 'GET' })
  return readJson(res, 'GET /health')
}

export async function fetchStatus() {
  const res = await fetch(`${PREFIX}/api/status`, { method: 'GET' })
  return readJson(res, 'GET /api/status')
}

export async function fetchToken() {
  const res = await fetch(`${PREFIX}/token`, { method: 'GET' })
  const data = await readJson(res, 'GET /token')
  return data.token
}

export async function echoMessage(message) {
  const res = await fetch(`${PREFIX}/echo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  return readJson(res, 'POST /echo')
}

export async function fetchBackendSnapshot() {
  const [health, status, token, echo] = await Promise.all([
    fetchHealth(),
    fetchStatus(),
    fetchToken(),
    echoMessage('hello from frontend'),
  ])

  return { health, status, token, echo }
}
