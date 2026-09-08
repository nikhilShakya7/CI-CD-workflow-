import { expect } from "@playwright/test";
import { test, PRODUCTS, createCartItem } from "./fixtures";

test.describe("Cart", () => {
  test("shows empty cart message when nothing added", async ({ cartPage }) => {
    await cartPage.open();
    await cartPage.expectEmptyMessage();
    await cartPage.expectSummaryHidden();
  });

  test("adds multiple quantities of same product", async ({
    page,
    productsPage,
    cartPage,
  }) => {
    await productsPage.open();
    const addBtn = productsPage.product("Laptop Pro 15").addToCart;
    await addBtn.click();
    await addBtn.click();
    await cartPage.expectCartCount(2);
    await cartPage.open();
    await cartPage.expectItemCount(1);
    await expect(cartPage.quantity(PRODUCTS.laptop.id)).toHaveText("2");
  });

  test("calculates subtotal, tax (10%) and total", async ({
    setupCart,
    cartPage,
  }) => {
    await setupCart([
      createCartItem(PRODUCTS.laptop, 1),
      createCartItem(PRODUCTS.mouse, 2),
    ]);
    await cartPage.open();
    // subtotal = 1299 + 2*49 = 1397
    await expect(cartPage.subtotal).toHaveText("1397.00");
    // tax = 139.70
    await expect(cartPage.tax).toHaveText("139.70");
    // total = 1536.70
    await expect(cartPage.total).toHaveText("1536.70");
  });

  test("per-item subtotal updates when quantity changed", async ({
    setupCart,
    cartPage,
  }) => {
    await setupCart([createCartItem(PRODUCTS.keyboard, 1)]);
    await cartPage.open();
    await expect(cartPage.subtotalFor(PRODUCTS.keyboard.id)).toHaveText(
      "$79.00"
    );
    await cartPage.increaseQuantity(PRODUCTS.keyboard.id).click();
    await expect(cartPage.subtotalFor(PRODUCTS.keyboard.id)).toHaveText(
      "$158.00"
    );
    await expect(cartPage.subtotal).toHaveText("158.00");
    await cartPage.expectCartCount(2);
  });

  test("decreasing quantity below 1 removes the item", async ({
    setupCart,
    cartPage,
  }) => {
    await setupCart([createCartItem(PRODUCTS.mouse, 1)]);
    await cartPage.open();
    await cartPage.decreaseQuantity(PRODUCTS.mouse.id).click();
    await cartPage.expectItemCount(0);
    await cartPage.expectCartCount(0);
    await cartPage.expectEmptyMessage();
  });

  test("removes individual item from cart", async ({
    setupCart,
    cartPage,
  }) => {
    await setupCart([
      createCartItem(PRODUCTS.laptop, 1),
      createCartItem(PRODUCTS.mouse, 1),
    ]);
    await cartPage.open();
    await cartPage.expectItemCount(2);
    await cartPage.remove(PRODUCTS.laptop.id).click();
    await cartPage.expectItemCount(1);
    await cartPage.expectCartCount(1);
    await expect(cartPage.cartItems).toContainText(PRODUCTS.mouse.name);
  });

  test("clears entire cart", async ({ setupCart, cartPage }) => {
    await setupCart([
      createCartItem(PRODUCTS.laptop, 1),
      createCartItem(PRODUCTS.ssd, 2),
    ]);
    await cartPage.open();
    await cartPage.clearCart();
    await cartPage.expectItemCount(0);
    await cartPage.expectCartCount(0);
    await cartPage.expectSummaryHidden();
  });

  test("proceed to checkout navigates to checkout page", async ({
    page,
    setupCart,
    cartPage,
  }) => {
    await setupCart([createCartItem(PRODUCTS.mouse, 1)]);
    await cartPage.open();
    await cartPage.checkoutLink.click();
    await expect(page).toHaveURL(/checkout\.html$/);
  });
});
