const { expect } = require('@playwright/test');
const { BasePage } = require('./basePage');

class TourDetailsPage extends BasePage {
  constructor(page) {
    super(page);
    this.calendarTile = page.locator('button.react-calendar__tile:not(:disabled)');
    this.nextMonthButton = page.locator('button.react-calendar__navigation__next-button');
    this.bookButton = page.getByRole('button', { name: /book (now|tour)/i });
    this.bookingMessage = page.getByText(/booking requested|please select a date|selected date is not available/i);
  }

  async bookTour(dateString) {
    await this.bookButton.waitFor({ state: 'visible' });

    let clicked = false;
    if (dateString) {
      const targetDate = new Date(dateString);
      const dayText = String(targetDate.getDate());
      const tile = this.page.locator(`button.react-calendar__tile:not(:disabled):has-text("${dayText}")`).first();
      if (await tile.count()) {
        await tile.click();
        clicked = true;
      }
    }

    if (!clicked) {
      const firstEnabledTile = this.page.locator('button.react-calendar__tile:not(:disabled)').first();
      if (await firstEnabledTile.count()) {
        await firstEnabledTile.click();
      }
    }

    await this.page.locator('button.react-calendar__tile.react-calendar__tile--active').first().waitFor({ state: 'visible', timeout: 5000 });
    await this.bookButton.click();
  }

  async expectBookingStatusMessage(expectedText) {
    await this.page.getByText(expectedText).waitFor({ state: 'visible' });
  }

  async expectDateDisabled(dateString) {
    const targetDate = new Date(dateString);
    const dayText = String(targetDate.getDate());
    const tile = this.page.locator(`button.react-calendar__tile:has-text("${dayText}")`).first();
    await expect(tile).toHaveAttribute('disabled', '');
  }
}

module.exports = { TourDetailsPage };