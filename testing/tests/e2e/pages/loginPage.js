const { BasePage } = require('./basePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: /login/i });
    this.alert = page.getByRole('alert');
  }

  async gotoLogin() {
    await this.goto('/login');
  }

  async login(email, password) {
    await this.gotoLogin();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectInvalidLogin() {
    await this.alert.waitFor({ state: 'visible' });
  }
}

module.exports = { LoginPage };