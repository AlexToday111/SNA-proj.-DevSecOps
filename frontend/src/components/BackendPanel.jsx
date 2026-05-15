import { useEffect, useState } from 'react'
import { fetchBackendSnapshot } from '../api/backend.js'

function formatUptime(seconds) {
  if (typeof seconds !== 'number') return 'n/a'
  if (seconds < 60) return `${seconds}s`

  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}m ${rest}s`
}

export default function BackendPanel() {
  const [status, setStatus] = useState('checking')
  const [snapshot, setSnapshot] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setStatus('checking')
    setError('')

    fetchBackendSnapshot()
      .then((data) => {
        if (cancelled) return
        setStatus('online')
        setSnapshot(data)
      })
      .catch((e) => {
        if (cancelled) return
        setStatus('offline')
        setError(e?.message ?? String(e))
      })

    return () => { cancelled = true }
  }, [])

  const service = snapshot?.status?.service ?? 'devsecops-safe-backend'
  const mode = snapshot?.status?.mode ?? 'safe'
  const version = snapshot?.status?.version ?? '1.0.0'
  const uptime = formatUptime(snapshot?.status?.uptime_seconds)
  const token = snapshot?.token ?? ''
  const tokenPreview = token.length > 24 ? `${token.slice(0, 12)}...${token.slice(-6)}` : token
  const echoLength = snapshot?.echo?.length

  return (
    <div>
      <p className="section-title">Live Safe Backend API</p>
      <div className="backend-panel">
        <div className="backend-panel-row">
          <span className="backend-panel-label">Service</span>
          <span className="backend-panel-value">
            Go stdlib HTTP - <code className="backend-code">:8080</code> - <code className="backend-code">{service}</code>
          </span>
        </div>
        <div className="backend-panel-row">
          <span className="backend-panel-label">Status</span>
          <span className="backend-panel-value">
            <code className="backend-code">GET /api/status</code>
            {' - '}
            <span className={`backend-live ${status}`}>
              {status === 'checking' && 'checking...'}
              {status === 'online' && <>live - {mode} - v{version} - uptime {uptime}</>}
              {status === 'offline' && <>offline{error ? ` (${error})` : ''}</>}
            </span>
          </span>
        </div>
        <div className="backend-panel-row">
          <span className="backend-panel-label">Token</span>
          <span className="backend-panel-value">
            <code className="backend-code">GET /token</code>
            {' - JSON '}
            <code className="backend-code">{'{ "token": "..." }'}</code>
            {status === 'online' && <> - <code className="backend-code">{tokenPreview || '...'}</code></>}
          </span>
        </div>
        <div className="backend-panel-row">
          <span className="backend-panel-label">Echo</span>
          <span className="backend-panel-value">
            <code className="backend-code">POST /echo</code>
            {' - validated JSON body, no shell execution'}
            {typeof echoLength === 'number' && <> - length <code className="backend-code">{echoLength}</code></>}
          </span>
        </div>
        <p className="backend-panel-hint">
          Run the backend from <code className="backend-code">backend/safe</code>, then <code className="backend-code">npm run dev</code>
          {' '}uses Vite proxy <code className="backend-code">/backend/*</code> -&gt; <code className="backend-code">http://127.0.0.1:8080/*</code>.
        </p>
      </div>
    </div>
  )
}
