# BLAST Framework - Chapter 03

## JIRA to TestPlan & TestCases Generator

A lightweight React application that connects to JIRA, fetches ticket details, and automatically generates comprehensive Test Plans and Test Cases.

## BLAST Framework Phases

This project follows the **B.L.A.S.T** methodology:

- **B** - Blueprint: Data-first architecture with anti-hallucination rules
- **L** - Link: JIRA API verification and connection handshake
- **A** - Architect: 3-layer architecture (SOPs, Tools, UI)
- **S** - Stylize: Clean, responsive React UI
- **T** - Trigger: Deployment-ready with documentation

## Features

- **JIRA Integration**: Fetch any JIRA ticket using Email + API Token
- **Test Plan Generator**: Auto-generate structured test plans from ticket data
- **Test Case Generator**: Generate comprehensive test cases across categories:
  - Functional (Positive)
  - Boundary
  - Negative
  - Security
  - Integration
  - Regression
- **Batch Processing**: Process multiple JIRA IDs from a markdown file
  - Upload or paste markdown file
  - Auto-detect JIRA IDs in format `PROJECT-123`
  - Generate test plans for all tickets at once
  - Download all results as JSON or Markdown
- **GROQ Support**: Optional LLM generation via GROQ API
- **Template Mode**: Deterministic generation without LLM (default)
- **Export**: Download test cases as JSON or Markdown
- **Responsive UI**: Clean, modern React interface

## Live Deployment

**Production URL**: https://nisk-jira-buddy.vercel.app

The app is deployed on Vercel with serverless API functions and static frontend.

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment
Edit the `.env` file:
```
GROQ_KEY=""  # Optional - for LLM mode
JIRA_EMAIL="your-email@example.com"
JIRA_API_TOKEN="your-api-token"
JIRA_BASE_URL="https://your-domain.atlassian.net/"
```

### 3. Verify JIRA Connection
```bash
npm run verify:jira
```

### 4. Start Development
```bash
npm run dev
```

This starts:
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

### 5. Use the App
1. Go to **Settings** tab and configure JIRA credentials
2. Click **Test JIRA Connection** to verify
3. Go to **JIRA Ticket** tab and fetch ticket TES-1
4. Click **Generate Test Plan** to create a test plan
5. Click **Generate Test Cases** to create test cases
6. Download results as JSON or Markdown

## Architecture

```
Chapter_03_BLAST_Framework/
├── .env                          # Environment variables (secrets)
├── vercel.json                   # Vercel deployment configuration
├── package.json                  # Root package with scripts
├── task_plan.md                  # BLAST phase tracking
├── findings.md                   # Research & constraints
├── progress.md                   # What was done
├── gemini.md                     # Project Constitution
├── README.md                     # Project documentation
├── prompt.md                     # Conversation history
├── architecture/                 # SOPs (Standard Operating Procedures)
│   ├── sop_jira_fetch.md
│   ├── sop_test_plan_generation.md
│   └── sop_test_case_generation.md
├── tools/                        # Python deterministic scripts
│   ├── verify_jira.py
│   ├── fetch_jira.py
│   ├── generate_test_plan.py
│   ├── generate_test_cases.py
│   └── batch_process.py          # Batch processing multiple JIRA IDs
├── api/                          # Vercel serverless API functions
│   ├── health.js
│   ├── config.js
│   ├── jira/
│   │   └── fetch.js
│   ├── generate/
│   │   ├── test-plan.js
│   │   └── test-cases.js
│   └── batch/
│       ├── upload.js
│       └── process.js
├── server/                       # Express API backend (local dev)
│   ├── package.json
│   ├── server.js
│   └── routes/
│       ├── jira.js
│       ├── generate.js
│       └── batch.js
└── client/                       # React frontend
    ├── package.json
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/
        │   ├── Settings.jsx
        │   ├── JiraFetcher.jsx
        │   ├── TestPlanDisplay.jsx
        │   ├── TestCaseDisplay.jsx
        │   └── BatchProcessor.jsx  # Batch processing UI
        └── styles/
            └── App.css
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/config` | Get configuration (safe) |
| POST | `/api/jira/fetch` | Fetch JIRA ticket |
| POST | `/api/generate/test-plan` | Generate test plan |
| POST | `/api/generate/test-cases` | Generate test cases |
| POST | `/api/batch/upload` | Upload markdown, extract JIRA IDs |
| POST | `/api/batch/process` | Process multiple JIRA IDs in batch |

