﻿# Coupon Website

The Sales API is a backend service designed to manage and distribute discount coupons. It provides endpoints for administrators to manage coupons and for users to claim available coupons. IP Based user tracking.

## Purpose

The purpose of this API is to facilitate the management of discount coupons, allowing administrators to create, modify, and delete coupons, and enabling users to claim available coupons.

## Setup Instructions

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/AgrimGupta195/GetCouponWebsite.git

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:

    ```properties
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    PORT=5000
    NODE_ENV="production or development"
    CLIENT_URL="CLIENT_URL"
    ```

4. Start the server:

    ```sh
    node server.js
    ```

## Usage

### Admin Endpoints

- **Login Admin**

    ```http
    POST /api/admin/login
    ```

    Request Body:

    ```json
    {
        "email": "admin@example.com",
        "password": "password123"
    }
    ```

- **Get Coupons**

    ```http
    GET /api/admin/coupons
    ```

- **Add Coupon**

    ```http
    POST /api/admin/add
    ```

    Request Body:

    ```json
    {
        "code": "DISCOUNT10",
        "discount": 10
    }
    ```

- **Modify Coupon**

    ```http
    PUT /api/admin/edit/:id
    ```

    Request Body:

    ```json
    {
        "code": "DISCOUNT20",
        "discount": 20
    }
    ```

- **Delete Coupon**

    ```http
    DELETE /api/admin/delete/:id
    ```

- **Toggle Coupon Availability**

    ```http
    PATCH /api/admin/isAvailable/:id
    ```

- **Logout Admin**

    ```http
    POST /api/admin/logout
    ```

### User Endpoints

- **Get Available Coupons**

    ```http
    GET /api/coupons/coupons
    ```

- **Claim Coupon**

    ```http
    POST /api/coupons/claim/:id
    ```
