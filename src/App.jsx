import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Import Pages
import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import ProductDetail from "./Pages/ProductDetail";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import OrderSuccess from "./Pages/OrderSuccess";
import OrderDetails from "./Pages/OrderDetails";
import Login from "./Pages/Login";
import AdminLogin from "./Pages/AdminLogin";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import DashboardIndex from "./Pages/Dashboard";
import DNsuperadminPage from "./Pages/Dashboard/DNsuperadminPage";
import DNAdminPage from "./Pages/Dashboard/DNAdminPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Core Web Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            
            {/* Cart & Checkout Processes */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/order-details/:id" element={<OrderDetails />} />
            
            {/* Auth & Security Screens */}
            <Route path="/login" element={<Login />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Static Information */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Unified User Dashboards */}
            <Route path="/dashboard" element={<DashboardIndex />} />
            <Route path="/DNsuperadmin" element={<DNsuperadminPage />} />
            <Route path="/DNAdmin" element={<DNAdminPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;