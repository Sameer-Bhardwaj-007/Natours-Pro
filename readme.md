# 🌍 Natours

A full-stack tour booking web application where users can discover adventure tours, view tour details on interactive maps, securely book tours online, and manage their bookings.

🚀 **Live Demo:** https://your-render-url.onrender.com

---

## 📖 About

Natours is a production-ready tour booking platform built using **Node.js**, **Express.js**, **MongoDB**, and **Pug**. It provides secure authentication, online payments through Razorpay, interactive Mapbox maps, email notifications via SendGrid, and a responsive user interface.

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration and login
- JWT Authentication
- HTTP-only secure cookies
- Password hashing using bcrypt
- Password reset via email
- Role-based access control (Admin, Lead Guide, Guide, User)

### 🏔️ Tour Booking

- Browse available tours
- View detailed tour information
- Interactive Mapbox locations
- Tour reviews and ratings
- Secure online booking
- Prevent duplicate bookings
- "Already Booked" indicator

### 💳 Payments

- Razorpay payment gateway integration
- Secure payment verification
- Booking confirmation after successful payment

### 📧 Email Notifications

- Welcome emails
- Password reset emails
- Booking confirmation emails
- SendGrid integration

### 🗺️ Maps

- Interactive Mapbox GL JS maps
- Tour markers
- Custom styled maps

### 🛡️ Security

- Helmet
- Rate Limiting
- MongoDB Sanitization
- XSS Protection
- HTTP Parameter Pollution (HPP)
- Secure JWT Authentication

---

# 🛠️ Tech Stack

### Frontend

- Pug
- HTML5
- CSS3
- JavaScript (ES6+)
- Parcel

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Authentication

- JWT
- bcryptjs

### Payments

- Razorpay

### Email

- Nodemailer
- SendGrid

### Maps

- Mapbox GL JS

### Deployment

- Render

---

# 🚀 Live Demo

**Application**

https://your-render-url.onrender.com

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/Sameer-Bhardwaj-007/Natours.git
```

Move into the project

```bash
cd Natours
```

Install dependencies

```bash
npm install
```

Create a `config.env` file and configure the required environment variables.

Run the application

```bash
npm run dev
```

---

# 📂 Folder Structure

```
Natours
│
├── controllers
├── models
├── routes
├── views
├── public
│   ├── css
│   ├── img
│   └── js
├── utils
├── dev-data
├── app.js
├── server.js
├── package.json
└── README.md
```

---

# 🔑 Environment Variables

```
NODE_ENV=
PORT=

DATABASE=
DATABASE_PASSWORD=

JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES_IN=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USERNAME=
EMAIL_PASSWORD=

SENDGRID_USERNAME=
SENDGRID_PASSWORD=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

MAPBOX_PUBLIC_TOKEN=
```

---

# 📦 Available Scripts

```bash
npm run dev
```

Runs the application in development mode.

```bash
npm run build
```

Builds the frontend assets.

```bash
npm start
```

Runs the production server.

---

# 🔒 Security Features

- JWT Authentication
- Password Encryption
- Secure Cookies
- MongoDB Injection Protection
- XSS Protection
- HTTP Parameter Pollution Protection
- Rate Limiting
- Helmet Security Headers

---

# 🌟 Future Improvements

- Admin Analytics Dashboard
- Search & Filters
- Wishlist
- PDF Booking Invoice
- Multi-language Support
- Progressive Web App (PWA)

---

# 👨‍💻 Author

**Sameer Bhardwaj**

GitHub: https://github.com/Sameer-Bhardwaj-007

---

# 🙏 Acknowledgements

This project was inspired by **Jonas Schmedtmann's Node.js Bootcamp** and has been extended with additional features including:

- Razorpay Payment Integration
- SendGrid Email Service
- Enhanced Booking Workflow
- Improved Security
- Render Deployment
