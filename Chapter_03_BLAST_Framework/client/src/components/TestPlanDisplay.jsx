import React, { useState } from 'react'

function TestPlanDisplay({ jiraTicket, testPlan, setTestPlan, setActiveTab, loading, setLoading, error, setError }) {
  const [mode, setMode] = useState('template')

  const handleGenerate = async () => {
    if (!jiraTicket) {
      setError('Please fetch a JIRA ticket first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate/test-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jira_ticket: jiraTicket,
          mode: mode
        })
      })

      const data = await response.json()

      if (data.success) {
        setTestPlan(data.data)
        setError(null)
      } else {
        setError(data.error || data.details || 'Failed to generate test plan')
        setTestPlan(null)
      }
    } catch (err) {
      setError(err.message)
      setTestPlan(null)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateTestCases = () => {
    setActiveTab('testcases')
  }

  if (!jiraTicket) {
    return (
      <div className="test-plan-panel">
        <h2>Test Plan</h2>
        <div className="info-box">
          <p>Please fetch a JIRA ticket first from the <strong>JIRA Ticket</strong> tab.</p>
          <button className="btn btn-primary" onClick={() => setActiveTab('jira')}>
            Go to JIRA Ticket
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="test-plan-panel">
      <h2>Test Plan Generator</h2>
      <p className="panel-desc">
        Generate a comprehensive test plan based on JIRA ticket: <strong>{jiraTicket.key}</strong>
      </p>

      <div className="mode-selector">
        <label>Generation Mode:</label>
        <div className="mode-options">
          <label className="radio-label">
            <input
              type="radio"
              value="template"
              checked={mode === 'template'}
              onChange={(e) => setMode(e.target.value)}
            />
            Template-Based (Deterministic)
          </label>
          <label className="radio-label">
            <input
              type="radio"
              value="llm"
              checked={mode === 'llm'}
              onChange={(e) => setMode(e.target.value)}
              disabled
            />
            LLM / GROQ (Requires API Key)
          </label>
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Test Plan'}
      </button>

      {error && (
        <div className="error-box">
          <strong>Error:</strong> {error}
        </div>
      )}

      {testPlan && (
        <div className="test-plan-card">
          <div className="plan-header">
            <h3>
              <span className="plan-id">{testPlan.plan_id}</span>
              <span className="plan-feature">{testPlan.feature}</span>
            </h3>
            <div className="plan-meta">
              <span className="badge">JIRA: {testPlan.jira_id}</span>
              <span className="badge">Mode: {testPlan.mode}</span>
              <span className="badge">Generated: {new Date(testPlan.created_at).toLocaleString()}</span>
            </div>
          </div>

          <div className="plan-body">
            <div className="plan-section">
              <h4>Scope</h4>
              <div className="scope-block">
                <h5>In Scope</h5>
                <ul>
                  {testPlan.scope?.in_scope?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="scope-block">
                <h5>Out of Scope</h5>
                <ul>
                  {testPlan.scope?.out_of_scope?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="plan-section">
              <h4>Test Strategy</h4>
              <p>{testPlan.test_strategy}</p>
            </div>

            <div className="plan-section">
              <h4>Environment</h4>
              <p>{testPlan.environment}</p>
            </div>

            <div className="plan-section">
              <h4>Test Levels</h4>
              <div className="tag-list">
                {testPlan.test_levels?.map((level, i) => (
                  <span key={i} className="tag">{level}</span>
                ))}
              </div>
            </div>

            <div className="plan-section">
              <h4>Test Types</h4>
              <div className="tag-list">
                {testPlan.test_types?.map((type, i) => (
                  <span key={i} className="tag">{type}</span>
                ))}
              </div>
            </div>

            <div className="plan-section">
              <h4>Entry Criteria</h4>
              <ul>
                {testPlan.entry_criteria?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="plan-section">
              <h4>Exit Criteria</h4>
              <ul>
                {testPlan.exit_criteria?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="plan-section">
              <h4>Risks</h4>
              <ul>
                {testPlan.risks?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="plan-section">
              <h4>Assumptions</h4>
              <ul>
                {testPlan.assumptions?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="plan-section">
              <h4>Dependencies</h4>
              <ul>
                {testPlan.dependencies?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="plan-section">
              <h4>Schedule & Resources</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Schedule:</strong> {testPlan.schedule}
                </div>
                <div className="detail-item">
                  <strong>Resources:</strong>
                  <ul>
                    {testPlan.resources?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="plan-actions">
            <button className="btn btn-primary" onClick={handleGenerateTestCases}>
              Generate Test Cases
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestPlanDisplay
