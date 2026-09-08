import { expect, type Locator, type Page } from "@playwright/test";
import { NavHeader } from "./nav-header";

export interface CheckoutFormData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

export class CheckoutPage extends NavHeader {
  readonly form: Locator;
  readonly placeOrderBtn: Locator;
  readonly checkoutItems: Locator;
  readonly checkoutSubtotal: Locator;
  readonly checkoutTax: Locator;
  readonly checkoutTotal: Locator;
  readonly confirmationModal: Locator;
  readonly modalHeading: Locator;
  readonly modalMessage: Locator;
  readonly modalOrderId: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.locator("#checkout-form");
    this.placeOrderBtn = page.getByRole("button", { name: "Place Order" });
    this.checkoutItems = page.locator("#checkout-items");
    this.checkoutSubtotal = page.locator("#checkout-subtotal");
    this.checkoutTax = page.locator("#checkout-tax");
    this.checkoutTotal = page.locator("#checkout-total");
    this.confirmationModal = page.locator("#confirmation-modal");
    this.modalHeading = page.locator(".modal h3");
    this.modalMessage = page.locator("#modal-message");
    this.modalOrderId = page.locator("#modal-order-id");
  }

  async open() {
    await this.goto("/checkout.html");
  }

  getInput(id: string): Locator {
    return this.page.locator(`#${id}`);
  }

  errorFor(id: string): Locator {
    return this.page.locator(`#${id}-error`);
  }

  async fill(data: CheckoutFormData) {
    const fieldMap = {
      name: "name",
      email: "email",
      phone: "phone",
      address: "address",
      city: "city",
      zip: "zip",
      cardNumber: "card-number",
      cardExpiry: "card-expiry",
      cardCvv: "card-cvv",
    } as const;
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        await this.getInput(fieldMap[key as keyof typeof fieldMap]).fill(value);
      }
    }
  }

  async submit() {
    await this.placeOrderBtn.click();
  }

  async expectOrderSummaryItem(name: string) {
    await expect(this.checkoutItems).toContainText(name);
  }

  async expectConfirmation(messageText?: string) {
    await expect(this.confirmationModal).toBeVisible();
    await expect(this.modalHeading).toHaveText("Order Confirmed!");
    if (messageText) {
      await expect(this.modalMessage).toContainText(messageText);
    }
    await expect(this.modalOrderId).toContainText("ORD-");
  }
}
