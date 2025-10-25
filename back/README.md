# REST API Project – Node.js + MongoDB

A clean and modular **RESTful API** built with Node.js, Express, and MongoDB.  
This project includes **user authentication, role-based authorization, and business card management**, demonstrating best practices in backend development.

---

## 🚀 Features

- **User Management**: Register, login, get user/s profile, update, change business status, delete  
- **Business Cards**: Get all cards / one card / my cards, create, update, like, and delete  
- **Authentication**: JWT-based login with role handling (admin, business, regular user)  
- **Password Security**: Passwords hashed with **bcryptjs**  
- **Validation**:  
  - Request validation with **Joi** (client input)  
  - Schema validation with **Mongoose** (database layer)  
- **Logging**:  
  - Console logging with **Morgan**  
  - File logging for errors (status ≥ 400) – *bonus feature*  
- **Business Number Control**: Admin can change business numbers (ensures uniqueness) – *bonus feature*  
- **Environment Config**: Managed with the **config** package  
- **Supports two environments**:  
  - **Development** → connects to MongoDB local compass  
  - **Production** → connects to MongoDB Atlas  

### 📌 Note:
For security reasons, the real **production config file** (with Atlas username & password) was **not pushed to Git**.  
Instead, a **dummy config file** is included so the structure remains visible without exposing credentials.  

---

## 🛠 Tech Stack

- **Node.js + Express**  
- **MongoDB + Mongoose**  
- **bcryptjs**, **jsonwebtoken**, **Joi**  
- **morgan**, **cors**, **config**  
- **chalk**, **lodash**  

---

## 🧩 Project Structure

```
business_cards_app/
│
├── auth/                          # Authentication and authorization logic
│
├── cards/                         # Business cards module
│   ├── helpers/                   # Utility functions for cards
│   ├── models/                    # Mongoose schemas and models for cards
│   ├── routes/                    # Express routes for cards endpoints
│   ├── services/                  # Implements main business logic and connects routes with models
│   └── validations/               # Joi validation logic
│
├── users/                         # User management module (same structure as cards)
│   ├── helpers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── validations/
│
├── config/                        # Environment configuration using CONFIG library
│
├── DB/                            # Database connection and initialization
│
├── initialData/                   # Default data seeding (e.g., admin user, demo cards)
│
├── logger/                        # Logger setup (Morgan and error file logger)
│
├── logs/                          # Auto-generated log files
│
├── middlewares/                   # Express middlewares (CORS, error handling, auth checks)
│
├── mongoose_validation_generals/  # Shared Mongoose validation logic
│
├── public/                        # Static assets (if any)
│
├── router/                        # Main routing configuration
│
├── utils/                         # General utility functions
│
├── .gitignore                     # Ignored files and folders
├── package.json                   # Project dependencies and scripts
├── server.js                      # Application entry point
└── README.md                      # Project documentation
```

---

## ▶️ Getting Started

Clone the repository, install dependencies, and run the project in the desired environment:

```bash
git clone <your-repo-link>
cd <repository-folder>
npm install
```

### Run in Development (local MongoDB compass, with Nodemon auto-restart)
```bash
npm run dev
```

### Run in Production (MongoDB Atlas, without Nodemon)
```bash
npm run start
```

---

✨ This project is part of my **Full-Stack Development training** and serves as a portfolio piece demonstrating backend development skills.
