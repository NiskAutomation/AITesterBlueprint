import React, { useState } from 'react'
import Settings from './components/Settings'
import JiraFetcher from './components/JiraFetcher'
import TestPlanDisplay from './components/TestPlanDisplay'
import TestCaseDisplay from './components/TestCaseDisplay'
import BatchProcessor from './components/BatchProcessor'

function App() {
  const [activeTab, setActiveTab] = useState('settings')
  const [config, setConfig] = useState({
    jiraEmail: '',
    jiraToken: '',
    jiraBaseUrl: '',
    groqKey: '',
    groqModel: 'openai/gpt-oss-120b'
  })
  const [jiraTicket, setJiraTicket] = useState(null)
  const [testPlan, setTestPlan] = useState(null)
  const [testCases, setTestCases] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const tabs = [
    { id: 'settings', label: 'Settings' },
    { id: 'jira', label: 'JIRA Ticket' },
    { id: 'testplan', label: 'Test Plan' },
    { id: 'testcases', label: 'Test Cases' },
    { id: 'batch', label: 'Batch Process' }
  ]

  return (
    <div className="app">
      <header className="app-header">
        <h1>BLAST Framework</h1>
        <p className="subtitle">JIRA to TestPlan & TestCases Generator</p>
        <div className="phase-indicator">
          Phase: 3 - Architect | Objective: TES-1
        </div>
      </header>

      <nav className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {activeTab === 'settings' && (
          <Settings 
            config={config} 
            setConfig={setConfig}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'jira' && (
          <JiraFetcher
            config={config}
            jiraTicket={jiraTicket}
            setJiraTicket={setJiraTicket}
            setActiveTab={setActiveTab}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
          />
        )}

        {activeTab === 'testplan' && (
          <TestPlanDisplay
            jiraTicket={jiraTicket}
            testPlan={testPlan}
            setTestPlan={setTestPlan}
            setActiveTab={setActiveTab}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
          />
        )}

        {activeTab === 'testcases' && (
          <TestCaseDisplay
            jiraTicket={jiraTicket}
            testPlan={testPlan}
            testCases={testCases}
            setTestCases={setTestCases}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
          />
        )}

        {activeTab === 'batch' && (
          <BatchProcessor config={config} />
        )}
      </main>

      <footer className="app-footer">
        <p>BLAST Framework v1.0 | Phase 3: Architect | Built with React + Express + Python</p>
      </footer>
    </div>
  )
}

export default App
