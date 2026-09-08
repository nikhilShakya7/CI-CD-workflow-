import { expect } from "@playwright/test";
import { test } from "./fixtures";

test.describe("Login", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test("shows validation errors for empty fields", async ({ loginPage }) => {
    await loginPage.loginButton().click();
    await expect(loginPage.emailError()).toHaveText("Email is required");
    await expect(loginPage.passwordError()).toHaveText("Password is required");
  });

  test("validates email format", async ({ loginPage }) => {
    await loginPage.login("bad-email", "password123");
    await expect(loginPage.emailError()).toHaveText("Invalid email format");
  });

  test("rejects invalid credentials", async ({ loginPage }) => {
    await loginPage.login("test@test.com", "wrongpassword");
    await expect(loginPage.passwordError()).toHaveText(
      "Invalid email or password"
    );
  });

  test("logs in with demo credentials and redirects home", async ({
    homePage,
    loginPage,
  }) => {
    await loginPage.login("test@test.com", "password123");
    await expect(homePage.welcomeHeading()).toBeVisible();
    await expect(loginPage.authLink).toContainText("Tester");
    await expect(loginPage.authLink).toContainText("Logout");
  });

  test("logout clears session and shows Login link", async ({
    homePage,
    loginPage,
  }) => {
    await loginPage.login("test@test.com", "password123");
    await loginPage.logout();
    await expect(homePage.welcomeHeading()).toBeVisible();
    await expect(loginPage.authLink).toHaveText("Login");
  });

  test("register link navigates to register page", async ({
    page,
    loginPage,
  }) => {
    await loginPage.registerLink().click();
    await expect(page).toHaveURL(/register\.html$/);
  });

  test("demo credentials are shown on page", async ({ loginPage }) => {
    await expect(loginPage.demoCredentials()).toContainText("test@test.com");
    await expect(loginPage.demoCredentials()).toContainText("password123");
  });
});

test.describe("Register", () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.open();
  });

  test("shows validation errors for empty fields", async ({ registerPage }) => {
    await registerPage.submit();
    await expect(registerPage.nameError()).toHaveText(
      "Name must be at least 2 characters"
    );
    await expect(registerPage.emailError()).toHaveText("Email is required");
    await expect(registerPage.passwordError()).toHaveText(
      "Password must be at least 8 characters"
    );
  });

  test("validates password length", async ({ registerPage }) => {
    await registerPage.fill({
      name: "John Doe",
      email: "john@example.com",
      password: "short",
      passwordConfirm: "short",
      agreeTerms: true,
    });
    await registerPage.submit();
    await expect(registerPage.passwordError()).toHaveText(
      "Password must be at least 8 characters"
    );
  });

  test("validates password confirmation match", async ({ registerPage }) => {
    await registerPage.fill({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      passwordConfirm: "different123",
      agreeTerms: true,
    });
    await registerPage.submit();
    await expect(registerPage.passwordConfirmError()).toHaveText(
      "Passwords do not match"
    );
  });

  test("validates terms acceptance", async ({ registerPage }) => {
    await registerPage.fill({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      passwordConfirm: "password123",
    });
    await registerPage.submit();
    await expect(registerPage.termsError()).toHaveText(
      "You must agree to the terms"
    );
  });

  test("registers successfully and redirects home", async ({
    homePage,
    registerPage,
  }) => {
    await registerPage.fill({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
      passwordConfirm: "password123",
      agreeTerms: true,
    });
    await registerPage.submit();
    await expect(homePage.welcomeHeading()).toBeVisible();
    await expect(registerPage.authLink).toContainText("Jane Doe");
  });
});
