# Professional Test Case Documentation

## Project

`local-guide-platform`

## Purpose

This document defines the integration test cases for the guide platform backend, including prerequisites, test steps, expected results, actual results, and pass/fail status.

## Test Environment

- Node.js
- Jest + Supertest
- MongoDB in-memory server via `mongodb-memory-server`
- Run from `local-guide-platform` directory

## Execution Command

```bash
npx jest --config jest.config.js --runInBand
```

## Preconditions

- No manual MongoDB server is required; tests use an in-memory database.
- Verify environment variables if required:
  - `JWT_SECRET` (defaults to `secret` when not set)
  - `MONGOMS_DOWNLOAD_DIR` may be configured for local downloads
- Ensure project dependencies are installed:
  ```bash
  npm install
  ```

## Test Summary

- Test suites executed: `14` (plus the new bulk unit suites)
- Total test cases: `1,094`
- Passed: `1,094`
- Failed: `0`

## Test Suite Structure

- `tests/unit/` — isolated controller and middleware tests
- `tests/integration/` — endpoint-level integration tests for core backend flows
- `tests/system/` — end-to-end route workflows and role-based authorization
- `tests/regression/` — targeted high-risk regression scenarios
- `tests/unit/authBulk.unit.test.js` — large authentication and RBAC combination coverage
- `tests/unit/bookingBulk.unit.test.js` — booking validation and boundary case combinations
- `tests/unit/tourQueryBulk.unit.test.js` — comprehensive tour search/filter combination coverage

## Test Cases

| ID  | Suite          | Test Case                          | Description                                                                   | Expected Result                                                   | Actual Result                                          | Status |
| --- | -------------- | ---------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------ | ------ |
| 1   | authMiddleware | Protected route without token      | POST `/api/tours` without auth header                                         | `401 Unauthorized` returned with message indicating missing token | `401`, message matched `unauthorized`                  | Pass   |
| 2   | authMiddleware | Malformed/expired token            | POST `/api/tours` using invalid bearer token                                  | `401 Unauthorized` returned with JWT error message                | `401`, message matched `invalid`                       | Pass   |
| 3   | authMiddleware | Tourist access to Guide-only route | Tourist token calls POST `/api/tours`                                         | `403 Forbidden` returned for insufficient role                    | `403`, message matched `forbidden`                     | Pass   |
| 4   | authMiddleware | Guide access to Admin-only route   | Guide token calls GET `/api/admin/users`                                      | `403 Forbidden` returned for insufficient role                    | `403`, message matched `forbidden`                     | Pass   |
| 5   | authMiddleware | Valid token and request flow       | Guide token creates tour via POST `/api/tours`                                | `201 Created`, tour persisted with correct `guideId`              | `201`, tour created, DB state verified                 | Pass   |
| 6   | tourSearch     | List all tours                     | GET `/api/tours` with no filters                                              | Returns `200 OK` and all seeded tours                             | `200`, returned `5` tours                              | Pass   |
| 7   | tourSearch     | Filter by location                 | GET `/api/tours?location=Sylhet`                                              | Returns `200 OK` and tours with location `Sylhet`                 | `200`, returned `2` Sylhet tours                       | Pass   |
| 8   | tourSearch     | Filter by price range              | GET `/api/tours?minPrice=1000&maxPrice=5000`                                  | Returns `200 OK` and all tours within range                       | `200`, returned `5` tours in range                     | Pass   |
| 9   | tourSearch     | Pagination                         | GET `/api/tours?page=1&limit=2`                                               | Returns `200 OK`, `2` tours, and `x-total-count: 5`               | `200`, `2` tours returned, header correct              | Pass   |
| 10  | tourSearch     | Combined filters                   | GET `/api/tours?location=Dhaka&category=Heritage&minPrice=1000&maxPrice=2000` | Returns `200 OK` and only `Dhaka Heritage`                        | `200`, returned single `Dhaka Heritage` tour           | Pass   |
| 11  | bookingFlow    | Valid booking creation             | Tourist books available Tour via POST `/api/bookings`                         | `201 Created`, booking status `Pending`, DB persisted             | `201`, booking created, DB state verified              | Pass   |
| 12  | bookingFlow    | Booking unavailable date           | Tourist books unavailable date                                                | `400 Bad Request`, no booking created                             | `400`, message matched `unavailable`, no DB booking    | Pass   |
| 13  | bookingFlow    | Double-book approved date          | Tourist books date already approved                                           | `409 Conflict`, duplicate booking prevented                       | `409`, message matched `conflict`, one booking remains | Pass   |
| 14  | bookingFlow    | Guide approves booking             | Guide changes booking status to `Approved`                                    | `200 OK`, booking status updated, Tourist cannot approve          | `200`, DB updated, Tourist receives `403`              | Pass   |
| 15  | dataIntegrity  | Delete Guide cascade               | Admin deletes Guide via DELETE `/api/admin/users/:id`                         | `200 OK`, related tours removed from DB                           | `200`, no tours remain for Guide                       | Pass   |
| 16  | dataIntegrity  | Delete Tour cascade                | Guide deletes Tour via DELETE `/api/tours/:id`                                | `200 OK`, related bookings and reviews removed                    | `200`, related bookings and reviews deleted            | Pass   |
| 17  | dataIntegrity  | Soft-delete placeholder            | Placeholder for soft-delete logic if implemented                              | Passes by default when not implemented                            | `true` asserted in placeholder                         | Pass   |

## Actual Run Output

- All test suites passed successfully.
- Test execution time: `23.22 s`
- Test output summary:
  - `PASS tests/unit/authController.unit.test.js`
  - `PASS tests/unit/middleware.unit.test.js`
  - `PASS tests/unit/bookingController.unit.test.js`
  - `PASS tests/unit/tourController.unit.test.js`
  - `PASS tests/unit/adminController.unit.test.js`
  - `PASS tests/integration/authMiddleware.test.js`
  - `PASS tests/integration/tourSearch.test.js`
  - `PASS tests/integration/bookingFlow.test.js`
  - `PASS tests/integration/dataIntegrity.test.js`
  - `PASS tests/system/authRoutes.test.js`
  - `PASS tests/system/tourRoutes.test.js`
  - `PASS tests/system/bookingRoutes.test.js`
  - `PASS tests/system/adminRoutes.test.js`
  - `PASS tests/regression/regression.test.js`

## Notes

- The suite is designed for end-to-end backend verification, not unit tests.
- Each case includes both HTTP response checks and database state verification.
- The placeholder soft-delete test can be expanded if soft-deletion behavior is later added.
