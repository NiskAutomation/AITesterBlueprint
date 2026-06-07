import React, { useState, useEffect } from 'react'

function Settings({ config, setConfig, setActiveTab }) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load config from server on mount
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config')
      const data = await response.json()
      setConfig(prev => ({
        ...prev,
        jiraEmail: data.jira_email || '',
        jiraBaseUrl: data.jira_base_url || '',
        groqModel: data.groq_model || 'openai/gpt-oss-120b'
      }))
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setConfig(prev => ({ ...prev, [name]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleTestJira = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/jira/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: 'TES-1',
          email: config.jiraEmail,
          token: config.jiraToken,
          base_url: config.jiraBaseUrl
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('JIRA connection successful! Fetched TES-1.')
        setActiveTab('jira')
      } else {
        alert(`JIRA connection failed: ${data.error || data.details}`)
      }
    } catch (error) {
      alert(`Connection error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="settings-panel">
      <h2>Configuration Settings</h2>
      <p className="settings-desc">
        Configure your JIRA and GROQ API settings. These are used to fetch tickets and generate test plans.
      </p>

      <div className="settings-section">
        <h3>JIRA Configuration</h3>
        
        <div className="form-group">
          <label>Base URL</label>
          <input
            type="text"
            name="jiraBaseUrl"
            value={config.jiraBaseUrl}
            onChange={handleChange}
            placeholder="https://your-domain.atlassian.net/"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="jiraEmail"
            value={config.jiraEmail}
            onChange={handleChange}
            placeholder="your-email@example.com"
          />
        </div>

        <div className="form-group">
          <label>API Token</label>
          <input
            type="password"
            name="jiraToken"
            value={config.jiraToken}
            onChange={handleChange}
            placeholder="Your JIRA API Token"
          />
          <small className="hint">
            Get your token from: Atlassian Account Settings → Security → API Tokens
          </small>
        </div>

        <button 
          className="btn btn-test"
          onClick={handleTestJira}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test JIRA Connection (TES-1)'}
        </button>
      </div>

      <div className="settings-section">
        <h3>GROQ Configuration (Optional)</h3>
        
        <div className="form-group">
          <label>GROQ API Key</label>
          <input
            type="password"
            name="groqKey"
            value={config.groqKey}
            onChange={handleChange}
            placeholder="Your GROQ API Key (optional)"
          />
          <small className="hint">
            If empty, the system will use template-based deterministic generation.
          </small>
        </div>

        <div className="form-group">
          <label>Model</label>
          <input
            type="text"
            name="groqModel"
            value={config.groqModel}
            onChange={handleChange}
            placeholder="openai/gpt-oss-120b"
            disabled
          />
          <small className="hint">
            Default: openai/gpt-oss-120b (free tier)
          </small>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      <div className="info-box">
        <h4>About This App</h4>
        <p>
          This is the <strong>BLAST Framework</strong> application for Chapter 03 of the AITesterBlueprint.
          It follows the B.L.A.S.T methodology:
        </p>
        <ul>
          <li><strong>B</strong> - Blueprint (Data-first, anti-hallucination)</li>
          <li><strong>L</strong> - Link (JIRA API verification)</li>
          <li><strong>A</strong> - Architect (3-layer: SOPs, Tools, UI)</li>
          <li><strong>S</strong> - Stylize (Clean React UI)</li>
          <li><strong>T</strong> - Trigger (Deployment-ready)</li>
        </ul>
        <p>
          <strong>Target:</strong> JIRA Ticket TES-1 → Test Plan → Test Cases
        </p>
      </div>
    </div>
  )
}

export default Settings
