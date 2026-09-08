import { expect, type Locator, type Page } from "@playwright/test";
import { NavHeader } from "./nav-header";

export class ProductDetailPage extends NavHeader {
  readonly detail: Locator;
  readonly notFound: Locator;

  constructor(page: Page) {
    super(page);
    this.detail = page.locator("#product-detail");
    this.notFound = page.locator("#product-not-found");
  }

  private info() {
    return this.detail.locator(".product-detail-info");
  }

  private related() {
    return this.detail.locator(".related-products .product");
  }

  async open(id: number) {
    await this.goto(`/product.html?id=${id}`);
  }

  productName(name: string) {
    return this.page.getByRole("heading", { name });
  }

  description() {
    return this.detail.locator(".product-description");
  }

  price() {
    return this.info().locator(".price");
  }

  stockStatus() {
    return this.info().locator(".in-stock, .out-of-stock");
  }

  addToCart() {
    return this.info().getByRole("button", { name: "Add to Cart" });
  }

  reviews() {
    return this.detail.locator(".review");
  }

  relatedProducts() {
    return this.related();
  }

  relatedProductNameLinks() {
    return this.related().locator("h3 a");
  }

  async expectRelatedCount(count: number) {
    await expect(this.related()).toHaveCount(count);
  }

  async expectNotFound() {
    await expect(this.notFound).toBeVisible();
  }
}
