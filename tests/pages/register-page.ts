import { type Page } from "@playwright/test";
import { NavHeader } from "./nav-header";

export interface RegisterFormData {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
  agreeTerms?: boolean;
}

export class RegisterPage extends NavHeader {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto("/register.html");
  }

  nameInput() {
    return this.page.locator("#reg-name");
  }

  emailInput() {
    return this.page.locator("#reg-email");
  }

  passwordInput() {
    return this.page.locator("#reg-password");
  }

  passwordConfirmInput() {
    return this.page.locator("#reg-password-confirm");
  }

  agreeTermsCheckbox() {
    return this.page.locator("#agree-terms");
  }

  registerButton() {
    return this.page.getByRole("button", { name: "Create Account" });
  }

  nameError() {
    return this.page.locator("#reg-name-error");
  }

  emailError() {
    return this.page.locator("#reg-email-error");
  }

  passwordError() {
    return this.page.locator("#reg-password-error");
  }

  passwordConfirmError() {
    return this.page.locator("#reg-password-confirm-error");
  }

  termsError() {
    return this.page.locator("#agree-terms-error");
  }

  loginLink() {
    return this.page.getByRole("link", { name: "Login here" });
  }

  async fill(data: RegisterFormData) {
    if (data.name !== undefined) await this.nameInput().fill(data.name);
    if (data.email !== undefined) await this.emailInput().fill(data.email);
    if (data.password !== undefined) await this.passwordInput().fill(data.password);
    if (data.passwordConfirm !== undefined)
      await this.passwordConfirmInput().fill(data.passwordConfirm);
    if (data.agreeTerms === true) await this.agreeTermsCheckbox().check();
  }

  async submit() {
    await this.registerButton().click();
  }
}
