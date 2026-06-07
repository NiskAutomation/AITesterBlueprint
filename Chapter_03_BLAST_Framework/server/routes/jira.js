const express = require('express');
const axios = require('axios');
const router = express.Router();

// POST /api/jira/fetch - Fetch JIRA ticket
router.post('/fetch', async (req, res) => {
  const { ticket_id, email, token, base_url } = req.body;

  if (!ticket_id) {
    return res.status(400).json({
      error: 'Missing ticket_id',
      details: 'Please provide a JIRA ticket ID (e.g., TES-1)'
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
    const normalizedUrl = jiraBaseUrl.endsWith('/') ? jiraBaseUrl : jiraBaseUrl + '/';
    const endpoint = `${normalizedUrl}rest/api/2/issue/${ticket_id}`;
    
    const credentials = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');
    
    const response = await axios.get(endpoint, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    const rawData = response.data;
    const fields = rawData.fields || {};

    // Extract description
    let description = '';
    if (fields.description) {
      if (typeof fields.description === 'string') {
        description = fields.description;
      } else if (fields.description.content) {
        // ADF format - extract text
        description = extractTextFromADF(fields.description);
      }
    }

    // Extract acceptance criteria
    let acceptanceCriteria = fields.customfield_10016 || '';
    if (!acceptanceCriteria && description) {
      acceptanceCriteria = extractAcceptanceCriteria(description);
    }

    const ticket = {
      id: rawData.id,
      key: rawData.key,
      summary: fields.summary || '',
      description: description,
      priority: fields.priority?.name || 'Medium',
      status: fields.status?.name || 'Unknown',
      type: fields.issuetype?.name || 'Unknown',
      assignee: fields.assignee?.displayName || 'Unassigned',
      created: fields.created,
      updated: fields.updated,
      labels: fields.labels || [],
      components: (fields.components || []).map(c => c.name),
      acceptance_criteria: acceptanceCriteria,
      url: `${normalizedUrl}browse/${ticket_id}`
    };

    res.json({
      success: true,
      data: ticket
    });

  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        return res.status(401).json({
          error: 'Authentication failed',
          details: 'Invalid JIRA email or API token. Please check your credentials.'
        });
      } else if (status === 404) {
        return res.status(404).json({
          error: 'Ticket not found',
          details: `Ticket ${ticket_id} does not exist or you don't have permission.`
        });
      } else {
        return res.status(status).json({
          error: `JIRA API error (${status})`,
          details: error.response.data || 'Unknown error'
        });
      }
    }

    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
});

// Helper functions
function extractTextFromADF(adf) {
  const texts = [];
  
  function extractContent(content) {
    if (Array.isArray(content)) {
      content.forEach(item => extractContent(item));
    } else if (typeof content === 'object') {
      if (content.text) {
        texts.push(content.text);
      }
      if (content.content) {
        extractContent(content.content);
      }
    }
  }
  
  extractContent(adf);
  return texts.join(' ');
}

function extractAcceptanceCriteria(description) {
  const patterns = [
    'acceptance criteria',
    'acceptance criteria:',
    'ac:',
    'given when then',
    'scenario:',
    'criteria:'
  ];
  
  const descLower = description.toLowerCase();
  
  for (const pattern of patterns) {
    if (descLower.includes(pattern)) {
      const idx = descLower.indexOf(pattern);
      if (idx !== -1) {
        return description.substring(idx).trim();
      }
    }
  }
  
  return '';
}

module.exports = router;
