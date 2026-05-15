export default function ScenarioSelector({ scenarios, activeId, onSelect, isAnimating, onReplay }) {
  return (
    <div>
      <div className="section-header">
        <p className="section-title" style={{ margin: 0 }}>Demo Scenarios - select to run</p>
        <button
          className={`replay-btn ${isAnimating ? 'disabled' : ''}`}
          onClick={onReplay}
          disabled={isAnimating}
          title="Replay current scenario"
        >
          {isAnimating ? 'Running...' : 'Replay'}
        </button>
      </div>
      <div className="scenario-selector">
        {scenarios.map((s, idx) => {
          const isActive = s.id === activeId
          const activeClass = isActive
            ? s.tagColor === 'green' ? 'active-green' : 'active-red'
            : ''
          return (
            <button
              key={s.id}
              className={`scenario-card ${activeClass} ${isAnimating && !isActive ? 'disabled' : ''}`}
              onClick={() => onSelect(s)}
              disabled={isAnimating}
            >
              <div className="scenario-card-top">
                <span className="scenario-number">Scenario {idx + 1}</span>
                <span className={`scenario-tag ${s.tagColor}`}>{s.tag}</span>
              </div>
              <h3>{s.label}</h3>
              <p>{s.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
