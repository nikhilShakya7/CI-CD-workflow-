const PRODUCTS = [
  {
    id: 1,
    name: "Laptop Pro 15",
    price: 1299,
    category: "electronics",
    image: "💻",
    description:
      "High-performance laptop with 15-inch Retina display, 16GB RAM, 512GB SSD. Perfect for developers and power users.",
    rating: 4.7,
    reviews: [
      { user: "Alice M.", rating: 5, comment: "Amazing laptop! Super fast." },
      {
        user: "Bob K.",
        rating: 4,
        comment: "Great build quality, a bit heavy.",
      },
    ],
    inStock: true,
    tags: ["new", "bestseller"],
  },
  {
    id: 2,
    name: "Wireless Keyboard",
    price: 79,
    category: "accessories",
    image: "⌨️",
    description:
      "Slim wireless keyboard with backlit keys and long battery life. Compatible with Windows, Mac, and Linux.",
    rating: 4.3,
    reviews: [
      {
        user: "Carol S.",
        rating: 4,
        comment: "Nice keyboard, good for typing.",
      },
      {
        user: "Dave R.",
        rating: 5,
        comment: "Best keyboard I've ever owned.",
      },
    ],
    inStock: true,
    tags: ["bestseller"],
  },
  {
    id: 3,
    name: "Ergonomic Mouse",
    price: 49,
    category: "accessories",
    image: "🖱️",
    description:
      "Vertical ergonomic mouse designed to reduce wrist strain. 4000 DPI sensor with 6 programmable buttons.",
    rating: 4.5,
    reviews: [
      {
        user: "Eve T.",
        rating: 5,
        comment: "Finally no more wrist pain!",
      },
      { user: "Frank L.", rating: 4, comment: "Took a week to get used to." },
    ],
    inStock: true,
    tags: [],
  },
  {
    id: 4,
    name: 'Monitor 27" 4K',
    price: 449,
    category: "electronics",
    image: "🖥️",
    description:
      "27-inch 4K UHD IPS monitor with HDR support. 99% sRGB color accuracy, ideal for creative professionals.",
    rating: 4.8,
    reviews: [
      {
        user: "Grace H.",
        rating: 5,
        comment: "Stunning display, colors are perfect.",
      },
      {
        user: "Henry P.",
        rating: 5,
        comment: "Worth every penny for photo editing.",
      },
    ],
    inStock: true,
    tags: ["new"],
  },
  {
    id: 5,
    name: "Noise-Cancel Headphones",
    price: 249,
    category: "audio",
    image: "🎧",
    description:
      "Premium over-ear headphones with active noise cancellation. 30-hour battery, Bluetooth 5.0, and Hi-Res audio.",
    rating: 4.6,
    reviews: [
      {
        user: "Iris W.",
        rating: 5,
        comment: "Best headphones for commuting.",
      },
      {
        user: "Jack N.",
        rating: 4,
        comment: "Great sound, comfortable for hours.",
      },
    ],
    inStock: true,
    tags: ["bestseller"],
  },
  {
    id: 6,
    name: "USB-C Hub",
    price: 59,
    category: "accessories",
    image: "🔌",
    description:
      "7-in-1 USB-C hub with HDMI, USB 3.0 x3, SD card reader, and 100W power delivery passthrough.",
    rating: 4.2,
    reviews: [
      {
        user: "Karen B.",
        rating: 4,
        comment: "Works great with my MacBook.",
      },
      { user: "Leo M.", rating: 4, comment: "Compact and useful." },
    ],
    inStock: true,
    tags: [],
  },
  {
    id: 7,
    name: "Webcam HD 1080p",
    price: 89,
    category: "accessories",
    image: "📷",
    description:
      "Full HD 1080p webcam with built-in microphone, auto-focus, and low-light correction. Perfect for video calls.",
    rating: 4.1,
    reviews: [
      {
        user: "Mia C.",
        rating: 4,
        comment: "Good quality for the price.",
      },
      {
        user: "Noah D.",
        rating: 3,
        comment: "Mic could be better, video is nice.",
      },
    ],
    inStock: true,
    tags: [],
  },
  {
    id: 8,
    name: "Portable SSD 1TB",
    price: 129,
    category: "electronics",
    image: "💾",
    description:
      "Ultra-fast portable SSD with 1TB capacity. Read speeds up to 1050MB/s. Shock-resistant and USB 3.2 Gen 2.",
    rating: 4.9,
    reviews: [
      {
        user: "Olivia R.",
        rating: 5,
        comment: "Lightning fast transfers!",
      },
      {
        user: "Peter S.",
        rating: 5,
        comment: "Super compact, fits in my pocket.",
      },
    ],
    inStock: true,
    tags: ["new", "bestseller"],
  },
  {
    id: 9,
    name: "Bluetooth Speaker",
    price: 119,
    category: "audio",
    image: "🔊",
    description:
      "Waterproof portable Bluetooth speaker with 360-degree sound. 20-hour battery, built-in microphone for calls.",
    rating: 4.4,
    reviews: [
      {
        user: "Quinn A.",
        rating: 5,
        comment: "Incredible sound for its size!",
      },
      { user: "Rachel F.", rating: 4, comment: "Great for outdoor parties." },
    ],
    inStock: true,
    tags: [],
  },
  {
    id: 10,
    name: "Laptop Stand",
    price: 39,
    category: "accessories",
    image: "📐",
    description:
      "Adjustable aluminum laptop stand with ventilation holes. Improves ergonomics and helps with cooling.",
    rating: 4.3,
    reviews: [
      { user: "Sam T.", rating: 4, comment: "Sturdy and looks clean." },
      {
        user: "Tina G.",
        rating: 5,
        comment: "Makes a huge difference for posture.",
      },
    ],
    inStock: false,
    tags: [],
  },
];

const CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))];
