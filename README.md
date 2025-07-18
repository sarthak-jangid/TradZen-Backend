# TradZen Backend – Node.js + Express + MongoDB API

This is the backend service for **TradZen**, a full-stack stock trading platform. It provides secure RESTful APIs for user authentication, fund handling (via Razorpay test mode), holdings tracking, and more.

---

## 🌐 Base API URL
(https://tradzen-backend.onrender.com/api)
⚠️ *Note: Cold starts may cause a few seconds of delay on free-tier hosting (Render).*

---

## 🛠 Tech Stack

- **Node.js** – Server runtime
- **Express.js** – Web framework
- **MongoDB Atlas** – Cloud-hosted database
- **Mongoose** – ODM for MongoDB
- **JWT** – Secure authentication
- **bcrypt** – Password hashing
- **cookie-parser** – Handling HTTP-only cookies
- **CORS** – Cross-origin support
- **Razorpay** – Test mode payment API

---


---

## ✨ Features

- User authentication with JWT and HTTP-only cookies
- Password encryption using bcrypt
- Razorpay test mode integration for fund management
- Holdings tracking endpoints
- Modular codebase following MVC architecture
- Cross-origin access for frontend and dashboard apps

---

## 🔧 Getting Started (Local Development)

### 1. Clone the repo

```bash
git clone https://github.com/sarthak-jangid/tradzen-backend.git

cd tradzen-backend

npm install

Create a .env file in the root with the following keys:

MONGO_ATLAS_URL=your_mongodb_atlas_connection_string
TOKEN_KEY=your_jwt_secret
RAZORPAY_API_KEY=your_razorpay_key_id
RAZORPAY_API_SECRET=your_razorpay_secret


# Start the Server
node index.js   or   npx nodemon index.js
  
