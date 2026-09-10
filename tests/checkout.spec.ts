import { expect } from "@playwright/test";
import { test, PRODUCTS, createCartItem } from "./fixtures";

test.describe("Checkout", () => {
  test.beforeEach(async ({ setupCart, checkoutPage }) => {
    await setupCart([createCartItem(PRODUCTS.mouse, 1)]);
    await checkoutPage.open();
  });

  test("shows order summary with cart items and totals", async ({
    checkoutPage,
  }) => {
    await checkoutPage.expectOrderSummaryItem(PRODUCTS.mouse.name);
    await expect(checkoutPage.checkoutSubtotal).toHaveText("50.00");
    await expect(checkoutPage.checkoutTax).toHaveText("4.90");
    await expect(checkoutPage.checkoutTotal).toHaveText("53.90");
  });

  test("shows errors for all empty required fields", async ({
    checkoutPage,
  }) => {
    await checkoutPage.submit();
    await expect(checkoutPage.errorFor("name")).toHaveText("Name is required");
    await expect(checkoutPage.errorFor("email")).toHaveText(
      "Email is required",
    );
    await expect(checkoutPage.errorFor("address")).toHaveText(
      "Address is required",
    );
    await expect(checkoutPage.errorFor("city")).toHaveText("City is required");
    await expect(checkoutPage.errorFor("zip")).toHaveText(
      "ZIP code is required",
    );
    await expect(checkoutPage.errorFor("card-number")).toHaveText(
      "Card number is required",
    );
    await expect(checkoutPage.errorFor("card-expiry")).toHaveText(
      "Expiry is required",
    );
    await expect(checkoutPage.errorFor("card-cvv")).toHaveText(
      "CVV is required",
    );
  });

  test("validates email format", async ({ checkoutPage }) => {
    await checkoutPage.fill({ email: "not-an-email" });
    await checkoutPage.submit();
    await expect(checkoutPage.errorFor("email")).toHaveText(
      "Please enter a valid email",
    );
  });

  test("validates zip code format", async ({ checkoutPage }) => {
    await checkoutPage.fill({ zip: "abc" });
    await checkoutPage.submit();
    await expect(checkoutPage.errorFor("zip")).toHaveText(
      "Enter a valid ZIP code (e.g. 10001)",
    );
  });

  test("validates card number is 16 digits", async ({ checkoutPage }) => {
    await checkoutPage.fill({ cardNumber: "1234" });
    await checkoutPage.submit();
    await expect(checkoutPage.errorFor("card-number")).toHaveText(
      "Card number must be 16 digits",
    );
  });

  test("validates expiry format", async ({ checkoutPage }) => {
    await checkoutPage.fill({ cardExpiry: "1" });
    await checkoutPage.submit();
    await expect(checkoutPage.errorFor("card-expiry")).toHaveText(
      "Use MM/YY format",
    );
  });

  test("validates cvv length", async ({ checkoutPage }) => {
    await checkoutPage.fill({ cardCvv: "12" });
    await checkoutPage.submit();
    await expect(checkoutPage.errorFor("card-cvv")).toHaveText(
      "CVV must be 3-4 digits",
    );
  });

  test("formats card number input with spaces", async ({ checkoutPage }) => {
    await checkoutPage.getInput("card-number").fill("4242424242424242");
    await expect(checkoutPage.getInput("card-number")).toHaveValue(
      "4242 4242 4242 4242",
    );
  });

  test("formats card expiry input as MM/YY", async ({ checkoutPage }) => {
    await checkoutPage.getInput("card-expiry").fill("1228");
    await expect(checkoutPage.getInput("card-expiry")).toHaveValue("12/28");
  });

  test("successful order shows confirmation modal and clears cart", async ({
    checkoutPage,
    cartPage,
  }) => {
    await checkoutPage.fill({
      name: "John Doe",
      email: "john@example.com",
      address: "123 Main St",
      city: "New York",
      zip: "10001",
      cardNumber: "4242424242424242",
      cardExpiry: "12/28",
      cardCvv: "123",
    });
    await checkoutPage.submit();
    await checkoutPage.expectConfirmation("John Doe");
    await expect(checkoutPage.modalMessage).toContainText("$53.90");
    await cartPage.expectCartCount(0);
  });
});

test.describe("Checkout - Empty Cart", () => {
  test("shows empty cart message", async ({ checkoutPage }) => {
    await checkoutPage.open();
    await expect(checkoutPage.checkoutItems).toContainText(
      "Your cart is empty",
    );
  });
});
