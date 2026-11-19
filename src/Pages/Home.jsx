import React, { useState, useEffect, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Bell, Star, ArrowRight, Sparkles, Flame, Percent, ShieldCheck, Heart, Award, Clock, Mail, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Toast from "../components/Toast";
import Modal from "../components/Modal";
import InputBox from "../components/InputBox";
import API, { getImageUrl } from "../utils/api";
import { CartContext } from "../context/CartContext";
import heroBannerImg from "../assets/hero-banner.jpg";
import brandLogo from "../assets/logo/Dailynest Fresh Grocery Logo.png";

const Home = () => {
  const { addToCart, toggleWishlist, isInWishlist } = useContext(CartContext);
  const navigate = useNavigate();

  // State arrays
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [comingSoonProducts, setComingSoonProducts] = useState([]);
  
  // Filter variables
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [priceRange, setPriceRange] = useState(200000);
  const [sortBy, setSortBy] = useState("newest");

  // Interaction variables
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [toast, setToast] = useState(null);
  
  // Coming soon notification
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyProdName, setNotifyProdName] = useState("");

  // Countdown timer calculations
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial data
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        // Load active banners
        const bannerRes = await API.get("/banners");
        const mappedBanners = bannerRes.data.map(b => ({
          ...b,
          image: b.image ? getImageUrl(b.image) : ""
        }));
        const heroBanners = mappedBanners.filter(b => b.type === "Hero" || !b.type);
        setBanners(heroBanners);

        // Load active categories
        const catRes = await API.get("/categories?activeOnly=true");
        const mappedCategories = catRes.data.map(cat => ({
          ...cat,
          image: cat.image ? getImageUrl(cat.image) : ""
        }));
        setCategories(mappedCategories);

        // Load subcategories
        const subRes = await API.get("/categories/sub/all?activeOnly=true");
        setSubcategories(subRes.data);

        // Load standard active products
        const prodRes = await API.get("/products?isActive=true&limit=20");
        const mappedProds = prodRes.data.products.map(prod => {
          if (prod.images && prod.images.length > 0) {
            prod.images = prod.images.map(img => getImageUrl(img));
          }
          return prod;
        });
        setProducts(mappedProds);

        // Load coming soon products
        const csRes = await API.get("/products?isComingSoon=true&limit=4");
        const mappedCS = csRes.data.products.map(prod => {
          if (prod.images && prod.images.length > 0) {
            prod.images = prod.images.map(img => getImageUrl(img));
          }
          return prod;
        });
        setComingSoonProducts(mappedCS);
      } catch (err) {
        console.error("Home loading error:", err.message);
        // Load mock fallback data for showcase if server is unseeded or down
        setBanners([
          { _id: "b1", title: "Fresh Groceries Daily", description: "Get up to 25% off on fresh dairy and organic greens.", image: "", type: "Hero", link: "/shop" },
          { _id: "b2", title: "Smart Gadgets Collection", description: "Premium devices for your everyday task items.", image: "", type: "Hero", link: "/shop" }
        ]);
        setCategories([
          { _id: "c1", name: "Groceries", slug: "groceries" },
          { _id: "c2", name: "Electronics", slug: "electronics" },
          { _id: "c3", name: "Fashion", slug: "fashion" }
        ]);
      }
    };
    loadHomeData();
  }, []);

  const handleNextBanner = () => {
    setActiveBannerIdx((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const handlePrevBanner = () => {
    setActiveBannerIdx((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const openNotifyModal = (productName) => {
    setNotifyProdName(productName);
    setIsNotifyOpen(true);
  };

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (notifyEmail.trim()) {
      setIsNotifyOpen(false);
      setToast({
        type: "success",
        message: `Notification saved! We will notify you when ${notifyProdName} launches.`
      });
      setNotifyEmail("");
    }
  };

  const renderProductCard = (prod) => {
    const hasDiscount = prod.discountPrice && prod.discountPrice < prod.price;
    return (
      <div key={prod._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 p-4 relative group flex flex-col justify-between h-[360px]">
        <div>
          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(prod)}
            className="absolute top-3.5 right-3.5 z-10 p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 text-gray-400 hover:text-red-500 shadow-sm transition"
          >
            <Heart className={`w-4 h-4 ${isInWishlist(prod._id) ? "fill-red-500 text-red-500" : ""}`} />
          </button>

          {/* Product Image */}
          <div
            onClick={() => navigate(`/product/${prod._id}`)}
            className="h-40 bg-slate-50 flex items-center justify-center rounded-xl overflow-hidden mb-3 cursor-pointer"
          >
            <img
              src={prod.images && prod.images[0] ? prod.images[0] : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300"}
              alt={prod.name}
              className="max-h-full object-contain group-hover:scale-105 transition duration-300"
            />
          </div>

          {/* Brand */}
          <span className="text-[9px] bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
            {prod.brand || "Nest Fresh"}
          </span>

          {/* Title */}
          <h4
            onClick={() => navigate(`/product/${prod._id}`)}
            className="font-bold text-sm text-[#1E293B] mt-1.5 line-clamp-1 hover:text-[#2E7D32] cursor-pointer"
          >
            {prod.name}
          </h4>

          {/* Ratings */}
          <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{prod.ratingsAverage || "4.5"}</span>
            <span className="text-gray-400 font-medium">({prod.ratingsCount || "10"})</span>
          </div>
        </div>

        {/* Footer info: Price and Action */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-50">
          {prod.isComingSoon ? (
            <>
              <div>
                <span className="font-extrabold text-sm text-amber-600">
                  Price TBA
                </span>
              </div>
              <Button
                onClick={() => openNotifyModal(prod.name)}
                variant="accent"
                size="sm"
                className="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 border-0 text-white"
              >
                Notify Me
              </Button>
            </>
          ) : (
            <>
              <div>
                <span className="font-extrabold text-sm text-[#111827]">
                  Rs. {hasDiscount ? prod.discountPrice : prod.price}
                </span>
                {hasDiscount && (
                  <span className="text-[10px] text-gray-400 line-through ml-1.5">
                    Rs. {prod.price}
                  </span>
                )}
              </div>
              <Button
                onClick={() => {
                  addToCart(prod, 1);
                  setToast({ type: "success", message: "Added to shopping cart!" });
                }}
                variant="primary"
                size="sm"
                className="px-3 py-1.5 text-xs font-bold"
              >
                Add
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  // Filtered lists
  const filteredProducts = products.filter((prod) => {
    if (selectedCat && prod.category?._id !== selectedCat) return false;
    if (selectedSub && prod.subcategory?._id !== selectedSub) return false;
    if (prod.price > priceRange) return false;
    return true;
  });

  const displayProducts = useMemo(() => {
    const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 7);
  }, [products, selectedCat, selectedSub, priceRange]);

  const featuredList = products.filter((p) => p.isFeatured && !p.isComingSoon).slice(0, 4);
  const trendingList = products.filter((p) => p.isTrending && !p.isComingSoon).slice(0, 4);
  const bestSellerList = products.filter((p) => p.isBestSeller && !p.isComingSoon).slice(0, 4);
  const newArrivalsList = products.filter((p) => !p.isComingSoon).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      {/* Coming Soon Notification Modal */}
      <Modal isOpen={isNotifyOpen} onClose={() => setIsNotifyOpen(false)} title="Notify Me">
        <form onSubmit={handleNotifySubmit} className="space-y-4">
          <p className="text-sm text-gray-500">
            Submit your email or mobile contact. We'll alert you as soon as <strong>{notifyProdName}</strong> becomes available.
          </p>
          <InputBox
            label="Email or Mobile"
            name="notifyContact"
            type="text"
            required
            placeholder="e.g. sathish@gmail.com"
            value={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsNotifyOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Subscribe Launch Updates
            </Button>
          </div>
        </form>
      </Modal>

      {/* Hero Carousel Banner Slider */}
      <section className="relative h-[480px] bg-slate-900 overflow-hidden">
        {banners.length > 0 ? (
          <div className="h-full w-full relative">
            <div
              className="h-full w-full bg-cover bg-center flex items-center px-8 md:px-16"
              style={{
                backgroundImage: banners[activeBannerIdx]?.image
                  ? `linear-gradient(to right, rgba(15,23,42,0.85), rgba(15,23,42,0.3)), url(${
                      banners[activeBannerIdx].image === "/uploads/hero-banner.jpg"
                        ? heroBannerImg
                        : getImageUrl(banners[activeBannerIdx].image)
                    })`
                  : `linear-gradient(to right, rgba(15,23,42,0.85), rgba(15,23,42,0.3)), url(${heroBannerImg})`
              }}
            >
              <div className="max-w-2xl text-white space-y-5">
                {/* Brand Logo inside Hero Banner */}
                <div className="inline-flex items-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-lg border border-white/50">
                  <img
                    src={brandLogo}
                    alt="DailyNest"
                    className="h-9 sm:h-11 w-auto object-contain"
                  />
                </div>

                <div>
                  <span className="bg-[#F59E0B] text-slate-900 font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block mb-3">
                    TODAY'S SPECIAL FLASH DEAL
                  </span>
                  <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                    {banners[activeBannerIdx].title}
                  </h1>
                </div>
                <p className="text-slate-300 text-lg">
                  {banners[activeBannerIdx].description}
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      const link = banners[activeBannerIdx]?.link;
                      if (!link || link.includes("chatgpt") || !link.startsWith("/")) {
                        navigate("/shop");
                      } else {
                        navigate(link.toLowerCase());
                      }
                    }}
                    variant="primary"
                    className="px-8 py-3.5 text-base shadow-lg"
                  >
                    Shop Deals Now
                    <ArrowRight className="w-5 h-5 ml-2.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Slider controls */}
            <button
              onClick={handlePrevBanner}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextBanner}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-white font-semibold">
            Loading active promotional sliders...
          </div>
        )}
      </section>

      {/* Quick Jump Shortcuts */}
      <section className="bg-white py-4 border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-2">Quick Jump:</span>
          {[
            { label: "Trending", id: "trending-section", icon: <Flame className="w-3.5 h-3.5 mr-1" /> },
            { label: "Featured", id: "featured-section", icon: <Sparkles className="w-3.5 h-3.5 mr-1" /> },
            { label: "Best Sellers", id: "best-seller-section", icon: <Award className="w-3.5 h-3.5 mr-1" /> },
            { label: "New Arrivals", id: "new-arrivals-section", icon: <Clock className="w-3.5 h-3.5 mr-1" /> },
            { label: "Coming Soon", id: "coming-soon-section", icon: <Bell className="w-3.5 h-3.5 mr-1" /> }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => {
                const el = document.getElementById(btn.id);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 px-3.5 py-2 rounded-full transition-all duration-200"
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Categories list */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#1E293B] tracking-tight">Explore Categories</h2>
            <p className="text-gray-500 text-sm mt-1">Direct access to daily essentials and brand collections.</p>
          </div>
          <Link to="/shop" className="text-sm font-bold text-[#2E7D32] hover:text-[#256428] flex items-center gap-1">
            See All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => navigate(`/shop?category=${cat._id}`)}
              className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 cursor-pointer transform hover:-translate-y-1 group"
            >
              <div className="bg-emerald-50 rounded-xl w-14 h-14 mx-auto flex items-center justify-center text-[#2E7D32] group-hover:bg-[#2E7D32] group-hover:text-white transition-all duration-200 mb-4 font-bold text-lg overflow-hidden">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                ) : (
                  cat.name.charAt(0).toUpperCase()
                )}
              </div>
              <h4 className="font-bold text-sm text-[#1E293B] truncate">{cat.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Category Filter Section */}
      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-black text-[#1E293B] tracking-tight">Browse Custom Grids</h2>
            <p className="text-gray-500 text-sm mt-1.5">Apply catalog parameters to find products instantly.</p>
          </div>

          {/* Filtering bar control panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-[#F8FAFC] border border-gray-150 p-6 rounded-2xl mb-10">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
              <select
                value={selectedCat}
                onChange={(e) => {
                  setSelectedCat(e.target.value);
                  setSelectedSub("");
                }}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Subcategory Select */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Subcategory</label>
              <select
                value={selectedSub}
                onChange={(e) => setSelectedSub(e.target.value)}
                disabled={!selectedCat}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2E7D32] disabled:bg-gray-150"
              >
                <option value="">All Subcategories</option>
                {subcategories
                  .filter((sub) => sub.mainCategory?._id === selectedCat)
                  .map((sub) => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Price Limit: Rs. {priceRange}</label>
              <input
                type="range"
                min="10"
                max="200000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#2E7D32]"
              />
            </div>

            {/* Clear Button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full py-2 bg-white"
                onClick={() => {
                  setSelectedCat("");
                  setSelectedSub("");
                  setPriceRange(200000);
                }}
              >
                Reset Filter Parameters
              </Button>
            </div>
          </div>

          {/* Grid list results */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {displayProducts.map((prod) => (
                <div key={prod._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 p-4 relative group flex flex-col justify-between h-[360px]">
                  <div>
                    <button
                      onClick={() => toggleWishlist(prod)}
                      className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 text-gray-400 hover:text-red-500 shadow-sm transition"
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(prod._id) ? "fill-red-500 text-red-500" : ""}`} />
                    </button>

                    <div
                      onClick={() => navigate(`/product/${prod._id}`)}
                      className="h-44 bg-slate-50 flex items-center justify-center rounded-xl overflow-hidden mb-4 cursor-pointer"
                    >
                      <img
                        src={prod.images && prod.images[0] ? prod.images[0] : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300"}
                        alt={prod.name}
                        className="max-h-full object-contain group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase">
                      {prod.brand}
                    </span>
                    
                    <h4
                      onClick={() => navigate(`/product/${prod._id}`)}
                      className="font-bold text-sm text-[#1E293B] mt-1.5 line-clamp-1 hover:text-[#2E7D32] cursor-pointer"
                    >
                      {prod.name}
                    </h4>

                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{prod.ratingsAverage || "4.5"}</span>
                      <span className="text-gray-400 font-medium">({prod.ratingsCount || "12"})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                    {prod.isComingSoon ? (
                      <>
                        <div>
                          <span className="font-extrabold text-base text-amber-600">Price TBA</span>
                        </div>
                        <Button
                          onClick={() => openNotifyModal(prod.name)}
                          variant="accent"
                          size="sm"
                          className="bg-amber-500 hover:bg-amber-600 border-0 text-white"
                        >
                          Notify Me
                        </Button>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="font-extrabold text-base text-[#111827]">Rs. {prod.discountPrice || prod.price}</span>
                          {prod.discountPrice && (
                            <span className="text-xs text-gray-400 line-through ml-1.5">Rs. {prod.price}</span>
                          )}
                        </div>
                        <Button onClick={() => {
                          addToCart(prod, 1);
                          setToast({ type: "success", message: "Added to shopping cart!" });
                        }} variant="primary" size="sm">
                          Add to Cart
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* 8th Card - View All Products link */}
              <div
                onClick={() => navigate("/shop")}
                className="relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between h-[360px] cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-emerald-950/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-500 group border border-emerald-500/20 bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#115E59]"
              >
                {/* Glowing decorative circles */}
                <div className="absolute top-[-20%] right-[-20%] w-56 h-56 rounded-full bg-emerald-400/20 blur-2xl group-hover:bg-emerald-300/30 group-hover:scale-110 transition-all duration-700"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 rounded-full bg-teal-400/10 blur-xl group-hover:bg-teal-300/20 group-hover:scale-110 transition-all duration-700"></div>
                
                {/* Grid overlay pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px]"></div>

                {/* Top Badge */}
                <div className="relative z-10 flex justify-between items-center">
                  <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                    Full Catalog
                  </span>
                  <span className="text-[10px] text-teal-200 font-extrabold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    150+ Products
                  </span>
                </div>

                {/* Center Content */}
                <div className="relative z-10 flex-grow flex flex-col justify-center items-center gap-4 text-center mt-3">
                  <div className="relative">
                    {/* Glowing ring */}
                    <div className="absolute inset-0 rounded-full bg-white/20 blur-md scale-110 group-hover:scale-125 transition duration-500"></div>
                    <div className="relative bg-gradient-to-br from-white to-emerald-100 p-4.5 rounded-full shadow-lg group-hover:rotate-12 transition-all duration-500 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-[#047857]" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="font-black text-xl tracking-tight text-white drop-shadow-sm group-hover:text-emerald-100 transition-colors">
                      Explore All Products
                    </h4>
                    <p className="text-teal-100/80 text-xs px-1 leading-relaxed max-w-[210px] font-medium">
                      View all items in our catalog and find the best deals today!
                    </p>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="relative z-10 pt-2 border-t border-white/10 mt-2">
                  <div className="flex items-center justify-between bg-white/10 group-hover:bg-white text-white group-hover:text-emerald-900 px-4 py-3 rounded-2xl border border-white/15 group-hover:border-white transition-all duration-500">
                    <span className="font-extrabold text-xs tracking-wide">View All Products</span>
                    <div className="bg-white/20 group-hover:bg-emerald-800 p-1.5 rounded-xl transition duration-500 flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 text-white group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 font-semibold">
              No products found matching the filter bounds.
            </div>
          )}
        </div>
      </section>

      {/* Featured Grids (Trending, Featured, Best Sellers, New Arrivals) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-16">
        
        {/* Trending grid */}
        {trendingList.length > 0 && (
          <div id="trending-section">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
              <Flame className="w-6 h-6 text-red-500 fill-red-500" />
              <div>
                <h3 className="text-2xl font-black text-[#1E293B] tracking-tight">Trending Essentials</h3>
                <p className="text-xs text-gray-500 mt-0.5">Top picks customer favorites this week.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {trendingList.map(renderProductCard)}
            </div>
          </div>
        )}

        {/* Featured grid */}
        {featuredList.length > 0 && (
          <div id="featured-section">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
              <Sparkles className="w-6 h-6 text-emerald-600 fill-emerald-100" />
              <div>
                <h3 className="text-2xl font-black text-[#1E293B] tracking-tight">Featured Selections</h3>
                <p className="text-xs text-gray-500 mt-0.5">Selected premium items curated by DailyNest experts.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredList.map(renderProductCard)}
            </div>
          </div>
        )}

        {/* Best Selling grid */}
        {bestSellerList.length > 0 && (
          <div id="best-seller-section">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
              <Award className="w-6 h-6 text-amber-500 fill-amber-100" />
              <div>
                <h3 className="text-2xl font-black text-[#1E293B] tracking-tight">Best Selling Products</h3>
                <p className="text-xs text-gray-500 mt-0.5">Most purchased daily essentials and groceries.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {bestSellerList.map(renderProductCard)}
            </div>
          </div>
        )}

        {/* New Arrivals grid */}
        {newArrivalsList.length > 0 && (
          <div id="new-arrivals-section">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
              <Clock className="w-6 h-6 text-indigo-500" />
              <div>
                <h3 className="text-2xl font-black text-[#1E293B] tracking-tight">New Arrivals</h3>
                <p className="text-xs text-gray-500 mt-0.5">Fresh stock newly added to our collections.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {newArrivalsList.map(renderProductCard)}
            </div>
          </div>
        )}
      </section>

      {/* Coming Soon catalog (Light Theme, No Countdown Timer) */}
      {comingSoonProducts.length > 0 && (
        <section id="coming-soon-section" className="bg-white py-20 border-y border-gray-150">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-10 border-b border-gray-100 pb-4">
              <span className="bg-amber-100 text-amber-800 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                Exclusive Launch Previews
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#1E293B] tracking-tight mt-2.5">Coming Soon Catalog</h2>
              <p className="text-gray-500 text-sm mt-1">Get ready for these additions. Subscribe to be notified on launch!</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {comingSoonProducts.map((prod) => (
                <div key={prod._id} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between h-[340px] relative overflow-hidden group shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300">
                  <div className="absolute top-3 right-3 bg-amber-50 text-amber-800 font-bold text-[9px] px-2 py-0.5 rounded border border-amber-100">
                    PREVIEW
                  </div>
                  <div>
                    <div className="h-36 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden p-2 mb-4">
                      <img
                        src={prod.images && prod.images[0] ? prod.images[0] : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300"}
                        alt={prod.name}
                        className="max-h-full object-contain group-hover:scale-105 transition duration-350"
                      />
                    </div>
                    <h4 className="font-bold text-sm text-[#1E293B] line-clamp-1 hover:text-[#2E7D32] transition">{prod.name}</h4>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{prod.shortDescription}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-50 mt-2 flex justify-between items-center gap-2">
                    <span className="font-extrabold text-sm text-amber-600">Price TBA</span>
                    <Button
                      onClick={() => openNotifyModal(prod.name)}
                      variant="accent"
                      size="sm"
                      className="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 border-0 text-white"
                    >
                      <Bell className="w-3.5 h-3.5 mr-1.5" />
                      Notify Me
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Offer banners section */}
      <section className="bg-emerald-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-full">
              <Percent className="w-8 h-8 text-[#F59E0B]" />
            </div>
            <div>
              <h3 className="text-xl font-bold">15% Cashback Promotion Discount</h3>
              <p className="text-emerald-100 text-xs">Use credit cards or UPI method checkout for eligible coupon savings.</p>
            </div>
          </div>
          <Button onClick={() => navigate("/shop")} variant="secondary" className="bg-[#1E293B] hover:bg-[#0f172a] hover:scale-105 border-0">
            View Shop Catalog
          </Button>
        </div>
      </section>

      {/* DailyNest Store Partner Program Feature Banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] mb-2">
                DailyNest Store Partner Program
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight mb-3">
                Start Selling & Get Your <span className="text-[#2E7D32]">Own Branded Store</span> Page!
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-2xl mb-6">
                Sell your products to DailyNest shoppers while having your very own dedicated storefront URL (e.g. <span className="font-mono text-xs bg-slate-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">/store/your-shop</span>) to share directly with your customers on WhatsApp & Instagram.
              </p>

              {/* Quick Perks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-700">
                  ✓ Zero Setup Fee & Quick Onboarding
                </div>
                <div className="p-3 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-700">
                  ✓ Branded Storefront + DailyNest Market
                </div>
                <div className="p-3 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-700">
                  ✓ Dedicated Store Admin Dashboard
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col justify-center gap-3">
              <Button
                onClick={() => navigate("/register-store")}
                variant="primary"
                className="w-full py-3.5 text-sm font-bold shadow-sm flex items-center justify-center gap-2"
              >
                <span>Register Your Store</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigate("/adminlogin")}
                variant="outline"
                className="w-full py-3.5 text-sm font-bold bg-white"
              >
                Partner & Admin Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-[#1E293B]">Client Testimonials</h2>
          <p className="text-gray-500 text-sm mt-1.5">What our recurring buyers have to say about our logistics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Sathish", comment: "DailyNest is a lifesaver. The organic veggies are super fresh, and delivery took less than 45 minutes to Chennai!", stars: 5 },
            { name: "Dhanush", comment: "The checkout coupon discount saved me over Rs 400. Simulated UPI payment is extremely smooth and clean.", stars: 5 },
            { name: "Kesavan", comment: "Excellent customer service. Requested a refund on a device, and they verified and processed it within 24 hours.", stars: 5 }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <p className="text-gray-600 text-sm italic leading-relaxed">"{item.comment}"</p>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="font-bold text-sm text-[#1E293B]">{item.name}</span>
                <div className="flex text-amber-500">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Subscription Section - Light Clean Style */}
      <section className="bg-[#F8FAFC] border-t border-gray-200 py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Heading text */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#2E7D32] text-xs font-bold uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5" />
                <span>Stay Updated Daily</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#1E293B] tracking-tight leading-tight">
                Subscribe to DailyNest Newsletter
              </h2>
              <p className="text-slate-600 text-sm max-w-xl leading-relaxed">
                Be the first to receive updates on organic arrivals, special deals, health tips, and local coupons. Get a <strong className="text-[#2E7D32]">10% discount coupon</strong> instantly upon joining!
              </p>
            </div>

            {/* Input signup form card */}
            <div className="lg:col-span-5 bg-white border border-gray-200 p-6 sm:p-8 rounded-3xl shadow-sm">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const email = form.elements.newsletterEmail.value;
                  if (email.trim()) {
                    setToast({
                      type: "success",
                      message: "Thank you for subscribing! Your 10% coupon has been sent to your email."
                    });
                    form.reset();
                  }
                }}
                className="space-y-3"
              >
                <div className="relative">
                  <input
                    type="email"
                    name="newsletterEmail"
                    required
                    placeholder="Enter your email address"
                    className="w-full bg-[#F8FAFC] border border-gray-200 hover:border-gray-300 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] focus:outline-none rounded-2xl px-5 py-3.5 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200 pl-11"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3.5 text-sm font-bold bg-[#2E7D32] hover:bg-[#256428] text-white rounded-2xl tracking-wide shadow-md transition-all duration-200 border-0"
                >
                  Join DailyNest Club
                </Button>
              </form>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mt-4 px-2 uppercase tracking-wide">
                <span>🛡️ Spam-Free Policy</span>
                <span>Unsubscribe anytime</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;