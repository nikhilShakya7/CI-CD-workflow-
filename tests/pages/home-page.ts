import { type Page } from "@playwright/test";
import { NavHeader } from "./nav-header";

export class HomePage extends NavHeader {
  constructor(page: Page) {
    super(page);
  }

  readonly welcomeHeading = () =>
    this.page.getByRole("heading", { name: "Welcome to QA Practice Store" });

  readonly viewProductsLink = () =>
    this.page.getByRole("link", { name: "View Products" });

  async isAtHome() {
    await this.page.waitForURL(/index\.html$/);
  }
}
