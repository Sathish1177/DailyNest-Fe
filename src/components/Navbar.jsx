import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, LogOut, LayoutDashboard, Menu, X, ChevronDown } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import API from "../utils/api";
import Logo from "./Logo";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems, wishlistItems } = useContext(CartContext);
  
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Load categories for menu bar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/categories?activeOnly=true");
        setCategories(data.slice(0, 5)); // Show top 5
      } catch (err) {
        console.error("Error loading categories:", err.message);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const totalCartQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      {/* Top Banner Details */}
      <div className="bg-[#1E293B] text-white text-xs py-2 px-4 md:px-8 flex justify-between items-center">
        <div>Welcome to DailyNest Store! Fresh Daily Essentials.</div>
        <div className="flex gap-4">
          <Link to="/about" className="hover:text-[#F59E0B] transition">About Us</Link>
          <Link to="/contact" className="hover:text-[#F59E0B] transition">Contact Us</Link>
          <span>Support: +91 9025585770</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Logo size="md" />

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative">
          <input
            type="text"
            placeholder="Search products, brands, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-gray-200 rounded-full px-5 py-2.5 pr-12 text-sm text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2E7D32] transition">
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* Actions Bar */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Wishlist */}
          <Link to={user ? "/dashboard?tab=wishlist" : "/login"} className="relative text-[#1E293B] hover:text-[#2E7D32] transition focus:outline-none">
            <Heart className="w-6 h-6" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#F59E0B] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative text-[#1E293B] hover:text-[#2E7D32] transition focus:outline-none">
            <ShoppingCart className="w-6 h-6" />
            {totalCartQty > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#2E7D32] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                {totalCartQty}
              </span>
            )}
          </Link>

          {/* User Profile / Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1.5 text-[#1E293B] hover:text-[#2E7D32] font-semibold text-sm transition focus:outline-none py-1"
              >
                <div className="bg-emerald-100 text-[#2E7D32] rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline truncate max-w-[100px]">{user.name.split(" ")[0]}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2.5 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-50 text-xs font-semibold text-gray-400">
                    ROLE: <span className="text-[#2E7D32] font-bold uppercase">{user.role}</span>
                  </div>

                  {user.role === "store-admin" ? (
                    <Link
                      to="/store-dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#1e293b] hover:bg-emerald-50 hover:text-[#2E7D32] font-semibold transition"
                    >
                      <LayoutDashboard className="w-4.5 h-4.5 text-[#2E7D32]" />
                      Store Dashboard
                    </Link>
                  ) : user.role === "customer" ? (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#1e293b] hover:bg-emerald-50 hover:text-[#2E7D32] transition"
                    >
                      <LayoutDashboard className="w-4.5 h-4.5" />
                      My Dashboard
                    </Link>
                  ) : (
                    <Link
                      to={user.role === "super-admin" ? "/DNsuperadmin" : "/DNAdmin"}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#1e293b] hover:bg-emerald-50 hover:text-[#2E7D32] transition"
                    >
                      <LayoutDashboard className="w-4.5 h-4.5" />
                      Admin Control
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                      navigate("/");
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-50 mt-1"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-[#1e293b] hover:text-[#2E7D32] font-bold text-sm bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-100 px-4 py-2 rounded-full transition focus:outline-none"
            >
              <User className="w-4 h-4" />
              Login
            </Link>
          )}

          {/* Mobile Hamburguer */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-600 hover:text-[#2E7D32] focus:outline-none">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Nav Menu Categories (Desktop) */}
      <nav className="hidden md:block bg-[#F8FAFC] border-t border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/shop" className="text-sm font-bold text-[#1E293B] hover:text-[#2E7D32] transition">Shop All</Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat._id}`}
                className="text-sm font-medium text-[#1E293B] hover:text-[#2E7D32] transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="flex gap-2 items-center text-xs font-bold bg-[#F59E0B]/10 text-[#B45309] border border-[#F59E0B]/20 rounded-full px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]"></span>
            </span>
            <span>GET 15% OFF ON FIRST PURCHASE</span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 flex flex-col gap-4 shadow-inner">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Nav Categories */}
          <div className="flex flex-col gap-2.5">
            <Link
              to="/shop"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-bold text-[#1E293B] hover:text-[#2E7D32] transition border-b border-gray-55 pb-2"
            >
              Shop All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat._id}`}
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium text-gray-600 hover:text-[#2E7D32] transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
