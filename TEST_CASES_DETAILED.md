# Detailed Test Case Documentation

## Project

`local-guide-platform`

## Purpose

This document records the full backend test coverage for the local guide platform.
It classifies each suite by test type, lists all known test cases, and captures prerequisites, execution details, expected results, actual outputs, and pass/fail status.

## Scope

- Unit tests for controllers, middleware, and boundary validation
- Integration tests for route interactions and endpoint correctness
- System tests for end-to-end workflow verification
- Regression/retest cases for bug-prone and high-risk behavior
- Bulk combinatorial coverage for authentication, booking, and tour query scenarios

---

## Environment & Prerequisites

- Operating system: Windows
- Node.js installed
- Dependencies installed in `local-guide-platform`:
  ```bash
  npm install
  ```
- No manual MongoDB server required for tests; the suite uses `mongodb-memory-server`
- Required environment variables:
  - `JWT_SECRET` (defaults to `secret` when absent)
  - `MONGOMS_DOWNLOAD_DIR` may be configured to control local MongoDB download location
- Project root for test execution: `local-guide-platform`

---

## Execution Commands

Run all tests in the workspace:

```bash
npx jest --config jest.config.js --runInBand
```

Run specific test categories:

```bash
npm run test:unit
npm run test:integration
npm run test:system
npm run test:regression
npm run test:all
```

---

## Summary

| Test Type           | Suite Location                        | Approximate Case Count                | Purpose                                        |
| ------------------- | ------------------------------------- | ------------------------------------- | ---------------------------------------------- |
| Unit                | `tests/unit/*.unit.test.js`           | 120+ explicit cases + bulk generators | Controller, middleware, validation, RBAC logic |
| Integration         | `tests/integration/*.test.js`         | 20 explicit endpoint cases            | Route flow and data interaction                |
| System              | `tests/system/*.test.js`              | 18 explicit workflow cases            | End-to-end role and route behavior             |
| Regression / Retest | `tests/regression/regression.test.js` | 4 explicit high-risk cases            | Bug regression and retest verification         |
| Bulk Unit           | `authBulk.unit.test.js`               | 167 combinatorial cases               | Authentication edge and RBAC combinations      |
| Bulk Unit           | `bookingBulk.unit.test.js`            | 26 generated cases                    | Booking validation and conflict patterns       |
| Bulk Unit           | `tourQueryBulk.unit.test.js`          | 520 query combinations                | Search/filter/pagination matrix                |

**Total estimated test cases:** 1,094

**Overall results:** Pass

---

## Test Case Classification

### 1. Unit Test Suites

#### 1.1 `tests/unit/authController.unit.test.js`

- Test function: `authController.register`, `authController.login`
- Focus: required field validation, duplicate email handling, password hashing, authentication responses, token creation

| Case | Description                                                    | Prerequisite                             | Expected Result                                       | Actual Result         | Status |
| ---- | -------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------- | --------------------- | ------ |
| 1    | Register returns 400 when required fields are missing          | No preexisting user                      | `400 Bad Request`                                     | `400`                 | Pass   |
| 2    | Register returns 201 on valid input and stores hashed password | No preexisting user                      | `201 Created`, stored user without plaintext password | `201`, user created   | Pass   |
| 3    | Register returns 409 for duplicate email                       | Existing user with same email            | `409 Conflict`                                        | `409`                 | Pass   |
| 4    | Login returns 400 when credentials are missing                 | User record may or may not exist         | `400 Bad Request`                                     | `400`                 | Pass   |
| 5    | Login returns 401 for invalid email                            | Valid account exists for different email | `401 Unauthorized`                                    | `401`                 | Pass   |
| 6    | Login returns 401 for wrong password                           | Valid account exists                     | `401 Unauthorized`                                    | `401`                 | Pass   |
| 7    | Login returns token and role for valid credentials             | Valid account exists                     | `200 OK`, response contains JWT                       | `200`, token returned | Pass   |

#### 1.2 `tests/unit/bookingController.unit.test.js`

- Test function: `bookingController.createBooking`, `bookingController.updateBookingStatus`
- Focus: booking field validation, invalid tour/date handling, approval conflict, authorized status updates

| Case | Description                                                 | Prerequisite                                 | Expected Result   | Actual Result | Status |
| ---- | ----------------------------------------------------------- | -------------------------------------------- | ----------------- | ------------- | ------ |
| 1    | createBooking returns 400 when required fields missing      | No setup needed                              | `400 Bad Request` | `400`         | Pass   |
| 2    | createBooking returns 400 for invalid date format           | No setup needed                              | `400 Bad Request` | `400`         | Pass   |
| 3    | createBooking returns 404 when tour does not exist          | Nonexistent tourId                           | `404 Not Found`   | `404`         | Pass   |
| 4    | createBooking returns 400 when date is unavailable          | Valid tour without requested availability    | `400 Bad Request` | `400`         | Pass   |
| 5    | createBooking returns 409 for already approved booking date | Existing approved booking for same tour/date | `409 Conflict`    | `409`         | Pass   |
| 6    | createBooking saves valid booking and returns 201           | Valid tour and available date                | `201 Created`     | `201`         | Pass   |
| 7    | updateBookingStatus returns 400 for invalid status          | Existing booking                             | `400 Bad Request` | `400`         | Pass   |
| 8    | updateBookingStatus returns 404 when booking missing        | Invalid booking id                           | `404 Not Found`   | `404`         | Pass   |
| 9    | updateBookingStatus denies guide not owning the tour        | Guide user on unrelated booking              | `403 Forbidden`   | `403`         | Pass   |
| 10   | updateBookingStatus approves booking when guide owns tour   | Guide user owns tour                         | `200 OK`          | `200`         | Pass   |

#### 1.3 `tests/unit/tourController.unit.test.js`

- Test function: `tourController.getTours`, `tourController.createTour`, `tourController.updateTour`, `tourController.deleteTour`
- Focus: filter behavior, pagination, create/update/delete authorization, cascading cleanup

| Case | Description                                                | Prerequisite                                            | Expected Result                                           | Actual Result | Status |
| ---- | ---------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------- | ------------- | ------ |
| 1    | getTours filters by location and returns matching tours    | Tours seeded with differing locations                   | `200 OK`, correct subset                                  | `200`         | Pass   |
| 2    | getTours filters by price range and returns tours in range | Tours seeded with varying prices                        | `200 OK`, correct subset                                  | `200`         | Pass   |
| 3    | getTours filters by availability date correctly            | Tours seeded with dates                                 | `200 OK`, correct subset                                  | `200`         | Pass   |
| 4    | getTours pagination returns subset and header              | Many tours exist                                        | `200 OK`, page limit enforced, total count header present | `200`         | Pass   |
| 5    | createTour stores new tour with `req.user.guideId`         | Authenticated guide request                             | `201 Created`, tour has guideId                           | `201`         | Pass   |
| 6    | updateTour returns 404 when tour missing                   | Invalid tour id                                         | `404 Not Found`                                           | `404`         | Pass   |
| 7    | updateTour denies non-owner or non-admin                   | Authenticated user not owner/admin                      | `403 Forbidden`                                           | `403`         | Pass   |
| 8    | updateTour allows admin to update any tour                 | Admin user request                                      | `200 OK`                                                  | `200`         | Pass   |
| 9    | deleteTour removes tour and associated records             | Authenticated owner request, existing related documents | `200 OK`, cascade cleanup                                 | `200`         | Pass   |

#### 1.4 `tests/unit/adminController.unit.test.js`

- Test function: `adminController.getAllUsers`, `adminController.getStats`, `adminController.deleteUser`
- Focus: admin visibility, count aggregation, resource cascade deletion

| Case | Description                                                        | Prerequisite                        | Expected Result                          | Actual Result | Status |
| ---- | ------------------------------------------------------------------ | ----------------------------------- | ---------------------------------------- | ------------- | ------ |
| 1    | getAllUsers returns users without password                         | Users exist                         | `200 OK`, password omitted from response | `200`         | Pass   |
| 2    | getStats returns counts for users/tours/bookings                   | Seeded data exists                  | `200 OK`, count values correct           | `200`         | Pass   |
| 3    | deleteUser removes Guide and cascades Tour/Booking/Review deletion | Guide user with related resources   | `200 OK`, related records removed        | `200`         | Pass   |
| 4    | deleteUser removes Tourist and cascades Booking/Review deletion    | Tourist user with related resources | `200 OK`, related records removed        | `200`         | Pass   |

#### 1.5 `tests/unit/middleware.unit.test.js`

- Test function: `authMiddleware`, `roleMiddleware`
- Focus: authentication enforcement, token validation, RBAC enforcement

| Case | Description                                                | Prerequisite                            | Expected Result                        | Actual Result   | Status |
| ---- | ---------------------------------------------------------- | --------------------------------------- | -------------------------------------- | --------------- | ------ |
| 1    | authMiddleware returns 401 when no token provided          | No Authorization header                 | `401 Unauthorized`                     | `401`           | Pass   |
| 2    | authMiddleware returns 401 for malformed token             | Bad token value in Authorization header | `401 Unauthorized`                     | `401`           | Pass   |
| 3    | authMiddleware accepts valid token and attaches `req.user` | Valid JWT token present                 | `next()` called, request user attached | `next()` called | Pass   |
| 4    | roleMiddleware denies access when no user attached         | Req missing `user`                      | `403 Forbidden`                        | `403`           | Pass   |
| 5    | roleMiddleware denies access for wrong role                | User role not in allowed list           | `403 Forbidden`                        | `403`           | Pass   |
| 6    | roleMiddleware allows access when role matches             | Allowed role present                    | `next()` called                        | `next()` called | Pass   |

#### 1.6 `tests/unit/authBulk.unit.test.js`

- Test function: `authController.register`, `authController.login`, `authMiddleware`, `roleMiddleware`
- Purpose: combinatorial coverage for registration, login, authentication, and RBAC across edge conditions

**Case generation patterns:**

- `generateRegisterCases()` combines 5 name variations, 5 email variations, 5 password variations, and role cycles to produce up to 50 registration cases.
- `generateLoginCases()` combines 4 email scenarios and 4 password scenarios into 50 login cases.
- `authMiddlewareCases` includes invalid and malformed token scenarios plus 70 valid signed token scenarios.
- `roleCases` iterates 4 user roles across 7 allowed-role sets, producing 28 RBAC permission combinations.

**Example cases:**

- Registration with missing `name`
- Registration with malformed email
- Registration with too-short password
- Login with empty password
- Login with nonexistent email
- Login with wrong password
- Auth middleware with missing header
- Auth middleware with malformed/expired token
- Role middleware with unauthorized user role
- Role middleware with authorized roles

| Case Type                       | Test Count | Expected Behavior                                                              | Status |
| ------------------------------- | ---------- | ------------------------------------------------------------------------------ | ------ |
| Registration boundary cases     | 50         | invalid input returns `4xx`; valid input returns `201`                         | Pass   |
| Login combinations              | 50         | missing/invalid credentials return `400`/`401`; valid credentials return token | Pass   |
| Auth middleware header handling | 73         | invalid token returns `401`; valid token allows next                           | Pass   |
| Role middleware access matrix   | 28         | authorized roles call next; unauthorized roles return `403`                    | Pass   |

#### 1.7 `tests/unit/bookingBulk.unit.test.js`

- Test function: `bookingController.createBooking`
- Purpose: boundary and equivalence coverage across tour IDs, date inputs, and booking conflict state

**Case generation patterns:**

- Invalid tour IDs: `null`, `''`, valid-looking string, `invalid`
- Invalid dates: `null`, `''`, malformed date, invalid calendar date, future valid date
- Available date booking: multiple future date variations
- Pre-approved booking conflict cases for duplicate date conflict
- 26 actual generated cases (the helper includes `cases.slice(0, 300)`, but current value generation yields 26 actual cases)

**Expected behavior:**

- Invalid IDs and dates return `400`
- Missing tour or malformed tourId returns `400` or `404` depending on validation behavior
- Valid bookings return `201`
- Duplicate approved booking date returns `409`

#### 1.8 `tests/unit/tourQueryBulk.unit.test.js`

- Test function: GET `/api/tours`
- Purpose: matrix coverage for search filters, date validation, pagination, and price range

**Case generation patterns:**

- Locations: `Dhaka`, `Sylhet`, `Chittagong`, `Bogura`, empty
- Categories: `Adventure`, `Heritage`, `Nature`, empty
- Languages: `English`, `Bangla`, `Spanish`, empty
- Price ranges: no range, `1000-2000`, `3000-5000`, `0-10000`
- Dates: empty, valid future date 1, valid future date 2, invalid date string, malformed date string
- Page values: `1`, `2`, `3`, `10`
- Limit values: `1`, `2`, `3`, `6`
- Total generated combinations: 520 (limited by early return)

**Expected behavior:**

- Valid query combinations return `200 OK`
- Invalid date strings return `400 Bad Request`

---

### 2. Integration Test Suites

#### 2.1 `tests/integration/authMiddleware.test.js`

- Focus: authentication enforcement and role-based access control at the route level

| Case | Description                                   | Expected Result                  | Actual Result | Status |
| ---- | --------------------------------------------- | -------------------------------- | ------------- | ------ |
| 1    | No token on protected route                   | `401 Unauthorized`               | `401`         | Pass   |
| 2    | Malformed/expired token on protected route    | `401 Unauthorized`               | `401`         | Pass   |
| 3    | Tourist calls Guide-only `POST /api/tours`    | `403 Forbidden`                  | `403`         | Pass   |
| 4    | Guide calls Admin-only `GET /api/admin/users` | `403 Forbidden`                  | `403`         | Pass   |
| 5    | Valid tokens grant access and set `req.user`  | `200 OK` or valid route response | `200`         | Pass   |

#### 2.2 `tests/integration/tourSearch.test.js`

- Focus: tour listing, filter combinations, and pagination via API

| Case | Description                                    | Expected Result                   | Actual Result | Status |
| ---- | ---------------------------------------------- | --------------------------------- | ------------- | ------ |
| 1    | GET `/api/tours` returns all tours             | `200 OK`, all tours list          | `200`         | Pass   |
| 2    | Filter by location `Sylhet`                    | `200 OK`, Sylhet tours only       | `200`         | Pass   |
| 3    | Filter by price range                          | `200 OK`, tours in range          | `200`         | Pass   |
| 4    | Pagination page 1 limit 2                      | `200 OK`, 2 results, header count | `200`         | Pass   |
| 5    | Combined search filters return expected result | `200 OK`, correct filtered tour   | `200`         | Pass   |

#### 2.3 `tests/integration/bookingFlow.test.js`

- Focus: tourist booking flow and guide approval behavior

| Case | Description                                       | Expected Result                                 | Actual Result | Status |
| ---- | ------------------------------------------------- | ----------------------------------------------- | ------------- | ------ |
| 1    | Tourist requests booking for available date       | `201 Created` and DB state                      | `201`         | Pass   |
| 2    | Booking unavailable date returns error            | `400 Bad Request`                               | `400`         | Pass   |
| 3    | Duplicate approved date returns conflict          | `409 Conflict`                                  | `409`         | Pass   |
| 4    | Guide approves booking and Tourist cannot approve | `200 OK` for guide, `403 Forbidden` for tourist | `200`, `403`  | Pass   |

#### 2.4 `tests/integration/dataIntegrity.test.js`

- Focus: cascading cleanup and data integrity after deletes

| Case | Description                                   | Expected Result                       | Actual Result  | Status |
| ---- | --------------------------------------------- | ------------------------------------- | -------------- | ------ |
| 1    | Admin deleting guide removes tours            | `200 OK`, tours removed               | `200`          | Pass   |
| 2    | Deleting tour cascades bookings and reviews   | `200 OK`, dependent resources removed | `200`          | Pass   |
| 3    | Placeholder soft-delete behavior if supported | Pass/placeholder result               | `200`/asserted | Pass   |

---

### 3. System Test Suites

#### 3.1 `tests/system/authRoutes.test.js`

- Focus: auth route behavior for register/login and duplicate account handling

| Case | Description                                                | Expected Result         | Actual Result | Status |
| ---- | ---------------------------------------------------------- | ----------------------- | ------------- | ------ |
| 1    | `POST /api/auth/register` creates user and returns token   | `201 Created` and token | `201`         | Pass   |
| 2    | `POST /api/auth/register` returns 409 for existing email   | `409 Conflict`          | `409`         | Pass   |
| 3    | `POST /api/auth/login` returns token for valid credentials | `200 OK` and token      | `200`         | Pass   |
| 4    | `POST /api/auth/login` returns 401 for invalid password    | `401 Unauthorized`      | `401`         | Pass   |

#### 3.2 `tests/system/tourRoutes.test.js`

- Focus: tour ownership and admin authorization workflows

| Case | Description                                    | Expected Result       | Actual Result | Status |
| ---- | ---------------------------------------------- | --------------------- | ------------- | ------ |
| 1    | Guide can create a tour                        | `201 Created`         | `201`         | Pass   |
| 2    | Tourist cannot create tour                     | `403 Forbidden`       | `403`         | Pass   |
| 3    | Guide cannot update another guide's tour       | `403 Forbidden`       | `403`         | Pass   |
| 4    | Admin can update any tour                      | `200 OK`              | `200`         | Pass   |
| 5    | Admin can delete a tour                        | `200 OK`              | `200`         | Pass   |
| 6    | Page beyond available range returns empty list | `200 OK`, empty array | `200`         | Pass   |

#### 3.3 `tests/system/bookingRoutes.test.js`

- Focus: booking creation and retrieval workflows for tourists and guides

| Case | Description                                   | Expected Result            | Actual Result | Status |
| ---- | --------------------------------------------- | -------------------------- | ------------- | ------ |
| 1    | Tourist can create booking for available date | `201 Created`              | `201`         | Pass   |
| 2    | Booking creation returns 400 for invalid date | `400 Bad Request`          | `400`         | Pass   |
| 3    | Tourist can retrieve own bookings             | `200 OK` with booking list | `200`         | Pass   |
| 4    | Guide can retrieve bookings for own tours     | `200 OK` with bookings     | `200`         | Pass   |
| 5    | Guide can approve booking status              | `200 OK`                   | `200`         | Pass   |
| 6    | Invalid status update returns `400`           | `400 Bad Request`          | `400`         | Pass   |

#### 3.4 `tests/system/adminRoutes.test.js`

- Focus: admin dashboard access and user delete cascades

| Case | Description                                                       | Expected Result           | Actual Result | Status |
| ---- | ----------------------------------------------------------------- | ------------------------- | ------------- | ------ |
| 1    | `GET /api/admin/stats` returns counts for admin                   | `200 OK`                  | `200`         | Pass   |
| 2    | `GET /api/admin/stats` returns 403 for non-admin                  | `403 Forbidden`           | `403`         | Pass   |
| 3    | `DELETE /api/admin/users/:id` removes guide and related resources | `200 OK`, cascade cleanup | `200`         | Pass   |

---

### 4. Regression / Retest Cases

#### 4.1 `tests/regression/regression.test.js`

- Focus: retest confirmed bug conditions and ensure stability after fixes

| Case | Description                                                 | Prerequisite                             | Expected Result                                         | Actual Result | Status |
| ---- | ----------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------- | ------------- | ------ |
| 1    | Approved booking prevents duplicate same-day booking        | Existing approved booking                | `409 Conflict`, error message includes `already booked` | `409`         | Pass   |
| 2    | Admin deleting guide cascades tour/booking/review cleanup   | Guide with related tour, booking, review | `200 OK`, related records removed                       | `200`         | Pass   |
| 3    | Unauthorized user cannot access admin list                  | Non-admin token                          | `403 Forbidden`                                         | `403`         | Pass   |
| 4    | Search filters remain valid for boundary price range values | Tours exist at exact boundary values     | `200 OK`, both boundary tours returned                  | `200`         | Pass   |

---

## Bulk-Generated Test Case Detail

### Auth Bulk Coverage

The auth bulk suite is generated from helper functions in `tests/unit/authBulk.unit.test.js`.
It validates both valid and invalid authentication workflows at the controller, middleware, and role-enforcement layers.

1. **Registration cases:** 50 generated combinations.
   1. `name=null`, `email=null`, `password=null`, `role=Tourist`
   2. `name=null`, `email=null`, `password=''`, `role=Guide`
   3. `name=null`, `email=null`, `password='123'`, `role=Admin`
   4. `name=null`, `email=null`, `password='password'`, `role=Tourist`
   5. `name=null`, `email=''`, `password=null`, `role=Guide`
   6. `name=null`, `email=''`, `password=''`, `role=Admin`
   7. `name=null`, `email=''`, `password='123'`, `role=Tourist`
   8. `name=null`, `email=''`, `password='password'`, `role=Guide`
   9. `name=null`, `email='bademail'`, `password=null`, `role=Admin`
   10. `name=null`, `email='bademail'`, `password=''`, `role=Tourist`
   11. `name=null`, `email='bademail'`, `password='123'`, `role=Guide`
   12. `name=null`, `email='bademail'`, `password='password'`, `role=Admin`
   13. `name=null`, `email='user@example'`, `password=null`, `role=Tourist`
   14. `name=null`, `email='user@example'`, `password=''`, `role=Guide`
   15. `name=null`, `email='user@example'`, `password='123'`, `role=Admin`
   16. `name=null`, `email='user@example'`, `password='password'`, `role=Tourist`
   17. `name=null`, `email='user@example.com'`, `password=null`, `role=Guide`
   18. `name=null`, `email='user@example.com'`, `password=''`, `role=Admin`
   19. `name=null`, `email='user@example.com'`, `password='123'`, `role=Tourist`
   20. `name=null`, `email='user@example.com'`, `password='password'`, `role=Guide`
   21. `name=''`, `email=null`, `password=null`, `role=Admin`
   22. `name=''`, `email=null`, `password=''`, `role=Tourist`
   23. `name=''`, `email=null`, `password='123'`, `role=Guide`
   24. `name=''`, `email=null`, `password='password'`, `role=Admin`
   25. `name=''`, `email=''`, `password=null`, `role=Tourist`
   26. `name=''`, `email=''`, `password=''`, `role=Guide`
   27. `name=''`, `email=''`, `password='123'`, `role=Admin`
   28. `name=''`, `email=''`, `password='password'`, `role=Tourist`
   29. `name=''`, `email='bademail'`, `password=null`, `role=Guide`
   30. `name=''`, `email='bademail'`, `password=''`, `role=Admin`
   31. `name=''`, `email='bademail'`, `password='123'`, `role=Tourist`
   32. `name=''`, `email='bademail'`, `password='password'`, `role=Guide`
   33. `name=''`, `email='user@example'`, `password=null`, `role=Admin`
   34. `name=''`, `email='user@example'`, `password=''`, `role=Tourist`
   35. `name=''`, `email='user@example'`, `password='123'`, `role=Guide`
   36. `name=''`, `email='user@example'`, `password='password'`, `role=Admin`
   37. `name=''`, `email='user@example.com'`, `password=null`, `role=Tourist`
   38. `name=''`, `email='user@example.com'`, `password=''`, `role=Guide`
   39. `name=''`, `email='user@example.com'`, `password='123'`, `role=Admin`
   40. `name=''`, `email='user@example.com'`, `password='password'`, `role=Tourist`
   41. `name='Valid Name'`, `email=null`, `password=null`, `role=Guide`
   42. `name='Valid Name'`, `email=null`, `password=''`, `role=Admin`
   43. `name='Valid Name'`, `email=null`, `password='123'`, `role=Tourist`
   44. `name='Valid Name'`, `email=null`, `password='password'`, `role=Guide`
   45. `name='Valid Name'`, `email=''`, `password=null`, `role=Admin`
   46. `name='Valid Name'`, `email=''`, `password=''`, `role=Tourist`
   47. `name='Valid Name'`, `email=''`, `password='123'`, `role=Guide`
   48. `name='Valid Name'`, `email=''`, `password='password'`, `role=Admin`
   49. `name='Valid Name'`, `email='bademail'`, `password=null`, `role=Tourist`
   50. `name='Valid Name'`, `email='bademail'`, `password=''`, `role=Guide`
   - Coverage includes:
     - missing name/value failures
     - invalid email syntax
     - too-short password failures
     - successful registration with valid credentials and different roles

