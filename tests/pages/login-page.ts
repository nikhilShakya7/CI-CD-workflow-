import { type Page } from "@playwright/test";
import { NavHeader } from "./nav-header";

export class LoginPage extends NavHeader {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto("/login.html");
  }

  emailInput() {
    return this.page.locator("#login-email");
  }

  passwordInput() {
    return this.page.locator("#login-password");
  }

  loginButton() {
    return this.page.getByRole("button", { name: "Login" });
  }

  emailError() {
    return this.page.locator("#login-email-error");
  }

  passwordError() {
    return this.page.locator("#login-password-error");
  }

  registerLink() {
    return this.page.getByRole("link", { name: "Register here" });
  }

  demoCredentials() {
    return this.page.locator(".demo-credentials");
  }

  async login(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }
}