## Data Schemas

### Input (JIRA Configuration)
```json
{
  "jira_email": "string",
  "jira_api_token": "string",
  "jira_base_url": "string",
  "groq_key": "string (optional)",
  "groq_model": "openai/gpt-oss-120b"
}
```

### Output (Test Plan)
```json
{
  "plan_id": "TP-TES-1",
  "jira_id": "TES-1",
  "feature": "...",
  "scope": { "in_scope": [...], "out_of_scope": [...] },
  "test_strategy": "...",
  "environment": "...",
  "test_levels": [...],
  "test_types": [...],
  "entry_criteria": [...],
  "exit_criteria": [...],
  "risks": [...],
  "assumptions": [...],
  "dependencies": [...],
  "schedule": "...",
  "resources": [...]
}
```

### Output (Test Cases)
```json
{
  "jira_id": "TES-1",
  "plan_id": "TP-TES-1",
  "total_test_cases": 15,
  "test_cases": [
    {
      "tc_id": "TES-1_TC_001",
      "category": "Functional",
      "priority": "High",
      "type": "Positive",
      "title": "...",
      "description": "...",
      "pre_conditions": "...",
      "steps": [{ "step_no": 1, "action": "...", "expected": "..." }],
      "expected_result": "...",
      "traceability": "TES-1",
      "automation": "Yes"
    }
  ]
}
```

## Anti-Hallucination Rules

All generated test artifacts follow the anti-hallucination rules from Chapter 02 Project 2:
- Only test what is mentioned in the JIRA ticket
- No invented features, UI elements, or API endpoints
- Every assertion must be traceable to source
- Missing information = "Insufficient information to determine"
- Label inferences as low confidence

## Security

- **Never** hardcode API tokens in code
- **Always** use `.env` file for secrets
- JIRA API token is only read from environment variables
- Token is never logged or displayed in UI

## License

MIT

## Deployment

### Vercel (Production)
```bash
# Deploy to production
vercel --prod
```

**Environment Variables** (set in Vercel dashboard):
- `JIRA_EMAIL` - Your JIRA email
- `JIRA_API_TOKEN` - Your JIRA API token
- `JIRA_BASE_URL` - Your JIRA base URL
- `GROQ_KEY` - GROQ API key (optional)
- `GROQ_MODEL` - GROQ model (default: openai/gpt-oss-120b)

### Local Development
```bash
# Start backend
npm run dev:server

# Start frontend (in another terminal)
npm run dev:client

# Or start both
npm run dev
```

## Batch Processing

### Process Multiple JIRA IDs
1. Create a markdown file with JIRA IDs:
```markdown
# My JIRA Tickets

- TES-1 - Login Feature
- TES-2 - Dashboard
- PROJ-100 - API Integration
```

2. Go to **Batch Process** tab in the app
3. Upload or paste the markdown file
4. The system auto-detects all JIRA IDs (format: `PROJECT-123`)
5. Click **Generate Test Plans** to process all tickets
6. Download results as JSON or Markdown

## Completed BLAST Phases

- ✅ Phase 0: Initialization - Project memory files created
- ✅ Phase 1: Blueprint - Data-first architecture, schemas defined
- ✅ Phase 2: Link - JIRA API verification, connections tested
- ✅ Phase 3: Architect - 3-layer architecture (SOPs, Tools, UI)
- ✅ Phase 4: Stylize - Clean React UI, responsive design
- ✅ Phase 5: Trigger - Production deployment on Vercel

## Next Steps

- Add webhook support for automatic JIRA ticket processing
- Implement cron jobs for scheduled test plan generation
- Add Slack integration for notifications
- Expand test case templates for more categories
- Add test execution tracking

## References

- Chapter 02 / Project 1: RICE-POT Framework for Restful Booker API
- Chapter 02 / Project 2: Anti-Hallucination Rules, Templates, Playwright + Selenium Frameworks
- B.L.A.S.T.md: Framework specification
- Vercel Documentation: https://vercel.com/docs
