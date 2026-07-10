# AuditPilot AI

AuditPilot AI is an AI-assisted defensive web application audit platform that uses Playwright automation to inspect authorized websites, detect quality and security issues, generate actionable reports, and create reusable end-to-end test cases.

The project is designed for small engineering teams that want a senior-engineer-style assistant to help debug web application issues, improve security, validate frontend and backend flows, and reduce the time spent manually investigating problems.

## Vision

AuditPilot AI should let a user provide:

- A website URL
- Test credentials
- Allowed scan scope
- Optional issue description
- Scan mode and safety preferences

The system should then:

- Log in using Playwright
- Crawl approved pages safely
- Capture browser, network, console, screenshot, and trace data
- Detect frontend, backend, network, configuration, security, performance, and accessibility issues
- Score the application across multiple categories
- Generate clear recommendations
- Generate Playwright tests that can be reused in CI/CD
- Provide senior-engineer-style debugging guidance

## Current Status

This repository currently contains the first foundation layer: **Task 1: Scope and Permissions**.

Implemented capabilities:

- Scan configuration schema
- Credential metadata schema
- Authorization consent validation
- Allowed domain validation
- Excluded path validation
- Safe mode configuration
- Destructive action detection
- URL scope checking
- Element interaction policy checks
- Form submission policy checks

## Planned Features

### Core Scanning

- Authenticated website scanning
- Controlled same-domain crawling
- Page screenshot capture
- Playwright trace capture
- Console log collection
- Network request collection
- API failure detection
- Slow endpoint detection
- Broken link detection

### Security Analysis

- Security header checks
- Cookie security checks
- Sensitive data exposure detection
- Local storage and session storage inspection
- Mixed content detection
- Public admin route detection
- Safe file upload risk checks
- CORS and HTTPS configuration checks

### Frontend Analysis

- JavaScript runtime error detection
- Console warning analysis
- Broken UI state detection
- Infinite loader detection
- Form validation checks
- Responsive UI checks
- Accessibility smoke tests

### Backend and API Analysis

- HTTP 4xx and 5xx grouping
- Slow API grouping
- Inconsistent response detection
- Auth/session issue detection
- Sensitive response field detection
- Error response quality checks

### Performance Analysis

- Web Vitals collection
- Large asset detection
- Slow page detection
- Third-party script impact analysis
- Cache header checks
- Bundle and image optimization recommendations

### AI Reporting

- Executive summaries
- Root cause hypotheses
- Prioritized recommendations
- Risk scoring
- Reproduction steps
- Developer guidance
- Generated regression tests

### Playwright Test Generation

- Login tests
- Navigation tests
- Network health tests
- Security header tests
- Accessibility smoke tests
- Issue-specific regression tests
- CI-ready test suites

## Recommended Architecture

Long-term target architecture:

```text
User
  |
  v
Next.js Dashboard
  |
  v
Backend API
  |
  +--> Scan Queue
  |      |
  |      v
  |   Playwright Worker
  |      |
  |      +--> Browser Automation
  |      +--> Network Capture
  |      +--> Screenshot Capture
  |      +--> Trace Capture
  |
  +--> Analysis Engine
  |      |
  |      +--> Security Analyzer
  |      +--> Performance Analyzer
  |      +--> Frontend Analyzer
  |      +--> Backend/API Analyzer
  |      +--> Accessibility Analyzer
  |
  +--> AI Reasoning Engine
  |      |
  |      +--> Root Cause Summary
  |      +--> Recommendations
  |      +--> Playwright Test Generation
  |
  v
PostgreSQL + Object Storage
  |
  v
Report Dashboard + Exported Tests
```

## Suggested Future Monorepo Structure

```text
auditpilot-ai/
  apps/
    web/
    api/
    worker/
  packages/
    shared/
    playwright-engine/
    analyzers/
    ai-engine/
    test-generator/
  prisma/
  docker-compose.yml
  README.md
```

## Current Project Structure

```text
auditpilot-ai/
  src/
    scope/
      authorization.ts
      destructive-actions.ts
      scan-config.schema.ts
      scan-policy.ts
      scope-validator.ts
    index.ts
  package.json
  tsconfig.json
  README.md
```

## Installation

```bash
npm install
```

## Development Commands

Run TypeScript type checking:

```bash
npm run check
```

Build the project:

```bash
npm run build
```

## Task 1: Scope and Permissions

The first implemented layer is responsible for making sure scans are safe, authorized, and restricted to an approved scope.

### Scan Config Schema

The scan config supports:

- `websiteUrl`
- `credentials`
- `issueDescription`
- `scanMode`
- `maxCrawlDepth`
- `maxPages`
- `allowedDomains`
- `excludedPaths`
- `safety`
- `authorization`

### Safety Configuration

The safety configuration controls whether the scanner may perform sensitive actions:

