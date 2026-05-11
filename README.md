# Quality Assured Local Guide Platform

## Overview

The Quality Assured Local Guide Platform is a MERN-stack travel and tour booking application built around three user roles: `Tourist`, `Guide`, and `Admin`.

The project combines two goals:

1. building a functional local-tour discovery and booking platform
2. demonstrating a strong Software Quality Assurance workflow through layered automated testing, defect tracking, and formal documentation

This repository contains both the application code and the SQA artifacts produced during testing and reporting.

## What The Platform Does

The platform allows travelers to discover guided experiences offered by local guides. Tourists can register, browse tours, view details, request bookings, and review tours. Guides can create and manage tours and approve booking requests. Admins can monitor the system, view aggregate statistics, and remove users while preserving data integrity through cleanup logic.

At a high level, the system supports:

- user registration and login with role-based behavior
- protected dashboards for Tourist, Guide, and Admin
- tour creation, listing, filtering, update, and deletion
- booking request creation and guide approval workflows
- review and messaging modules exposed through the backend
- admin-level user management and platform statistics
- extensive backend and frontend automated testing

## Project Objectives

This project was developed not only as an application, but as a quality-assured software engineering deliverable. The main objective was to validate the platform across multiple quality layers:

- functionality
- access control and security
- business-rule enforcement
- integration behavior
- regression protection
- documentation quality and reproducibility

## Core User Roles

### Tourist

- register and log in
- browse public tours
- filter tours by search terms and structured criteria
- open tour details
- submit booking requests for valid dates
- view personal bookings
- submit reviews

### Guide

- register and log in as a guide
- access the guide dashboard
- create tours with title, description, location, category, language, price, availability dates, and optional image
- manage bookings related to owned tours
- approve booking requests

### Admin

- access admin-protected functionality
- view all users without exposing password fields
- retrieve platform statistics
- delete users
- trigger cascade cleanup of dependent resources where applicable

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- React Calendar

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT for authentication
- bcrypt for password hashing

### Quality Assurance Tooling

- Jest
- Supertest
- mongodb-memory-server
- Playwright
- Page Object Model for frontend automation

## Repository Layout

The repository contains application code, test suites, and documentation artifacts. The current test harness and most active application references point to the nested `local-guide-platform` directory, while root-level folders contain SQA assets and test orchestration.

```text
Guide_Platform_Project/
├── README.md
├── package.json
├── local-guide-platform/
│   ├── backend/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── utils/
│   ├── tests/
│   ├── testing/
│   ├── SQA_PLAN.md
│   ├── TESTS.md
│   ├── TEST_CASES.md
│   └── jest.config.js
├── tests/
│   ├── integration/
│   ├── regression/
│   ├── setup/
│   ├── system/
│   └── unit/
├── testing/
│   ├── docs/
│   └── tests/e2e/
├── SQA_PLAN.md
├── TESTS.md
├── TEST_CASES.md
├── SQA_FINAL_REPORT_AND_SRS_SUMMARY_Faisal_Mahmud_2517729650.txt
└── SQA_FINAL_REPORT_AND_SRS_SUMMARY_Faisal_Mahmud_2517729650.docx
```

## Application Architecture

### Frontend Architecture

The frontend is a React single-page application with role-aware navigation and protected routes.

Key frontend responsibilities include:

- rendering public pages such as Home, Login, Register, Tours, and Tour Details
- protecting dashboard routes based on authenticated user role
- managing client-side authentication state through context
- calling backend APIs through a central Axios service
- supporting search, filter, and booking interactions from the browser

Important frontend route patterns include:

- `/`
- `/login`
- `/register`
- `/tours`
- `/tours/:id`
- `/dashboard/tourist`
- `/dashboard/guide`
- `/dashboard/admin`
- `/profile`

### Backend Architecture

The backend is an Express API with modular routes and controller-based business logic.

Mounted API groups include:

- `/api/auth`
- `/api/tours`
- `/api/bookings`
- `/api/reviews`
- `/api/messages`
- `/api/admin`

Core backend responsibilities include:

- authentication and token generation
- role-based authorization
- tour querying and filtering
- booking creation and approval workflows
- review and messaging support
- user administration and statistics
- cascading cleanup for dependent records

### Data Model Overview

The platform uses MongoDB collections modeled with Mongoose schemas:

- `User`
  - name
  - email
  - password
  - role
  - profileDetails
- `Tour`
  - guideId
  - title
  - description
  - location
  - category
  - language
  - price
  - availabilityDates
  - image
  - rating
