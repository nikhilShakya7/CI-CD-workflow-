import { expect } from "@playwright/test";
import { test, PRODUCTS, createCartItem } from "./fixtures";

test.describe("Navigation", () => {
  test("homepage shows welcome hero", async ({ homePage }) => {
    await homePage.goto("/");
    await expect(homePage.welcomeHeading()).toBeVisible();
    await expect(homePage.viewProductsLink()).toBeVisible();
  });

  test("header nav links navigate to correct pages", async ({
    page,
    homePage,
    productsPage,
    cartPage,
  }) => {
    await homePage.goto("/");
    await homePage.goToProducts();
    await expect(page).toHaveURL(/products\.html$/);
    await expect(productsPage.heading()).toBeVisible();

    await productsPage.goToCart();
    await expect(page).toHaveURL(/cart\.html$/);
    await expect(page.getByRole("heading", { name: "Your Cart" })).toBeVisible();

    await cartPage.goToHome();
    await expect(homePage.welcomeHeading()).toBeVisible();
  });

  test("cart count badge displays number of items", async ({ setupCart, homePage }) => {
    await setupCart([
      createCartItem(PRODUCTS.laptop, 1),
      createCartItem(PRODUCTS.mouse, 2),
    ]);
    await homePage.goto("/");
    await homePage.expectCartCount(3);
  });

  test("cart count badge is 0 when cart empty", async ({ homePage }) => {
    await homePage.goto("/");
    await homePage.expectCartCount(0);
  });

  test("404 page is shown for unknown routes", async ({ page }) => {
    const response = await page.goto("/does-not-exist.html");
    expect(response?.status()).toBe(404);
  });

  test("auth link shows Login when logged out", async ({ homePage }) => {
    await homePage.goto("/");
    await expect(homePage.authLink).toHaveText("Login");
  });

  test("mobile hamburger toggles the navigation menu", async ({
    page,
    homePage,
  }) => {
    await homePage.goto("/");
    if (!(await homePage.hamburger.isVisible())) {
      test.skip();
    }
    await expect(homePage.mainNav).not.toHaveClass(/open/);
    await homePage.hamburger.click();
    await expect(homePage.mainNav).toHaveClass(/open/);
    await expect(
      homePage.mainNav.getByRole("link", { name: "Products", exact: true })
    ).toBeVisible();
    await homePage.hamburger.click();
    await expect(homePage.mainNav).not.toHaveClass(/open/);
  });
});