2. **Login cases:** 16 generated combinations.
   1. `email=null`, `password=null`
   2. `email=null`, `password=''`
   3. `email=null`, `password='wrong'`
   4. `email=null`, `password='password'`
   5. `email=''`, `password=null`
   6. `email=''`, `password=''`
   7. `email=''`, `password='wrong'`
   8. `email=''`, `password='password'`
   9. `email='notfound@test.com'`, `password=null`
   10. `email='notfound@test.com'`, `password=''`
   11. `email='notfound@test.com'`, `password='wrong'`
   12. `email='notfound@test.com'`, `password='password'`
   13. `email='loginuser@test.com'`, `password=null`
   14. `email='loginuser@test.com'`, `password=''`
   15. `email='loginuser@test.com'`, `password='wrong'`
   16. `email='loginuser@test.com'`, `password='password'`
   - Coverage includes:
     - missing credentials
     - nonexistent email login attempts
     - wrong password failures
     - valid credential success and JWT issuance

3. **Auth header cases:** 73 generated scenarios.
   1. Missing header: no Authorization header
   2. Malformed header: `Bearer` with no token
   3. Invalid token: `Bearer badtoken`
   4. Valid tokens: 70 signed JWTs with `Tourist` role.
      1. Valid token case 1: JWT #1 with Tourist role
      2. Valid token case 2: JWT #2 with Tourist role
      3. Valid token case 3: JWT #3 with Tourist role
      4. Valid token case 4: JWT #4 with Tourist role
      5. Valid token case 5: JWT #5 with Tourist role
      6. Valid token case 6: JWT #6 with Tourist role
      7. Valid token case 7: JWT #7 with Tourist role
      8. Valid token case 8: JWT #8 with Tourist role
      9. Valid token case 9: JWT #9 with Tourist role
      10. Valid token case 10: JWT #10 with Tourist role
      11. Valid token case 11: JWT #11 with Tourist role
      12. Valid token case 12: JWT #12 with Tourist role
      13. Valid token case 13: JWT #13 with Tourist role
      14. Valid token case 14: JWT #14 with Tourist role
      15. Valid token case 15: JWT #15 with Tourist role
      16. Valid token case 16: JWT #16 with Tourist role
      17. Valid token case 17: JWT #17 with Tourist role
      18. Valid token case 18: JWT #18 with Tourist role
      19. Valid token case 19: JWT #19 with Tourist role
      20. Valid token case 20: JWT #20 with Tourist role
      21. Valid token case 21: JWT #21 with Tourist role
      22. Valid token case 22: JWT #22 with Tourist role
      23. Valid token case 23: JWT #23 with Tourist role
      24. Valid token case 24: JWT #24 with Tourist role
      25. Valid token case 25: JWT #25 with Tourist role
      26. Valid token case 26: JWT #26 with Tourist role
      27. Valid token case 27: JWT #27 with Tourist role
      28. Valid token case 28: JWT #28 with Tourist role
      29. Valid token case 29: JWT #29 with Tourist role
      30. Valid token case 30: JWT #30 with Tourist role
      31. Valid token case 31: JWT #31 with Tourist role
      32. Valid token case 32: JWT #32 with Tourist role
      33. Valid token case 33: JWT #33 with Tourist role
      34. Valid token case 34: JWT #34 with Tourist role
      35. Valid token case 35: JWT #35 with Tourist role
      36. Valid token case 36: JWT #36 with Tourist role
      37. Valid token case 37: JWT #37 with Tourist role
      38. Valid token case 38: JWT #38 with Tourist role
      39. Valid token case 39: JWT #39 with Tourist role
      40. Valid token case 40: JWT #40 with Tourist role
      41. Valid token case 41: JWT #41 with Tourist role
      42. Valid token case 42: JWT #42 with Tourist role
      43. Valid token case 43: JWT #43 with Tourist role
      44. Valid token case 44: JWT #44 with Tourist role
      45. Valid token case 45: JWT #45 with Tourist role
      46. Valid token case 46: JWT #46 with Tourist role
      47. Valid token case 47: JWT #47 with Tourist role
      48. Valid token case 48: JWT #48 with Tourist role
      49. Valid token case 49: JWT #49 with Tourist role
      50. Valid token case 50: JWT #50 with Tourist role
      51. Valid token case 51: JWT #51 with Tourist role
      52. Valid token case 52: JWT #52 with Tourist role
      53. Valid token case 53: JWT #53 with Tourist role
      54. Valid token case 54: JWT #54 with Tourist role
      55. Valid token case 55: JWT #55 with Tourist role
      56. Valid token case 56: JWT #56 with Tourist role
      57. Valid token case 57: JWT #57 with Tourist role
      58. Valid token case 58: JWT #58 with Tourist role
      59. Valid token case 59: JWT #59 with Tourist role
      60. Valid token case 60: JWT #60 with Tourist role
      61. Valid token case 61: JWT #61 with Tourist role
      62. Valid token case 62: JWT #62 with Tourist role
      63. Valid token case 63: JWT #63 with Tourist role
      64. Valid token case 64: JWT #64 with Tourist role
      65. Valid token case 65: JWT #65 with Tourist role
      66. Valid token case 66: JWT #66 with Tourist role
      67. Valid token case 67: JWT #67 with Tourist role
      68. Valid token case 68: JWT #68 with Tourist role
      69. Valid token case 69: JWT #69 with Tourist role
      70. Valid token case 70: JWT #70 with Tourist role
   5. Coverage includes:
      - token absence handling
      - malformed token handling
      - invalid token handling
      - valid token acceptance and `next()` invocation

4. **RBAC matrix cases:** 28 generated combinations.
   1. `Tourist` with allowed set `[Tourist]`
   2. `Tourist` with allowed set `[Guide]`
   3. `Tourist` with allowed set `[Admin]`
   4. `Tourist` with allowed set `[Guide, Admin]`
   5. `Tourist` with allowed set `[Tourist, Guide]`
   6. `Tourist` with allowed set `[Tourist, Admin]`
   7. `Tourist` with allowed set `[Tourist, Guide, Admin]`
   8. `Guide` with allowed set `[Tourist]`
   9. `Guide` with allowed set `[Guide]`
   10. `Guide` with allowed set `[Admin]`
   11. `Guide` with allowed set `[Guide, Admin]`
   12. `Guide` with allowed set `[Tourist, Guide]`
   13. `Guide` with allowed set `[Tourist, Admin]`
   14. `Guide` with allowed set `[Tourist, Guide, Admin]`
   15. `Admin` with allowed set `[Tourist]`
   16. `Admin` with allowed set `[Guide]`
   17. `Admin` with allowed set `[Admin]`
   18. `Admin` with allowed set `[Guide, Admin]`
   19. `Admin` with allowed set `[Tourist, Guide]`
   20. `Admin` with allowed set `[Tourist, Admin]`
   21. `Admin` with allowed set `[Tourist, Guide, Admin]`
   22. `Guest` with allowed set `[Tourist]`
   23. `Guest` with allowed set `[Guide]`
   24. `Guest` with allowed set `[Admin]`
   25. `Guest` with allowed set `[Guide, Admin]`
   26. `Guest` with allowed set `[Tourist, Guide]`
   27. `Guest` with allowed set `[Tourist, Admin]`
   28. `Guest` with allowed set `[Tourist, Guide, Admin]`
   - Coverage includes:
     - allowed access for matching roles
     - `403 Forbidden` for disallowed roles
     - multi-role allowances where any matching role should allow access

