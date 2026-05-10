# SQA Plan for Local Guide Platform

## Objective

The primary focus of this project is Software Quality Assurance (SQA). The goal is to deliver a reliable travel booking platform while demonstrating strong testing discipline across all development stages.

## Test Strategy

This project uses layered testing to validate backend functionality and enforce regression control:

- Unit Tests: Validate individual controllers, middleware, and model logic in isolation.
- Integration Tests: Validate interactions between routes and the in-memory MongoDB data layer.
- System Tests: Validate end-to-end API workflows across authentication, tour management, bookings, and admin functions.
- Regression Tests: Capture high-risk bug scenarios and verify fixes remain stable after changes.

## Test Coverage Areas

1. Authentication & Role Management
2. Tour listing, filtering, pagination, and update/delete behavior
3. Booking creation, validation, conflict detection, and guide approval
4. Admin monitoring, user deletion, and system statistics
5. Data integrity for cascading deletes and related resource cleanup
6. Boundary value and equivalence class cases for input validation and searching
7. Security tests for unauthorized access and role enforcement

## Testing Categories

- Functional Testing: Verify each endpoint behaves according to requirements.
- Unit Testing: Isolate backend controllers and middleware.
- API Testing: Validate REST routes with SuperTest.
- Regression Testing: Preserve fixes for critical booking and access-control bugs.
- Security Testing: Validate RBAC, invalid tokens, and data access restrictions.

## Project Test Directories

- `tests/unit/` — isolated controller and middleware tests.
- `tests/integration/` — endpoint-level verification and environment interactions.
- `tests/system/` — higher-level workflow tests for core user journeys.
- `tests/regression/` — targeted bug regression scenarios.

## Execution Commands

From project root:

```bash
npm test
npm run test:unit
npm run test:integration
npm run test:system
npm run test:regression
npm run test:all
```

Because the complete project test suite now includes 1,000+ cases, `npm run test:all` executes the test layers sequentially instead of all in a single large Jest process.

## Step-by-Step Plan

1. Review existing backend features and identify critical modules.
2. Create a formal SQA plan and document test structure.
3. Expand unit tests for controllers, middleware, and model validation.
4. Implement system tests covering actual route usage and RBAC behavior.
5. Add regression tests for high-risk scenarios: approved booking conflicts, cascade deletes, unauthorized access, and boundary filters.
6. Run all test suites and verify 100% pass status.
7. Update documentation with test counts, case descriptions, and actual outcomes.
8. Commit each completed module or suite after validation.

## Todo List

- [x] Create unit test files for controllers and middleware
- [x] Create system test files for auth, tour, booking, and admin routes
- [x] Create regression test coverage for critical bug scenarios
- [x] Update package scripts for modular test runs
- [x] Document the SQA plan and test directories
- [ ] Run full test suite and confirm all passing
- [ ] Update `TEST_CASES.md` with expanded totals and results
- [ ] Commit test additions and documentation after successful runs

## Regression Focus

The regression test suite will emphasize:

- booking conflict handling
- unauthorized endpoint access
- cascading deletion of related records
- invalid input handling for date, price, and status fields
- preservation of role-based access control
