class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(path) {
    await this.page.goto(path);
  }

  async clickText(text) {
    await this.page.getByText(text).click();
  }

  async fillByLabel(label, value) {
    await this.page.getByLabel(label).fill(value);
  }
}

module.exports = { BasePage };