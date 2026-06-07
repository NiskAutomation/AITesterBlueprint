# SOP: Fetch JIRA Ticket

## Goal
Fetch a JIRA ticket by ID using the JIRA REST API v2.

## Inputs
- `jira_email`: JIRA account email (from .env or user input)
- `jira_api_token`: JIRA API token (from .env or user input)
- `base_url`: JIRA instance URL (e.g., `https://nishikantpradhan1996.atlassian.net/`)
- `ticket_id`: Ticket ID (e.g., `TES-1`)

## Tool Logic
1. Construct the API endpoint: `{base_url}/rest/api/2/issue/{ticket_id}`
2. Create Basic Auth header: `base64(email:api_token)`
3. Send GET request with headers:
   - `Authorization: Basic {base64(email:token)}`
   - `Accept: application/json`
4. Parse JSON response
5. Extract relevant fields: `key`, `fields.summary`, `fields.description`, `fields.priority`, `fields.status`, `fields.labels`, `fields.components`, `fields.issuetype`, `fields.assignee`, `fields.created`, `fields.updated`
6. Return structured JSON object

## Edge Cases
- **Invalid credentials**: Return 401 error with clear message
- **Ticket not found**: Return 404 error
- **Network error**: Return 500 error with details
- **Missing fields**: Return null for optional fields, never crash
- **Rate limiting**: JIRA API has rate limits. If 429, retry with exponential backoff

## Validation
- `base_url` must end with `/`
- `ticket_id` must match pattern `[A-Z]+-[0-9]+`
- `email` must be valid email format
- `api_token` must be non-empty

## Output Format
```json
{
  "success": true,
  "data": {
    "id": "10001",
    "key": "TES-1",
    "summary": "...",
    "description": "...",
    "priority": "High",
    "status": "In Progress",
    "type": "Story",
    "assignee": "...",
    "created": "2026-01-01T00:00:00.000Z",
    "updated": "2026-01-02T00:00:00.000Z",
    "labels": [],
    "components": [],
    "acceptance_criteria": "..."
  }
}
```

## Error Format
```json
{
  "success": false,
  "error": "string",
  "details": "string"
}
```
