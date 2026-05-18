# DailyNest 🛒

DailyNest is a modern and scalable ecommerce platform built for seamless online shopping experiences. It provides category-based product browsing, secure authentication, payment integration, and role-based dashboards for customers, admins, and super admins.

The platform is designed with a clean UI, secure backend architecture, and a simple shopping experience for daily essentials and ecommerce management.

---

##  Features

###  Authentication System
- Manual Login / Signup
- Mobile Number + Password Authentication
- Google Login (OAuth)
- JWT Authentication
- Forgot Password
- Reset Password
- Protected Routes
- Role-Based Access

###  Ecommerce Features
- Category-based Shopping
- Main Category → Sub Category → Products
- Product Filtering
- Search Products
- Featured Products
- Trending Products
- Best Sellers
- New Arrivals
- Coming Soon Products
- Wishlist
- Cart Management
- Coupon System

###  Payment System
- Secure Payment Gateway Integration
- Razorpay
- Stripe
- UPI
- Credit / Debit Cards
- Cash on Delivery (COD)
- Payment Verification
- Transaction History

###  Customer Dashboard
- Profile Management
- Order History
- Wishlist
- Address Management
- Cart Management
- Order Tracking
- Invoice Download
- Password Update

###  Admin Dashboard
- Product Management
- Category Management
- Subcategory Management
- Order Management
- Inventory Management
- Banner Management
- Coupon Management
- Customer Management
- Analytics Dashboard
- Homepage Management

###  Super Admin Dashboard
- Manage Admin Accounts
- Role & Permission Control
- Website Settings
- Payment Settings
- System Logs
- Analytics & Reports

---

##  Category Structure

```txt
Main Category
      ↓
Sub Category
      ↓
Products
```

Example:

```txt
Electronics
   ├── Mobiles
   ├── Laptops

Fashion
   ├── Men
   ├── Women
```

---

##  Tech Stack

### Frontend
- React.js
- React Router DOM
- SCSS / Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT Authentication
- Google OAuth

### Payment
- Razorpay
- Stripe

---





### Navigate to Project

```bash
cd dailynest
```

---

## Install Dependencies

### Frontend

```bash
cd frontend
npm install
```


---

##  Environment Variables

Create `.env` file inside backend:

```env
PORT=8000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

RAZORPAY_KEY_ID=your_key
RAZORPAY_SECRET=your_secret

STRIPE_SECRET_KEY=your_key
```

---

## ▶ Run Project

### Start Backend

```bash
npm run server
```

### Start Frontend

```bash
npm start
```

---

##  Homepage Sections

- Hero Banner
- Featured Categories
- Trending Products
- Featured Products
- Coming Soon Products
- Best Selling Products
- Product Filters
- Offer Banner
- Testimonials
- Newsletter Subscription

---

##  Security Features

- JWT Authentication
- Password Hashing
- Protected APIs
- Role-Based Access Control
- Input Validation
- Secure Payment Verification
- Middleware Authentication

---

##  Future Improvements

- AI Product Recommendation
- Multi Vendor System
- Live Order Tracking
- Referral System
- Push Notifications
- Subscription Plans

---




## Built With Love

Built to simplify daily shopping and ecommerce management with a clean and scalable architecture.

**DailyNest — Your Everyday Shopping Companion**