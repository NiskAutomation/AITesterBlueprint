```ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  timeout: 30000,
  use: {
    viewport: { width: 1440, height: 900 },
    actionTimeout: 10000,
    trace: 'on-first-retry',
  },
  retries: 1,
  testDir: './tests',
  outputDir: './test-results/',
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  workers: process.env.CI ? 4 : undefined,
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' }
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' }
    }
  ]
};

export default config;
```