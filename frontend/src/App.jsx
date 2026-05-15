import { useState, useCallback } from 'react'
import { scenarios } from './data/scenarios.js'
import Header from './components/Header.jsx'
import ScenarioSelector from './components/ScenarioSelector.jsx'
import PipelineFlow from './components/PipelineFlow.jsx'
import ScanResults from './components/ScanResults.jsx'
import EventLogs from './components/EventLogs.jsx'
import BackendPanel from './components/BackendPanel.jsx'
import { BlockIcon, CheckIcon } from './components/Icons.jsx'

const STEP_DELAY_MS = 600
const LOG_DELAY_MS = 300

export default function App() {
  const [activeScenario, setActiveScenario] = useState(scenarios[0])
  const [animatedSteps, setAnimatedSteps] = useState(scenarios[0].steps)
  const [visibleLogs, setVisibleLogs] = useState(scenarios[0].logs)
  const [showOutcome, setShowOutcome] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const runAnimation = useCallback((scenario) => {
    setIsAnimating(true)
    setShowOutcome(false)
    setVisibleLogs([])

    const pending = scenario.steps.map(s => ({ ...s, status: 'pending' }))
    setAnimatedSteps(pending)

    const totalSteps = scenario.steps.length

    scenario.steps.forEach((step, idx) => {
      setTimeout(() => {
        setAnimatedSteps(prev =>
          prev.map((s, i) => (i === idx ? { ...s, status: step.status } : s))
        )
      }, (idx + 1) * STEP_DELAY_MS)
    })

    scenario.logs.forEach((log, idx) => {
      setTimeout(() => {
        setVisibleLogs(prev => [...prev, log])
      }, (idx + 1) * LOG_DELAY_MS + totalSteps * STEP_DELAY_MS * 0.3)
    })

    const totalDuration = totalSteps * STEP_DELAY_MS + 300
    setTimeout(() => {
      setIsAnimating(false)
      setShowOutcome(true)
    }, totalDuration)
  }, [])

  const handleSelectScenario = useCallback((scenario) => {
    if (isAnimating) return
    setActiveScenario(scenario)
    runAnimation(scenario)
  }, [isAnimating, runAnimation])

  const handleReplay = useCallback(() => {
    if (isAnimating) return
    runAnimation(activeScenario)
  }, [isAnimating, activeScenario, runAnimation])

  const outcome = activeScenario.outcome

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <ScenarioSelector
          scenarios={scenarios}
          activeId={activeScenario.id}
          onSelect={handleSelectScenario}
          isAnimating={isAnimating}
          onReplay={handleReplay}
        />

        {showOutcome && (
          <div className={`outcome-banner ${outcome.status}`}>
            <span className="outcome-icon">
              {outcome.status === 'deployed'
                ? <CheckIcon size={18} title="Passed" />
                : <BlockIcon size={18} title="Blocked" />
              }
            </span>
            <span>{outcome.message}</span>
          </div>
        )}

        <PipelineFlow steps={animatedSteps} />

        <BackendPanel />

        <ScanResults
          sast={activeScenario.sast}
          trivy={activeScenario.trivy}
        />

        <EventLogs
          logs={visibleLogs}
          totalLogs={activeScenario.logs.length}
          isAnimating={isAnimating}
        />
      </main>
    </div>
  )
}
