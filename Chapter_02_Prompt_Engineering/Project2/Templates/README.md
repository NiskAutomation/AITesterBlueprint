# Templates

This folder contains **reusable prompt templates** for various software testing scenarios. Each template is designed to be copy-pasted into an LLM and customized with your specific requirements.

## Available Templates

| Template | Description |
|----------|-------------|
| `01_TestCaseGeneration.md` | Generate comprehensive test cases from requirements or user stories. |
| `02_TestCases_from_prd.md` | Extract test cases directly from a Product Requirements Document (PRD). |
| `03_API_Test_Generation.md` | Generate API test scenarios (positive, negative, boundary, error handling). |
| `04_Negative_TC_Only.md` | Focus exclusively on negative and edge-case test scenarios. |
| `05_Security_Test.md` | Generate security-focused test cases (OWASP, injection, auth, etc.). |
| `06_Regression_Suite.md` | Build a regression test suite from an existing feature set or test catalog. |

## How to use

1. Open the template that matches your current testing goal.
2. Fill in the bracketed placeholders (e.g., `[PRODUCT_NAME]`, `[FEATURE_DESCRIPTION]`).
3. Paste the completed prompt into your LLM of choice.
4. Review and refine the generated output.

---
*Part of the AITesterBlueprint repository — Chapter 02: Prompt Engineering.*
