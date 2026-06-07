import React, { useState } from 'react'

function TestCaseDisplay({ jiraTicket, testPlan, testCases, setTestCases, loading, setLoading, error, setError }) {
  const [mode, setMode] = useState('template')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const handleGenerate = async () => {
    if (!jiraTicket || !testPlan) {
      setError('Please fetch a JIRA ticket and generate a test plan first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate/test-cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jira_ticket: jiraTicket,
          test_plan: testPlan,
          mode: mode
        })
      })

      const data = await response.json()

      if (data.success) {
        setTestCases(data.data)
        setError(null)
      } else {
        setError(data.error || data.details || 'Failed to generate test cases')
        setTestCases(null)
      }
    } catch (err) {
      setError(err.message)
      setTestCases(null)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!testCases) return

    const dataStr = JSON.stringify(testCases, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `test-cases-${jiraTicket?.key || 'unknown'}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadMarkdown = () => {
    if (!testCases) return

    let md = `# Test Cases for ${jiraTicket?.key || 'Unknown'}\n\n`
    md += `**Generated:** ${new Date().toLocaleString()}\n\n`
    md += `**Total Test Cases:** ${testCases.total_test_cases}\n\n`
    md += `**Mode:** ${testCases.mode}\n\n`
    md += `---\n\n`

    testCases.test_cases?.forEach((tc, index) => {
      md += `## ${tc.tc_id} - ${tc.title}\n\n`
      md += `- **Category:** ${tc.category}\n`
      md += `- **Priority:** ${tc.priority}\n`
      md += `- **Type:** ${tc.type}\n`
      md += `- **Automation:** ${tc.automation}\n`
      md += `- **Traceability:** ${tc.traceability}\n\n`
      md += `**Description:** ${tc.description}\n\n`
      md += `**Pre-conditions:** ${tc.pre_conditions}\n\n`
      md += `**Steps:**\n\n`
      tc.steps?.forEach(step => {
        md += `${step.step_no}. **Action:** ${step.action}\n`
        md += `   **Expected:** ${step.expected}\n\n`
      })
      md += `**Expected Result:** ${tc.expected_result}\n\n`
      md += `**Post-conditions:** ${tc.post_conditions}\n\n`
      if (tc.notes) {
        md += `**Notes:** ${tc.notes}\n\n`
      }
      md += `---\n\n`
    })

    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `test-cases-${jiraTicket?.key || 'unknown'}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredTestCases = testCases?.test_cases?.filter(tc => {
    if (selectedCategory === 'all') return true
    return tc.category.toLowerCase() === selectedCategory.toLowerCase()
  }) || []

  const categories = testCases?.test_cases
    ? [...new Set(testCases.test_cases.map(tc => tc.category))]
    : []

  if (!jiraTicket || !testPlan) {
    return (
      <div className="test-cases-panel">
        <h2>Test Cases</h2>
        <div className="info-box">
          <p>Please complete the previous steps first:</p>
          <ol>
            <li>Fetch a JIRA ticket</li>
            <li>Generate a Test Plan</li>
          </ol>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Start Over
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="test-cases-panel">
      <h2>Test Case Generator</h2>
      <p className="panel-desc">
        Generate test cases for: <strong>{jiraTicket.key}</strong> based on Test Plan: <strong>{testPlan.plan_id}</strong>
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
        {loading ? 'Generating...' : 'Generate Test Cases'}
      </button>

      {error && (
        <div className="error-box">
          <strong>Error:</strong> {error}
        </div>
      )}

      {testCases && (
        <div className="test-cases-container">
          <div className="test-cases-header">
            <h3>
              Test Cases for {testCases.jira_id}
              <span className="badge">{testCases.total_test_cases} total</span>
              <span className="badge">{testCases.mode}</span>
            </h3>

            <div className="filter-bar">
              <label>Filter by Category:</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="download-actions">
              <button className="btn btn-secondary" onClick={handleDownload}>
                Download JSON
              </button>
              <button className="btn btn-secondary" onClick={handleDownloadMarkdown}>
                Download Markdown
              </button>
            </div>
          </div>

          <div className="test-cases-list">
            {filteredTestCases.map((tc, index) => (
              <div key={tc.tc_id} className={`test-case-card priority-${tc.priority.toLowerCase()}`}>
                <div className="tc-header">
                  <span className="tc-id">{tc.tc_id}</span>
                  <span className={`badge category-${tc.category.toLowerCase()}`}>{tc.category}</span>
                  <span className={`badge priority-${tc.priority.toLowerCase()}`}>{tc.priority}</span>
                  <span className="badge">{tc.type}</span>
                  <span className="badge">Auto: {tc.automation}</span>
                </div>

                <h4 className="tc-title">{tc.title}</h4>

                <div className="tc-section">
                  <strong>Description:</strong>
                  <p>{tc.description}</p>
                </div>

                <div className="tc-section">
                  <strong>Pre-conditions:</strong>
                  <p>{tc.pre_conditions}</p>
                </div>

                <div className="tc-section">
                  <strong>Steps:</strong>
                  <ol>
                    {tc.steps?.map(step => (
                      <li key={step.step_no}>
                        <strong>Action:</strong> {step.action}
                        <br />
                        <strong>Expected:</strong> {step.expected}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="tc-section">
                  <strong>Expected Result:</strong>
                  <p>{tc.expected_result}</p>
                </div>

                <div className="tc-section">
                  <strong>Post-conditions:</strong>
                  <p>{tc.post_conditions}</p>
                </div>

                <div className="tc-footer">
                  <span className="trace">Traceability: {tc.traceability}</span>
                  {tc.notes && <span className="notes">Notes: {tc.notes}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TestCaseDisplay
