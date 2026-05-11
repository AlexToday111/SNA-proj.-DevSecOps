import { StepIcon } from './Icons.jsx'

const STATUS_ICON = {
  success: '✓',
  failed:  '✗',
  pending: '●',
  skipped: '–',
  blocked: '◌',
}

function PipelineStep({ step }) {
  const icon = STATUS_ICON[step.status] ?? '●'
  return (
    <div className="pipeline-step">
      <div className={`step-box ${step.status}`}>
        <span className="step-icon" aria-hidden="true">
          <StepIcon stepId={step.id} />
        </span>
        <span className={`step-status-icon ${step.status}`}>{icon}</span>
      </div>
      <span className="step-label">{step.label}</span>
    </div>
  )
}

export default function PipelineFlow({ steps }) {
  return (
    <div>
      <p className="section-title">CI / CD Pipeline</p>
      <div className="pipeline-wrapper">
        <div className="pipeline-flow">
          {steps.map((step, idx) => {
            const prevSuccess = idx === 0 || steps[idx - 1].status === 'success'
            return (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                {idx > 0 && (
                  <div className={`pipeline-arrow ${prevSuccess && step.status === 'success' ? 'active' : ''}`}>
                    →
                  </div>
                )}
                <PipelineStep step={step} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
