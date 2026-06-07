# SOP: Generate Test Plan

## Goal
Generate a structured Test Plan from JIRA ticket data using deterministic templates.

## Inputs
- `jira_ticket`: JSON object with fields: summary, description, priority, status, labels, components
- `mode`: `"llm"` or `"template"` (default: `"template"` if GROQ key missing)
- `groq_key`: Optional GROQ API key for LLM mode

## Tool Logic (Template Mode)
1. Extract feature name from `summary`
2. Map `priority` to test priority strategy
3. Analyze `description` for key functional areas
4. Generate standard test plan sections:
   - **Scope**: In-scope and out-of-scope based on description
   - **Test Strategy**: Approach based on ticket type and priority
   - **Environment**: Recommended test environment
   - **Test Levels**: Unit, Integration, System, Acceptance (based on component)
   - **Test Types**: Functional, Performance, Security, Usability
   - **Entry Criteria**: Prerequisites for testing
   - **Exit Criteria**: Definition of done
   - **Risks**: Based on priority and complexity
   - **Assumptions**: Based on description gaps
   - **Dependencies**: Based on labels and components
   - **Schedule**: Estimate based on priority
   - **Resources**: Roles needed
5. Apply anti-hallucination rules:
   - Only include what is in the ticket
   - Mark assumptions clearly
   - No invented features

## Tool Logic (LLM Mode)
1. Build a RICE-POT prompt:
   - Role: "You are an expert QA Test Manager with 10+ years experience"
   - Instructions: "Generate a comprehensive test plan from the JIRA ticket data"
   - Context: JIRA ticket JSON
   - Example: Reference test plan structure
   - Parameters: "Be deterministic, traceable, no hallucinations"
   - Output: JSON matching Test Plan schema
   - Tone: "Professional, structured, concise"
2. Call GROQ API with the prompt
3. Parse and validate JSON response
4. Return structured test plan

## Edge Cases
- **Empty description**: Use summary only, mark as "limited information"
- **Missing priority**: Default to "Medium"
- **No components**: Default to "General"
- **LLM fails**: Fallback to template mode automatically
- **Invalid JSON from LLM**: Attempt to parse, fallback to template if fails

## Validation
- Feature name must be non-empty
- At least 3 test levels must be present
- At least 2 test types must be present
- Entry/Exit criteria must have at least 2 items each
- Risks must be non-empty

## Output Format
Matches Test Plan schema in gemini.md

## Quality Rules
1. Every test plan item must trace to a JIRA ticket field
2. No invented features, UI elements, or APIs
3. Assumptions must be labeled as "Assumption"
4. Priority mapping:
   - Highest/Critical → High priority tests
   - High → Medium-High priority tests
   - Medium → Balanced priority tests
   - Low/Lowest → Low priority tests
