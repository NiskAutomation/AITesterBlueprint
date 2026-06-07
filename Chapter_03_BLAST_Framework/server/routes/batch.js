const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const router = express.Router();

const TOOLS_DIR = path.join(__dirname, '..', '..', 'tools');

// POST /api/batch/process - Process multiple JIRA IDs
router.post('/process', async (req, res) => {
  const { jira_ids, email, token, base_url, generate_test_cases } = req.body;
  
  if (!jira_ids || !Array.isArray(jira_ids) || jira_ids.length === 0) {
    return res.status(400).json({
      error: 'Missing jira_ids',
      details: 'Provide an array of JIRA ticket IDs'
    });
  }
  
  // Use .env defaults if not provided
  const jiraEmail = email || process.env.JIRA_EMAIL;
  const jiraToken = token || process.env.JIRA_API_TOKEN;
  const jiraBaseUrl = base_url || process.env.JIRA_BASE_URL;
  
  if (!jiraEmail || !jiraToken || !jiraBaseUrl) {
    return res.status(400).json({
      error: 'Missing JIRA credentials',
      details: 'Provide email, token, and base_url or set them in .env file'
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
});

// POST /api/batch/upload - Upload MD file with JIRA IDs
router.post('/upload', async (req, res) => {
  const { content, email, token, base_url, generate_test_cases } = req.body;
  
  if (!content) {
    return res.status(400).json({
      error: 'Missing content',
      details: 'Provide markdown file content'
    });
  }
  
  // Extract JIRA IDs from markdown content
  // Pattern: TES-1, TES-2, PROJ-123, etc.
  const jiraIdPattern = /[A-Z]+-\d+/g;
  const jiraIds = [...content.matchAll(jiraIdPattern)].map(match => match[0]);
  
  // Remove duplicates
  const uniqueJiraIds = [...new Set(jiraIds)];
  
  if (uniqueJiraIds.length === 0) {
    return res.status(400).json({
      error: 'No JIRA IDs found',
      details: 'The markdown file does not contain any valid JIRA IDs (format: PROJECT-123)'
    });
  }
  
  res.json({
    success: true,
    jira_ids: uniqueJiraIds,
    total_found: uniqueJiraIds.length,
    message: `Found ${uniqueJiraIds.length} unique JIRA IDs. Use /api/batch/process to process them.`
  });
});

module.exports = router;
