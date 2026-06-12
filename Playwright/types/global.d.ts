```typescript
/// <reference types="@playwright/test" />

declare namespace PlaywrightTest {
  interface Fixtures extends import('../support/setup').Fixtures {}
}
```