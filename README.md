# Horizon Cart 🌌
> A Next-Generation, Premium Full-Stack E-Commerce Workspace Ecosystem.

Horizon Cart is a state-of-the-art e-commerce web application featuring high-end glassmorphic UI aesthetics, Redux-driven state architectures, robust JWT user authentication, comprehensive admin inventory control center, and dynamic order settlement logisticians.

![Horizon Cart Banner](https://images.unsplash.com/photo-1618384887929-16ec33faf9c1?w=1000&auto=format&fit=crop&q=80)

---

## Key Feature Spotlights

### 🔒 User Authentication & Security
- **Secure Encrypted Sessions**: User signups and logins with encrypted password hashing (`bcryptjs`).
- **Authorization Middlewares**: Endpoints protected with secure JSON Web Token (`JWT`) bearer headers.
- **Route Guards**: Client routes protected by custom React Router route guards separating admins from standard customers.

### 🛒 Inventory Catalog & Persistent Carts
- **Live Catalog Queries**: Advanced searching, sorting (price high-to-low, low-to-high, highest rated), and category filters.
- **Persistent Shopping Carts**: Reactive Redux Toolkit slice synced with LocalStorage, preserving carts across browser restarts.
- **Stock Milestones**: Automatic calculations of item subtotals, tax rates (15%), and dynamic shipping tariffs (free over $100).
- **Reviews & Ratings**: Logged-in customers can leave numeric and text feedback. Ratings aggregate dynamically.

### 💳 Logistics & Payment Gateway
- **Simulated Payment Gateway**: Visual Stripe, PayPal, and Razorpay interactive checkout authorization.
- **Interactive Tracing**: Order details show live logistical milestones (Awaiting Carrier Dispatch -> Carrier Picked -> Delivered).
- **Billing Ledger**: Detailed, printable cost breakdowns and timestamps.

### 🛡️ Admin Dashboard (Control Center)
- **Live Statistics Overview**: Real-time sales calculations, transaction volume tracking, product inventories, and active customer registers.
- **Catalog Curation**: Admin control tables to create new hardware profiles, edit product descriptions, adjust pricing, and delete items.
- **Fulfillment Logistics**: Administrative shipping markers to update order statuses dynamically.

---

## Core Technology Stack

- **Frontend Client**: React.js, Vite, Redux Toolkit, Tailwind CSS, Lucide Icons, Google Font Outfit.
- **Backend API**: Node.js, Express.js, JWT, CORS, dotenv, bcryptjs.
- **Database Layer**: MongoDB + Mongoose (standard) with **Graceful JSON File Database Fallback** for instant running out-of-the-box!

---

## Getting Started

### 📋 Prerequisites
- **Node.js** (v16.0.0 or higher recommended)
- **npm** (v7.0.0 or higher)
- *Optional*: **MongoDB** running locally or a MongoDB Atlas URI string. If no MongoDB is detected, the application automatically boots into a local JSON database mode, allowing full functionality immediately!

---

### 🚀 Quick Start Guide

#### 1. Clone the Project
```bash
git clone https://github.com/your-username/horizon-cart.git
cd horizon-cart
```

#### 2. Configure Environments
Create a `.env` file in the `backend/` directory (you can copy `.env.example` as a template):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/horizoncart
JWT_SECRET=supersecretjwtkey12345
NODE_ENV=development
```

#### 3. Install & Start Backend API Server
```bash
cd backend
npm install
npm run server
```
*The server will start on `http://localhost:5000` with active console flags.*

#### 4. Install & Start Frontend Client
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The client will start on `http://localhost:3000` with reverse-proxies mapping API endpoints directly.*

---

## Default Profiles for Testing & Evaluation

Use these seed credentials to log in and evaluate user paths:

### 🛡️ Systems Admin Account
- **Email**: `admin@horizon.com`
- **Password**: `admin123`
- *Access: Full Control Center Panel, Products Editing, Orders Shipping*

### 👤 Customer Account
- **Email**: `john@example.com`
- **Password**: `user123`
- *Access: Purchases, Carts Checkout, Writing Reviews*

---

## API Documentation Cheat Sheet

| Endpoint | Method | Security | Description |
|---|---|---|---|
| `/api/auth/register` | `POST` | Public | Registers customer and returns active JWT |
| `/api/auth/login` | `POST` | Public | Verifies credentials and returns active JWT |
| `/api/auth/profile` | `PUT` | Customer | Updates name, email, or passwords |
| `/api/auth` | `GET` | Admin | Retrieves lists of registered users |
| `/api/products` | `GET` | Public | Returns searched, sorted, and filtered products |
| `/api/products/:id` | `GET` | Public | Returns detailed description of single product |
| `/api/products/:id/reviews` | `POST` | Customer | Adds rating review and aggregates score |
| `/api/products/:id` | `PUT` | Admin | Updates pricing, stock, descriptions |
| `/api/orders` | `POST` | Customer | Plucks cart items, reserves stock, creates invoice |
| `/api/orders/:id/pay` | `PUT` | Customer | Authorizes simulated Stripe or PayPal settlements |
| `/api/orders/:id/deliver` | `PUT` | Admin | Flags cargo dispatch and packages delivery |

---

*Horizon Cart is developed as a premium design specimen. Created by Antigravity under Gemini 3.5 instructions.*
