import { ClipboardIcon } from './Icons.jsx'

export default function EventLogs({ logs, totalLogs, isAnimating }) {
  return (
    <div>
      <p className="section-title">Security Event Log</p>
      <div className="logs-card">
        <div className="logs-header">
          <div className="logs-header-left">
            <span aria-hidden="true"><ClipboardIcon size={14} /></span>
            <span>Pipeline Events</span>
            {isAnimating && (
              <span style={{ fontSize: '11px', color: 'var(--blue)', fontWeight: 400 }}>
                — streaming…
              </span>
            )}
          </div>
          <span className="logs-count">{logs.length} / {totalLogs} events</span>
        </div>
        <div className="logs-list">
          {logs.map((log, idx) => (
            <div key={idx} className="log-row">
              <span className="log-time">{log.time}</span>
              <span className={`log-level ${log.level}`}>[{log.level}]</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))}
          {isAnimating && logs.length < totalLogs && (
            <div className="log-row log-cursor-row">
              <span className="log-time">──────</span>
              <span className="log-level INFO">[INFO]</span>
              <span className="log-message log-cursor">▌</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
