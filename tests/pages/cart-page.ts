import { expect, type Locator, type Page } from "@playwright/test";
import { NavHeader } from "./nav-header";

export class CartPage extends NavHeader {
  readonly cartItems: Locator;
  readonly cartSummary: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly clearCartBtn: Locator;
  readonly checkoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator("#cart-items");
    this.cartSummary = page.locator("#cart-summary");
    this.subtotal = page.locator("#cart-subtotal");
    this.tax = page.locator("#cart-tax");
    this.total = page.locator("#cart-total");
    this.clearCartBtn = page.locator("#clear-cart-btn");
    this.checkoutLink = page.getByRole("link", {
      name: "Proceed to Checkout",
    });
  }

  async open() {
    await this.goto("/cart.html");
  }

  // Row for a given product, identified by the quantity data-testid inside it.
  private row(productId: number): Locator {
    return this.cartItems.locator(".cart-item").filter({
      has: this.page.locator(`[data-testid="qty-${productId}"]`),
    });
  }

  quantity(productId: number): Locator {
    return this.page.locator(`[data-testid="qty-${productId}"]`);
  }

  subtotalFor(productId: number): Locator {
    return this.page.locator(`[data-testid="subtotal-${productId}"]`);
  }

  increaseQuantity(productId: number) {
    return this.row(productId).getByRole("button", {
      name: "Increase quantity",
    });
  }

  decreaseQuantity(productId: number) {
    return this.row(productId).getByRole("button", {
      name: "Decrease quantity",
    });
  }

  remove(productId: number) {
    return this.row(productId).getByRole("button", { name: "Remove" });
  }

  async clearCart() {
    await this.clearCartBtn.click();
  }

  async expectItemCount(count: number) {
    await expect(this.cartItems.locator(".cart-item")).toHaveCount(count);
  }

  async expectEmptyMessage() {
    await expect(this.cartItems).toContainText("Your cart is empty");
  }

  async expectSummaryHidden() {
    await expect(this.cartSummary).toBeHidden();
  }
}