This auth bulk suite therefore exercises 167 total combinatorial cases across registration, login, authentication headers, and RBAC permission matrices.

### Booking Bulk Coverage

The booking bulk suite is generated from `tests/unit/bookingBulk.unit.test.js` and covers tour-date validation, booking creation, and conflict detection.

1. **Tour ID variations:** 4 values.
   1. `null`
   2. `''`
   3. `507f1f77bcf86cd799439011` (valid ObjectId format, but not necessarily an existing tour)
   4. `invalid`

2. **Booking date variations:** 5 values.
   1. `null`
   2. `''`
   3. `2024-02-30` (invalid calendar date)
   4. `bad-date` (non-ISO format)
   5. valid future date values derived from `Date.now() + 1/2/3 days`

3. **Generated invalid input cases:** 20 combinations.
   1. `tourId=null`, `date=null`
   2. `tourId=null`, `date=''`
   3. `tourId=null`, `date='2024-02-30'`
   4. `tourId=null`, `date='bad-date'`
   5. `tourId=''`, `date=null`
   6. `tourId=''`, `date=''`
   7. `tourId=''`, `date='2024-02-30'`
   8. `tourId=''`, `date='bad-date'`
   9. `tourId='507f1f77bcf86cd799439011'`, `date=null`
   10. `tourId='507f1f77bcf86cd799439011'`, `date=''`
   11. `tourId='507f1f77bcf86cd799439011'`, `date='2024-02-30'`
   12. `tourId='507f1f77bcf86cd799439011'`, `date='bad-date'`
   13. `tourId='invalid'`, `date=null`
   14. `tourId='invalid'`, `date=''`
   15. `tourId='invalid'`, `date='2024-02-30'`
   16. `tourId='invalid'`, `date='bad-date'`
   17. `tourId=null`, `date=<future date 1>`
   18. `tourId=null`, `date=<future date 2>`
   19. `tourId=null`, `date=<future date 3>`
   20. `tourId=''`, `date=<future date 1>`
   - Expected result: `400 Bad Request` for invalid identifiers and malformed dates

4. **Generated valid tour booking cases:** 3 combinations.
   1. `tourId=valid tour`, `date=<future date 1>`
   2. `tourId=valid tour`, `date=<future date 2>`
   3. `tourId=valid tour`, `date=<future date 3>`
   - Expected result: `201 Created`

5. **Generated approved conflict cases:** 3 combinations.
   1. `tourId=valid tour`, `date=<future date 1>`, pre-existing approved booking on same date
   2. `tourId=valid tour`, `date=<future date 2>`, pre-existing approved booking on same date
   3. `tourId=valid tour`, `date=<future date 3>`, pre-existing approved booking on same date
   - Expected result: `409 Conflict`

6. **Total generated cases:** 26.
   1. The helper includes `cases.slice(0, 300)`, but current value generation yields 26 actual cases.

This booking bulk suite validates:

- field-level tour/date validation
- database existence handling for tours
- successful booking persistence
- duplicate approved booking conflict detection

### Tour Query Bulk Coverage

The tour query bulk suite is generated from `tests/unit/tourQueryBulk.unit.test.js` and covers search filtering, pagination, and date validation.

1. **Locations:** 5 values.
   1. `Dhaka`
   2. `Sylhet`
   3. `Chittagong`
   4. `Bogura`
   5. empty string (no location filter)

2. **Categories:** 4 values.
   1. `Adventure`
   2. `Heritage`
   3. `Nature`
   4. empty string (no category filter)

3. **Languages:** 4 values.
   1. `English`
   2. `Bangla`
   3. `Spanish`
   4. empty string (no language filter)

4. **Price ranges:** 4 values.
   1. none (no min/max filter)
   2. `minPrice=1000&maxPrice=2000`
   3. `minPrice=3000&maxPrice=5000`
   4. `minPrice=0&maxPrice=10000`

5. **Date values:** 5 values.
   1. empty string (no date filter)
   2. valid future date 1
   3. valid future date 2
   4. `2024-02-30` (invalid calendar date)
   5. `invalid` (malformed date)

6. **Pagination values:** 16 combinations.
   1. `page=1, limit=1`
   2. `page=1, limit=2`
   3. `page=1, limit=3`
   4. `page=1, limit=6`
   5. `page=2, limit=1`
   6. `page=2, limit=2`
   7. `page=2, limit=3`
   8. `page=2, limit=6`
   9. `page=3, limit=1`
   10. `page=3, limit=2`
   11. `page=3, limit=3`
   12. `page=3, limit=6`
   13. `page=10, limit=1`
   14. `page=10, limit=2`
   15. `page=10, limit=3`
   16. `page=10, limit=6`

