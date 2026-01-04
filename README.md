# Canteen Connect - Full Stack RWD Project

## 📖 Overview
**Canteen Connect** is a complete full-stack web application designed to digitize campus dining. It features a robust **Node.js/Express backend** managing users, orders, and wallets, paired with a responsive **React frontend** for a seamless student experience....

---

## 🏗️ Project Architecture

The project is divided into two main components within the root directory:

```
c:/RWD
├── backend/              # Node.js + Express API Server
├── react/                # React.js + Vite Client Application
└── assets/               # Shared static assets (icons, etc.)
```

### 1. 🖥️ Frontend (`/react`)
Built with **React (Vite)**, focusing on responsive design and smooth user interaction.
*   **Core Stack**: React 18, React Router DOM, Vanilla CSS (Scoped).
*   **Key Directories**:
    *   `src/jsxfolder`: React Components (`Canteen.jsx`, `Cart.jsx`, `ShopDashboard.jsx`, etc.)
    *   `src/css`: Scoped CSS modules.
*   **Features**: Dynamic routing, Cart management, Live Order Tracking, Shopkeeper Dashboard.

### 2. 🔌 Backend (`/backend`)
A RESTful API built with **Node.js** and **Express**, connecting to a MongoDB database.
*   **Core Stack**: Node.js, Express.js, Mongoose, JWT.
*   **Key Directories**:
    *   `controller/`: Business logic (Auth, Cart, Shop, Orders).
    *   `models/`: Mongoose schemas (User, Order, Item, Shopkeeper).
    *   `routes/`: API route definitions (`auth.js`).
*   **Documentation**: [📄 Read Backend API Documentation](backend/API_DOCUMENTATION.md)

---

## 🚀 Key Workflows

### 🔐 Authentication & Security
*   **JWT Auth**: Stateless authentication using JSON Web Tokens.
*   **Key System**: Unique 8-char `key` assigned to users for wallet transactions.
*   **Password Reset**: OTP-based verification flow via email.

### 🛒 Ordering Process
1.  **Selection**: Users browse kitchens (`/menu`) and add items to Cart.
2.  **Payment**: Wallet interactions verify balance and deduct amounts.
3.  **Order Placement**: Backend moves items from `Cart` to specific Kitchen Order collections.

### 👨‍🍳 Shopkeeper Portal (New!)
A dedicated dashboard for kitchen staff.
*   **Login**: `/shop/login` (Separate credentials for each kitchen).
*   **Dashboard**: Live polling of orders, organized by status (Pending, Accepted, Preparing, Ready).

### 📦 Live Order Tracking (New!)
*   **User View**: Students can track their order status in real-time under "My Orders".
*   **Robust Backend**: Orders are stored in 4 separate collections (`OrderCentralMess`, `OrderSnackCorner`, etc.) for stability.

---

## 📚 Documentation & Guides

| Document | Description |
| :--- | :--- |
| [**Backend API Docs**](backend/API_DOCUMENTATION.md) | Complete API reference for Auth, Cart, Wallet, and Shopkeeper. |
| [**React Documentation**](react/REACT_DOCUMENTATION.md) | Deep dive into Frontend structure, Components, and Logic. |
| [**Interactive QA Guide**](https://lets-c.vercel.app/html/test.html) | **New!** A web-based "Quick Start" guide for testers without GitHub access. |

---

## 🛠️ Setup & Installation

### Backend Setup
1.  Navigate to backend: `cd backend`
2.  Install dependencies: `npm install`
3.  Start server: `npm start` (Runs on Port 8080)

### Frontend Setup
1.  Navigate to frontend: `cd react`
2.  Install dependencies: `npm install`
3.  Start dev server: `npm run dev` (Runs on Port 5173)

---

## 📂 Detailed File Structure

```
c:/RWD
├── backend/
│   ├── controller/       # Logic: auth, cart, shopController
│   ├── models/           # DB Schemas: User, Order(s), Item, Shopkeeper
│   ├── routes/           # Endpoints: auth.js
│   ├── server.js         # Entry Point
│   └── API_DOCUMENTATION.md # Full API Reference
│
├── react/
│   ├── src/
│   │   ├── jsxfolder/    # UI Components (Canteen, Cart, ShopDashboard)
│   │   ├── css/          # Stylesheets
│   │   └── main.jsx      # DOM Rendering
│   ├── public/           # Static assets (qa_guide.html)
│   └── REACT_DOCUMENTATION.md # Frontend Docs
│
├── TESTING_GUIDE.md      # Manual Testing Instructions
└── assets/               # Project-wide static files
```
