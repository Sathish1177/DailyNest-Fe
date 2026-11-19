import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, ShieldCheck, ChevronRight, Check, Bell, Store } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Toast from "../components/Toast";
import Modal from "../components/Modal";
import InputBox from "../components/InputBox";
import API from "../utils/api";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart, toggleWishlist, isInWishlist } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Coming soon notification
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyProdName, setNotifyProdName] = useState("");

  const openNotifyModal = (productName) => {
    setNotifyProdName(productName || product?.name || "");
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

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Fetch product data on load / ID change
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products/${id}`);
        if (data.images && data.images.length > 0) {
          data.images = data.images.map(img => img && !img.startsWith("http") ? `http://localhost:8000${img}` : img);
        }
        setProduct(data);
        setActiveImage(data.images?.[0] || "");

        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }

        // Get reviews
        const reviewRes = await API.get(`/reviews/product/${data._id}`);
        setReviews(reviewRes.data);

        // Get related products (same category)
        const relRes = await API.get(`/products?category=${data.category?._id}&limit=4`);
        const related = relRes.data.products.filter((p) => p._id !== data._id);
        const mappedRelated = related.map(p => {
          if (p.images && p.images.length > 0) {
            p.images = p.images.map(img => img && !img.startsWith("http") ? `http://localhost:8000${img}` : img);
          }
          return p;
        });
        setRelatedProducts(mappedRelated);
      } catch (err) {
        console.error("Error loading product detail:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty, selectedVariant);
      setToast({ type: "success", message: "Product added to cart!" });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, qty, selectedVariant);
      navigate("/cart");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setToast({ type: "error", message: "Review comment cannot be empty." });
      return;
    }

    setReviewLoading(true);
    try {
      const { data } = await API.post("/reviews", {
        productId: product._id,
        rating: newRating,
        comment: newComment
      });
      setToast({ type: "success", message: data.message });
      setNewComment("");
      setNewRating(5);
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Failed to submit review."
      });
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E7D32]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center py-20">
          <p className="text-gray-500 font-bold mb-4">Product details could not be loaded.</p>
          <Link to="/shop" className="text-[#2E7D32] font-semibold hover:underline">
            Go back to shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-2 text-xs font-semibold text-gray-400 flex items-center gap-1.5">
        <Link to="/" className="hover:text-slate-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-slate-700">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600 truncate">{product.name}</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Core Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white border border-gray-100 p-8 rounded-2xl shadow-sm mb-12">
          
          {/* GALLERY WITH HOVER ZOOM */}
          <div className="space-y-4">
            <div className="h-[380px] bg-slate-50 border border-gray-150 rounded-2xl flex items-center justify-center overflow-hidden relative group cursor-zoom-in">
              <img
                src={activeImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain transform hover:scale-150 transition-transform duration-300 origin-center"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`h-16 w-16 border rounded-lg overflow-hidden shrink-0 transition bg-slate-50
                      ${activeImage === img ? "border-[#2E7D32] ring-1 ring-[#2E7D32]" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFORMATION COLUMN */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Brand and category */}
              <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D32] uppercase tracking-wide">
                <span>{product.brand}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">{product.category?.name}</span>
              </div>

              {product.store && (
                <div className="mb-2">
                  <Link
                    to={`/store/${product.store.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg transition"
                  >
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sold by: {product.store.name}</span>
                    <span className="text-[10px] text-emerald-600 underline ml-1">Visit Store ↗</span>
                  </Link>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl font-black text-[#1E293B] mt-2.5 leading-tight tracking-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-3 text-sm text-amber-500 font-bold">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s <= Math.round(product.ratingsAverage || 4.5) ? "fill-current" : "text-gray-200"}`}
                    />
                  ))}
                </div>
                <span>{product.ratingsAverage || "4.5"}</span>
                <span className="text-gray-400 font-medium">({reviews.length} reviews)</span>
              </div>

              {/* Price Details */}
              <div className="mt-5 flex items-baseline gap-3">
                {product.isComingSoon ? (
                  <span className="text-3xl font-black text-amber-600">
                    Price TBA
                  </span>
                ) : (
                  <>
                    <span className="text-3xl font-black text-[#111827]">
                      Rs. {selectedVariant?.price || product.discountPrice || product.price}
                    </span>
                    {product.discountPrice && !selectedVariant?.price && (
                      <span className="text-sm font-semibold text-gray-400 line-through">
                        Rs. {product.price}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Short description */}
              <p className="text-gray-500 text-sm mt-5 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* VARIANTS (Accordion selector) */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Available Variants</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 border rounded-lg text-xs font-semibold flex items-center gap-1.5 transition
                          ${selectedVariant === v 
                            ? "border-[#2E7D32] bg-emerald-50 text-[#2E7D32]" 
                            : "border-gray-200 text-slate-700 hover:border-gray-300 bg-white"
                          }`}
                      >
                        {v.size || v.weight || v.color}
                        {selectedVariant === v && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity selector */}
              {!product.isComingSoon && (
                <div className="mt-6 flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Quantity</span>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-[#F8FAFC]">
                    <button
                      onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                      className="px-3.5 py-1.5 font-bold hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <span className="px-5 font-bold text-sm text-[#1E293B]">{qty}</span>
                    <button
                      onClick={() => setQty((prev) => prev + 1)}
                      className="px-3.5 py-1.5 font-bold hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Stock details */}
                  <span className="text-xs font-semibold text-gray-400">
                    {selectedVariant ? selectedVariant.stock : product.stock} units available
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {product.isComingSoon ? (
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={openNotifyModal}
                  variant="accent"
                  className="flex-1 py-3.5 font-bold inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 border-0 text-white"
                >
                  <Bell className="w-4.5 h-4.5 mr-2" />
                  Notify Me on Launch
                </Button>
                
                {/* Wishlist toggle icon */}
                <button
                  onClick={() => {
                    toggleWishlist(product);
                    setToast({ type: "info", message: "Wishlist updated!" });
                  }}
                  className={`p-3.5 rounded-lg border flex items-center justify-center transition
                    ${isInWishlist(product._id)
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-gray-200 bg-white text-gray-400 hover:text-red-500"
                    }`}
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>
            ) : (
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="flex-1 py-3.5 bg-white font-bold"
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="w-4.5 h-4.5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  variant="primary"
                  className="flex-1 py-3.5 font-bold"
                  disabled={product.stock <= 0}
                >
                  Buy Now
                </Button>
                
                {/* Wishlist toggle icon */}
                <button
                  onClick={() => {
                    toggleWishlist(product);
                    setToast({ type: "info", message: "Wishlist updated!" });
                  }}
                  className={`p-3.5 rounded-lg border flex items-center justify-center transition
                    ${isInWishlist(product._id)
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-gray-200 bg-white text-gray-400 hover:text-red-500"
                    }`}
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product detailed description & Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Detailed Description */}
          <div className="lg:col-span-7 bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-[#1E293B] border-b border-gray-100 pb-3 mb-4">Detailed Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          {/* Specifications Card */}
          <div className="lg:col-span-5 bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-[#1E293B] border-b border-gray-100 pb-3 mb-4">Product Specifications</h3>
            <div className="divide-y divide-gray-100 text-xs">
              {[
                { label: "Weight / Unit Size", value: product.weight },
                { label: "Country of Origin", value: product.origin },
                { label: "Shelf Life / Expiry", value: product.shelfLife },
                { label: "Dimensions", value: product.dimensions },
                { label: "Warranty Info", value: product.warranty },
                { label: "Model Number", value: product.modelNumber },
                { label: "Warranty Period", value: product.warrantyPeriod },
                { label: "Material", value: product.material },
                { label: "Gender Target", value: product.gender },
                { label: "Capacity", value: product.capacity },
                { label: "Skin Type", value: product.skinType },
                { label: "Ingredients", value: product.ingredients },
                { label: "Volume / Size", value: product.volume }
              ].map((spec, idx) => (
                spec.value ? (
                  <div key={idx} className="py-3 flex justify-between font-semibold">
                    <span className="text-gray-400 uppercase tracking-wider text-[10px]">{spec.label}</span>
                    <span className="text-[#1E293B] text-right">{spec.value}</span>
                  </div>
                ) : null
              ))}
              {!product.weight && !product.origin && !product.shelfLife && !product.dimensions && !product.warranty && 
               !product.modelNumber && !product.warrantyPeriod && !product.material && !product.gender && 
               !product.capacity && !product.skinType && !product.ingredients && !product.volume && (
                <p className="text-gray-400 italic text-center py-6">No specific parameters available for this product.</p>
              )}
            </div>
          </div>
        </div>

        {/* REVIEWS & SUBMISSION SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Reviews list */}
          <div className="lg:col-span-2 bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-[#1E293B] border-b border-gray-100 pb-3 mb-6">Approved Reviews</h3>
            
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div key={rev._id} className="border-b border-gray-50 pb-5 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <strong className="text-sm font-bold text-[#1E293B]">{rev.userName}</strong>
                      <span className="text-[10px] text-gray-400 font-semibold">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex text-amber-500 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-current" : "text-gray-200"}`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm font-semibold text-center py-10">
                No reviews yet for this product. Be the first to leave one!
              </p>
            )}
          </div>

          {/* Leave Review Form */}
          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm h-fit">
            <h3 className="text-xl font-bold text-[#1E293B] border-b border-gray-100 pb-3 mb-6">Write a Review</h3>
            
            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Stars select */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setNewRating(s)}
                        className={`text-2xl transition ${s <= newRating ? "text-amber-500" : "text-gray-200"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Comment</label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Provide your experience with the product..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#2E7D32]"
                  ></textarea>
                </div>

                <Button type="submit" variant="primary" className="w-full" isLoading={reviewLoading}>
                  Submit Review log
                </Button>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-gray-500 mb-4 font-semibold">Please sign in to submit a rating review.</p>
                <Link to="/login">
                  <Button variant="outline" className="w-full bg-white">
                    Sign In to Review
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="text-2xl font-black text-[#1E293B] mb-8 tracking-tight">Similar Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <div key={prod._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm relative group flex flex-col justify-between">
                  <div>
                    <div onClick={() => navigate(`/product/${prod._id}`)} className="h-36 bg-slate-50 flex items-center justify-center rounded-xl mb-3 cursor-pointer">
                      <img src={prod.images[0]} alt={prod.name} className="max-h-full object-contain group-hover:scale-105 transition" />
                    </div>
                    <h4 onClick={() => navigate(`/product/${prod._id}`)} className="font-bold text-xs text-[#1E293B] hover:text-[#2E7D32] cursor-pointer line-clamp-2">{prod.name}</h4>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                    {prod.isComingSoon ? (
                      <>
                        <span className="font-extrabold text-xs text-amber-600">Price TBA</span>
                        <Button onClick={() => openNotifyModal(prod.name)} variant="accent" size="sm" className="bg-amber-500 hover:bg-amber-600 border-0 text-white py-1 px-3 text-[10px]">Notify</Button>
                      </>
                    ) : (
                      <>
                        <span className="font-extrabold text-sm text-[#111827]">Rs. {prod.discountPrice || prod.price}</span>
                        <Button onClick={() => { addToCart(prod, 1); setToast({ type: "success", message: "Added to cart!" }); }} variant="primary" size="sm">Add</Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

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
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsNotifyOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="bg-[#2E7D32]">
              Subscribe Alert
            </Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
};

export default ProductDetail;
