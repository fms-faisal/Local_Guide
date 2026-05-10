// tests/setup/jest.setup.js
// Ensures test DB is cleared after each test and allows enough time for in-memory MongoDB setup.
const { clearDatabase, closeDatabase } = require('./db');

jest.setTimeout(600000);

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});
