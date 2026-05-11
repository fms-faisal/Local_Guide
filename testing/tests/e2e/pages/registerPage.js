const { BasePage } = require('./basePage');

class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.nameInput = page.getByLabel('Name');
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.roleSelect = page.getByLabel('Role');
    this.bioInput = page.getByLabel('Bio');
    this.locationInput = page.getByLabel('Location');
    this.submitButton = page.getByRole('button', { name: /register account/i });
  }

  async register({ name, email, password, role = 'Tourist', bio = '', location = '' }) {
    await this.goto('/register');
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.roleSelect.selectOption(role);
    await this.bioInput.fill(bio);
    await this.locationInput.fill(location);
    await this.submitButton.click();
  }
}

module.exports = { RegisterPage };