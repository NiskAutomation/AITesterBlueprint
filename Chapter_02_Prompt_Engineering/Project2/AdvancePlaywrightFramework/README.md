# Advance Playwright Framework

A **production-ready TypeScript automation framework** built with [Playwright](https://playwright.dev/) and integrated with [Allure](https://allurereport.org/) reporting.

## Tech Stack

- **Playwright** ^1.42.0
- **TypeScript** ^5.3.0
- **Allure Report** ^2.42.0 (with `allure-playwright` integration)

## Project Structure

| Folder | Purpose |
|--------|---------|
| `pages/` | Page Object Model (POM) classes |
| `tests/` | Playwright test specs |
| `playwright.config.ts` | Playwright configuration |
| `package.json` | Dependencies & npm scripts |

## Available Scripts

```bash
# Run tests headlessly
npm run test

# Run tests in headed mode
npm run test:headed

# Generate Allure report
npm run allure:generate

# Open Allure report
npm run allure:open

# Full report pipeline
npm run allure:report
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```
3. Run the tests:
   ```bash
   npm run test
   ```

---
*Part of the AITesterBlueprint repository — Chapter 02: Prompt Engineering.*