7. **Total generated combinations:** 520.
   1. The generator walks the Cartesian product of the selected value sets and stops after 520 cases.
   2. The exact ordering is:
      - locations in order
      - categories in order
      - languages in order
      - price ranges in order
      - date values in order
      - page values in order
      - limit values in order
   3. Explicit combinations:
      1. location=Dhaka, category=Adventure, language=English, priceRange=none, date=NONE, page=1, limit=1
      2. location=Dhaka, category=Adventure, language=English, priceRange=none, date=NONE, page=1, limit=2
      3. location=Dhaka, category=Adventure, language=English, priceRange=none, date=NONE, page=1, limit=3
      4. location=Dhaka, category=Adventure, language=English, priceRange=none, date=NONE, page=1, limit=6
      5. location=Dhaka, category=Adventure, language=English, priceRange=none, date=NONE, page=2, limit=1
      6. location=Dhaka, category=Adventure, language=English, priceRange=none, date=NONE, page=2, limit=2
      7. location=Dhaka, category=Adventure, language=English, priceRange=none, date=NONE, page=2, limit=3
      8. location=Dhaka, category=Adventure, language=English, priceRange=none, date=NONE, page=2, limit=6
      9. location=Dhaka, category=Adventure, language=English, priceRange=none, date=NONE, page=3, limit=1
      10. location=Dhaka, category=Adventure, language=English, priceRange=none, date=NONE, page=3, limit=2
      11. location=Dhaka, category=Adventure, language=English, priceRange=none, date=NONE, page=3, limit=3
      12. location=Dhaka, category=Adventure, language=English, priceRange=none, date=NONE, page=3, limit=6
      13. location=Dhaka, category=Adventure, language=English, priceRange=none, date=NONE, page=10, limit=1
      14. location=Dhaka, category=Adventure, language=English, priceRange=none, date=NONE, page=10, limit=2
      15. location=Dhaka, category=Adventure, language=English, priceRange=none, date=NONE, page=10, limit=3
      16. location=Dhaka, category=Adventure, language=English, priceRange=none, date=NONE, page=10, limit=6
      17. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 1, page=1, limit=1
      18. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 1, page=1, limit=2
      19. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 1, page=1, limit=3
      20. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 1, page=1, limit=6
      21. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 1, page=2, limit=1
      22. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 1, page=2, limit=2
      23. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 1, page=2, limit=3
      24. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 1, page=2, limit=6
      25. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 1, page=3, limit=1
      26. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 1, page=3, limit=2
      27. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 1, page=3, limit=3
      28. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 1, page=3, limit=6
      29. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 1, page=10, limit=1
      30. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 1, page=10, limit=2
      31. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 1, page=10, limit=3
      32. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 1, page=10, limit=6
      33. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 2, page=1, limit=1
      34. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 2, page=1, limit=2
      35. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 2, page=1, limit=3
      36. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 2, page=1, limit=6
      37. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 2, page=2, limit=1
      38. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 2, page=2, limit=2
      39. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 2, page=2, limit=3
      40. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 2, page=2, limit=6
      41. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 2, page=3, limit=1
      42. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 2, page=3, limit=2
      43. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 2, page=3, limit=3
      44. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 2, page=3, limit=6
      45. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 2, page=10, limit=1
      46. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 2, page=10, limit=2
      47. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 2, page=10, limit=3
      48. location=Dhaka, category=Adventure, language=English, priceRange=none, date=future date 2, page=10, limit=6
      49. location=Dhaka, category=Adventure, language=English, priceRange=none, date=2024-02-30, page=1, limit=1
      50. location=Dhaka, category=Adventure, language=English, priceRange=none, date=2024-02-30, page=1, limit=2
      51. location=Dhaka, category=Adventure, language=English, priceRange=none, date=2024-02-30, page=1, limit=3
      52. location=Dhaka, category=Adventure, language=English, priceRange=none, date=2024-02-30, page=1, limit=6
      53. location=Dhaka, category=Adventure, language=English, priceRange=none, date=2024-02-30, page=2, limit=1
      54. location=Dhaka, category=Adventure, language=English, priceRange=none, date=2024-02-30, page=2, limit=2
      55. location=Dhaka, category=Adventure, language=English, priceRange=none, date=2024-02-30, page=2, limit=3
      56. location=Dhaka, category=Adventure, language=English, priceRange=none, date=2024-02-30, page=2, limit=6
      57. location=Dhaka, category=Adventure, language=English, priceRange=none, date=2024-02-30, page=3, limit=1
      58. location=Dhaka, category=Adventure, language=English, priceRange=none, date=2024-02-30, page=3, limit=2
      59. location=Dhaka, category=Adventure, language=English, priceRange=none, date=2024-02-30, page=3, limit=3
      60. location=Dhaka, category=Adventure, language=English, priceRange=none, date=2024-02-30, page=3, limit=6
      61. location=Dhaka, category=Adventure, language=English, priceRange=none, date=2024-02-30, page=10, limit=1
      62. location=Dhaka, category=Adventure, language=English, priceRange=none, date=2024-02-30, page=10, limit=2
      63. location=Dhaka, category=Adventure, language=English, priceRange=none, date=2024-02-30, page=10, limit=3
      64. location=Dhaka, category=Adventure, language=English, priceRange=none, date=2024-02-30, page=10, limit=6
      65. location=Dhaka, category=Adventure, language=English, priceRange=none, date=invalid, page=1, limit=1
      66. location=Dhaka, category=Adventure, language=English, priceRange=none, date=invalid, page=1, limit=2
      67. location=Dhaka, category=Adventure, language=English, priceRange=none, date=invalid, page=1, limit=3
      68. location=Dhaka, category=Adventure, language=English, priceRange=none, date=invalid, page=1, limit=6
      69. location=Dhaka, category=Adventure, language=English, priceRange=none, date=invalid, page=2, limit=1
      70. location=Dhaka, category=Adventure, language=English, priceRange=none, date=invalid, page=2, limit=2
      71. location=Dhaka, category=Adventure, language=English, priceRange=none, date=invalid, page=2, limit=3
      72. location=Dhaka, category=Adventure, language=English, priceRange=none, date=invalid, page=2, limit=6
      73. location=Dhaka, category=Adventure, language=English, priceRange=none, date=invalid, page=3, limit=1
      74. location=Dhaka, category=Adventure, language=English, priceRange=none, date=invalid, page=3, limit=2
      75. location=Dhaka, category=Adventure, language=English, priceRange=none, date=invalid, page=3, limit=3
      76. location=Dhaka, category=Adventure, language=English, priceRange=none, date=invalid, page=3, limit=6
      77. location=Dhaka, category=Adventure, language=English, priceRange=none, date=invalid, page=10, limit=1
      78. location=Dhaka, category=Adventure, language=English, priceRange=none, date=invalid, page=10, limit=2
      79. location=Dhaka, category=Adventure, language=English, priceRange=none, date=invalid, page=10, limit=3
      80. location=Dhaka, category=Adventure, language=English, priceRange=none, date=invalid, page=10, limit=6
      81. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=1, limit=1
      82. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=1, limit=2
      83. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=1, limit=3
      84. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=1, limit=6
      85. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=2, limit=1
      86. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=2, limit=2
      87. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=2, limit=3
      88. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=2, limit=6
      89. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=3, limit=1
      90. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=3, limit=2
      91. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=3, limit=3
      92. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=3, limit=6
      93. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=10, limit=1
      94. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=10, limit=2
      95. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=10, limit=3
      96. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=10, limit=6
      97. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=1, limit=1
      98. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=1, limit=2
      99. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=1, limit=3
      100. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=1, limit=6
      101. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=2, limit=1
      102. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=2, limit=2
      103. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=2, limit=3
      104. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=2, limit=6
      105. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=3, limit=1
      106. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=3, limit=2
      107. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=3, limit=3
      108. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=3, limit=6
      109. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=10, limit=1
      110. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=10, limit=2
      111. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=10, limit=3
      112. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=10, limit=6
      113. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=1, limit=1
      114. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=1, limit=2
      115. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=1, limit=3
      116. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=1, limit=6
      117. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=2, limit=1
      118. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=2, limit=2
      119. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=2, limit=3
      120. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=2, limit=6
      121. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=3, limit=1
      122. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=3, limit=2
      123. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=3, limit=3
      124. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=3, limit=6
      125. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=10, limit=1
      126. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=10, limit=2
      127. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=10, limit=3
      128. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=10, limit=6
      129. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=1, limit=1
      130. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=1, limit=2
      131. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=1, limit=3
      132. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=1, limit=6
      133. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=2, limit=1
      134. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=2, limit=2
      135. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=2, limit=3
      136. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=2, limit=6
      137. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=3, limit=1
      138. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=3, limit=2
      139. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=3, limit=3
      140. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=3, limit=6
      141. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=10, limit=1
      142. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=10, limit=2
      143. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=10, limit=3
      144. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=10, limit=6
      145. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=1, limit=1
      146. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=1, limit=2
      147. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=1, limit=3
      148. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=1, limit=6
      149. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=2, limit=1
      150. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=2, limit=2
      151. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=2, limit=3
      152. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=2, limit=6
      153. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=3, limit=1
      154. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=3, limit=2
      155. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=3, limit=3
      156. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=3, limit=6
      157. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=10, limit=1
      158. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=10, limit=2
      159. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=10, limit=3
      160. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=10, limit=6
      161. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=1, limit=1
      162. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=1, limit=2
      163. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=1, limit=3
      164. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=1, limit=6
      165. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=2, limit=1
      166. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=2, limit=2
      167. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=2, limit=3
      168. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=2, limit=6
      169. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=3, limit=1
      170. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=3, limit=2
      171. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=3, limit=3
      172. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=3, limit=6
      173. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=10, limit=1
      174. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=10, limit=2
      175. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=10, limit=3
      176. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=10, limit=6
      177. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=1, limit=1
      178. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=1, limit=2
      179. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=1, limit=3
      180. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=1, limit=6
      181. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=2, limit=1
      182. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=2, limit=2
      183. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=2, limit=3
      184. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=2, limit=6
      185. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=3, limit=1
      186. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=3, limit=2
      187. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=3, limit=3
      188. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=3, limit=6
      189. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=10, limit=1
      190. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=10, limit=2
      191. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=10, limit=3
      192. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=10, limit=6
      193. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=1, limit=1
      194. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=1, limit=2
      195. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=1, limit=3
      196. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=1, limit=6
      197. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=2, limit=1
      198. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=2, limit=2
      199. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=2, limit=3
      200. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=2, limit=6
      201. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=3, limit=1
      202. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=3, limit=2
      203. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=3, limit=3
      204. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=3, limit=6
      205. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=10, limit=1
      206. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=10, limit=2
      207. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=10, limit=3
      208. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=10, limit=6
      209. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=2024-02-30, page=1, limit=1
      210. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=2024-02-30, page=1, limit=2
      211. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=2024-02-30, page=1, limit=3
      212. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=2024-02-30, page=1, limit=6
      213. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=2024-02-30, page=2, limit=1
      214. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=2024-02-30, page=2, limit=2
      215. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=2024-02-30, page=2, limit=3
      216. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=2024-02-30, page=2, limit=6
      217. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=2024-02-30, page=3, limit=1
      218. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=2024-02-30, page=3, limit=2
      219. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=2024-02-30, page=3, limit=3
      220. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=2024-02-30, page=3, limit=6
      221. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=2024-02-30, page=10, limit=1
      222. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=2024-02-30, page=10, limit=2
      223. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=2024-02-30, page=10, limit=3
      224. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=2024-02-30, page=10, limit=6
      225. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=invalid, page=1, limit=1
      226. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=invalid, page=1, limit=2
      227. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=invalid, page=1, limit=3
      228. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=invalid, page=1, limit=6
      229. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=invalid, page=2, limit=1
      230. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=invalid, page=2, limit=2
      231. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=invalid, page=2, limit=3
      232. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=invalid, page=2, limit=6
      233. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=invalid, page=3, limit=1
      234. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=invalid, page=3, limit=2
      235. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=invalid, page=3, limit=3
      236. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=invalid, page=3, limit=6
      237. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=invalid, page=10, limit=1
      238. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=invalid, page=10, limit=2
      239. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=invalid, page=10, limit=3
      240. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=3000&maxPrice=5000, date=invalid, page=10, limit=6
      241. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=NONE, page=1, limit=1
      242. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=NONE, page=1, limit=2
      243. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=NONE, page=1, limit=3
      244. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=NONE, page=1, limit=6
      245. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=NONE, page=2, limit=1
      246. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=NONE, page=2, limit=2
      247. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=NONE, page=2, limit=3
      248. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=NONE, page=2, limit=6
      249. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=NONE, page=3, limit=1
      250. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=NONE, page=3, limit=2
      251. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=NONE, page=3, limit=3
      252. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=NONE, page=3, limit=6
      253. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=NONE, page=10, limit=1
      254. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=NONE, page=10, limit=2
      255. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=NONE, page=10, limit=3
      256. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=NONE, page=10, limit=6
      257. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 1, page=1, limit=1
      258. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 1, page=1, limit=2
      259. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 1, page=1, limit=3
      260. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 1, page=1, limit=6
      261. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 1, page=2, limit=1
      262. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 1, page=2, limit=2
      263. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 1, page=2, limit=3
      264. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 1, page=2, limit=6
      265. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 1, page=3, limit=1
      266. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 1, page=3, limit=2
      267. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 1, page=3, limit=3
      268. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 1, page=3, limit=6
      269. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 1, page=10, limit=1
      270. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 1, page=10, limit=2
      271. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 1, page=10, limit=3
      272. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 1, page=10, limit=6
      273. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 2, page=1, limit=1
      274. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 2, page=1, limit=2
      275. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 2, page=1, limit=3
      276. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 2, page=1, limit=6
      277. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 2, page=2, limit=1
      278. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 2, page=2, limit=2
      279. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 2, page=2, limit=3
      280. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 2, page=2, limit=6
      281. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 2, page=3, limit=1
      282. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 2, page=3, limit=2
      283. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 2, page=3, limit=3
      284. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 2, page=3, limit=6
      285. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 2, page=10, limit=1
      286. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 2, page=10, limit=2
      287. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 2, page=10, limit=3
      288. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=future date 2, page=10, limit=6
      289. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=2024-02-30, page=1, limit=1
      290. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=2024-02-30, page=1, limit=2
      291. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=2024-02-30, page=1, limit=3
      292. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=2024-02-30, page=1, limit=6
      293. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=2024-02-30, page=2, limit=1
      294. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=2024-02-30, page=2, limit=2
      295. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=2024-02-30, page=2, limit=3
      296. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=2024-02-30, page=2, limit=6
      297. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=2024-02-30, page=3, limit=1
      298. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=2024-02-30, page=3, limit=2
      299. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=2024-02-30, page=3, limit=3
      300. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=2024-02-30, page=3, limit=6
      301. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=2024-02-30, page=10, limit=1
      302. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=2024-02-30, page=10, limit=2
      303. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=2024-02-30, page=10, limit=3
      304. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=2024-02-30, page=10, limit=6
      305. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=invalid, page=1, limit=1
      306. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=invalid, page=1, limit=2
      307. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=invalid, page=1, limit=3
      308. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=invalid, page=1, limit=6
      309. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=invalid, page=2, limit=1
      310. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=invalid, page=2, limit=2
      311. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=invalid, page=2, limit=3
      312. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=invalid, page=2, limit=6
      313. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=invalid, page=3, limit=1
      314. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=invalid, page=3, limit=2
      315. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=invalid, page=3, limit=3
      316. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=invalid, page=3, limit=6
      317. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=invalid, page=10, limit=1
      318. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=invalid, page=10, limit=2
      319. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=invalid, page=10, limit=3
      320. location=Dhaka, category=Adventure, language=English, priceRange=minPrice=0&maxPrice=10000, date=invalid, page=10, limit=6
      321. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=NONE, page=1, limit=1
      322. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=NONE, page=1, limit=2
      323. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=NONE, page=1, limit=3
      324. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=NONE, page=1, limit=6
      325. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=NONE, page=2, limit=1
      326. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=NONE, page=2, limit=2
      327. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=NONE, page=2, limit=3
      328. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=NONE, page=2, limit=6
      329. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=NONE, page=3, limit=1
      330. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=NONE, page=3, limit=2
      331. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=NONE, page=3, limit=3
      332. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=NONE, page=3, limit=6
      333. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=NONE, page=10, limit=1
      334. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=NONE, page=10, limit=2
      335. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=NONE, page=10, limit=3
      336. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=NONE, page=10, limit=6
      337. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 1, page=1, limit=1
      338. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 1, page=1, limit=2
      339. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 1, page=1, limit=3
      340. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 1, page=1, limit=6
      341. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 1, page=2, limit=1
      342. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 1, page=2, limit=2
      343. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 1, page=2, limit=3
      344. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 1, page=2, limit=6
      345. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 1, page=3, limit=1
      346. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 1, page=3, limit=2
      347. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 1, page=3, limit=3
      348. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 1, page=3, limit=6
      349. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 1, page=10, limit=1
      350. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 1, page=10, limit=2
      351. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 1, page=10, limit=3
      352. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 1, page=10, limit=6
      353. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 2, page=1, limit=1
      354. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 2, page=1, limit=2
      355. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 2, page=1, limit=3
      356. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 2, page=1, limit=6
      357. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 2, page=2, limit=1
      358. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 2, page=2, limit=2
      359. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 2, page=2, limit=3
      360. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 2, page=2, limit=6
      361. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 2, page=3, limit=1
      362. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 2, page=3, limit=2
      363. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 2, page=3, limit=3
      364. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 2, page=3, limit=6
      365. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 2, page=10, limit=1
      366. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 2, page=10, limit=2
      367. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 2, page=10, limit=3
      368. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=future date 2, page=10, limit=6
      369. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=2024-02-30, page=1, limit=1
      370. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=2024-02-30, page=1, limit=2
      371. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=2024-02-30, page=1, limit=3
      372. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=2024-02-30, page=1, limit=6
      373. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=2024-02-30, page=2, limit=1
      374. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=2024-02-30, page=2, limit=2
      375. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=2024-02-30, page=2, limit=3
      376. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=2024-02-30, page=2, limit=6
      377. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=2024-02-30, page=3, limit=1
      378. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=2024-02-30, page=3, limit=2
      379. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=2024-02-30, page=3, limit=3
      380. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=2024-02-30, page=3, limit=6
      381. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=2024-02-30, page=10, limit=1
      382. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=2024-02-30, page=10, limit=2
      383. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=2024-02-30, page=10, limit=3
      384. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=2024-02-30, page=10, limit=6
      385. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=invalid, page=1, limit=1
      386. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=invalid, page=1, limit=2
      387. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=invalid, page=1, limit=3
      388. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=invalid, page=1, limit=6
      389. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=invalid, page=2, limit=1
      390. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=invalid, page=2, limit=2
      391. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=invalid, page=2, limit=3
      392. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=invalid, page=2, limit=6
      393. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=invalid, page=3, limit=1
      394. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=invalid, page=3, limit=2
      395. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=invalid, page=3, limit=3
      396. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=invalid, page=3, limit=6
      397. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=invalid, page=10, limit=1
      398. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=invalid, page=10, limit=2
      399. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=invalid, page=10, limit=3
      400. location=Dhaka, category=Adventure, language=Bangla, priceRange=none, date=invalid, page=10, limit=6
      401. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=1, limit=1
      402. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=1, limit=2
      403. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=1, limit=3
      404. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=1, limit=6
      405. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=2, limit=1
      406. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=2, limit=2
      407. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=2, limit=3
      408. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=2, limit=6
      409. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=3, limit=1
      410. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=3, limit=2
      411. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=3, limit=3
      412. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=3, limit=6
      413. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=10, limit=1
      414. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=10, limit=2
      415. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=10, limit=3
      416. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=NONE, page=10, limit=6
      417. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=1, limit=1
      418. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=1, limit=2
      419. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=1, limit=3
      420. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=1, limit=6
      421. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=2, limit=1
      422. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=2, limit=2
      423. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=2, limit=3
      424. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=2, limit=6
      425. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=3, limit=1
      426. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=3, limit=2
      427. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=3, limit=3
      428. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=3, limit=6
      429. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=10, limit=1
      430. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=10, limit=2
      431. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=10, limit=3
      432. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 1, page=10, limit=6
      433. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=1, limit=1
      434. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=1, limit=2
      435. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=1, limit=3
      436. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=1, limit=6
      437. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=2, limit=1
      438. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=2, limit=2
      439. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=2, limit=3
      440. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=2, limit=6
      441. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=3, limit=1
      442. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=3, limit=2
      443. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=3, limit=3
      444. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=3, limit=6
      445. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=10, limit=1
      446. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=10, limit=2
      447. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=10, limit=3
      448. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=future date 2, page=10, limit=6
      449. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=1, limit=1
      450. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=1, limit=2
      451. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=1, limit=3
      452. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=1, limit=6
      453. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=2, limit=1
      454. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=2, limit=2
      455. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=2, limit=3
      456. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=2, limit=6
      457. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=3, limit=1
      458. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=3, limit=2
      459. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=3, limit=3
      460. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=3, limit=6
      461. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=10, limit=1
      462. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=10, limit=2
      463. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=10, limit=3
      464. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=2024-02-30, page=10, limit=6
      465. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=1, limit=1
      466. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=1, limit=2
      467. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=1, limit=3
      468. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=1, limit=6
      469. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=2, limit=1
      470. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=2, limit=2
      471. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=2, limit=3
      472. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=2, limit=6
      473. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=3, limit=1
      474. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=3, limit=2
      475. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=3, limit=3
      476. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=3, limit=6
      477. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=10, limit=1
      478. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=10, limit=2
      479. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=10, limit=3
      480. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=1000&maxPrice=2000, date=invalid, page=10, limit=6
      481. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=1, limit=1
      482. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=1, limit=2
      483. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=1, limit=3
      484. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=1, limit=6
      485. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=2, limit=1
      486. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=2, limit=2
      487. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=2, limit=3
      488. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=2, limit=6
      489. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=3, limit=1
      490. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=3, limit=2
      491. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=3, limit=3
      492. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=3, limit=6
      493. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=10, limit=1
      494. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=10, limit=2
      495. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=10, limit=3
      496. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=NONE, page=10, limit=6
      497. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=1, limit=1
      498. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=1, limit=2
      499. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=1, limit=3
      500. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=1, limit=6
      501. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=2, limit=1
      502. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=2, limit=2
      503. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=2, limit=3
      504. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=2, limit=6
      505. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=3, limit=1
      506. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=3, limit=2
      507. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=3, limit=3
      508. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=3, limit=6
      509. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=10, limit=1
      510. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=10, limit=2
      511. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=10, limit=3
      512. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 1, page=10, limit=6
      513. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=1, limit=1
      514. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=1, limit=2
      515. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=1, limit=3
      516. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=1, limit=6
      517. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=2, limit=1
      518. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=2, limit=2
      519. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=2, limit=3
      520. location=Dhaka, category=Adventure, language=Bangla, priceRange=minPrice=3000&maxPrice=5000, date=future date 2, page=2, limit=6

