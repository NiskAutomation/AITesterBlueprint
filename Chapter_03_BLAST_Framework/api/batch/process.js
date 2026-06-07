const { spawn } = require('child_process');
const path = require('path');

const TOOLS_DIR = path.join(__dirname, '..', '..', 'tools');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { jira_ids, email, token, base_url, generate_test_cases } = req.body;
  
  if (!jira_ids || !Array.isArray(jira_ids) || jira_ids.length === 0) {
    return res.status(400).json({
      error: 'Missing jira_ids',
      details: 'Provide an array of JIRA ticket IDs'
    });
  }
  
  const jiraEmail = email || process.env.JIRA_EMAIL;
  const jiraToken = token || process.env.JIRA_API_TOKEN;
  const jiraBaseUrl = base_url || process.env.JIRA_BASE_URL;
  
  if (!jiraEmail || !jiraToken || !jiraBaseUrl) {
    return res.status(400).json({
      error: 'Missing JIRA credentials',
      details: 'Provide email, token, and base_url or set them in environment variables'
    });
  }
  
  try {
    const args = [
      path.join(TOOLS_DIR, 'batch_process.py'),
      ...jira_ids
    ];
    
    if (generate_test_cases) {
      args.push('--test-cases');
    }
    
    const pythonProcess = spawn('python', args, {
      env: {
        ...process.env,
        JIRA_EMAIL: jiraEmail,
        JIRA_API_TOKEN: jiraToken,
        JIRA_BASE_URL: jiraBaseUrl
      }
    });
    
    let output = '';
    let errorOutput = '';
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          error: 'Batch processing failed',
          details: errorOutput || `Python script exited with code ${code}`
        });
      }
      
      try {
        const data = JSON.parse(output);
        res.json(data);
      } catch (e) {
        res.status(500).json({
          error: 'Failed to parse batch results',
          details: e.message
        });
      }
    });
    
    pythonProcess.on('error', (error) => {
      res.status(500).json({
        error: 'Server error',
        details: error.message
      });
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
};
