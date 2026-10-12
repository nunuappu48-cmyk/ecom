# 🍯 Fellas Honey — Premium Mobile-First E-Commerce Web App

A modern, mobile-first e-commerce web application built for selling 100% pure, raw, artisanal natural honey products. Built with **React**, **Vite**, **Tailwind CSS**, **Lucide Icons**, **Supabase** (PostgreSQL, Auth, Storage, RLS), and configured for **Vercel** deployment.

---

## 🌟 Features

### 📱 Mobile-First User Experience
- **Fluid Responsiveness**: Flawlessly optimized for 320px, 375px, 390px, 430px phones, tablets, and desktop displays.
- **Mobile Bottom Navigation Bar**: Quick navigation between **Home**, **Shop**, **Cart (with count badge)**, and **Account**.
- **Slide-Over Cart Drawer**: Direct item editing, free shipping progress tracker, promo codes, and fast checkout.

### 🍯 Storefront Highlights
- **Luxury Hero Section**: Highlighting *"Pure Honey, Straight From Nature"*, organic badges, trust seals, and CTA buttons.
- **"Why Choose Our Honey"**: 4 key pillars:
  - 🍯 **100% Pure** (Never pasteurized)
  - 🌿 **Naturally Sourced** (Certified origins)
  - 🐝 **Carefully Harvested** (Ethical bee-friendly methods)
  - 🚚 **Fast Delivery** (Free over $50)
- **Product Catalog & Filters**:
  - Live search with instant debounce
  - Category filter pills (*Wildflower, Raw Honey, Monofloral, Rare Reserve, Medical Grade, Infused Honey, Honeydew*)
  - Interactive price range slider
  - Sorting by Price (Low to High, High to Low), Popularity/Rating, and Newest.
- **Product Details Page (`/products/:slug`)**:
  - Dynamic jar weight selector (`250g`, `500g`, `1kg`) with live price recalculation
  - Health benefits, single-origin ingredients, and harvest storage guide tabs
  - Customer reviews + interactive "Write a Review" modal
  - "You May Also Like" recommendation grid
  - **Instant "Buy Now"** & "Add to Cart" triggers.
- **Cash on Delivery Checkout (`/checkout`)**:
  - Full shipping details capture
  - Active Cash on Delivery (COD) & Online Payment sandbox options
  - Order creation in Supabase PostgreSQL database
- **Celebratory Order Receipt (`/order-success/:orderNumber`)**:
  - Confetti burst animation
  - Itemized receipt summary with tracking timeline

### 👤 Customer Accounts & Auth
- **Supabase Authentication**: Email/Password login, registration, password recovery.
- **One-Click Demo Access**: Fast testing buttons for instant Customer and Admin preview!
- **Order History & Profile Dashboard**: View past receipts, delivery progress, and update profile info.

### 🛡️ Beekeeper Admin Dashboard (`/admin`)
- **Metric Cards**: Total Revenue, Total Orders, Pending Orders, Active Products, Low Stock Alerts.
- **Product Management (`/admin/products`)**:
  - Add, Edit, Delete (with safety modal)
  - Toggle Featured on Home & Active storefront visibility
  - Image uploads to Supabase Storage bucket (`product-images`)
- **Order Management (`/admin/orders`)**:
  - Filter orders by status (*Pending, Confirmed, Processing, Shipped, Delivered, Cancelled*)
  - Inspect customer shipping address, phone, notes, and items
  - Update shipment status in real time
- **Reviews Moderation (`/admin/reviews`)**:
  - Moderate testimonials and monitor newsletter subscriber lists.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router 6, Tailwind CSS, Lucide React, Canvas Confetti
- **Backend / Database**: Supabase PostgreSQL, Supabase Auth, Supabase Row Level Security (RLS)
- **Image Storage**: **Firebase Cloud Storage** (for uploading and serving high-resolution product photography)
- **Hosting & API**: Vercel (SPA rewrite config + Serverless API functions)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your **Supabase** and **Firebase** credentials:
```env
# Supabase PostgreSQL Database & Auth
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Firebase Cloud Storage (For Product Images)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Server-Side Only (Optional)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> **Note**: The application includes a fallback data layer with sample honey products, so it runs immediately out-of-the-box even before Supabase credentials are configured!

### 3. Supabase Database & Auth Setup
1. Go to your [Supabase Dashboard](https://app.supabase.com) → **SQL Editor**.
2. Run the schema migration script: [`supabase/migrations/20260928000001_initial_schema.sql`](supabase/migrations/20260928000001_initial_schema.sql).
3. (Optional) Run the seed script to populate realistic artisanal honeys: [`supabase/seed.sql`](supabase/seed.sql).
4. **Remove Email Rate Limit / Instant Sign Up**:
   - In Supabase Dashboard → **Authentication** → **Providers** → **Email**.
   - Turn **OFF** **"Confirm email"** (Toggle switch off and click Save).
   - *Why?* Supabase free tier limits built-in confirmation emails to 3-4/hour. Turning off "Confirm email" allows instant signup and login without any email rate limits!
   - If you want confirmation emails in production, configure **Custom SMTP** under **Project Settings** → **Authentication** → **SMTP Settings** (e.g. via Resend, Brevo, SendGrid).

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚢 Deploy to Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project into [Vercel](https://vercel.com).
3. In Project Settings → **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (if using serverless functions)
4. Deploy! Vercel will automatically build the React Vite app using the configuration in `vercel.json`.

---

## 🐝 Honey Color Palette

- **Honey Gold**: `#F4B400`
- **Dark Honey**: `#B7791F`
- **Light Honey**: `#FFF4CC`
- **Cream**: `#FFFDF5`
- **Dark Brown**: `#3E2723`
- **Natural Green**: `#6B8E23`
- **White**: `#FFFFFF`

---

## 📄 License
MIT License. Crafted with 🍯 for **Fellas Honey**.
