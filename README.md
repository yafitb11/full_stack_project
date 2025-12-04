# 🛒 Full-Stack Online Store

### Node.js + MongoDB + React (Vite + TypeScript)

This is a full-stack project simulating a real-world e-commerce system:
It includes user management, products, categories, a shopping cart, orders, a "Contact Us" messaging system, product likes, role-based permissions, and a fully responsive design.

The system is built on a RESTful API using Node.js and MongoDB, with a modern frontend implemented in React + Vite + TypeScript + Redux + Tailwind.
---

# 🚀 Features

## 👤 Users Features (Registered Users)

* View all products
* Like / Unlike products
* Add/remove items to/from cart
* View order summary and place orders 
* View previous orders
* View & edit personal profile
* Send contact messages
* Full authentication flow (Register, Login, JWT)

## 👥 Public Visitors (Unregistered Users)

* View product catalog  and product details
* Send contact messages

## 🛠️ Admin Features

Admins have an enhanced dashboard with full control:

* Full CRUD control over categories
* Full CRUD control over products
* Full CRUD control over users
* View all contact messages
* Monitor products: Quantity in stock, Number of likes, Number of orders

### Admin Restrictions

Admins cannot: Add products to cart, place orders and like products

---

# 🔐 Authentication & Authorization

* Login with **JWT**
* Password hashing with **bcryptjs**
* Token stored in `localStorage`
* Role-based access:

  * Admin
  * Registered user
  * Guest


# **Validation**:

  * Joi for request validation
  * Mongoose for schema validation

# **Global State Management**:

* Managed with Redux Toolkit and React Redux

* **Logging**:

  * Morgan console logs
  * File logs for errors (not uploaded to githab)

  **CORS**:

 * Enabled for all origins by default, configurable per domain

* **Environment**:

  * development → MongoDB Compass
  * production → MongoDB Atlas
* Real production config is hidden for security; dummy config included


# 🌙 Additional Features

* Dark/Light mode
* Responsive design
* Toggle button to switch between large and compact product cards
* Pagination & search filters
* Persistent cart
* Reusable components & custom hooks

---

# 🧰 Tech Stack

## Frontend

* React (Vite + TypeScript)
* Redux Toolkit + React Redux
* React Router DOM
* Axios
* Tailwind CSS
* React Icons
* Custom Hooks
* Regex validation
* JWT auth

## Backend

* Node.js + Express
* MongoDB + Mongoose
* Joi
* bcryptjs
* jsonwebtoken
* morgan
* config
* chalk
* cors
* lodash

---

# ▶️ Getting Started

Clone the repository:

```
git clone <your-repo-link>
```

---

## 🖥️ Backend Setup

```
cd backend
npm install
npm run dev (for development)
npm run start (for production)
```

## 💻 Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

# 📄 License

This project is for educational and portfolio purposes.

---
# **Important Notes**:

* The search filter filters products on the Home-page, Favorites page, and ManageUsers page. I didn't add a search filter on the CategoryProducts page.

* To avoid exposing my personal details, I created a dummy file for the production configuration. I will add my username and password when submitting the project.