- `safeMode`
- `allowDestructiveActions`
- `allowFormSubmission`
- `allowFileUploadTesting`
- `allowPaymentFlowTesting`

By default, safe mode is enabled and risky actions are blocked.

### Authorization Requirement

AuditPilot AI requires explicit authorization before scanning. This is important because the tool should only be used on websites that the user owns or has permission to test.

Required authorization fields:

- `isAuthorizedToTest`
- `acceptedTermsAt`
- `testerName`
- `organizationName`
- `notes`

### Scope Validation

The scope validator checks that:

- The target website host is included in `allowedDomains`
- Wildcard domains are blocked in the initial safe version
- Excluded paths start with `/`
- Safe mode is not combined with destructive-action permission

### Destructive Action Detection

AuditPilot AI includes a basic action-label classifier that blocks potentially risky interactions such as:

- Delete
- Remove
- Cancel subscription
- Refund
- Pay now
- Transfer
- Withdraw
- Publish
- Send email
- Disable account
- Archive

These checks help prevent the scanner from accidentally mutating production data.

## Example Scan Configuration

```ts
import { validateScanScope } from './src/index.js';

const result = validateScanScope({
  websiteUrl: 'https://demo-shop.example.com',
  credentials: {
    username: 'admin@example.com',
    password: 'example-password',
    loginUrl: 'https://demo-shop.example.com/login',
    mfaRequired: false,
  },
  issueDescription: 'Checkout page is slow and sometimes payment fails.',
  scanMode: 'full-qa',
  maxCrawlDepth: 2,
  maxPages: 25,
  allowedDomains: ['demo-shop.example.com'],
  excludedPaths: ['/admin/delete-user', '/billing/refund'],
  safety: {
    safeMode: true,
    allowDestructiveActions: false,
    allowFormSubmission: false,
    allowFileUploadTesting: false,
    allowPaymentFlowTesting: false,
  },
  authorization: {
    isAuthorizedToTest: true,
    acceptedTermsAt: new Date().toISOString(),
    testerName: 'QA Engineer',
    organizationName: 'Demo Shop Inc.',
  },
});

console.log(result);
```

## Example Output Report Goal

A completed scan should eventually produce a report like this:

```json
{
  "overallHealthScore": 68,
  "securityScore": 61,
  "performanceScore": 54,
  "frontendQualityScore": 72,
  "backendApiScore": 58,
  "accessibilityScore": 76,
  "reliabilityScore": 60,
  "riskLevel": "Medium-High",
  "topFindings": [
    {
      "severity": "High",
      "category": "Backend/API",
      "title": "Checkout API intermittently returns 500",
      "recommendation": "Add backend error handling, timeout handling, structured error responses, and a frontend retry path."
    },
    {
      "severity": "High",
      "category": "Security",
      "title": "Missing Content-Security-Policy header",
      "recommendation": "Add a CSP header in report-only mode, validate it, and then enforce it."
    }
  ]
}
```

## Example Generated Playwright Test Goal

```ts
import { test, expect } from '@playwright/test';

test('homepage should include important security headers', async ({ request }) => {
  const response = await request.get('https://demo-shop.example.com');

  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['strict-transport-security']).toBeTruthy();
  expect(response.headers()['content-security-policy']).toBeTruthy();
});
```

## Defensive Use Only

AuditPilot AI is intended only for defensive testing of websites and web applications where the user has explicit authorization.

Do not use this project to scan, test, crawl, or interact with systems without permission.

The project should avoid destructive behavior by default and should require explicit consent for any action that could modify application data.

## Roadmap

### Phase 1: Foundation

- [x] Scope and permission model
- [ ] Monorepo structure
- [ ] Database schema
- [ ] Scan job model
- [ ] Basic API server

### Phase 2: Playwright Engine

- [ ] Login automation
- [ ] Session storage
- [ ] Controlled crawler
- [ ] Screenshot capture
- [ ] Network logging
- [ ] Console logging

### Phase 3: Analyzers

- [ ] Security header analyzer
- [ ] Cookie analyzer
- [ ] Frontend error analyzer
- [ ] API health analyzer
- [ ] Performance analyzer
- [ ] Accessibility analyzer

### Phase 4: AI Layer

- [ ] Issue summarizer
- [ ] Root cause hypothesis generator
- [ ] Recommendation engine
- [ ] Playwright test generator

### Phase 5: Dashboard

- [ ] Scan setup UI
- [ ] Live scan progress UI
- [ ] Report dashboard
- [ ] Issue detail pages
- [ ] Export reports

### Phase 6: CI and Team Features

- [ ] GitHub Actions integration
- [ ] Historical scan comparison
- [ ] Scheduled scans
- [ ] Team collaboration
- [ ] Jira/Slack integration

## License

License information has not been added yet.

## Maintainers

This project is in early development.
