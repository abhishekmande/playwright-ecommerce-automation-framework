# Test Strategy

## Objective
Validate critical customer journeys of the Rahul Shetty Academy Let's Shop practice application using a maintainable Playwright + TypeScript automation framework.

## In scope
- Login: valid and invalid authentication
- Product catalogue visibility
- Add-to-cart behavior
- Checkout country selection
- Order placement
- Order-history verification
- Authentication API contract
- Cross-browser compatibility for safe/read-only workflows
- CI execution and failure artifacts

## Out of scope
- Load/performance testing
- Security penetration testing
- Payment-gateway validation
- Database validation
- Mobile native testing

## Browser coverage
- Chromium
- Firefox
- WebKit

Authentication and product-catalogue checks run cross-browser. Cart and order creation are restricted to Chromium because they mutate shared account state.

## Test levels
- UI functional tests
- End-to-end tests
- API contract test for login

## Test data
Credentials are supplied through environment variables or CI secrets. No real credentials are committed to source control. Product and country values are configurable through `.env`.

## Execution strategy
Independent tests use Playwright parallel execution. CI uses a limited worker count to avoid unnecessary load on the public practice application.

## Pass criteria
- All smoke tests pass.
- All required regression tests pass or have a documented application/environment defect.
- No unexpected browser-specific failures in the supported cross-browser subset.

## Failure evidence
- Playwright HTML report
- JSON report
- Trace on failure
- Screenshot on failure
- Video on failure
- Custom execution dashboard

## Key risks and mitigations
| Risk | Mitigation |
|---|---|
| Public practice site changes | Centralize locators in Page Objects |
| Shared account state causes flaky tests | Restrict mutating scenarios to Chromium |
| Slow network/UI | Use Playwright auto-waiting and web-first assertions |
| Credentials exposed in Git | Use `.env`, `.gitignore`, GitHub/Jenkins secrets |
| Hard-to-debug CI failure | Retain trace, screenshot, video and HTML report |
