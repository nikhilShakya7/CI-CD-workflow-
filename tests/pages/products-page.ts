import { expect, type Locator, type Page } from "@playwright/test";
import { NavHeader } from "./nav-header";

export class ProductsPage extends NavHeader {
  readonly heading = () => this.page.getByRole("heading", { name: "Products" });
  readonly searchInput: Locator;
  readonly categoryFilters: Locator;
  readonly sortSelect: Locator;
  readonly resultsCount: Locator;
  readonly noResults: Locator;
  readonly productGrid: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator("#search-input");
    this.categoryFilters = page.locator("#category-filters");
    this.sortSelect = page.locator("#sort-select");
    this.resultsCount = page.locator("#results-count");
    this.noResults = page.locator("#no-results");
    this.productGrid = page.locator("#products-grid");
    this.productCards = page.locator("#products-grid .product");
  }

  async open() {
    await this.goto("/products.html");
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async filterByCategory(category: string) {
    await this.categoryFilters
      .getByRole("button", { name: category, exact: true })
      .click();
  }

  async sortBy(option: string) {
    await this.sortSelect.selectOption(option);
  }

  productCard(name: string): Locator {
    return this.productGrid.locator(".product", { hasText: name });
  }

  productNameLinks(): Locator {
    return this.productCards.locator("h3 a");
  }

  productPrices(): Locator {
    return this.productCards.locator(".price");
  }

  product(name: string) {
    return {
      addToCart: this.productCard(name).getByRole("button", {
        name: "Add to Cart",
      }),
    };
  }

  async expectProductCount(count: number) {
    await expect(this.productCards).toHaveCount(count);
  }

  async expectProductNames(names: string[]) {
    await expect(this.productNameLinks()).toHaveText(names);
  }

  async expectNoResults() {
    await expect(this.noResults).toBeVisible();
  }

  async expectSectionHeading(heading: string) {
    await expect(this.page.getByRole("heading", { name: heading })).toBeVisible();
  }
}
