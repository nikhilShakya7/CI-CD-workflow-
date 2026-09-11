# QA Practice Store

A demo e-commerce website built with vanilla HTML, CSS, and JavaScript, designed specifically for practicing **manual testing**, **Playwright automation**, and **CI/CD**.

## Features

- **10 products** across 3 categories (electronics, accessories, audio) with descriptions, star ratings, customer reviews, and stock status
- Product badges (`new`, `bestseller`, `out of stock`) — including one out-of-stock product for testing disabled states
- **Search**, **category filtering**, and **sorting** (price, name, rating) on the products page
- **Product detail pages** with reviews, related products, and "not found" handling
- **Cart** with quantity controls (+/-), per-item subtotals, tax (10%), and grand total
- **Checkout flow** with order summary, full form validation (name, email, phone, ZIP, card number auto-formatting, expiry MM/YY, CVV), and an order confirmation modal with an order ID
- **User accounts** — register, login, logout (demo credentials: `test@test.com` / `password123`)
- Toast notifications, responsive design with a mobile hamburger menu, 404 page

## Quick Start

You need **Python 3** (or any static file server).

```bash
# Serve the site locally (any static server works)
python3 -m http.server 5500
```

Open http://localhost:5500.

## Running the Tests

### Prerequisites

```bash
npm install
npx playwright install          # download browser binaries
```

> The repo already runs a local server automatically during tests via the `webServer` block in `playwright.config.ts`.

### Commands

| Command | Description |
| --- | --- |
| `npm test` | Run the full test suite (all configured browser projects) |
| `npm run test:headed` | Run tests in headed mode (watch the browser) |
| `npm run test:chromium` | Run only the Chromium project |
| `npm run test:report` | Open the HTML test report |

### Test Suite (55 tests)

Tests live in `tests/` and use the **Page Object Model (POM)**:

```
tests/
├── fixtures.ts                    # auto-wired page objects + helper data
├── pages/                         # Page Object classes
│   ├── base-page.ts               # shared navigation helpers
│   ├── nav-header.ts              # header, nav, cart badge, hamburger
│   ├── home-page.ts
│   ├── products-page.ts           # search, filter, sort, product cards
│   ├── product-detail-page.ts     # details, reviews, related products
│   ├── cart-page.ts               # quantities, totals, remove/clear
│   ├── checkout-page.ts           # form fill, validation, confirmation modal
│   ├── login-page.ts / register-page.ts
│   └── toast.ts                   # toast notification component
├── nav.spec.ts                    # navigation, cart badge, 404, mobile menu
├── products.spec.ts               # catalog, search, filters, sorting
├── product-detail.spec.ts         # detail page, reviews, related products
├── cart.spec.ts                   # cart math and quantity flows
├── checkout.spec.ts               # validation + order flow
└── auth.spec.ts                   # login/register flows
```

## CI/CD

Two GitHub Actions workflows run on every push/PR to `main`:

- **`.github/workflows/playwright.yml`** — installs dependencies & browsers, runs `npx playwright test`, uploads the report
- **`.github/workflows/qa-pipeline.yml`** — similar QA pipeline (checkout, node, install, test, upload report)

On CI, Playwright runs with stricter settings (see `playwright.config.ts`):
- `forbidOnly` — fails the build if a `test.only` is committed
- `retries: 2` — retries failed tests and captures traces
- `workers: 1` — serial-executes tests
- The report is uploaded as a downloadable artifact on the Actions tab

### Practice Ideas

1. **Break a build on purpose** — change an expected value in a spec, push to a branch, open a PR, watch CI fail, download the report artifact, then fix it.
2. **Commit a `test.only`** — watch `forbidOnly` fail the pipeline immediately.
3. **Add a deploy step** — deploy to Netlify/GitHub Pages on push to `main`, then run smoke tests against the deployed URL.
4. **Speed up CI** — add `actions/cache` for `npm ci` and Playwright browser binaries.

## Project Structure

```
.
├── index.html            # Homepage
├── products.html         # Product catalog (search/filter/sort)
├── product.html          # Product detail (uses ?id=N)
├── cart.html             # Shopping cart
├── checkout.html         # Checkout + order confirmation
├── login.html            # Login
├── register.html         # Registration
├── 404.html              # Not found
├── products-data.js      # Static product catalog data
├── script.js             # Application logic (cart, validation, auth)
├── style.css             # Styling (responsive)
├── tests/                # Playwright tests (POM)
├── playwright.config.ts  # Playwright configuration
├── package.json          # Project dependencies & npm scripts
└── .github/workflows/    # CI/CD pipelines
```

## License

ISC