- `Booking`
  - tourId
  - touristId
  - status
  - paymentStatus
  - date
  - bookingDate
- `Review`
  - linked to tour and tourist data in testing and cleanup flows

## Security Model

Security is implemented primarily through JWT-based authentication and role-based access control.

### Authentication

- users receive a JWT after successful registration or login
- the frontend stores the token and attaches it to API requests through an Axios interceptor
- protected backend routes require a valid bearer token

### Role-Based Access Control

- Tourists can create bookings but cannot create tours
- Guides can create tours and update booking status for owned tours
- Admins can access admin endpoints and manage users
- unauthorized and malformed-token requests are rejected

### Defensive Query Handling

Tour filtering uses escaped regular expressions to reduce query-based injection risk in search parameters. Security-oriented Playwright tests also check how the UI responds to hostile query strings.

## Main Features

### Authentication And Role Routing

- registration with role selection
- secure login
- protected routes for each dashboard
- invalid credential handling

### Tour Discovery And Management

- public tour listing page
- search by location or general text
- category, language, price, and date-oriented filtering
- paginated responses using `X-Total-Count`
- guide-controlled tour creation
- owner/admin update and delete controls

### Booking Workflow

- tourists request bookings on available dates
- invalid dates are rejected
- approved-date conflicts are blocked
- guides approve bookings for their own tours
- tourist and guide views expose booking state

### Administration

- retrieve user list
- retrieve system statistics
- delete users
- preserve data integrity by removing dependent records where required

## Quality Assurance Approach

This repository places heavy emphasis on SQA. Testing was designed as a layered strategy instead of a single test style.

### Why A Layered Strategy Was Used

Different risks exist at different levels of the application:

- unit tests detect controller and middleware defects early
- integration tests validate route and database interactions together
- system tests confirm real API workflows
- regression tests protect against previously fixed bugs returning
- frontend E2E tests validate visible user behavior in the browser

Using all of these together produces much stronger confidence than relying on only UI tests or only API tests.

## Testing Organization

### Backend Test Tree

The backend quality suite is organized under `tests/`:

- `tests/unit/`
  - isolated controller and middleware tests
- `tests/integration/`
  - route and model interaction tests using real in-memory MongoDB state
- `tests/system/`
  - end-to-end API route workflows through Express and Supertest
- `tests/regression/`
  - targeted protection for previously fixed high-risk bugs
- `tests/setup/`
  - shared database bootstrapping and test configuration

### Frontend Test Tree

The frontend automation suite is organized under `testing/tests/e2e/`:

- `bookingWorkflow.spec.js`
  - critical-path user journeys
- `modules/auth.module.spec.js`
  - authentication coverage pack
- `modules/booking.module.spec.js`
  - booking-related route and UI coverage pack
- `modules/dashboard.module.spec.js`
  - dashboard and protected-access coverage pack
- `modules/navigation.module.spec.js`
  - navigation and route behavior checks
- `modules/registration.module.spec.js`
  - registration form and validation coverage
- `modules/security.module.spec.js`
  - security-focused browser checks
- `modules/tour-detail.module.spec.js`
  - detail page and invalid-route behavior
- `modules/tour-listing.module.spec.js`
  - listing, search, filter, and category navigation checks

## Types Of Tests Implemented

### 1. Unit Tests

Unit tests verify controller and middleware behavior in isolation.

Examples include:

- successful and failed registration
- successful and failed login
- booking creation validation
- booking status update validation
- role middleware access control
- admin statistics and cascade deletion logic
- tour filtering and pagination behavior

### 2. Bulk Combination Unit Tests

The project also includes large combinational suites to stress validation logic and boundary coverage.

These include:

- `authBulk.unit.test.js`
- `bookingBulk.unit.test.js`
- `tourQueryBulk.unit.test.js`

These suites generate many input combinations to validate:

- missing or malformed credentials
- role-access matrices
- invalid token/header combinations
- booking validation boundary conditions
- extensive filter combinations for tours

### 3. Integration Tests

Integration tests verify that routes, middleware, controllers, and database state work correctly together.

Examples include:

- RBAC behavior across protected routes
- booking lifecycle validation with DB state checks
- cascading deletes for data integrity
- search and filter correctness using real seeded tour data

### 4. System Tests

System tests hit real Express routes through Supertest and validate complete API behavior.

Examples include:

- auth route success and failure cases
- admin statistics and admin-only restrictions
- booking creation and my-bookings endpoints
- tour creation, update, delete, and pagination behavior

### 5. Regression Tests

Regression tests preserve previously fixed bug behavior.

Protected scenarios include:

- duplicate approved booking prevention
- admin deletion cleanup cascades
- admin route protection
- boundary search range behavior

### 6. Frontend End-To-End Tests

Playwright tests validate real browser-visible behavior.

These cover:

- registration and login flows
- guide tour creation and public listing visibility
- tourist booking and guide approval workflow
- route protection and redirect behavior
- form validation
- navigation correctness
- 404 handling
- basic security-oriented UI checks

## How Tests Were Run

### Backend Testing

Backend tests are executed from the repository root using the root `package.json` scripts.

Available commands:

```bash
npm test
npm run test:unit
npm run test:unit:core
npm run test:unit:auth
npm run test:unit:booking
npm run test:unit:tourquery
npm run test:integration
npm run test:system
npm run test:regression
npm run test:all
```

These scripts use:

- `jest --config local-guide-platform/jest.config.js`
- `mongodb-memory-server`
- `supertest`

### Why mongodb-memory-server Was Used

The backend test suite is designed to run against a disposable, isolated MongoDB instance in memory. This provides three major benefits:

- it avoids polluting any production or local development database
- it makes tests repeatable and easier to reset between runs
- it allows assertions against real persistence behavior without external database setup

### Frontend E2E Testing

Frontend tests are implemented with Playwright and are designed to run against:

- frontend at `http://localhost:5173`
- backend at `http://localhost:5000`

The critical path suite is centered around `testing/tests/e2e/bookingWorkflow.spec.js`, and the module packs extend coverage significantly.

The Playwright work uses a Page Object Model to reduce selector duplication and improve maintainability.

## Test Strategy Summary

The SQA strategy emphasized:

- functional correctness
- access control verification
- negative testing
- boundary-value testing
- equivalence-style input combinations
- regression protection
- browser-level validation of user-facing behavior
- documentation of failures, root causes, and fixes

## Notable Quality Findings And Fixes

During the SQA cycle, the project documented and addressed several issues, including:

- guide dashboard authentication/provider issues
- guide image upload and rendering issues
- breadcrumb display removal
- booking and auth reload behavior defects
- TourDetails import and routing issues
- CSS import-order compliance issues
- backend RBAC, search, booking, and cascade cleanup fixes
- intermittent frontend E2E stability problems and mitigation steps

These outcomes are captured in the SQA documentation and final report included in the repository.

## Running The Application Locally

### Prerequisites

- Node.js
- npm
- MongoDB connection string available as `MONGODB_URI`
- optional `JWT_SECRET`

### Backend

From the backend folder:

```bash
cd local-guide-platform/backend
node server.js
```

Expected behavior:

- server starts on port `5000` by default
- MongoDB connects using `MONGODB_URI`

### Frontend

From the frontend folder:

```bash
cd local-guide-platform/frontend
npm install
npm run dev
```

Expected behavior:

- Vite starts the client on port `5173` by default
- the frontend sends API calls to `http://localhost:5000/api`

## Documentation Included In This Repository

This repository includes multiple supporting QA documents:

- `SQA_PLAN.md`
- `TESTS.md`
- `TEST_CASES.md`
- `testing/docs/SQA_EXECUTION_AND_DEFECT_REPORT.md`
- `SQA_FINAL_REPORT_AND_SRS_SUMMARY_Faisal_Mahmud_2517729650.txt`
- `SQA_FINAL_REPORT_AND_SRS_SUMMARY_Faisal_Mahmud_2517729650.docx`

These documents cover:

- planning
- execution strategy
- test case definitions
- defect tracking
- final SQA reporting

## Current State Of The Project

The project demonstrates a functioning MERN application with a substantial QA layer. The backend test strategy is strong and highly structured. The frontend automation also covers critical paths and large generated module packs, although the repository documentation notes intermittent environment-related instability in some E2E runs.

That makes the project useful both as an application prototype and as an academic SQA deliverable.

## Contribution Focus

The strongest contribution of this repository is the combination of:

- application development across multiple user roles
- layered automated testing
- large-volume combinational validation
- defect documentation and resolution tracking
- final professional SQA reporting

This makes the work more than a standard course project. It is also a documented quality-engineering exercise with traceable testing evidence.

## Suggested Reading Order

If you are opening this repository for the first time, the best reading order is:

1. this `README.md`
2. `SQA_PLAN.md`
3. `testing/docs/SQA_EXECUTION_AND_DEFECT_REPORT.md`
4. `TEST_CASES.md`
5. the final report files

## Author

Faisal Mahmud  
ID: 2517729650  
Course: CSE 534, Section 1  
North South University
