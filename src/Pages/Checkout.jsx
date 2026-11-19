import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, CreditCard, QrCode, DollarSign, Plus, ArrowLeft, ShieldCheck, Check, Sparkles } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import Toast from "../components/Toast";
import API from "../utils/api";

const Checkout = () => {
  const { user, addAddress } = useContext(AuthContext);
  const { cartItems, coupon, getPricingSummary, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Address Form State
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    addressType: "Home"
  });

  // Mock Payment Card Form State
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  // UPI State
  const [upiId, setUpiId] = useState("");
  const [showMockGateway, setShowMockGateway] = useState(false);

  const { itemsPrice, taxPrice, shippingPrice, discount, totalPrice } = getPricingSummary();

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=checkout");
    } else if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [user, cartItems, navigate]);

  if (!user || cartItems.length === 0) {
    return null; // or loading
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.postalCode) {
      setToast({ type: "error", message: "Please fill out all required fields." });
      return;
    }
    const result = await addAddress(newAddress);
    if (result.success) {
      setToast({ type: "success", message: "Address added successfully!" });
      setShowAddressForm(false);
      setNewAddress({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        addressType: "Home"
      });
      // Select the newly added address (which goes to the end of user.addresses array)
      setSelectedAddressIndex(user.addresses.length);
    } else {
      setToast({ type: "error", message: result.message || "Failed to add address." });
    }
  };

  const handlePlaceOrder = async () => {
    if (user.addresses.length === 0) {
      setToast({ type: "error", message: "Please select or add a shipping address." });
      return;
    }

    const shippingAddress = user.addresses[selectedAddressIndex];
    
    if (paymentMethod === "COD") {
      submitOrder(shippingAddress, "COD", "COD-MOCK-" + Date.now());
    } else {
      // Trigger checkout gateway simulation overlay
      setShowMockGateway(true);
    }
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
      setToast({ type: "error", message: "Please fill in all card details." });
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowMockGateway(false);
      const shippingAddress = user.addresses[selectedAddressIndex];
      submitOrder(shippingAddress, paymentMethod, `TXN-${paymentMethod.toUpperCase()}-${Date.now()}`);
    }, 1500);
  };

  const handleUpiSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === "UPI" && !upiId.includes("@")) {
      setToast({ type: "error", message: "Please enter a valid UPI ID (e.g. user@okhdfcbank)." });
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowMockGateway(false);
      const shippingAddress = user.addresses[selectedAddressIndex];
      submitOrder(shippingAddress, "UPI", `TXN-UPI-${Date.now()}`);
    }, 1200);
  };

  const submitOrder = async (shippingAddress, method, txnId) => {
    setProcessing(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          selectedVariant: item.selectedVariant
        })),
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          addressType: shippingAddress.addressType
        },
        paymentMethod: method,
        couponCode: coupon ? coupon.code : undefined,
        transactionId: txnId
      };

      const { data } = await API.post("/orders", orderData);
      clearCart();
      setProcessing(false);
      navigate(`/order-success?orderId=${data._id}`);
    } catch (err) {
      setProcessing(false);
      setToast({ type: "error", message: err.response?.data?.message || "Order placement failed." });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Back Link */}
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#2E7D32] mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>

        <h1 className="text-3xl font-black text-[#1E293B] mb-8">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#2E7D32]" />
                  <span>Shipping Address</span>
                </h2>
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-xs font-bold text-[#2E7D32] hover:text-[#1E293B] transition flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add New
                  </button>
                )}
              </div>

              {showAddressForm ? (
                <form onSubmit={handleAddressSubmit} className="space-y-4 border border-emerald-50 bg-emerald-50/20 p-5 rounded-2xl">
                  <h3 className="font-bold text-sm text-[#2E7D32]">New Address Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputBox
                      label="Street Address"
                      placeholder="e.g. 123 Main St, Apartment 4B"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      required
                    />
                    <InputBox
                      label="City"
                      placeholder="e.g. Chennai"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      required
                    />
                    <InputBox
                      label="State"
                      placeholder="e.g. Tamil Nadu"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      required
                    />
                    <InputBox
                      label="Postal Code (PIN)"
                      placeholder="e.g. 600001"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      required
                    />
                    <InputBox
                      label="Country"
                      placeholder="Country"
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Type</label>
                      <div className="flex gap-4">
                        {["Home", "Work", "Other"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setNewAddress({ ...newAddress, addressType: type })}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold border transition ${
                              newAddress.addressType === type
                                ? "bg-[#2E7D32] border-[#2E7D32] text-white"
                                : "bg-white border-gray-200 text-[#1E293B] hover:bg-gray-50"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <Button variant="outline" size="sm" onClick={() => setShowAddressForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm">
                      Save & Use Address
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {user.addresses && user.addresses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.addresses.map((addr, idx) => (
                        <div
                          key={addr._id || idx}
                          onClick={() => setSelectedAddressIndex(idx)}
                          className={`relative border p-4.5 rounded-xl cursor-pointer transition ${
                            selectedAddressIndex === idx
                              ? "border-[#2E7D32] bg-emerald-50/20 ring-1 ring-[#2E7D32]"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 capitalize">
                              {addr.addressType}
                            </span>
                            {selectedAddressIndex === idx && (
                              <span className="bg-[#2E7D32] text-white rounded-full p-0.5">
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-[#1E293B]">{addr.street}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {addr.city}, {addr.state} - {addr.postalCode}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{addr.country}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      <p className="text-sm mb-4">No shipping addresses saved yet.</p>
                      <Button variant="primary" size="sm" onClick={() => setShowAddressForm(true)}>
                        Create Shipping Address
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#1E293B] mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#2E7D32]" />
                <span>Payment Method</span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: "Stripe", name: "Stripe Card", icon: <CreditCard className="w-5 h-5" /> },
                  { id: "Razorpay", name: "Razorpay", icon: <Sparkles className="w-5 h-5" /> },
                  { id: "UPI", name: "UPI Pay", icon: <QrCode className="w-5 h-5" /> },
                  { id: "COD", name: "Cash on Delivery", icon: <DollarSign className="w-5 h-5" /> }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl gap-2 transition hover:shadow-sm ${
                      paymentMethod === method.id
                        ? "border-[#2E7D32] bg-emerald-50/20 text-[#2E7D32] font-black"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {method.icon}
                    <span className="text-xs font-semibold">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#1E293B] mb-6">Order Details</h2>

              {/* Items preview list */}
              <div className="max-h-60 overflow-y-auto mb-6 space-y-4 pr-1 border-b border-gray-100 pb-4">
                {cartItems.map((item) => (
                  <div key={`${item.product}-${JSON.stringify(item.selectedVariant)}`} className="flex justify-between items-center text-xs gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={
                          item.image
                            ? item.image.startsWith("http")
                              ? item.image
                              : `https://dailynest-be.onrender.com${item.image}`
                            : "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60"
                        }
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded bg-gray-50 border border-gray-100"
                      />
                      <div className="truncate">
                        <p className="font-bold text-gray-800 truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-700">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
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
                    <span>Discount</span>
                    <span className="font-bold">- Rs. {discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-[#1E293B] font-black text-lg py-4">
                <span>Total to Pay</span>
                <span className="text-[#2E7D32]">Rs. {totalPrice.toFixed(2)}</span>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-xs text-gray-500 mb-6 flex gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2E7D32] shrink-0" />
                <span>All transactions are encrypted and processed securely. Our mock portal is ready for payment simulation.</span>
              </div>

              <Button
                onClick={handlePlaceOrder}
                variant="primary"
                className="w-full"
                size="lg"
                disabled={processing}
              >
                {paymentMethod === "COD" ? "Place Order" : `Pay Rs. ${totalPrice.toFixed(2)}`}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Mock Payment Gateway Modal Overlay */}
      {showMockGateway && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#1E293B] text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="font-black text-lg">DailyNest Checkout Portal</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Secure payment gateway simulator</p>
              </div>
              <span className="bg-[#2E7D32] text-white text-xs px-2.5 py-1 rounded-full font-bold">
                Rs. {totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Body */}
            <div className="p-6">
              {paymentMethod === "Stripe" || paymentMethod === "Razorpay" ? (
                <form onSubmit={handleCardSubmit} className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#2E7D32]" />
                    <span>Enter Card Information</span>
                  </h4>

                  <InputBox
                    label="Card Number"
                    placeholder="4111 2222 3333 4444"
                    maxLength="19"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    required
                  />

                  <InputBox
                    label="Cardholder Name"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <InputBox
                      label="Expiry Date"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      required
                    />
                    <InputBox
                      label="CVV / CVC"
                      type="password"
                      placeholder="123"
                      maxLength="3"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setShowMockGateway(false)}
                      disabled={processing}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={processing}
                    >
                      Confirm Payment
                    </Button>
                  </div>
                </form>
              ) : paymentMethod === "UPI" ? (
                <form onSubmit={handleUpiSubmit} className="space-y-5 text-center">
                  <div className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
                    <p className="text-xs font-bold text-gray-500 mb-3">SCAN THIS QR CODE WITH ANY UPI APP</p>
                    
                    {/* Simulated QR Code Visual */}
                    <div className="w-40 h-40 bg-white border border-gray-100 rounded-xl flex items-center justify-center relative p-2 shadow-inner">
                      <svg className="w-full h-full text-gray-800" viewBox="0 0 100 100">
                        {/* Standard QR-like pattern */}
                        <rect x="5" y="5" width="25" height="25" fill="currentColor" />
                        <rect x="10" y="10" width="15" height="15" fill="white" />
                        <rect x="70" y="5" width="25" height="25" fill="currentColor" />
                        <rect x="75" y="10" width="15" height="15" fill="white" />
                        <rect x="5" y="70" width="25" height="25" fill="currentColor" />
                        <rect x="10" y="75" width="15" height="15" fill="white" />
                        {/* Fake bits */}
                        <rect x="40" y="5" width="10" height="10" fill="currentColor" />
                        <rect x="40" y="25" width="20" height="10" fill="currentColor" />
                        <rect x="5" y="45" width="15" height="10" fill="currentColor" />
                        <rect x="30" y="45" width="40" height="40" fill="currentColor" />
                        <rect x="45" y="55" width="10" height="10" fill="white" />
                        <rect x="80" y="45" width="15" height="20" fill="currentColor" />
                      </svg>
                      {/* Logo in QR center */}
                      <div className="absolute bg-[#2E7D32] text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow">
                        DN
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">Merchant: DailyNest Essentials</p>
                  </div>

                  <div className="text-left">
                    <InputBox
                      label="Or enter UPI ID to request"
                      placeholder="e.g. sathish@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setShowMockGateway(false)}
                      disabled={processing}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={processing}
                    >
                      Confirm Payment
                    </Button>
                  </div>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      )}

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

export default Checkout;
