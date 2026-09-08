import { expect, type Page } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path = "/") {
    await this.page.goto(path);
  }
}

/**
 * Shared header/nav component rendered on every page.
 */
export class NavHeader extends BasePage {
  readonly logo: ReturnType<Page["getByRole"]>;
  readonly mainNav: ReturnType<Page["locator"]>;
  readonly cartLink: ReturnType<Page["locator"]>;
  readonly authLink: ReturnType<Page["locator"]>;
  readonly cartCount: ReturnType<Page["locator"]>;
  readonly hamburger: ReturnType<Page["locator"]>;

  constructor(page: Page) {
    super(page);
    this.logo = page.getByRole("link", { name: "QA Practice Store" });
    this.mainNav = page.locator("#main-nav");
    this.authLink = page.locator("#auth-link");
    this.cartCount = page.locator("#cart-count");
    this.hamburger = page.locator("#hamburger");
    this.cartLink = this.mainNav.getByRole("link", { name: /Cart/ });
  }

  async openMobileNav() {
    if (await this.hamburger.isVisible()) {
      await this.hamburger.click();
      await expect(this.mainNav).toHaveClass(/open/);
    }
  }

  async goToProducts() {
    await this.openMobileNav();
    await this.mainNav
      .getByRole("link", { name: "Products", exact: true })
      .click();
  }

  async goToCart() {
    await this.openMobileNav();
    await this.cartLink.click();
  }

  async goToHome() {
    await this.openMobileNav();
    await this.mainNav
      .getByRole("link", { name: "Home", exact: true })
      .click();
  }

  async goToLogin() {
    await this.openMobileNav();
    await this.authLink.click();
  }

  async expectCartCount(count: string | number) {
    await expect(this.cartCount).toHaveText(String(count));
  }

  async logout() {
    await this.openMobileNav();
    await this.authLink.click();
  }
}
