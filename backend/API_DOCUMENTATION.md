# Backend API Documentation

Base URL: `http://localhost:8080` (or our railway URL which will be used on gobal testing)

## 📑 Quick Navigation

| Category | Description |
| :--- | :--- |
| [**Authentication & User**](#authentication--user) | Signup, Login, Password Reset, Profile |
| [**Cart Operations**](#cart-operations) | Add, Remove, View Cart Items |
| [**Order Management**](#order-management) | Place Order, View History |
| [**Products & Search**](#products--search) | Filter and Search |
| [**Wallet**](#wallet) | Balance and Transactions |
| [**Topup Operations**](#topup-operations) | Topup Wallet, View History |
| [**Shopkeeper Portal**](#shopkeeper-portal) | Login, Manage Orders, Update Status |
| [**User Orders**](#user-orders-live-tracking) | Live Tracking, Multi-Kitchen History |

---

## Backend Workflows

### 1. Authentication Flow
*   **Stateless JWT**: The backend uses JSON Web Tokens (JWT) for authentication.
*   **The "Key" System**: Each user is assigned a unique 8-character `key` upon signup. This key is used for wallet operations and internal identification.
*   **Session**: The frontend should store the `jwtToken`, `email`, and `key` received during login.

### 2. Password Reset Flow (OTP)
1.  **Request**: User requests an OTP via `/auth/forget`. (Rate limited: 1 OTP per 5 mins).
2.  **Verify**: User enters OTP. Backend verifies it via `/auth/verify` and temporarily authorizes the reset.
3.  **Reset**: User provides new password via `/auth/reset`. Backend updates the hash and deletes the OTP.

### 3. Order Lifecycle (Single Active Order)
*   **One-at-a-time**: A user can only have **one active order** at a time.
*   **Overwriting**: Placing a new order via `/auth/placeorder` will **automatically clear** any existing items in the cart and replace any previous active order for that user.
*   **Status**: Orders start as "Placed" and move through "Accepted" -> "Preparing" -> "Ready" -> "Picked".

### 4. Validation Rules
*   **Signup**:
    *   Name: 3 - 100 characters.
    *   Password: 4 - 100 characters.
    *   Email: Must be a valid email format.
*   **Login**:
    *   Email & Password required.

---

## Authentication & User

### 1. Signup
*   **Endpoint:** `/auth/signup`
*   **Method:** `POST`
*   **Description:** Creates a new user account.
*   **Request Body:**
    ```json
    {
      "name": "John Doe",
      "phone": "1234567890",
      "usn": "1XX19CS001",
      "gender": "Male",
      "email": "john@example.com",
      "password": "securepassword"
    }
    ```
*   **Response (Success - 201):**
    ```json
    {
      "message": "Singup successful",
      "success": true
    }
    ```
*   **Response (Error - 409):** `Email already exists` or `USN already exists`.
*   **Response (Server Error - 500):** Signup failed.

### 2. Login
*   **Endpoint:** `/auth/login`
*   **Method:** `POST`
*   **Description:** Authenticates a user.
*   **Request Body:**
    ```json
    {
      "email": "john@example.com",
      "password": "securepassword"
    }
    ```
*   **Response (Success - 200):**
    ```json
    {
      "message": "Login successful",
      "success": true,
      "jwtToke": "...", 
      "email": "john@example.com",
      "key": "A1B2C3D4",
      "user": "John Doe"
    }
    ```
*   **Response (Error - 409):** `User does not exist` or `Invalid password`.

### 3. Forgot Password
*   **Endpoint:** `/auth/forget`
*   **Method:** `POST`
*   **Description:** Sends an OTP to the user's email for password reset.
*   **Request Body:**
    ```json
    { "email": "john@example.com" }
    ```
*   **Response (Success - 200):**
    ```json
    { "success": true, "message": "OTP sent to your email" }
    ```
*   **Response (Error - 400/404/429):** Validation errors, User not found, Rate limit exceeded.

### 4. Verify OTP
*   **Endpoint:** `/auth/verify`
*   **Method:** `POST`
*   **Description:** Verifies the OTP sent to the user.
*   **Request Body:**
    ```json
    {
      "email": "john@example.com",
      "otp": 123456
    }
    ```
*   **Response (Success - 200):**
    ```json
    { "success": true, "message": "OTP verified successfully" }
    ```

### 5. Reset Password
*   **Endpoint:** `/auth/reset`
*   **Method:** `POST`
*   **Description:** Resets the user's password.
*   **Request Body:**
    ```json
    {
      "email": "john@example.com",
      "newPassword": "newpassword123",
      "confirmPassword": "newpassword123"
    }
    ```
*   **Response (Success - 200):**
    ```json
    { "success": true, "message": "Password reset successfully" }
    ```

### 6. Get Profile
*   **Endpoint:** `/auth/profile`
*   **Method:** `GET`
*   **Description:** Fetch user profile details and wallet balance.
*   **Query Params:**
    *   `key`: The user's unique key (Required).
*   **Example Request:**
    `GET http://localhost:8080/auth/profile?key=A1B2C3D4`
*   **Response (Success - 200):**
    ```json
    {
      "success": true,
      "body": {
        "name": "John Doe",
        "phone": "1234567890",
        "email": "john@example.com",
        "key": "A1B2C3D4",
        "balance": 500
      }
    }
    ```
*   **Response (Error - 400):** `Key is required` / `User or Wallet not found`.
*   **Response (Server Error - 500):** Server error.

---

## Cart Operations

### 7. Get Cart (Method A)
*   **Endpoint:** `/auth/cart`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    { "username": "john@example.com" }
    ```
*   **Response (Success - 200):**
    ```json
    {
      "message": "Cart fetched",
      "items": [ ... ],
      "success": true
    }
    ```

### 8. Get Cart (Method B)
*   **Endpoint:** `/auth/returncart`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    { "user": "john@example.com" }
    ```
*   **Response (Success - 200):**
    ```json
    {
      "items": [ ... ],
      "success": true,
      "message": "Cart found"
    }
    ```

### 9. Add to Cart
*   **Endpoint:** `/auth/add2cart`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    {
      "user": "john@example.com",
      "itemname": "Burger",
      "itemprice": 100,
      "itemsrc": "http://image.url"
    }
    ```
*   **Response (Success - 200):**
    ```json
    { "success": true, "message": "Cart updated" }
    ```

### 10. Delete Item
*   **Endpoint:** `/auth/delete-item`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    { "user": "john@example.com", "itemname": "Burger" }
    ```
*   **Response (Success - 200):**
    ```json
    { "success": true, "message": "Item deleted" }
    ```

### 11. Decrease Quantity
*   **Endpoint:** `/auth/remove-quantity`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    { "user": "john@example.com", "itemname": "Burger" }
    ```
*   **Response (Success - 200):**
    ```json
    { "success": true, "message": "Quantity updated" }
    ```

---

## Order Management

### 12. Place Order
*   **Endpoint:** `/auth/placeorder`
*   **Method:** `POST`
*   **Description:** Places a new order, clears the cart.
*   **Request Body:**
    ```json
    {
      "user": "john@example.com",
      "items": [...],
      "totalItems": 3,
      "totalAmount": 450
    }
    ```
*   **Response (Success - 200):**
    ```json
    { "success": true, "message": "Order Placed" }
    ```

### 13. Get Order
*   **Endpoint:** `/auth/getorder`
*   **Method:** `POST`
*   **Description:** Fetches the active order.
*   **Request Body:**
    ```json
    { "user": "john@example.com" }
    ```
*   **Response (Success - 200):**
    ```json
    { "success": true, "data": [{...}] }
    ```

---

## Products & Search

### 14. Filter Products
*   **Endpoint:** `/auth/filter`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    { "category": "All" }
    ```
*   **Response (Success - 200):**
    ```json
    { "success": true, "items": [...] }
    ```

### 15. Search Products
*   **Endpoint:** `/auth/search`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    { "query": "pizza" }
    ```
*   **Response (Success - 200):**
    ```json
    { "success": true, "items": [...] }
    ```

---

## Wallet

### 16. Get Wallet Balance
*   **Endpoint:** `/auth/getwallet`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    { "key": "USER_KEY" }
    ```
*   **Response (Success - 200):**
    ```json
    { "success": true, "balance": 500, "transactions": [] }
    ```

### 17. Update Wallet
*   **Endpoint:** `/auth/updatewallet`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    {
      "key": "USER_KEY",
      "amount": 100,
      "utr": "TRANSACTION_ID"
    }
    ```
*   **Response (Success - 200):**
    ```json
    { "success": true, "balance": 600 }
    ```

---

## Topup Operations

### 18. Create Topup
*   **Endpoint:** `/auth/topup`
*   **Method:** `POST`
*   **Description:** Top up wallet balance using a UTR (Transaction ID).
*   **Request Body:**
    ```json
    {
      "key": "USER_KEY",
      "amt": 500,
      "utr": "UTR123456789"
    }
    ```
*   **Response (Success - 201):**
    ```json
    {
      "success": true,
      "message": "Topup successful"
    }
    ```
*   **Response (Error - 400/401/409):** Missing fields, Invalid key, UTR already used.

### 19. Get Topup History
*   **Endpoint:** `/auth/topup-history`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    {} 
    ```
*   **Response (Success - 200):**
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "...",
          "userkey": "...",
          "amt": 500,
          "utr": "UTR123456789",
          "date": "..."
        }
      ]
    }
    ```

### 20. Accept Topup
*   **Endpoint:** `/auth/accept-topup`
*   **Method:** `POST`
*   **Description:** Accepts a topup request, adds balance to user wallet, and logs it in history.
*   **Request Body:**
    ```json
    {
      "key": "USER_KEY",
      "amonut": 500,
      "utr": "UTR123456789",
      "type": "accepted"
    }
    ```
*   **Response (Success - 200):**
    ```json
    {
      "success": true,
      "message": "Updated"
    }
    ```
*   **Response (Error - 400/404):** Missing Details / Not Found.

### 21. Reject Topup
*   **Endpoint:** `/auth/reject-topup`
*   **Method:** `POST`
*   **Description:** Rejects a topup request and logs it in history.
*   **Request Body:**
    ```json
    {
      "key": "USER_KEY",
      "amount": 500,
      "utr": "UTR123456789",
      "type": "rejected"
    }
    ```
*   **Response (Success - 200):**
    ```json
    {
      "success": true,
      "message": "Updated"
    }
    ```
*   **Response (Error - 400):** Missing Details.

---

### 22. Get Recent Topup History
*   **Endpoint:** `/auth/recent-topup-history`
*   **Method:** `POST`
*   **Description:** Fetches the 10 most recent accepted or rejected topups.
*   **Request Body:**
    ```json
    {}
    ```
*   **Response (Success - 200):**
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "...",
          "userkey": "...",
          "amt": 500,
          "utr": "UTR...",
          "type": "accepted",
          "date": "..."
        }
      ]
    }
    ```

---

## Shopkeeper Portal

### 23. Shopkeeper Login
*   **Endpoint:** `/auth/shop/login`
*   **Method:** `POST`
*   **Description:** Authenticates a shopkeeper/kitchen staff.
*   **Request Body:**
    ```json
    {
      "email": "central@college.edu",
      "password": "password123"
    }
    ```
*   **Response (Success - 200):**
    ```json
    {
      "success": true,
      "message": "Login successful",
      "kitchenName": "Central Mess",
      "name": "Central Manager"
    }
    ```
*   **Response (Error - 400):** Invalid credentials.

### 24. Get Shop Orders
*   **Endpoint:** `/auth/shop/orders`
*   **Method:** `POST`
*   **Description:** Fetches all orders for a specific kitchen.
*   **Request Body:**
    ```json
    {
      "kitchenName": "Central Mess"
    }
    ```
*   **Response (Success - 200):**
    ```json
    {
      "success": true,
      "orders": [
        {
          "_id": "67756f...",
          "user": "student@college.edu",
          "status": "Pending",
          "items": [...],
          "totalAmount": 150,
          "createdAt": "2024-01-01T12:00:00Z"
        }
      ]
    }
    ```

### 25. Update Order Status
*   **Endpoint:** `/auth/shop/update-status`
*   **Method:** `POST`
*   **Description:** Updates the status of an order (e.g., Pending -> Accepted -> Ready).
*   **Request Body:**
    ```json
    {
      "orderId": "67756f...",
      "status": "Accepted" 
    }
    ```
*   **Allowed Statuses:** `Pending`, `Accepted`, `Preparing`, `Ready`, `Served`, `Rejected`
*   **Response (Success - 200):**
    ```json
    {
      "success": true,
      "message": "Status updated"
    }
    ```

---

## User Orders (Live Tracking)

### 26. Get My Orders
*   **Endpoint:** `/auth/my-orders`
*   **Method:** `POST`
*   **Description:** Fetches all active and past orders for a user from *all* kitchens, sorted by date.
*   **Request Body:**
    ```json
    {
      "user": "john@example.com"
    }
    ```
*   **Response (Success - 200):**
    ```json
    {
      "success": true,
      "orders": [
        {
          "_id": "67756...",
          "kitchen": "Central Mess",
          "status": "Preparing",
          "items": [...],
          "totalAmount": 120,
          "createdAt": "..."
        },
        {
          "_id": "67759...",
          "kitchen": "Snack Corner",
          "status": "Ready",
          "items": [...],
          "totalAmount": 50
        }
      ]
    }
    ```
