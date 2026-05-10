# Test Documentation

## Overview

This document describes the integration test coverage for `local-guide-platform`.

## Run tests

Use the following command from the `local-guide-platform` directory:

```bash
npx jest --config jest.config.js --runInBand
```

## Test Suites

### `tests/integration/authMiddleware.test.js`

Covers authentication and RBAC behavior:

- `401 Unauthorized` when a protected route is accessed without a token
- `401 Unauthorized` when a malformed/expired token is used
- `403 Forbidden` when a non-Guide tries to create a tour
- `403 Forbidden` when a non-Admin tries to access admin user endpoints
- Valid Guide requests can create tours and `req.user` is correctly injected

### `tests/integration/tourSearch.test.js`

Covers tour search, filtering, and pagination:

- `GET /api/tours` returns all tours
- `GET /api/tours?location=Sylhet` filters by location
- `GET /api/tours?minPrice=1000&maxPrice=5000` filters by price range
- `GET /api/tours?page=1&limit=2` returns the correct page and total count header
- Combined filters return the correct tour

### `tests/integration/bookingFlow.test.js`

Covers booking creation and validation logic:

- `POST /api/bookings` creates a pending booking
- Booking on unavailable dates returns `400`
- Double-booking an approved date returns `409`
- Only Guide can approve bookings; Tourist receives `403`

### `tests/integration/dataIntegrity.test.js`

Covers cascading delete and relational integrity:

- Admin deleting a guide deletes their tours
- Deleting a tour deletes related bookings and reviews
- Soft-delete placeholder test exists for optional behavior

## Notes

- The integration test suite uses `mongodb-memory-server` and runs against a real in-memory MongoDB instance.
- Jest timeouts were extended to support slower binary downloads on local development machines.
