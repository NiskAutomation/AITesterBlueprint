const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const jiraRoutes = require('./routes/jira');
const generateRoutes = require('./routes/generate');
const batchRoutes = require('./routes/batch');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'BLAST Framework API Server',
    version: '1.0.0',
    features: [
      'JIRA ticket fetch',
      'Test plan generation',
      'Test case generation',
      'Batch processing',
      'Markdown JIRA ID extraction'
    ],
    phases: {
      phase0: 'Initialization: Complete',
      phase1: 'Blueprint: Complete',
      phase2: 'Link: Complete',
      phase3: 'Architect: Complete',
      phase4: 'Stylize: Complete',
      phase5: 'Trigger: Complete'
    }
  });
});

// Config endpoint (safe - no secrets)
app.get('/api/config', (req, res) => {
  res.json({
    jira_base_url: process.env.JIRA_BASE_URL || '',
    jira_email: process.env.JIRA_EMAIL || '',
    groq_key_present: !!process.env.GROQ_KEY,
    groq_model: 'openai/gpt-oss-120b'
  });
});

// Routes
app.use('/api/jira', jiraRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/batch', batchRoutes);

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`BLAST Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
