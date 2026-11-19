import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Store,
  MapPin,
  Phone,
  MessageCircle,
  Share2,
  CheckCircle,
  Star,
  Search,
  ShoppingCart,
  Heart,
  Package,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Toast from "../components/Toast";
import { CartContext } from "../context/CartContext";
import API from "../utils/api";

const StoreFront = () => {
  const { slug } = useParams();
  const { addToCart } = useContext(CartContext);

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchStore();
  }, [slug]);

  const fetchStore = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/stores/public/${slug}`);
      setStore(data.store);
      setProducts(data.products || []);
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Storefront error:", err);
      setToast({
        type: "error",
        message: err.response?.data?.message || "Store not found or currently offline"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToast({ type: "success", message: "Storefront link copied to clipboard!" });
    }
  };

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === "all" ||
      prod.category?._id === selectedCategory ||
      prod.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Opening Storefront...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="py-24 max-w-md mx-auto text-center px-4">
          <Store className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-800">Store Not Found</h2>
          <p className="text-slate-500 text-sm mt-2 mb-6">
            The store you are looking for may have moved or is temporarily inactive.
          </p>
          <Link to="/shop">
            <Button variant="primary">Browse DailyNest Market</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const whatsappNumber = store.socialLinks?.whatsapp || store.phone || "9025585770";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hello ${store.name}! I am browsing your store on DailyNest.`
  )}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar />

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-[#2E7D32]">DailyNest Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-slate-400">Stores & Partners</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-bold text-slate-800">{store.name}</span>
        </div>
      </div>

      {/* Dedicated Storefront Hero Banner - Clean Light Design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm">
          {/* Cover Banner */}
          <div
            className="h-44 sm:h-60 w-full bg-cover bg-center bg-slate-100"
            style={{
              backgroundImage: `url(${
                store.banner || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80"
              })`
            }}
          />

          {/* Store Info Bar */}
          <div className="p-6 sm:p-8 bg-white flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-gray-100">
            <div className="flex items-center gap-4 sm:gap-6">
              <img
                src={store.logo || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300"}
                alt={store.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-md -mt-12 sm:-mt-16 bg-white shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight">
                    {store.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    Verified Partner
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl font-medium">
                  {store.tagline}
                </p>
                <div className="flex items-center gap-3 sm:gap-4 mt-2.5 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {store.address?.city ? `${store.address.city}, Tamil Nadu` : "Tamil Nadu, India"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {store.rating || 4.8} ({store.numReviews || 0} Reviews)
                  </span>
                  <span>•</span>
                  <span className="text-slate-600 font-semibold">
                    {products.length} Products in Store
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                Chat on WhatsApp
              </a>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-gray-200 px-3.5 py-2.5 rounded-xl font-bold text-xs transition"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Store Story & Trust Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              About {store.name}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {store.description ||
                "Welcome to our store! We source and prepare genuine products with care and hygiene. Order directly from our catalog below and get quick delivery backed by DailyNest's unified payment and delivery guarantee."}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2">
              <ShieldCheck className="w-5 h-5 text-[#2E7D32]" />
              DailyNest Partner Guarantee
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every order placed from this store is protected by DailyNest Return Guarantee, secure payments, and direct door delivery.
            </p>
          </div>
        </div>

        {/* Products Search & Category Chips */}
        <div className="mt-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                Products from this Store
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {filteredProducts.length} items available for direct purchase
              </p>
            </div>

            {/* In-store Search */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder={`Search in ${store.name}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 pl-9 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Category Filter Chips */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                  selectedCategory === "all"
                    ? "bg-[#2E7D32] text-white shadow-sm"
                    : "bg-white text-slate-600 border border-gray-200 hover:border-emerald-600"
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                    selectedCategory === cat._id
                      ? "bg-[#2E7D32] text-white shadow-sm"
                      : "bg-white text-slate-600 border border-gray-200 hover:border-emerald-600"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Store Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center my-6">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No items match your search</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for something else or reset your category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod._id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative overflow-hidden bg-slate-50">
                    <Link to={`/product/${prod.slug || prod._id}`}>
                      <img
                        src={prod.images?.[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500"}
                        alt={prod.name}
                        className="w-full h-44 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    {prod.discountPrice && (
                      <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                        Save ₹{prod.discountPrice - prod.price}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                        {store.name}
                      </div>
                      <Link to={`/product/${prod.slug || prod._id}`}>
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-2 hover:text-[#2E7D32] transition">
                          {prod.name}
                        </h4>
                      </Link>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                        {prod.shortDescription}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                      <div>
                        <div className="text-base font-black text-slate-900">
                          ₹{prod.price}
                        </div>
                        {prod.discountPrice && (
                          <div className="text-[11px] text-slate-400 line-through">
                            ₹{prod.discountPrice}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          addToCart(prod, 1);
                          setToast({ type: "success", message: `${prod.name} added to cart!` });
                        }}
                        className="p-2.5 rounded-xl bg-[#2E7D32] text-white hover:bg-[#256428] transition shadow-md hover:shadow-emerald-700/30"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StoreFront;

