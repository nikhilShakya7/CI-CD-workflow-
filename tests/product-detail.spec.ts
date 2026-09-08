import { expect } from "@playwright/test";
import { test, PRODUCTS } from "./fixtures";

test.describe("Product Detail Page", () => {
  test("shows full product details", async ({ productDetailPage }) => {
    await productDetailPage.open(PRODUCTS.laptop.id);
    await expect(
      productDetailPage.productName(PRODUCTS.laptop.name)
    ).toBeVisible();
    await expect(productDetailPage.description()).toContainText(
      "15-inch Retina display"
    );
    await expect(productDetailPage.price()).toHaveText("$1299.00");
    await expect(productDetailPage.stockStatus()).toHaveText("In Stock");
  });

  test("shows out of stock status", async ({ productDetailPage }) => {
    await productDetailPage.open(PRODUCTS.stand.id);
    await expect(productDetailPage.stockStatus()).toHaveText("Out of Stock");
    await expect(productDetailPage.addToCart()).toBeDisabled();
  });

  test("shows product reviews", async ({ productDetailPage }) => {
    await productDetailPage.open(PRODUCTS.laptop.id);
    await expect(productDetailPage.reviews()).toHaveCount(2);
    await expect(productDetailPage.reviews().first()).toContainText("Alice M.");
  });

  test("shows related products from same category", async ({
    productDetailPage,
  }) => {
    await productDetailPage.open(PRODUCTS.laptop.id);
    // Electronics category (3 items) minus the current product = 2 related
    await productDetailPage.expectRelatedCount(2);
    await expect(productDetailPage.relatedProductNameLinks().first()).toContainText(
      "Monitor"
    );
  });

  test("adds product to cart from detail page", async ({ productDetailPage }) => {
    await productDetailPage.open(PRODUCTS.ssd.id);
    await productDetailPage.addToCart().click();
    await productDetailPage.expectCartCount(1);
  });

  test("shows not found message for invalid product id", async ({
    productDetailPage,
  }) => {
    await productDetailPage.open(999);
    await productDetailPage.expectNotFound();
  });

  test("product name on listing links to detail page", async ({
    page,
    productsPage,
  }) => {
    await productsPage.open();
    await productsPage.productCard("Ergonomic Mouse").locator("h3 a").click();
    await expect(page).toHaveURL(/product\.html\?id=3/);
  });
});
