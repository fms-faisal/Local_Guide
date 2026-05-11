# Local Guide Platform - SQA Execution and Defect Report

## 1. Scope and Objective

This report documents:

- E2E automation scope and coverage
- Test execution outcomes with expected vs actual outputs
- Known failures, error logs, root causes, fixes, and open issues
- Toolchain, environment, and reproducibility steps

Date: 2026-05-11
Project: Local Guide Platform
Automation Framework: Playwright + Page Object Model
Primary Spec: tests/e2e/bookingWorkflow.spec.js

## 2. Environment and Tooling

- OS: Windows
- Node.js runtime: in use across test runs
- Playwright CLI: 1.59.1
- Browser runtime cache detected:
  - chromium-1217
  - chromium_headless_shell-1217
  - ffmpeg-1011
  - winldd-1007
- Frontend target URL: http://localhost:5173
- Backend target URL: http://localhost:5000

## 3. Preconditions

Mandatory preconditions for stable E2E runs:

1. Backend server must be running and reachable on port 5000.
2. Frontend server must be running OR Playwright webServer must start cleanly.
3. Database connectivity must be healthy.
4. Playwright browser cache should exist and lockfile must not be stale.

## 4. Test Suite Under Report

File: tests/e2e/bookingWorkflow.spec.js
Current automated test count in spec: 4

### 4.1 Test Case Execution Summary (Expected vs Actual)

| TC ID      | Test Case                                       | Expected Output                                                                          | Actual Output                                                                                                                    | Result                                             |
| ---------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| TC-E2E-001 | Tourist registration and login                  | User can register, login, and reach /dashboard/tourist with visible dashboard navigation | Intermittent failures observed in unstable sessions: register form not interactable (`getByLabel('Name')` timeout)               | FAIL (intermittent, environment-dependent)         |
| TC-E2E-002 | Guide tour creation and public listing          | Guide creates tour and it appears in listings                                            | Tour creation and listing flow completed successfully in latest run                                                              | PASS                                               |
| TC-E2E-003 | Booking workflow from Tourist to Guide approval | Tourist books, Guide approves, Tourist sees approved status                              | Failure observed in unstable session: post-registration redirect remained at /register instead of /dashboard/guide               | FAIL (intermittent, environment-dependent)         |
| TC-E2E-004 | Negative validation checks                      | Invalid login error shown; past date prevented by booking UI/validation                  | Invalid login alert intermittently not observed in unstable session; past-date scenario updated to assert disabled calendar date | FAIL/PASS mixed depending on environment stability |

## 5. Mandatory Failure Logs (Captured)

### 5.1 User-reported failure log A

```
bookingWorkflow.spec.js:87
Error: expect(locator).toBeVisible() failed

Locator: getByText('E2E Beach Tour 1778500877671')
Expected: visible
Timeout: 5000ms
Error: element(s) not found
```

### 5.2 User-reported failure log B

```
bookingWorkflow.spec.js:197
Error: expect(locator).toBeVisible() failed

Locator: getByRole('alert')
Expected: visible
Timeout: 5000ms
Error: element(s) not found
```

### 5.3 Reproduced failure logs from latest run

- `registerPage.register`: timeout waiting for `getByLabel('Name')` on /register flow.
- `bookingWorkflow.spec.js`: expected redirect `/dashboard/guide`, actual URL remained `http://localhost:5173/register`.
- Negative flow: login error alert not always visible in unstable run context.

## 6. Root Cause Analysis

Primary causes observed:

1. Environment instability between frontend/backend startup states causes inconsistent DOM availability and auth transitions.
2. Timing-sensitive assertions in E2E (especially after failed login -> successful login handoff) can race if page is not fully settled.
3. Data visibility in listings depends on successful API filter response and stable UI render cycle.
4. Running commands from incorrect directories can produce misleading failures.

## 7. Fixes Implemented During This Cycle

1. Improved selector robustness in E2E page objects.
2. Updated negative validation strategy:
   - Past-date scenario changed from forced booking submission to UI-level disabled-date validation.
3. Added explicit login/URL checks to reduce race conditions.
4. Added wait strategies around filtered search/navigation in listing flows.

## 8. Difficulties Encountered and Mitigations

### 8.1 Difficulty: Playwright browser install lock and network errors

- Symptom: `__dirlock` active lockfile and `ENOTFOUND`/`ECONNRESET` during browser download.
- Mitigation:
  - Removed stale lockfile when present.
  - Verified local browser cache folders exist.
  - Proceeded with test execution using existing cache.

### 8.2 Difficulty: Intermittent E2E failures despite same test code

- Symptom: identical suite alternates between pass and fail.
- Mitigation:
  - Documented dependency preconditions.
  - Added stronger waits/assertions around state transitions.
  - Logged request/response behavior during filter flows.

## 9. Evidence and Artifacts

- Playwright report folder: `reports/playwright-report`
- Failure traces/screenshots/videos: `test-results/*`
- Main E2E spec: `tests/e2e/bookingWorkflow.spec.js`

## 10. SQA Conclusion

- Automation foundation is functional.
- Current stability risk is environment orchestration and asynchronous state transitions.
- Additional high-volume test design (200+) is now cataloged separately in:
  - `docs/SQA_TEST_CASE_CATALOG.md`

## 11. Recommended Next Actions

1. Introduce CI-friendly environment bootstrap (backend + frontend + DB readiness checks).
2. Split E2E smoke and regression layers.
3. Add API-level validation tests for booking and auth edge cases.
4. Track flaky tests with retry analytics and quarantine policy.
