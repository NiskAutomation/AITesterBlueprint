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
  
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({
      error: 'Missing content',
      details: 'Provide markdown file content'
    });
  }
  
  // Extract JIRA IDs from markdown content
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
};
