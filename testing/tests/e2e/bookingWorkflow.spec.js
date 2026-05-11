const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('./pages/registerPage');
const { LoginPage } = require('./pages/loginPage');
const { GuideDashboardPage } = require('./pages/guideDashboardPage');
const { TourListingsPage } = require('./pages/tourListingsPage');
const { TourDetailsPage } = require('./pages/tourDetailsPage');

const uniqueEmail = (role) => `e2e-${role.toLowerCase()}-${Date.now()}@example.com`;
const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const futureDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return formatLocalDate(date);
};
const pastDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return formatLocalDate(date);
};

const logout = async (page) => {
  const logoutButton = page.getByRole('button', { name: /logout/i });
  if (await logoutButton.count()) {
    await logoutButton.click();
  }
};

test.describe('Local Guide Platform critical path', () => {
  test('Tourist registration and login', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);

    const tourist = {
      name: 'E2E Tourist',
      email: uniqueEmail('tourist'),
      password: 'Test1234!',
      role: 'Tourist',
      bio: 'Automated test traveler',
      location: 'Dhaka',
    };

    await registerPage.register(tourist);
    await expect(page).toHaveURL(/dashboard\/tourist/);
    await expect(page.getByRole('link', { name: /my dashboard/i }).first()).toBeVisible();

    await logout(page);
    await loginPage.login(tourist.email, tourist.password);
    await expect(page).toHaveURL(/dashboard\/tourist/);
    await expect(page.getByRole('link', { name: /my dashboard/i }).first()).toBeVisible();
  });

  test('Guide tour creation and public listing', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const guideDashboard = new GuideDashboardPage(page);
    const tourListings = new TourListingsPage(page);

    const guide = {
      name: 'E2E Guide',
      email: uniqueEmail('guide'),
      password: 'Guide1234!',
      role: 'Guide',
      bio: 'Automated tour guide',
      location: 'Coxs Bazar',
    };

    const tour = {
      title: `E2E Beach Tour ${Date.now()}`,
      description: 'A test tour for automation flows.',
      location: 'Coxs Bazar',
      category: 'Adventure',
      language: 'English',
      price: 120,
      availabilityDates: futureDate(),
    };

    await registerPage.register(guide);
    await expect(page).toHaveURL(/dashboard\/guide/);
    await guideDashboard.createTour(tour);

    await tourListings.gotoTours();
    await tourListings.searchLocation('Coxs Bazar');
    await expect(page.getByText(tour.title)).toBeVisible();
  });

  test('Booking workflow from Tourist to Guide approval', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const guideDashboard = new GuideDashboardPage(page);
    const tourListings = new TourListingsPage(page);
    const tourDetails = new TourDetailsPage(page);

    const guide = {
      name: 'E2E Approver',
      email: uniqueEmail('guide'),
      password: 'Guide1234!',
      role: 'Guide',
      bio: 'Booking workflow guide',
      location: 'Sundarbans',
    };

    const tourist = {
      name: 'E2E Booker',
      email: uniqueEmail('tourist'),
      password: 'Tourist1234!',
      role: 'Tourist',
      bio: 'Booking workflow tourist',
      location: 'Dhaka',
    };

    const tour = {
      title: `E2E Safari Tour ${Date.now()}`,
      description: 'A guide-added tour for booking workflow.',
      location: 'Sundarbans',
      category: 'Nature',
      language: 'English',
      price: 150,
      availabilityDates: futureDate(),
    };

    // Create a guide and a tour
    await registerPage.register(guide);
    await expect(page).toHaveURL(/dashboard\/guide/);
    await guideDashboard.createTour(tour);
    await logout(page);

    // Register and book as tourist
    await registerPage.register(tourist);
    await expect(page).toHaveURL(/dashboard\/tourist/);
    await tourListings.gotoTours();
    await tourListings.searchLocation(tour.title);
    await tourListings.openTourByTitle(tour.title);
    await tourDetails.bookTour(tour.availabilityDates);
    await expect(page.getByText(/booking requested!/i)).toBeVisible();
    await logout(page);

    // Guide approves the booking
    await loginPage.login(guide.email, guide.password);
    await expect(page).toHaveURL(/dashboard\/guide/);
    await guideDashboard.approveBookingForTour(tour.title, tourist.name);
    await logout(page);

    // Tourist verifies approval
    await loginPage.login(tourist.email, tourist.password);
    await expect(page).toHaveURL(/dashboard\/tourist/);
    await expect(page.getByText(tour.title)).toBeVisible();
    await expect(page.getByText(/status:.*approved/i)).toBeVisible();
  });

  test('Negative validation checks', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const tourListings = new TourListingsPage(page);
    const tourDetails = new TourDetailsPage(page);

    const tourist = {
      name: 'E2E Negative',
      email: uniqueEmail('tourist'),
      password: 'Tourist1234!',
      role: 'Tourist',
      bio: 'Negative test tourist',
      location: 'Barisal',
    };

    const tour = {
      title: `E2E Negative Tour ${Date.now()}`,
      description: 'Tour for negative validation',
      location: 'Barisal',
      category: 'Culture',
      language: 'English',
      price: 90,
      availabilityDates: futureDate(),
    };

    // Register a guide and create a tour for booking validation
    await registerPage.register({
      ...tourist,
      email: uniqueEmail('guide'),
      role: 'Guide',
      name: 'E2E Negative Guide',
    });
    await expect(page).toHaveURL(/dashboard\/guide/);
    const guideDashboard = new GuideDashboardPage(page);
    await guideDashboard.createTour(tour);
    await logout(page);

    // Register tourist to perform negative login and booking errors
    await registerPage.register(tourist);
    await logout(page);

    // Wrong password login should fail
    await loginPage.login(tourist.email, 'WrongPassword!');
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toContainText(/invalid|failed/i);

    // Book with a past date and expect the UI to prevent selection
    await loginPage.login(tourist.email, tourist.password);
    await expect(page).toHaveURL(/dashboard\/tourist/);
    await expect(page.getByRole('link', { name: /my dashboard/i }).first()).toBeVisible();
    await tourListings.gotoTours();
    await tourListings.searchLocation(tour.title);
    await tourListings.openTourByTitle(tour.title);
    await tourDetails.expectDateDisabled(pastDate());
  });
});