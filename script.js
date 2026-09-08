const CART_KEY = "cart";
const USER_KEY = "currentUser";
const TAX_RATE = 0.1;

let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCount() {
  const count = document.getElementById("cart-count");
  if (count) {
    count.textContent = getCartCount();
  }
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function getFromCart(productId) {
  return cart.find((item) => item.productId === productId);
}

function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  if (!product.inStock) {
    showToast(`${product.name} is out of stock`, "error");
    return;
  }

  const existing = getFromCart(productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
    });
  }

  saveCart();
  updateCartCount();
  showToast(`${product.name} added to cart`);
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const item = getFromCart(productId);
  if (!item) return;

  item.quantity = newQuantity;
  saveCart();
  updateCartCount();
  displayCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  saveCart();
  updateCartCount();
  displayCart();
  showToast("Item removed from cart", "info");
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartCount();
  displayCart();
  showToast("Cart cleared", "info");
}

function formatPrice(amount) {
  return amount.toFixed(2);
}

function calcSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderStars(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="${i <= Math.round(rating) ? "star filled" : "star"}">★</span>`;
  }
  return html;
}

function displayProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  const searchTerm = (document.getElementById("search-input")?.value || "")
    .trim()
    .toLowerCase();
  const activeCategory =
    document.querySelector(".filter-btn.active")?.dataset.category || "all";
  const sortBy = document.getElementById("sort-select")?.value || "default";

  let filtered = PRODUCTS.filter((p) => {
    const matchesCategory =
      activeCategory === "all" || p.category === activeCategory;
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  switch (sortBy) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "rating-desc":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
  }

  const countEl = document.getElementById("results-count");
  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} of ${PRODUCTS.length} products`;
  }

  const noResults = document.getElementById("no-results");
  if (noResults) {
    noResults.style.display = filtered.length === 0 ? "block" : "none";
  }

  grid.innerHTML = filtered
    .map(
      (p) => `
      <div class="product">
        <div class="product-image">${p.image}</div>
        <div class="product-badges">
          ${p.tags.map((t) => `<span class="badge badge-${t}">${t}</span>`).join("")}
          ${!p.inStock ? '<span class="badge badge-oos">out of stock</span>' : ""}
        </div>
        <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="product-rating" title="Rating ${p.rating}">${renderStars(p.rating)} <span>(${p.reviews.length})</span></div>
        <p class="price">$${formatPrice(p.price)}</p>
        <button
          onclick="addToCart(${p.id})"
          ${p.inStock ? "" : "disabled"}
        >
          Add to Cart
        </button>
      </div>
    `
    )
    .join("");
}

