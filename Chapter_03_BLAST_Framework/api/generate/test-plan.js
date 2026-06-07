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
  
  const { jira_ticket, mode } = req.body;
  
  if (!jira_ticket) {
    return res.status(400).json({
      error: 'Missing jira_ticket',
      details: 'Provide JIRA ticket data'
    });
  }

  try {
    const result = await runPythonScript('generate_test_plan.py', JSON.stringify(jira_ticket));
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        mode: mode || 'template'
      });
    } else {
      res.status(500).json({
        error: 'Test plan generation failed',
        details: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
};

function runPythonScript(scriptName, ...args) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(TOOLS_DIR, scriptName);
    const pythonProcess = spawn('python', [scriptPath, ...args]);
    
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
        resolve({
          success: false,
          error: errorOutput || `Python script exited with code ${code}`
        });
      } else {
        try {
          const data = JSON.parse(output);
          resolve({ success: true, data });
        } catch (e) {
          resolve({
            success: false,
            error: `Failed to parse JSON output: ${e.message}`
          });
        }
      }
    });
    
    pythonProcess.on('error', (error) => {
      reject(error);
    });
  });
}
