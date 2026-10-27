# Playwright E-Commerce Automation Framework

Portfolio-ready **Playwright + TypeScript** test automation project for the Rahul Shetty Academy **Let's Shop** practice application.

Application under test: `https://rahulshettyacademy.com/client/`

## Why this project exists

This repository demonstrates the kind of framework work expected from a QA Automation Engineer rather than only showing isolated scripts. It covers maintainable page objects, UI and API-assisted authentication, cross-browser execution, parallelism, CI/CD, failure artifacts, and a small stakeholder-facing execution dashboard.

## Technology stack

- Playwright Test 1.64.1
- TypeScript
- Page Object Model (POM)
- Chromium, Firefox and WebKit
- Playwright APIRequestContext
- GitHub Actions
- Jenkins
- HTML + JSON reporting
- Custom static execution dashboard

## Automated business scenarios

| Area | Scenario | Tag | Browsers |
|---|---|---|---|
| Authentication | Invalid customer cannot log in | `@smoke` | Chromium, Firefox, WebKit |
| Authentication | Registered customer can log in | `@smoke` | Chromium, Firefox, WebKit |
| Catalogue | Authenticated customer can view the target product | `@regression` | Chromium, Firefox, WebKit |
| Cart | Authenticated customer adds a named product to cart | `@regression` | Chromium |
| Checkout | Add product → cart → checkout → country → order → order history | `@regression @e2e` | Chromium |
| API | Login API returns an authentication token | `@api` | Browser-independent; executed once under Chromium project |

State-changing cart/order scenarios are intentionally limited to Chromium because the public practice application uses a shared test account state. Running the same account through three browsers in parallel can create duplicate orders or cart interference. Cross-browser coverage is demonstrated on authentication and read-only catalogue validation.

## Framework structure

```text
.
├── .github/workflows/playwright.yml
├── fixtures/
│   └── auth.fixture.ts
├── project-docs/
│   ├── TEST_CASES.md
│   └── TEST_STRATEGY.md
├── pages/
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── LoginPage.ts
│   ├── OrdersPage.ts
│   └── ProductPage.ts
├── scripts/
│   ├── clean.mjs
│   └── generate-dashboard.mjs
├── tests/
│   ├── api/auth.api.spec.ts
│   ├── e2e/place-order.spec.ts
│   └── ui/
│       ├── cart.spec.ts
│       ├── login.spec.ts
│       └── product-catalog.spec.ts
├── utils/
│   ├── ApiClient.ts
│   └── env.ts
├── .env.example
├── Jenkinsfile
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

## Setup

### 1. Create a test account

Open the application and register a test account if you do not already have one. Do **not** commit credentials to GitHub.

### 2. Install dependencies

```bash
npm install
npx playwright install
```

### 3. Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then set your registered test credentials:

```env
USER_EMAIL=your_registered_email@example.com
USER_PASSWORD=your_password
```

## Run the tests

```bash
npm test
```

Useful commands:

```bash
npm run test:headed
npm run test:ui
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:smoke
npm run test:regression
npm run test:api
npm run report
```

## API-assisted login

`fixtures/auth.fixture.ts` calls the application's login API with Playwright's request fixture, obtains the token, and injects it into `localStorage` before opening the application. This is used for workflows where login itself is not the behavior under test.

Benefits:

- avoids repeating UI login in every test;
- reduces execution time;
- isolates authentication UI tests from business-flow tests;
- demonstrates combined UI + API automation.

## Cross-browser and parallel execution

`playwright.config.ts` defines three projects:

- Chromium / Desktop Chrome
- Firefox / Desktop Firefox
- WebKit / Desktop Safari

`fullyParallel: true` enables parallel execution for independent tests. CI limits workers to two to reduce resource pressure on shared runners and on the public practice application.

## Reporting and custom dashboard

Playwright produces:

- console list report;
- HTML report in `playwright-report/`;
- machine-readable JSON results in `test-results/results.json`;
- trace, screenshot and video artifacts for failures.

After a run:

```bash
npm run dashboard
```

This creates `docs/index.html` with:

- total executions;
- passed / failed counts;
- pass rate;
- aggregated execution time;
- browser-wise metrics;
- test-level status, duration and failure details.

The dashboard can be published with GitHub Pages by the included workflow.

## GitHub Actions setup

After pushing this project to GitHub:

1. Go to **Settings → Secrets and variables → Actions**.
2. Add repository secrets `USER_EMAIL` and `USER_PASSWORD`.
3. Go to **Settings → Pages** and select **GitHub Actions** as the source.
4. Run the **Playwright Cross-Browser Tests** workflow, or push to `main`.
5. The workflow runs the suite, uploads Playwright artifacts and deploys the generated dashboard to GitHub Pages.

Never store the real password in `.env.example`, source files, screenshots, or README content.

## Jenkins setup

The `Jenkinsfile` expects a Jenkins Username/Password credential with id:

```text
rahulshetty-test-user
```

Map the username to the registered email and the password to the test-account password. The pipeline installs dependencies, installs Playwright browsers, executes tests, builds the dashboard and archives reports.

## CI execution flow

```text
Git push / Pull request
        ↓
GitHub Actions or Jenkins
        ↓
npm install
        ↓
Install Playwright browsers
        ↓
Cross-browser Playwright suite
        ↓
HTML + JSON + trace/screenshot/video artifacts
        ↓
Custom dashboard generation
        ↓
GitHub Pages dashboard / CI artifacts
```

## Design decisions you can explain in an interview

### Why Page Object Model?
Locators and page actions are kept out of test specifications. If a locator changes, the update is made in one page object rather than in every test.

### Why API login for some tests?
A cart test should fail because cart behavior is broken, not because the login UI was slow. UI login is tested separately, while authenticated business tests can use a faster API precondition.

### Why not use `waitForTimeout()`?
The framework relies on Playwright auto-waiting and web-first assertions. Fixed sleeps increase execution time and create flaky tests.

### Why are cart/order mutations Chromium-only?
They mutate shared server-side state. Running the exact same account simultaneously across browsers can create duplicate orders or cart interference. Cross-browser compatibility is demonstrated on safer authentication and read-only catalogue workflows.

### How are failures debugged?
CI retains Playwright traces, screenshots, videos, HTML reports and raw JSON results.

## Suggested GitHub repository name

```text
playwright-ecommerce-automation-framework
```

A typical repository URL will look like:

```text
https://github.com/<your-github-username>/playwright-ecommerce-automation-framework
```

The dashboard URL will typically look like:

```text
https://<your-github-username>.github.io/playwright-ecommerce-automation-framework/
```

## Resume-ready project wording

**Playwright E-Commerce Automation Framework | TypeScript, Playwright, GitHub Actions**

- Designed a Page Object Model based Playwright automation framework for an e-commerce practice application, covering authentication, product selection, cart, checkout and order-history validation.
- Implemented Chromium, Firefox and WebKit projects with parallel execution, reusable API-assisted authentication, environment-based test data and failure diagnostics using traces, screenshots and videos.
- Integrated the suite with GitHub Actions/Jenkins and generated a stakeholder-facing dashboard from Playwright JSON results to visualize pass rate, execution duration, browser-wise status and failures.

Only claim metrics such as “reduced execution time by 30%” after you have measured them from your own runs.

## Important portfolio note

This is a practice/portfolio project against a public training application. Present it as **your automation framework implementation for a practice e-commerce application**, not as production work performed for Rahul Shetty Academy.
