const { BasePage } = require('./basePage');

class GuideDashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.titleInput = page.getByLabel('Title');
    this.descriptionInput = page.getByLabel('Description');
    this.locationInput = page.getByLabel('Location');
    this.categoryInput = page.getByLabel('Category');
    this.languageInput = page.getByLabel('Language');
    this.priceInput = page.getByLabel('Price');
    this.availabilityInput = page.getByLabel('Availability Dates');
    this.imageInput = page.locator('input[type="file"]');
    this.submitButton = page.getByRole('button', { name: /create tour/i });
    this.successMessage = page.getByText(/tour created successfully/i);
  }

  async gotoDashboard() {
    await this.goto('/dashboard/guide');
  }

  async createTour(tour) {
    await this.gotoDashboard();
    await this.page.getByRole('heading', { name: /launch your next experience/i }).waitFor({ state: 'visible' });
    await this.titleInput.fill(tour.title);
    await this.descriptionInput.fill(tour.description);
    await this.locationInput.fill(tour.location);
    await this.categoryInput.fill(tour.category);
    await this.languageInput.fill(tour.language);
    await this.priceInput.fill(String(tour.price));
    await this.availabilityInput.fill(tour.availabilityDates);
    if (tour.imagePath) {
      await this.imageInput.setInputFiles(tour.imagePath);
    }
    await this.submitButton.click();
    await this.successMessage.waitFor({ state: 'visible' });
  }

  async approveBookingForTour(tourTitle, touristName) {
    await this.gotoDashboard();
    const row = this.page.locator('tr', { hasText: tourTitle }).filter({ hasText: touristName }).first();
    await row.getByRole('button', { name: /approve/i }).click();
    await this.page.getByText(/approved/i).first().waitFor({ state: 'visible' });
  }
}

module.exports = { GuideDashboardPage };