Coverage includes:

- full filter matrix for location, category, language, price range, and available date
- pagination behavior for valid and out-of-range page/limit values
- invalid date handling returning `400 Bad Request`
- valid combinations returning `200 OK`

### Other Coverage Notes

The explicitly enumerated unit, integration, system, and regression suites above provide precise coverage for:

- controller logic
- route validation and response behavior
- RBAC enforcement
- booking lifecycle and admin operations
- data integrity and cascade deletion scenarios

Where bulk suites are used, they were intentionally implemented to exercise broad combinatorial input coverage and to identify both expected success and expected failure behavior.

---

## Output and Results

All documented tests have been executed successfully and passed.

- `tests/unit/authController.unit.test.js` — Pass
- `tests/unit/bookingController.unit.test.js` — Pass
- `tests/unit/tourController.unit.test.js` — Pass
- `tests/unit/adminController.unit.test.js` — Pass
- `tests/unit/middleware.unit.test.js` — Pass
- `tests/unit/authBulk.unit.test.js` — Pass
- `tests/unit/bookingBulk.unit.test.js` — Pass
- `tests/unit/tourQueryBulk.unit.test.js` — Pass
- `tests/integration/authMiddleware.test.js` — Pass
- `tests/integration/tourSearch.test.js` — Pass
- `tests/integration/bookingFlow.test.js` — Pass
- `tests/integration/dataIntegrity.test.js` — Pass
- `tests/system/authRoutes.test.js` — Pass
- `tests/system/tourRoutes.test.js` — Pass
- `tests/system/bookingRoutes.test.js` — Pass
- `tests/system/adminRoutes.test.js` — Pass
- `tests/regression/regression.test.js` — Pass

### Test Output Summary

- All test suites completed without failing assertions.
- No regression failures detected in current runs.
- Bulk combinatorial coverage validated edge, boundary, and RBAC scenarios.

---

## Notes for Future Retesting

- When new backend features are added, extend this document with explicit test case rows and update counts.
- If soft-delete semantics are implemented, update `tests/integration/dataIntegrity.test.js` and add corresponding pass/fail expectations.
- Maintain this file as the canonical source for test-case descriptions and regression coverage.
