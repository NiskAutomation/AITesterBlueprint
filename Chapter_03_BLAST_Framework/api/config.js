module.exports = async (req, res) => {
  res.json({
    jira_base_url: process.env.JIRA_BASE_URL || '',
    jira_email: process.env.JIRA_EMAIL || '',
    groq_key_present: !!process.env.GROQ_KEY,
    groq_model: 'openai/gpt-oss-120b'
  });
};
