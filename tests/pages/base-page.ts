import { type Locator, type Page } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path = "/") {
    await this.page.goto(path);
  }

  async openMobileNavIfNeeded() {
    const hamburger = this.page.locator("#hamburger");
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await this.expectNavOpen();
    }
  }

  private async expectNavOpen() {
    await this.page.locator("#main-nav").evaluate((el) => {
      if (!el.classList.contains("open")) {
        el.classList.add("open");
      }
    });
  }
}
