import React, { useState } from 'react'

function BatchProcessor({ config }) {
  const [mdContent, setMdContent] = useState('')
  const [jiraIds, setJiraIds] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [generateTC, setGenerateTC] = useState(false)
  const [step, setStep] = useState('upload') // upload, review, processing, done

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setMdContent(event.target.result)
      extractJiraIds(event.target.result)
    }
    reader.readAsText(file)
  }

  const handlePaste = (e) => {
    const content = e.target.value
    setMdContent(content)
    extractJiraIds(content)
  }

  const extractJiraIds = (content) => {
    const pattern = /[A-Z]+-\d+/g
    const matches = content.match(pattern) || []
    const unique = [...new Set(matches)]
    setJiraIds(unique)
    if (unique.length > 0) {
      setStep('review')
    }
  }

  const handleProcess = async () => {
    if (jiraIds.length === 0) {
      setError('No JIRA IDs to process')
      return
    }

    setLoading(true)
    setError(null)
    setStep('processing')

    try {
      const response = await fetch('/api/batch/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jira_ids: jiraIds,
          email: config.jiraEmail,
          token: config.jiraToken,
          base_url: config.jiraBaseUrl,
          generate_test_cases: generateTC
        })
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error || data.details)
        setStep('review')
      } else {
        setResults(data)
        setStep('done')
      }
    } catch (err) {
      setError(err.message)
      setStep('review')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadAll = () => {
    if (!results) return

    const dataStr = JSON.stringify(results, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `batch-test-plans-${results.batch_id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadMarkdown = () => {
    if (!results) return

    let md = `# Batch Test Plans - ${results.batch_id}\n\n`
    md += `**Generated:** ${new Date(results.processed_at).toLocaleString()}\n\n`
    md += `**Total:** ${results.total} | **Successful:** ${results.successful} | **Failed:** ${results.failed}\n\n`
    md += `---\n\n`

    results.items?.forEach((item) => {
      if (item.success && item.test_plan) {
        md += `## ${item.ticket_id} - ${item.ticket?.summary || 'Unknown'}\n\n`
        md += `- **Type:** ${item.ticket?.type || 'Unknown'}\n`
        md += `- **Priority:** ${item.ticket?.priority || 'Unknown'}\n`
        md += `- **Status:** ${item.ticket?.status || 'Unknown'}\n\n`
        
        md += `### Test Plan: ${item.test_plan.plan_id}\n\n`
        md += `**Feature:** ${item.test_plan.feature}\n\n`
        md += `**Strategy:** ${item.test_plan.test_strategy}\n\n`
        md += `**Environment:** ${item.test_plan.environment}\n\n`
        md += `**Schedule:** ${item.test_plan.schedule}\n\n`
        
        md += `**Test Levels:** ${item.test_plan.test_levels?.join(', ')}\n\n`
        md += `**Test Types:** ${item.test_plan.test_types?.join(', ')}\n\n`
        
        md += `**Entry Criteria:**\n`
        item.test_plan.entry_criteria?.forEach(c => { md += `- ${c}\n` })
        md += `\n`
        
        md += `**Exit Criteria:**\n`
        item.test_plan.exit_criteria?.forEach(c => { md += `- ${c}\n` })
        md += `\n`
        
        md += `**Risks:**\n`
        item.test_plan.risks?.forEach(r => { md += `- ${r}\n` })
        md += `\n`

        if (item.test_cases) {
          md += `### Test Cases (${item.test_cases.total_test_cases})\n\n`
          item.test_cases.test_cases?.forEach((tc) => {
            md += `#### ${tc.tc_id} - ${tc.title}\n\n`
            md += `- **Category:** ${tc.category} | **Priority:** ${tc.priority} | **Type:** ${tc.type}\n\n`
            md += `**Steps:**\n\n`
            tc.steps?.forEach(step => {
              md += `${step.step_no}. **Action:** ${step.action}\n`
              md += `   **Expected:** ${step.expected}\n\n`
            })
            md += `**Expected Result:** ${tc.expected_result}\n\n`
            md += `---\n\n`
          })
        }
        
        md += `---\n\n`
      }
    })

    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `batch-test-plans-${results.batch_id}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="batch-processor">
      <h2>Batch Test Plan Generator</h2>
      <p className="panel-desc">
        Upload or paste a markdown file containing JIRA IDs to generate test plans for all tickets at once.
      </p>

      {step === 'upload' && (
        <div className="upload-section">
          <div className="form-group">
            <label>Upload Markdown File</label>
            <input
              type="file"
              accept=".md,.markdown,.txt"
              onChange={handleFileUpload}
              className="file-input"
            />
            <small className="hint">File should contain JIRA IDs in format: PROJECT-123</small>
          </div>

          <div className="form-group">
            <label>Or Paste Content</label>
            <textarea
              className="paste-area"
              rows={10}
              placeholder="Paste your markdown content here...&#10;JIRA IDs will be automatically detected.&#10;&#10;Example:&#10;TES-1 - Login Feature&#10;TES-2 - Dashboard&#10;PROJ-100 - API Integration"
              onChange={handlePaste}
              value={mdContent}
            />
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="review-section">
          <h3>Found {jiraIds.length} JIRA IDs</h3>
          
          <div className="jira-id-list">
            {jiraIds.map((id, index) => (
              <span key={id} className="jira-id-badge">
                {id}
              </span>
            ))}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={generateTC}
                onChange={(e) => setGenerateTC(e.target.checked)}
              />
              Also generate test cases for each ticket
            </label>
          </div>

          <div className="batch-actions">
            <button
              className="btn btn-primary"
              onClick={handleProcess}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Generate Test Plans for ${jiraIds.length} Tickets`}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setStep('upload')
                setJiraIds([])
                setMdContent('')
              }}
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {step === 'processing' && (
        <div className="processing-section">
          <div className="spinner"></div>
          <p>Processing {jiraIds.length} JIRA tickets...</p>
          <p className="hint">This may take a few moments depending on the number of tickets.</p>
        </div>
      )}

      {error && (
        <div className="error-box">
          <strong>Error:</strong> {error}
        </div>
      )}

      {step === 'done' && results && (
        <div className="results-section">
          <h3>Batch Results: {results.batch_id}</h3>
          
          <div className="results-summary">
            <div className="result-stat success">
              <span className="stat-number">{results.successful}</span>
              <span className="stat-label">Successful</span>
            </div>
            <div className="result-stat failed">
              <span className="stat-number">{results.failed}</span>
              <span className="stat-label">Failed</span>
            </div>
            <div className="result-stat total">
              <span className="stat-number">{results.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>

          <div className="download-actions">
            <button className="btn btn-secondary" onClick={handleDownloadAll}>
              Download All (JSON)
            </button>
            <button className="btn btn-secondary" onClick={handleDownloadMarkdown}>
              Download All (Markdown)
            </button>
          </div>

          <div className="results-list">
            {results.items?.map((item, index) => (
              <div key={item.ticket_id} className={`result-item ${item.success ? 'success' : 'failed'}`}>
                <div className="result-header">
                  <span className="result-id">{item.ticket_id}</span>
                  <span className={`result-status ${item.success ? 'success' : 'failed'}`}>
                    {item.success ? '✓' : '✗'}
                  </span>
                </div>
                
                {item.success && item.ticket && (
                  <div className="result-details">
                    <p><strong>{item.ticket.summary}</strong></p>
                    <p className="ticket-meta-inline">
                      {item.ticket.type} | {item.ticket.priority} | {item.ticket.status}
                    </p>
                    
                    {item.test_plan && (
                      <div className="plan-mini">
                        <strong>Test Plan:</strong> {item.test_plan.plan_id}
                        <br />
                        <strong>Schedule:</strong> {item.test_plan.schedule}
                        <br />
                        <strong>Strategy:</strong> {item.test_plan.test_strategy}
                      </div>
                    )}
                    
                    {item.test_cases && (
                      <div className="tc-mini">
                        <strong>Test Cases:</strong> {item.test_cases.total_test_cases} generated
                      </div>
                    )}
                  </div>
                )}
                
                {!item.success && item.error && (
                  <div className="error-mini">
                    Error: {item.error}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="batch-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                setStep('upload')
                setJiraIds([])
                setMdContent('')
                setResults(null)
                setError(null)
              }}
            >
              Process Another Batch
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BatchProcessor
