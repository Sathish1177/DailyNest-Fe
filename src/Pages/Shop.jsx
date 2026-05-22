import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Heart, Star, ShoppingCart, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Toast from "../components/Toast";
import API from "../utils/api";
import { CartContext } from "../context/CartContext";

const Shop = () => {
  const { addToCart, toggleWishlist, isInWishlist } = useContext(CartContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search details
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  
  // Local state copy of URL params for forms
  const [searchVal, setSearchVal] = useState(searchParams.get("search") || "");
  const [selectedCat, setSelectedCat] = useState(searchParams.get("category") || "");
  const [selectedSub, setSelectedSub] = useState(searchParams.get("subcategory") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || 200000);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync state with URL params changes
  useEffect(() => {
    setSearchVal(searchParams.get("search") || "");
    setSelectedCat(searchParams.get("category") || "");
    setSelectedSub(searchParams.get("subcategory") || "");
    setMaxPrice(searchParams.get("maxPrice") || 200000);
    setSortBy(searchParams.get("sort") || "newest");
    setCurrentPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  // Load category sidebar data
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const catRes = await API.get("/categories?activeOnly=true");
        setCategories(catRes.data);
        
        const subRes = await API.get("/categories/sub/all?activeOnly=true");
        setSubcategories(subRes.data);
      } catch (err) {
        console.error("Error loading categories metadata:", err.message);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch products from server based on search/filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 12,
          isActive: true
        };

        if (searchVal) params.search = searchVal;
        if (selectedCat) params.category = selectedCat;
        if (selectedSub) params.subcategory = selectedSub;
        if (maxPrice) {
          params.minPrice = 0;
          params.maxPrice = maxPrice;
        }
        if (sortBy) params.sort = sortBy;

        const { data } = await API.get("/products", { params });
        const mappedProducts = data.products.map(prod => {
          if (prod.images && prod.images.length > 0) {
            prod.images = prod.images.map(img => img && !img.startsWith("http") ? `http://localhost:8000${img}` : img);
          }
          return prod;
        });
        setProducts(mappedProducts);
        setTotalPages(data.pages);
        setTotalProducts(data.total);
      } catch (err) {
        console.error("Error loading products lists:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchVal, selectedCat, selectedSub, maxPrice, sortBy, currentPage]);

  const updateUrlParams = (newParams) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });
    setSearchParams(nextParams);
  };

  const handleCategoryClick = (catId) => {
    const newCat = selectedCat === catId ? "" : catId;
    setSelectedCat(newCat);
    setSelectedSub(""); // Clear sub
    setCurrentPage(1);
    updateUrlParams({ category: newCat, subcategory: "", page: 1 });
  };

  const handleSubcategoryClick = (subId) => {
    const newSub = selectedSub === subId ? "" : subId;
    setSelectedSub(newSub);
    setCurrentPage(1);
    updateUrlParams({ subcategory: newSub, page: 1 });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    updateUrlParams({ search: searchVal, page: 1 });
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    updateUrlParams({ sort: newSort });
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setMaxPrice(newPrice);
    updateUrlParams({ maxPrice: newPrice });
  };

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      updateUrlParams({ page: pageNum });
    }
  };

  const handleResetFilters = () => {
    setSearchVal("");
    setSelectedCat("");
    setSelectedSub("");
    setMaxPrice(200000);
    setSortBy("newest");
    setCurrentPage(1);
    navigate("/shop");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* SIDEBAR FILTER PANEL */}
          <aside className="w-full md:w-64 shrink-0 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="font-black text-slate-800 text-base inline-flex items-center gap-2">
                <SlidersHorizontal className="w-4.5 h-4.5 text-[#2E7D32]" />
                Filter Options
              </span>
              <button onClick={handleResetFilters} className="text-xs font-bold text-red-500 hover:underline">
                Reset All
              </button>
            </div>

            {/* Category selection */}
            <div>
              <h4 className="font-bold text-sm text-[#1E293B] mb-4">Categories</h4>
              <div className="space-y-2.5">
                {categories.map((cat) => (
                  <div key={cat._id} className="flex flex-col">
                    <button
                      onClick={() => handleCategoryClick(cat._id)}
                      className={`text-left text-xs font-bold py-1 transition flex justify-between items-center ${selectedCat === cat._id ? "text-[#2E7D32]" : "text-gray-600 hover:text-[#2E7D32]"}`}
                    >
                      <span>{cat.name}</span>
                      {selectedCat === cat._id && <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></span>}
                    </button>

                    {/* Subcategories (nested accordion style) */}
                    {selectedCat === cat._id && (
                      <div className="pl-3 mt-1.5 border-l border-gray-100 space-y-1.5">
                        {subcategories
                          .filter((sub) => sub.mainCategory?._id === cat._id)
                          .map((sub) => (
                            <button
                              key={sub._id}
                              onClick={() => handleSubcategoryClick(sub._id)}
                              className={`block text-left text-[11px] font-semibold py-0.5 w-full transition ${selectedSub === sub._id ? "text-[#F59E0B]" : "text-gray-500 hover:text-[#F59E0B]"}`}
                            >
                              • {sub.name}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price limits slider */}
            <div>
              <h4 className="font-bold text-sm text-[#1E293B] mb-4 flex justify-between">
                <span>Max Price</span>
                <span className="text-[#2E7D32]">Rs. {maxPrice}</span>
              </h4>
              <input
                type="range"
                min="50"
                max="200000"
                step="500"
                value={maxPrice}
                onChange={handlePriceChange}
                className="w-full accent-[#2E7D32]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1.5">
                <span>Rs. 50</span>
                <span>Rs. 200000+</span>
              </div>
            </div>
          </aside>

          {/* PRODUCT LISTING CONTENT */}
          <section className="flex-grow">
            
            {/* Header controls bar */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <span className="text-sm font-semibold text-gray-500">
                Showing <strong className="text-slate-800">{products.length}</strong> of <strong className="text-slate-800">{totalProducts}</strong> products
              </span>

              {/* Form Search & Sort */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-60">
                  <input
                    type="text"
                    placeholder="Search in results..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-lg px-4 py-2 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2E7D32]">
                    <Search className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-[#F8FAFC] w-full sm:w-auto">
                  <ArrowUpDown className="w-4 h-4 text-gray-400 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="bg-transparent border-0 text-xs font-semibold text-slate-700 focus:outline-none w-full cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="popularity">Popularity (Stars)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Catalog Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E7D32]"></div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map((prod) => (
                    <div key={prod._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm p-4 relative group hover:shadow-md hover:border-emerald-250 transition-all flex flex-col justify-between">
                      <div>
                        {/* Wishlist toggle */}
                        <button
                          onClick={() => toggleWishlist(prod)}
                          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/90 border border-gray-100 text-gray-400 hover:text-red-500 shadow-sm transition"
                        >
                          <Heart className={`w-4 h-4 ${isInWishlist(prod._id) ? "fill-red-500 text-red-500" : ""}`} />
                        </button>

                        {/* Image */}
                        <div
                          onClick={() => navigate(`/product/${prod._id}`)}
                          className="h-44 bg-slate-50 flex items-center justify-center rounded-xl overflow-hidden mb-4 cursor-pointer"
                        >
                          <img
                            src={prod.images[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300"}
                            alt={prod.name}
                            className="max-h-full object-contain group-hover:scale-105 transition duration-300"
                          />
                        </div>

                        {/* Brand badge */}
                        <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase">
                          {prod.brand}
                        </span>

                        {/* Name */}
                        <h4
                          onClick={() => navigate(`/product/${prod._id}`)}
                          className="font-bold text-sm text-[#1E293B] mt-1.5 line-clamp-2 hover:text-[#2E7D32] cursor-pointer"
                        >
                          {prod.name}
                        </h4>

                        {/* Star Rating details */}
                        <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{prod.ratingsAverage || "4.5"}</span>
                          <span className="text-gray-400 font-medium">({prod.ratingsCount || "0"})</span>
                        </div>
                      </div>

                      {/* Pricing and Cart button */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                        <div>
                          <span className="font-extrabold text-base text-[#111827]">Rs. {prod.discountPrice || prod.price}</span>
                          {prod.discountPrice && (
                            <span className="text-xs text-gray-400 line-through ml-1.5">Rs. {prod.price}</span>
                          )}
                        </div>
                        <Button
                          onClick={() => {
                            addToCart(prod, 1);
                            setToast({ type: "success", message: "Added to shopping cart!" });
                          }}
                          variant="primary"
                          size="sm"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION BAR */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="bg-white"
                    >
                      Prev
                    </Button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-9 h-9 rounded-lg font-bold text-xs border transition
                          ${currentPage === i + 1
                            ? "bg-[#2E7D32] text-white border-[#2E7D32]"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="bg-white"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 bg-white border border-gray-150 rounded-2xl shadow-sm text-gray-400 font-semibold">
                No catalog items found matching parameters.
              </div>
            )}
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
