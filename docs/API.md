# API Documentation

The ThreadWorks backend provides a RESTful API for managing users, products, orders, and Tableau integration.

## Base URL
`http://localhost:8080/api`

## Authentication
Most endpoints require a JWT token in the `Authorization` header:
`Authorization: Bearer <your_jwt_token>`

---

## 🔐 Authentication Endpoints (`/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/register` | Register a new user | No |
| POST | `/login` | Authenticate and receive a JWT | No |

---

## 📊 Tableau Endpoints (`/tableau`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/token` | Get a JWT for Tableau embedding | Yes (ADMIN) |

---

## 👕 Product Endpoints (`/products`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/` | List all products | No |
| GET | `/{id}` | Get product details | No |
| POST | `/` | Create a new product | Yes (ADMIN) |

---

## 🎨 Custom Design Endpoints (`/custom-designs`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/upload` | Upload a new custom design file | Yes (ANY) |
| GET | `/user/{userId}`| List designs for a specific user | Yes (OWNER) |
| GET | `/all` | List all designs in the system | Yes (ADMIN) |
| PUT | `/{id}/status` | Update the status of a design | Yes (ADMIN) |

---

## 📦 Order Endpoints (`/orders`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/` | Place a new order | Yes (ANY) |
| GET | `/user/{userId}`| Get order history for a user | Yes (OWNER) |

---

## 📂 File Serving (`/files`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/designs/{filename}`| Serve an uploaded design file | No |
