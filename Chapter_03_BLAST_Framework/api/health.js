module.exports = async (req, res) => {
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
};
