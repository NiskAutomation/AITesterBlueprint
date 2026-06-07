# Project Constitution (gemini.md)

## Behavioral Rules
1. **BLAST Framework Discipline**: Strictly follow all 5 phases in order. No skipping.
2. **No Premature Coding**: No `tools/` scripts until Phase 1 Data Schema is confirmed.
3. **Security**: JIRA API token is NEVER logged, hardcoded, or exposed. Only use `.env` / `process.env`.
4. **Anti-Hallucination**: All generated tests must be traceable to JIRA ticket data. No invented features, IDs, error codes, or UI elements.
5. **Deterministic**: Prefer template-based generation over LLM when GROQ key is missing.
6. **RICE-POT Alignment**: Test output follows structured format (Role, Instructions, Context, Example, Parameters, Output, Tone).
7. **Lightweight**: Minimal dependencies, fast builds, clean code.

## Data Schemas

### Input Schema (JIRA Configuration)
```json
{
  "jira": {
    "email": "string",
    "api_token": "string (sensitive)",
    "base_url": "string (https://...atlassian.net/)"
  },
  "groq": {
    "api_key": "string (optional)",
    "model": "openai/gpt-oss-120b"
  },
  "ticket_id": "TES-1"
}
```

### JIRA Ticket Schema (API Response)
```json
{
  "id": "string",
  "key": "TES-1",
  "fields": {
    "summary": "string",
    "description": "string | null",
    "issuetype": { "name": "string" },
    "priority": { "name": "string" },
    "status": { "name": "string" },
    "assignee": { "displayName": "string" },
    "created": "string (ISO 8601)",
    "updated": "string (ISO 8601)",
    "labels": ["string"],
    "components": [{"name": "string"}],
    "customfield_10016": "string (acceptance criteria)"
  }
}
```

### Test Plan Schema (Output)
```json
{
  "plan_id": "TP-{jira_id}",
  "jira_id": "TES-1",
  "feature": "string (from summary)",
  "scope": "string",
  "test_strategy": "string",
  "environment": "string",
  "test_levels": ["Unit", "Integration", "System", "Acceptance"],
  "test_types": ["Functional", "Non-Functional"],
  "entry_criteria": ["string"],
  "exit_criteria": ["string"],
  "risks": ["string"],
  "assumptions": ["string"],
  "dependencies": ["string"],
  "schedule": "string",
  "resources": ["string"],
  "created_at": "string (ISO 8601)",
  "generated_by": "string"
}
```

### Test Case Schema (Output)
```json
{
  "tc_id": "TES-1_TC_{001..n}",
  "jira_id": "TES-1",
  "plan_id": "TP-TES-1",
  "category": "string (Functional | Boundary | Negative | Security | Integration | Regression)",
  "priority": "string (High | Medium | Low)",
  "type": "string (Positive | Negative)",
  "title": "string",
  "description": "string",
  "pre_conditions": "string",
  "steps": [
    { "step_no": 1, "action": "string", "expected": "string" }
  ],
  "expected_result": "string",
  "post_conditions": "string",
  "traceability": "TES-1",
  "automation": "string (Yes | No | Future)",
  "notes": "string"
}
```

## Architectural Invariants
- **JIRA is Source of Truth**: All test artifacts trace back to the JIRA ticket.
- **Deterministic Generation**: If GROQ key is missing, use template-based generation.
- **Modular Tools**: Each Python script in `tools/` is atomic and testable.
- **SOP-Driven**: If logic changes, update the SOP in `architecture/` before updating code.
- **React Frontend**: Stateless presentation layer. All logic in backend/tools.
- **Express Backend**: API gateway, auth proxy, orchestration layer.
- **Environment Variables**: All secrets in `.env` only.

## API Endpoints

### Backend (Express)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/jira/fetch` | Fetch JIRA ticket by ID |
| POST | `/api/generate/test-plan` | Generate test plan from ticket |
| POST | `/api/generate/test-cases` | Generate test cases from plan |
| GET | `/api/config` | Get current configuration (safe) |

## Error Handling Rules
- All API errors return JSON: `{ "error": "string", "details": "string" }`
- HTTP status codes: 200 (OK), 400 (Bad Request), 401 (Unauthorized), 500 (Server Error)
- JIRA auth failures: Return 401 with clear message
- Missing GROQ key: Return 200 with fallback mode flag
- Validation: All inputs validated before processing
