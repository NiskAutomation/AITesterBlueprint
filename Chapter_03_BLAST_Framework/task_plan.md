# Task Plan

## Objective
Build a lightweight React application that:
1. Takes JIRA configuration (email, token, base URL) and GROQ API key in settings
2. Fetches JIRA ticket (TES-1) automatically
3. Generates a Test Plan based on ticket data
4. Generates Test Cases based on the test plan
5. Displays everything in a clean React UI

## BLAST Framework Phases

### Phase 0: Initialization (Complete)
- [x] Create `task_plan.md`
- [x] Create `findings.md`
- [x] Create `progress.md`
- [x] Create `gemini.md` (Project Constitution)

### Phase 1: Blueprint (Complete)
- [x] North Star: Lightweight React app for JIRA-to-TestPlan automation
- [x] Integrations: JIRA API (credentials in .env), GROQ API (optional)
- [x] Source of Truth: JIRA ticket TES-1
- [x] Delivery Payload: React web app with settings panel, ticket display, test plan/test case display
- [x] Behavioral Rules: Use native test knowledge, deterministic generation, anti-hallucination rules
- [x] Data Schema: Defined in gemini.md

### Phase 2: Link (Complete)
- [x] Create JIRA API handshake script
- [x] Verify JIRA credentials
- [x] Create GROQ API handshake placeholder
- [x] Build verification tools

### Phase 3: Architect (Complete)
- [x] Create architecture SOPs in `architecture/`
- [x] Create deterministic Python scripts in `tools/`
- [x] Create Express backend (`server/`)
- [x] Create React frontend (`client/`)
- [x] Wire frontend + backend + tools

### Phase 4: Stylize (Complete)
- [x] Polish UI/UX
- [x] Apply clean CSS
- [x] Responsive design
- [x] Export functionality

### Phase 5: Trigger (In Progress)
- [x] Create deployment documentation
- [x] Finalize maintenance log
- [x] Document all API endpoints
- [x] Batch processing documentation
- [ ] Production deployment
- [ ] Set up execution triggers

## Directory Structure
```
Chapter_03_BLAST_Framework/
├── .env
├── task_plan.md
├── findings.md
├── progress.md
├── gemini.md
├── README.md
├── jira_ids_sample.md             # Sample JIRA IDs file
├── package.json (root)
├── architecture/
│   ├── sop_jira_fetch.md
│   ├── sop_test_plan_generation.md
│   └── sop_test_case_generation.md
├── tools/
│   ├── verify_jira.py
│   ├── fetch_jira.py
│   ├── generate_test_plan.py
│   ├── generate_test_cases.py
│   └── batch_process.py           # Batch processing
├── server/
│   ├── package.json
│   ├── server.js
│   └── routes/
│       ├── jira.js
│       ├── generate.js
│       └── batch.js               # Batch routes
└── client/
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
        │   └── BatchProcessor.jsx # Batch UI
        └── styles/
            └── App.css
```

## How to Run

### 1. Install All Dependencies
```bash
npm run install:all
```

### 2. Verify JIRA Connection
```bash
npm run verify:jira
```

### 3. Start Development
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

### 5. Start Production Server
```bash
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/config` | Get configuration (safe) |
| POST | `/api/jira/fetch` | Fetch JIRA ticket |
| POST | `/api/generate/test-plan` | Generate test plan |
| POST | `/api/generate/test-cases` | Generate test cases |
| POST | `/api/batch/upload` | Upload MD file, extract JIRA IDs |
| POST | `/api/batch/process` | Process multiple JIRA IDs |

## Test Flow (Single Ticket)
1. Settings → Configure JIRA credentials
2. JIRA Ticket → Fetch TES-1
3. Test Plan → Generate from ticket
4. Test Cases → Generate from plan
5. Export → Download JSON or Markdown

## Batch Flow (Multiple Tickets)
1. Batch Process → Upload or paste markdown file
2. Review → See all detected JIRA IDs
3. Process → Generate test plans for all tickets
4. Results → Download all as JSON or Markdown

## Sample JIRA IDs File
Create a markdown file with JIRA IDs:
```markdown
# My JIRA Tickets

- TES-1 - Login Feature
- TES-2 - Dashboard
- PROJ-100 - API Integration
```

The system will auto-detect all JIRA IDs in format `PROJECT-123`.

## Status: COMPLETE
All BLAST phases implemented. Batch processing ready. Ready for testing and deployment.
