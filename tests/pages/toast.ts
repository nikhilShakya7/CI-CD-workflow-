import { type Locator, type Page } from "@playwright/test";

/**
 * Toast notification component rendered in #toast-container on every page.
 */
export class Toast {
  readonly container: Locator;

  constructor(page: Page) {
    this.container = page.locator("#toast-container");
  }

  success(): Locator {
    return this.container.locator(".toast-success");
  }

  error(): Locator {
    return this.container.locator(".toast-error");
  }

  info(): Locator {
    return this.container.locator(".toast-info");
  }
}
