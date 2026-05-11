import { SemgrepIcon, TrivyIcon } from './Icons.jsx'

function SastCard({ data }) {
  if (!data) {
    return (
      <div className="scan-card">
        <div className="scan-header">
          <div className="scan-title">
            <span className="scan-title-icon" aria-hidden="true"><SemgrepIcon size={16} /></span>
            <span className="scan-title-text">SAST Scan</span>
          </div>
          <span className="scan-status-badge skipped">NOT RUN</span>
        </div>
        <div className="scan-skipped-notice">Scan was not executed in this scenario</div>
      </div>
    )
  }

  const ok = data.status === 'passed'
  return (
    <div className="scan-card">
      <div className="scan-header">
        <div className="scan-title">
          <span className="scan-title-icon" aria-hidden="true"><SemgrepIcon size={16} /></span>
          <div>
            <div className="scan-title-text">SAST Scan</div>
            <div className="scan-subtitle">Tool: {data.tool}</div>
          </div>
        </div>
        <span className={`scan-status-badge ${data.status}`}>
          {data.status.toUpperCase()}
        </span>
      </div>
      <div className="scan-body">
        <div className="scan-meta">
          <div className="scan-meta-item">
            <span className="scan-meta-label">Duration</span>
            <span className="scan-meta-value">{data.duration}</span>
          </div>
          <div className="scan-meta-item">
            <span className="scan-meta-label">Findings</span>
            <span className="scan-meta-value">{data.findings.length}</span>
          </div>
        </div>

        <div className={`scan-summary ${ok ? 'ok' : 'fail'}`}>
          {ok ? '✓ ' : '✗ '}{data.summary}
        </div>

        {data.findings.length > 0 && (
          <div className="findings-list">
            {data.findings.map((f, idx) => (
              <div key={idx} className="finding-item">
                <div className="finding-top">
                  <span className={`severity-badge ${f.severity}`}>{f.severity}</span>
                  <span className="finding-location">{f.file}:{f.line}</span>
                </div>
                <div className="finding-id">{f.rule}</div>
                <div className="finding-message">{f.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TrivyCard({ data }) {
  if (!data) {
    return (
      <div className="scan-card">
        <div className="scan-header">
          <div className="scan-title">
            <span className="scan-title-icon" aria-hidden="true"><TrivyIcon size={16} /></span>
            <span className="scan-title-text">Trivy Image Scan</span>
          </div>
          <span className="scan-status-badge skipped">NOT RUN</span>
        </div>
        <div className="scan-skipped-notice">
          Scan was skipped — pipeline blocked before Docker build
        </div>
      </div>
    )
  }

  const ok = data.status === 'passed'
  return (
    <div className="scan-card">
      <div className="scan-header">
        <div className="scan-title">
          <span className="scan-title-icon" aria-hidden="true"><TrivyIcon size={16} /></span>
          <div>
            <div className="scan-title-text">Trivy Image Scan</div>
            <div className="scan-subtitle">Image: {data.image}</div>
          </div>
        </div>
        <span className={`scan-status-badge ${data.status}`}>
          {data.status.toUpperCase()}
        </span>
      </div>
      <div className="scan-body">
        <div className="scan-meta">
          <div className="scan-meta-item">
            <span className="scan-meta-label">Duration</span>
            <span className="scan-meta-value">{data.duration}</span>
          </div>
          <div className="scan-meta-item">
            <span className="scan-meta-label">CVEs Found</span>
            <span className="scan-meta-value">{data.findings.length}</span>
          </div>
          {data.findings.length > 0 && (
            <div className="scan-meta-item">
              <span className="scan-meta-label">Critical</span>
              <span className="scan-meta-value" style={{ color: 'var(--red)' }}>
                {data.findings.filter(f => f.severity === 'CRITICAL').length}
              </span>
            </div>
          )}
        </div>

        <div className={`scan-summary ${ok ? 'ok' : 'fail'}`}>
          {ok ? '✓ ' : '✗ '}{data.summary}
        </div>

        {data.findings.length > 0 && (
          <div className="findings-list">
            {data.findings.map((f, idx) => (
              <div key={idx} className="finding-item">
                <div className="finding-top">
                  <span className={`severity-badge ${f.severity}`}>{f.severity}</span>
                  <span className="finding-id">{f.cve}</span>
                </div>
                <div className="finding-location">{f.pkg}</div>
                <div className="finding-message">{f.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ScanResults({ sast, trivy }) {
  return (
    <div>
      <p className="section-title">Security Scan Results</p>
      <div className="results-grid">
        <SastCard data={sast} />
        <TrivyCard data={trivy} />
      </div>
    </div>
  )
}
