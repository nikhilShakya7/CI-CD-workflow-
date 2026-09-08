import { expect } from "@playwright/test";
import { test } from "./fixtures";

test.describe("Products Catalog", () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.open();
  });

  test("displays all 10 products", async ({ productsPage }) => {
    await productsPage.expectProductCount(10);
    await productsPage.expectSectionHeading("Products");
  });

  test("search filters products by name", async ({ productsPage }) => {
    await productsPage.search("ssd");
    await productsPage.expectProductCount(1);
    await productsPage.expectProductNames(["Portable SSD 1TB"]);
  });

  test("search matches multiple products sharing a word", async ({
    productsPage,
  }) => {
    await productsPage.search("laptop");
    await productsPage.expectProductCount(2);
    await productsPage.expectProductNames(["Laptop Pro 15", "Laptop Stand"]);
  });

  test("search shows no results message for gibberish", async ({
    productsPage,
  }) => {
    await productsPage.search("zzzzzz");
    await productsPage.expectNoResults();
    await productsPage.expectProductCount(0);
  });

  test("category filter shows only electronics", async ({ productsPage }) => {
    await productsPage.filterByCategory("Electronics");
    await productsPage.expectProductCount(3);
    await productsPage.expectProductNames([
      "Laptop Pro 15",
      'Monitor 27" 4K',
      "Portable SSD 1TB",
    ]);
  });

  test("sort by price low to high", async ({ productsPage }) => {
    await productsPage.sortBy("price-asc");
    const prices = await productsPage.productPrices().allTextContents();
    const numeric = prices.map((p) => Number(p.replace("$", "")));
    const sorted = [...numeric].sort((a, b) => a - b);
    expect(numeric).toEqual(sorted);
  });

  test("sort by price high to low", async ({ productsPage }) => {
    await productsPage.sortBy("price-desc");
    const prices = await productsPage.productPrices().allTextContents();
    const numeric = prices.map((p) => Number(p.replace("$", "")));
    const sorted = [...numeric].sort((a, b) => b - a);
    expect(numeric).toEqual(sorted);
  });

  test("sort by rating high to low", async ({ productsPage }) => {
    await productsPage.sortBy("rating-desc");
    await productsPage.expectProductNames([
      "Portable SSD 1TB",
      'Monitor 27" 4K',
      "Laptop Pro 15",
      "Noise-Cancel Headphones",
      "Ergonomic Mouse",
      "Bluetooth Speaker",
      "Wireless Keyboard",
      "Laptop Stand",
      "USB-C Hub",
      "Webcam HD 1080p",
    ]);
  });

  test("out of stock product has disabled add button", async ({
    productsPage,
  }) => {
    const card = productsPage.productCard("Laptop Stand");
    await expect(card.getByRole("button")).toBeDisabled();
  });

  test("in stock product add button is enabled", async ({ productsPage }) => {
    const card = productsPage.productCard("Laptop Pro 15");
    await expect(card.getByRole("button")).toBeEnabled();
  });

  test("adding a product increments cart count and shows toast", async ({
    page,
    productsPage,
  }) => {
    await productsPage.product("Laptop Pro 15").addToCart.click();
    await productsPage.expectCartCount(1);
    await expect(page.locator(".toast-success")).toContainText(
      "Laptop Pro 15 added to cart"
    );
  });
});
