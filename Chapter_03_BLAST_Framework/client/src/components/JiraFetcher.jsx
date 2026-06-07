import React, { useState } from 'react'

function JiraFetcher({ config, jiraTicket, setJiraTicket, setActiveTab, loading, setLoading, error, setError }) {
  const [ticketId, setTicketId] = useState('TES-1')
  const [useCustomCreds, setUseCustomCreds] = useState(false)
  const [customCreds, setCustomCreds] = useState({
    email: '',
    token: '',
    baseUrl: ''
  })

  const handleFetch = async () => {
    setLoading(true)
    setError(null)
    
    const creds = useCustomCreds ? customCreds : {
      email: config.jiraEmail,
      token: config.jiraToken,
      baseUrl: config.jiraBaseUrl
    }

    try {
      const response = await fetch('/api/jira/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticketId,
          email: creds.email,
          token: creds.token,
          base_url: creds.baseUrl
        })
      })

      const data = await response.json()

      if (data.success) {
        setJiraTicket(data.data)
        setError(null)
      } else {
        setError(data.error || data.details || 'Unknown error')
        setJiraTicket(null)
      }
    } catch (err) {
      setError(err.message)
      setJiraTicket(null)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateTestPlan = () => {
    setActiveTab('testplan')
  }

  return (
    <div className="jira-panel">
      <h2>JIRA Ticket Fetcher</h2>
      <p className="panel-desc">
        Fetch a JIRA ticket to analyze its details and generate test artifacts.
      </p>

      <div className="fetch-form">
        <div className="form-group">
          <label>Ticket ID</label>
          <input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="TES-1"
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={useCustomCreds}
              onChange={(e) => setUseCustomCreds(e.target.checked)}
            />
            Use custom credentials
          </label>
        </div>

        {useCustomCreds && (
          <div className="custom-creds">
            <div className="form-group">
              <label>Base URL</label>
              <input
                type="text"
                value={customCreds.baseUrl}
                onChange={(e) => setCustomCreds({...customCreds, baseUrl: e.target.value})}
                placeholder="https://your-domain.atlassian.net/"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={customCreds.email}
                onChange={(e) => setCustomCreds({...customCreds, email: e.target.value})}
                placeholder="your-email@example.com"
              />
            </div>
            <div className="form-group">
              <label>Token</label>
              <input
                type="password"
                value={customCreds.token}
                onChange={(e) => setCustomCreds({...customCreds, token: e.target.value})}
                placeholder="API Token"
              />
            </div>
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={handleFetch}
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Fetch Ticket'}
        </button>
      </div>

      {error && (
        <div className="error-box">
          <strong>Error:</strong> {error}
        </div>
      )}

      {jiraTicket && (
        <div className="ticket-card">
          <div className="ticket-header">
            <h3>
              <span className="ticket-key">{jiraTicket.key}</span>
              <span className="ticket-summary">{jiraTicket.summary}</span>
            </h3>
            <div className="ticket-meta">
              <span className={`badge status-${jiraTicket.status?.toLowerCase().replace(' ', '-')}`}>
                {jiraTicket.status}
              </span>
              <span className={`badge priority-${jiraTicket.priority?.toLowerCase()}`}>
                {jiraTicket.priority}
              </span>
              <span className="badge type">{jiraTicket.type}</span>
            </div>
          </div>

          <div className="ticket-body">
            <div className="ticket-section">
              <h4>Description</h4>
              <p className="ticket-description">
                {jiraTicket.description || 'No description provided.'}
              </p>
            </div>

            {jiraTicket.acceptance_criteria && (
              <div className="ticket-section">
                <h4>Acceptance Criteria</h4>
                <pre className="ticket-ac">{jiraTicket.acceptance_criteria}</pre>
              </div>
            )}

            <div className="ticket-details">
              <div className="detail-item">
                <strong>Assignee:</strong> {jiraTicket.assignee}
              </div>
              <div className="detail-item">
                <strong>Created:</strong> {new Date(jiraTicket.created).toLocaleDateString()}
              </div>
              <div className="detail-item">
                <strong>Updated:</strong> {new Date(jiraTicket.updated).toLocaleDateString()}
              </div>
              <div className="detail-item">
                <strong>Labels:</strong> {jiraTicket.labels?.join(', ') || 'None'}
              </div>
              <div className="detail-item">
                <strong>Components:</strong> {jiraTicket.components?.join(', ') || 'None'}
              </div>
              <div className="detail-item">
                <strong>URL:</strong>
                <a href={jiraTicket.url} target="_blank" rel="noopener noreferrer">
                  {jiraTicket.url}
                </a>
              </div>
            </div>
          </div>

          <div className="ticket-actions">
            <button className="btn btn-primary" onClick={handleGenerateTestPlan}>
              Generate Test Plan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default JiraFetcher
