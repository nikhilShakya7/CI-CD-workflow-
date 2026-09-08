import { test as base } from "@playwright/test";
import { HomePage } from "./pages/home-page";
import { ProductsPage } from "./pages/products-page";
import { ProductDetailPage } from "./pages/product-detail-page";
import { CartPage } from "./pages/cart-page";
import { CheckoutPage } from "./pages/checkout-page";
import { LoginPage } from "./pages/login-page";
import { RegisterPage } from "./pages/register-page";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export const PRODUCTS = {
  laptop: { id: 1, name: "Laptop Pro 15", price: 1299 },
  keyboard: { id: 2, name: "Wireless Keyboard", price: 79 },
  mouse: { id: 3, name: "Ergonomic Mouse", price: 49 },
  monitor: { id: 4, name: 'Monitor 27" 4K', price: 449 },
  headphones: { id: 5, name: "Noise-Cancel Headphones", price: 249 },
  hub: { id: 6, name: "USB-C Hub", price: 59 },
  webcam: { id: 7, name: "Webcam HD 1080p", price: 89 },
  ssd: { id: 8, name: "Portable SSD 1TB", price: 129 },
  speaker: { id: 9, name: "Bluetooth Speaker", price: 119 },
  stand: { id: 10, name: "Laptop Stand", price: 39, inStock: false },
} as const;

export const test = base.extend<Pages & SetupCartFixtures>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  productsPage: async ({ page }, use) => use(new ProductsPage(page)),
  productDetailPage: async ({ page }, use) =>
    use(new ProductDetailPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  setupCart: async ({ page }, use) => {
    await use(async (items) => {
      await page.addInitScript((items) => {
        localStorage.setItem("cart", JSON.stringify(items));
      }, items);
    });
  },
});

interface Pages {
  homePage: HomePage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
}

interface SetupCartFixtures {
  setupCart: (items: CartItem[]) => Promise<void>;
}

export const createCartItem = (p: { id: number; name: string; price: number }, quantity = 1): CartItem => ({
  productId: p.id,
  name: p.name,
  price: p.price,
  quantity,
});
