import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, X } from "lucide-react";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import Toast from "../components/Toast";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    coupon,
    couponError,
    applyCouponCode,
    removeCoupon,
    getPricingSummary
  } = useContext(CartContext);

  const [couponCode, setCouponCode] = useState("");
  const [toast, setToast] = useState(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const navigate = useNavigate();

  const { itemsPrice, taxPrice, shippingPrice, discount, totalPrice } = getPricingSummary();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setLoadingCoupon(true);
    const result = await applyCouponCode(couponCode.trim());
    setLoadingCoupon(false);
    if (result.success) {
      setToast({ type: "success", message: "Coupon applied successfully!" });
      setCouponCode("");
    } else {
      setToast({ type: "error", message: result.message || "Failed to apply coupon" });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setToast({ type: "warning", message: "Coupon removed" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 className="text-3xl font-black text-[#1E293B] mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-16 text-center max-w-2xl mx-auto flex flex-col items-center gap-6">
            <div className="bg-emerald-50 text-[#2E7D32] rounded-full p-6 animate-bounce">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Your Cart is Empty</h2>
              <p className="text-gray-500 text-sm">
                Add fresh grocery and organic products to your nest before checking out.
              </p>
            </div>
            <Link to="/shop">
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, idx) => (
                <div
                  key={`${item.product}-${JSON.stringify(item.selectedVariant)}`}
                  className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex gap-4 md:gap-6 items-center hover:shadow-md transition duration-200"
                >
                  <img
                    src={
                      item.image
                        ? item.image.startsWith("http")
                          ? item.image
                          : `https://dailynest-be.onrender.com${item.image}`
                        : "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60"
                    }
                    alt={item.name}
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl border border-gray-100 bg-gray-50"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-[#1E293B] truncate hover:text-[#2E7D32]">
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </h3>

                    {item.selectedVariant && (
                      <p className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-2 gap-y-1">
                        {Object.entries(item.selectedVariant).map(([k, v]) => (
                          <span key={k} className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                            <strong>{k}:</strong> {v}
                          </span>
                        ))}
                      </p>
                    )}

                    <div className="text-sm font-semibold text-gray-500 mt-2">
                      Rs. {item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity - 1, item.selectedVariant)}
                        className="p-2 hover:bg-gray-200 text-gray-600 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3.5 text-sm font-bold text-[#1E293B]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity + 1, item.selectedVariant)}
                        className="p-2 hover:bg-gray-200 text-gray-600 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product, item.selectedVariant)}
                      className="text-gray-400 hover:text-red-500 p-2 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#1E293B] mb-6">Order Summary</h2>

                <div className="space-y-4 border-b border-gray-100 pb-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#1E293B]">Rs. {itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span className="font-semibold text-[#1E293B]">Rs. {taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Charges</span>
                    <span className="font-semibold text-[#1E293B]">
                      {shippingPrice === 0 ? (
                        <span className="text-[#2E7D32] font-bold">FREE</span>
                      ) : (
                        `Rs. ${shippingPrice.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#2E7D32]">
                      <span className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        Discount
                      </span>
                      <span className="font-bold">- Rs. {discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-[#1E293B] font-black text-lg py-4">
                  <span>Grand Total</span>
                  <span className="text-[#2E7D32]">Rs. {totalPrice.toFixed(2)}</span>
                </div>

                <Button
                  onClick={() => navigate("/checkout")}
                  variant="primary"
                  className="w-full justify-between"
                  size="lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Coupon Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-[#1E293B] mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#2E7D32]" /> Apply Promo Coupon
                </h3>

                {coupon ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-[#2E7D32]">{coupon.code}</div>
                      <div className="text-gray-500 mt-0.5">Promo active and applied!</div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-1.5 hover:bg-emerald-100 rounded-lg text-emerald-800 transition"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="e.g. NESTNEW"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm uppercase focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                      />
                    </div>
                    <Button type="submit" variant="secondary" size="md" isLoading={loadingCoupon}>
                      Apply
                    </Button>
                  </form>
                )}
                {couponError && <p className="text-xs text-red-500 mt-2 font-medium">{couponError}</p>}
              </div>
            </div>
          </div>
        )}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Cart;
