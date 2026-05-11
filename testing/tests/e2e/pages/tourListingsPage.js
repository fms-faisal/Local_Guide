const { BasePage } = require('./basePage');

class TourListingsPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = page.getByPlaceholder('City or region');
    this.applyFiltersButton = page.getByRole('button', { name: /apply filters/i });
  }

  async gotoTours() {
    await this.goto('/tours');
  }

  async searchLocation(location) {
    await this.gotoTours();
    await this.searchInput.fill(location);
    await Promise.all([
      this.page.waitForResponse(response => response.url().includes('/api/tours') && response.status() === 200),
      this.applyFiltersButton.click(),
    ]);
  }

  async openTourByTitle(title) {
    const tourTitle = this.page.getByRole('heading', { name: title }).first();
    await tourTitle.waitFor({ state: 'visible', timeout: 15000 });
    await Promise.all([
      this.page.waitForURL(/\/tours\//),
      tourTitle.click(),
    ]);
  }
}

module.exports = { TourListingsPage };