function initCategoryFilters() {
  const container = document.getElementById("category-filters");
  if (!container) return;

  CATEGORIES.forEach((category) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.category = category;
    btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    btn.addEventListener("click", () => {
      container.querySelectorAll(".filter-btn").forEach((b) => {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      displayProducts();
    });
    container.appendChild(btn);
  });
}

function displayCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  container.innerHTML = "";

  const summary = document.getElementById("cart-summary");
  if (summary) {
    summary.style.display = cart.length ? "block" : "none";
  }

  if (cart.length === 0) {
    container.innerHTML =
      '<p>Your cart is empty. <a href="products.html">Browse products</a></p>';
    updateCartTotals();
    return;
  }

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">$${formatPrice(item.price)} each</span>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="updateQuantity(${item.productId}, ${item.quantity - 1})" aria-label="Decrease quantity">-</button>
        <span class="qty-value" data-testid="qty-${item.productId}">${item.quantity}</span>
        <button class="qty-btn" onclick="updateQuantity(${item.productId}, ${item.quantity + 1})" aria-label="Increase quantity">+</button>
      </div>
      <span class="cart-item-subtotal" data-testid="subtotal-${item.productId}">$${formatPrice(item.price * item.quantity)}</span>
      <button class="button button-danger" onclick="removeFromCart(${item.productId})">Remove</button>
    `;

    container.appendChild(div);
  });

  updateCartTotals();
}

function updateCartTotals() {
  const subtotal = calcSubtotal(cart);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = formatPrice(value);
  };

  ["cart-subtotal", "checkout-subtotal"].forEach((id) => setText(id, subtotal));
  ["cart-tax", "checkout-tax"].forEach((id) => setText(id, tax));
  ["cart-total", "checkout-total"].forEach((id) => setText(id, total));
}

function displayProductDetail() {
  const container = document.getElementById("product-detail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id"), 10);
  const product = PRODUCTS.find((p) => p.id === productId);

  const notFound = document.getElementById("product-not-found");
  if (!product) {
    container.style.display = "none";
    notFound.style.display = "block";
    return;
  }

  container.innerHTML = `
    <div class="product-detail-card">
      <div class="product-detail-image">${product.image}</div>
      <div class="product-detail-info">
        <h2>${product.name}</h2>
        <div class="product-rating">${renderStars(product.rating)} <span class="rating-value">${product.rating} (${product.reviews.length} reviews)</span></div>
        <p class="price">$${formatPrice(product.price)}</p>
        <p class="product-description">${product.description}</p>
        <p class="${product.inStock ? "in-stock" : "out-of-stock"}">
          ${product.inStock ? "In Stock" : "Out of Stock"}
        </p>
        <button
          class="button large"
          onclick="addToCart(${product.id})"
          ${product.inStock ? "" : "disabled"}
        >
          Add to Cart
        </button>
        <a class="button button-secondary" href="products.html">Back to Products</a>
      </div>
    </div>

    <div class="related-products">
      <h3>Related Products</h3>
      <div class="products">
        ${PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id)
          .map(
            (p) => `
          <div class="product">
            <div class="product-image">${p.image}</div>
            <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
            <p class="price">$${formatPrice(p.price)}</p>
            <button onclick="addToCart(${p.id})" ${p.inStock ? "" : "disabled"}>
              Add to Cart
            </button>
          </div>
        `
          )
          .join("")}
      </div>
    </div>

    <div class="reviews-section">
      <h3>Customer Reviews</h3>
      ${product.reviews
        .map(
          (r) => `
        <div class="review">
          <div class="review-header">
            <strong>${r.user}</strong>
            <span class="product-rating">${renderStars(r.rating)}</span>
          </div>
          <p>${r.comment}</p>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(id, message) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.textContent = message;
  return !!message;
}

function checkout() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  displayCheckoutSummary();

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let valid = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const zip = document.getElementById("zip").value.trim();
    const cardNumber = document
      .getElementById("card-number")
      .value.replace(/\s/g, "");
    const cardExpiry = document.getElementById("card-expiry").value.trim();
    const cardCvv = document.getElementById("card-cvv").value.trim();

    setError("name-error", name ? "" : "Name is required");
    if (!name) valid = false;

    setError("email-error", "");
    if (!email) {
      setError("email-error", "Email is required");
      valid = false;
    } else if (!isValidEmail(email)) {
      setError("email-error", "Please enter a valid email");
      valid = false;
    }

    setError("phone-error", "");
    if (phone && !/^[0-9\s()+-]{10,}$/.test(phone)) {
      setError("phone-error", "Please enter a valid phone number");
      valid = false;
    }

    setError("address-error", address ? "" : "Address is required");
    if (!address) valid = false;

    setError("city-error", city ? "" : "City is required");
    if (!city) valid = false;

    setError("zip-error", "");
    if (!zip) {
      setError("zip-error", "ZIP code is required");
      valid = false;
    } else if (!/^\d{5}(-\d{4})?$/.test(zip)) {
      setError("zip-error", "Enter a valid ZIP code (e.g. 10001)");
      valid = false;
    }

    setError("card-number-error", "");
    if (!cardNumber) {
      setError("card-number-error", "Card number is required");
      valid = false;
    } else if (!/^\d{16}$/.test(cardNumber)) {
      setError("card-number-error", "Card number must be 16 digits");
      valid = false;
    }

    setError("card-expiry-error", "");
    if (!cardExpiry) {
      setError("card-expiry-error", "Expiry is required");
      valid = false;
    } else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setError("card-expiry-error", "Use MM/YY format");
      valid = false;
    }

    setError("card-cvv-error", "");
    if (!cardCvv) {
      setError("card-cvv-error", "CVV is required");
      valid = false;
    } else if (!/^\d{3,4}$/.test(cardCvv)) {
      setError("card-cvv-error", "CVV must be 3-4 digits");
      valid = false;
    }

    if (!cart.length) {
      showToast("Your cart is empty. Add items before checking out.", "error");
      valid = false;
    }

    if (!valid) return;

    const total = calcSubtotal(cart) + calcSubtotal(cart) * TAX_RATE;
    const orderId = "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    localStorage.removeItem(CART_KEY);
    cart = [];
    updateCartCount();
    displayCheckoutSummary();

    document.getElementById("modal-order-id").textContent = `Order ID: ${orderId}`;
    document.getElementById("modal-message").textContent =
      `Thanks, ${name}! Your order of $${formatPrice(total)} has been placed.`;
    document.getElementById("confirmation-modal").style.display = "flex";
    form.reset();
  });
}

function displayCheckoutSummary() {
  const container = document.getElementById("checkout-items");
  const summary = document.getElementById("checkout-summary");
  if (!container) {
    updateCartTotals();
    return;
  }

  updateCartTotals();
  if (summary) {
    summary.style.display = cart.length ? "block" : "none";
  }

  container.innerHTML = cart.length
    ? cart
        .map(
          (item) => `
        <div class="checkout-item">
          <span>${item.name} &times; ${item.quantity}</span>
          <span>$${formatPrice(item.price * item.quantity)}</span>
        </div>
      `
        )
        .join("")
    : "<p>Your cart is empty.</p>";
}

function initCheckoutModal() {
  const modal = document.getElementById("confirmation-modal");
  if (!modal) return;

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      window.location.href = "index.html";
    }
  });
}

function initSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;

  let debounceTimer;
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => displayProducts(), 250);
  });

  const sort = document.getElementById("sort-select");
  if (sort) {
    sort.addEventListener("change", displayProducts);
  }
}

function initClearCart() {
  const btn = document.getElementById("clear-cart-btn");
  if (!btn) return;
  btn.addEventListener("click", clearCart);
}

function formatCardNumber() {
  const input = document.getElementById("card-number");
  if (!input) return;
  input.addEventListener("input", () => {
    let value = input.value.replace(/\D/g, "").slice(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    input.value = value;
  });
}

function formatExpiry() {
  const input = document.getElementById("card-expiry");
  if (!input) return;
  input.addEventListener("input", () => {
    let value = input.value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    input.value = value;
  });
}

function auth() {
  const currentUser = localStorage.getItem(USER_KEY);
  const authLink = document.getElementById("auth-link");

  if (authLink && currentUser) {
    authLink.textContent = `Hi, ${currentUser} (Logout)`;
    authLink.href = "#";
    authLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem(USER_KEY);
      showToast("Logged out", "info");
      setTimeout(() => (window.location.href = "index.html"), 500);
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;

      let valid = true;
      setError("login-email-error", "");
      setError("login-password-error", "");

      if (!email) {
        setError("login-email-error", "Email is required");
        valid = false;
      } else if (!isValidEmail(email)) {
        setError("login-email-error", "Invalid email format");
        valid = false;
      }

      if (!password) {
        setError("login-password-error", "Password is required");
        valid = false;
      }

      if (!valid) return;

      if (email === "test@test.com" && password === "password123") {
        localStorage.setItem(USER_KEY, "Tester");
        showToast("Login successful!");
        setTimeout(() => (window.location.href = "index.html"), 800);
      } else {
        setError("login-password-error", "Invalid email or password");
      }
    });
  }

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("reg-name").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value;
      const confirm = document.getElementById("reg-password-confirm").value;
      const agree = document.getElementById("agree-terms").checked;

      let valid = true;
      ["reg-name-error", "reg-email-error", "reg-password-error", "reg-password-confirm-error", "agree-terms-error"].forEach(
        (id) => setError(id, "")
      );

      if (!name || name.length < 2) {
        setError("reg-name-error", "Name must be at least 2 characters");
        valid = false;
      }

      if (!email) {
        setError("reg-email-error", "Email is required");
        valid = false;
      } else if (!isValidEmail(email)) {
        setError("reg-email-error", "Invalid email format");
        valid = false;
      }

      if (!password || password.length < 8) {
        setError("reg-password-error", "Password must be at least 8 characters");
        valid = false;
      }

      if (confirm !== password) {
        setError("reg-password-confirm-error", "Passwords do not match");
        valid = false;
      }

      if (!agree) {
        setError("agree-terms-error", "You must agree to the terms");
        valid = false;
      }

      if (!valid) return;

      localStorage.setItem(USER_KEY, name);
      showToast("Account created! Redirecting...");
      setTimeout(() => (window.location.href = "index.html"), 900);
    });
  }
}

function initHamburger() {
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("main-nav");
  if (!hamburger || !nav) return;

  hamburger.addEventListener("click", () => {
    nav.classList.toggle("open");
    hamburger.classList.toggle("active");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initHamburger();
  initCategoryFilters();
  initSearch();
  initClearCart();
  formatCardNumber();
  formatExpiry();
  initCheckoutModal();
  displayProducts();
  displayCart();
  displayProductDetail();
  checkout();
  auth();
});
