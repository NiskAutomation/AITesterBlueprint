# Findings

## Objective
Fetch JIRA ticket TES-1 and automatically generate a Test Plan + Test Cases using a lightweight React application.

## .env Discovery
- **GROQ_KEY**: Empty (needs user to fill in for LLM mode)
- **JIRA_EMAIL**: Configured
- **JIRA_API_TOKEN**: Configured (sensitive - never log or hardcode)
- **JIRA_BASE_URL**: Configured

## MCP Context & Environment
- **OS**: Windows 11
- **Shell**: PowerShell 5.1
- **Node**: Available (for React + Express)
- **Python**: Available (for tools/ scripts)
- **Working Directory**: C:\Users\Nishikant\Documents\AITESTERBLUEPRINT\Chapter_03_BLAST_Framework

## Available Tools
- File system operations (read, write, edit)
- Bash/Shell execution
- Web fetch
- No external MCP servers configured

## Constraints
1. **BLAST Phase 0 Rule**: No code in `tools/` until Data Schema confirmed
2. **Security**: JIRA API token is sensitive - only use via `.env` / `process.env`
3. **Anti-Hallucination** (from Chapter 02 Project2):
   - No invented features, IDs, error codes, or UI elements
   - Every assertion traceable to source (JIRA ticket)
   - Missing info = "Insufficient information to determine"
   - Label inferences as low confidence
4. **RICE-POT Framework**: Output must follow structured format (Role, Instructions, Context, Example, Parameters, Output, Tone)
5. **GROQ Key Empty**: If no GROQ key provided, fallback to template-based deterministic generation
6. **Lightweight**: Minimal dependencies, fast build, clean UI

## Previous Work Reference
- **Chapter 02 / Project1**: Restful Booker API (73+ TC) using RICE-POT
- **Chapter 02 / Project2**: 6 reusable templates (Basic, PRD-to-TC, API, Negative, Security, Regression)
- **Chapter 02 / Project2**: Anti-hallucination rules, SKILL.md, blank-template-rice-pot.md
- **Chapter 02 / Project2**: Playwright + Selenium frameworks (Page Object Model)

## JIRA Ticket Context
- **Target Ticket**: TES-1
- **Base URL**: Atlassian instance
- **Auth**: Email + API Token (Basic Auth)
- **API Endpoint**: `/rest/api/2/issue/{ticketId}`

## GROQ Context
- **Model**: openai/gpt-oss-120b (free tier)
- **API**: https://api.groq.com/openai/v1/chat/completions
- **Key**: Empty in .env - user needs to fill or use fallback mode

## Key Decisions
1. **Backend**: Node.js/Express (not Python-only) because React needs a server to proxy JIRA API (CORS)
2. **Tools**: Python scripts in `tools/` for deterministic generation logic (per BLAST Phase 3)
3. **Fallback**: Template-based generation if GROQ key is missing
4. **Frontend**: Vite + React (lightweight, fast dev server)
