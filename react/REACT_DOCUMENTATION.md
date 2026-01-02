# Canteen Admin & User Frontend Documentation

This is the comprehensive documentation for the **React Frontend** of the Canteen Connect system. It handles the User Interface for Students (Food ordering) and the Kitchen Staff (Order management).

## 🛠️ Technology Stack

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | v19.0.0 | UI Library |
| **Vite** | v7.3.0 | Build Tool & Dev Server (Fast HMR) |
| **React Router** | v7.0.1 | Client-side Routing & Navigation |
| **CSS** | Vanilla | Custom styling (no external UI libraries) |

---

## 📂 Detailed Folder Structure

```
react/
├── src/
│   ├── config.js         # 🔧 GLOBAL CONFIG: Sets the Backend API URL.
│   ├── main.jsx          # Entry point. Mounts the React App.
│   │
│   ├── css/              # 🎨 STYLES:
│   │   ├── App.css         # Global resets
│   │   ├── menu.css        # Styles for Food Cards & Search
│   │   ├── cart.css        # Styles for Cart items & Bill summary
│   │   ├── orderc.css      # Styles for Order History & Live Tracking
│   │   ├── login.css       # Styles for Login/Signup forms
│   │   ├── topup.css       # Styles for Wallet Recharge
│   │   └── ...
│   │
│   ├── jsxfolder/        # 🧩 COMPONENTS:
│   │   ├── App.jsx         # 🚦 ROUTER: Defines all URL paths.
│   │   ├── ProtectedRoute.jsx # 🛡️ GUARD: Redirects unauthenticated users.
│   │   │
│   │   ├── -- AUTH --
│   │   ├── Login.jsx       # Student Login. Saves JWT to localStorage.
│   │   ├── ShopLogin.jsx   # Kitchen Staff Login.
│   │   ├── ForgetPassword.jsx  # Request OTP.
│   │   ├── ResetPassword.jsx   # Reset Password.
│   │   ├── AuthPopup.jsx   # Custom Modal for Alerts (Success/Error).
│   │   │
│   │   ├── -- STUDENT --
│   │   ├── Landing.jsx     # Welcome Page.
│   │   ├── Menu.jsx        # Food Catalog. Search/Filter logic.
│   │   ├── Cart.jsx        # Cart Management & Checkout.
│   │   ├── orderc.jsx      # "My Orders" - Live Status Tracking.
│   │   │
│   │   ├── -- SHOPKEEPER --
│   │   └── ShopDashboard.jsx # Kitchen Order Management Console.
│   │
│   └── images/           # Static assets (Logos, Icons, Banners)
```

---

## 🧠 Key Logic & Flows

### 1. Authentication & Session
*   **Storage**: The app uses `localStorage` to persist sessions.
    *   `jwtToke`: The Bearer token sent with requests.
    *   `gmail` / `user`: User identifier.
    *   `key`: Wallet security key.
*   **Protection**: `ProtectedRoute.jsx` checks for `localStorage.getItem('jwtToke')`. If missing, it kicks the user to `/login`.

### 2. The Shopping Cart (`Cart.jsx`)
*   **Fetching**: On load, it calls `/auth/returncart` to get user items.
*   **Grouping**: Items are *visually* grouped by Kitchen Name (e.g., "Central Mess"), but stored as a flat list in the database.
*   **Calculations**:
    *   `itemTotal` = Sum of (price * quantity)
    *   `tax` = 5% of itemTotal
    *   `fee` = Flat ₹10 (ASAP) or ₹5 (Scheduled)
*   **Logic**:
    1. Check Wallet Balance (`/auth/getwallet`).
    2. If sufficient -> Deduct Money (`/auth/updatewallet`).
    3. If deducted -> Place Order (`/auth/placeorder`).

### 3. Order Tracking (`orderc.jsx`)
*   **Multi-Kitchen Tracking**: The page fetches orders from `/auth/my-orders`. This endpoint aggregates data from **4 different backend collections** (Central Mess, Snack Corner, etc.).
*   **Status Badges**:
    *   `Pending` (Yellow)
    *   `Preparing` (Blue)
    *   `Ready` (Green - Go pick it up!)
    *   `Served` (Grey - History)

### 4. Shopkeeper Dashboard (`ShopDashboard.jsx`)
*   **Kitchen Awareness**: The dashboard knows which kitchen to show based on `localStorage.getItem('kitchenName')` set during login.
*   **Live Updates**: It uses **Polling** (setInterval) to fetch new orders every 10 seconds.
*   **Tabs**: Orders are filtered by status tabs (Pending, Accepted, etc.).
*   **Actions**:
    *   **Accept**: Moves order to "Accepted".
    *   **Start Preparing**: Moves to "Preparing".
    *   **Ready**: Notifies user (via status change).
    *   **Served**: Closes the order loop.

---

## 🔧 Configuration (API Connection)

The app is built to be environment-agnostic. You only need to change **ONE** file to switch servers.

**File**: `src/config.js`

```javascript
// For Local Development
export const API_BASE_URL = "http://localhost:8080";

// For Production (Railway/AWS/Etc)
// export const API_BASE_URL = "https://your-live-url.app";
```

**Note**: All components import `API_BASE_URL` from here. Never hardcode URLs in components.

---

## 💻 Running Locally

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Dev Server**:
    ```bash
    npm run dev
    ```
    *Runs on Port 5173 by default.*

3.  **Build for Production**:
    ```bash
    npm run build
    ```
    *Creates a `dist` folder optimized for hosting.*

---

## 🐛 Troubleshooting

*   **"CORS Error"**: Ensure your Backend is running and has `cors()` enabled in `server.js`.
*   **"Login Failed"**: Check if `API_BASE_URL` matches your backend port.
*   **"No Orders Showing"**: Verify that your Backend has the new **Multi-Collection** logic (OrderCentralMess, etc.) implemented.
