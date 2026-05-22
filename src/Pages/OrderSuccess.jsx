import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, ShoppingBag, Eye, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "MOCK-ORDER-123456";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow max-w-2xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        {/* Animated Green Check Ring */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-75"></div>
          <div className="relative bg-[#2E7D32] text-white rounded-full p-6 shadow-lg">
            <CheckCircle className="w-16 h-16" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-[#1E293B] mb-3">Order Placed Successfully!</h1>
        <p className="text-gray-500 text-sm max-w-md mb-8">
          Thank you for shopping with DailyNest. Your fresh essentials are being packed with care and will be dispatched shortly.
        </p>

        {/* Info Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 w-full shadow-sm text-left mb-8 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 font-semibold">Order ID</span>
            <span className="font-mono font-bold text-[#1E293B] select-all bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
              {orderId}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 font-semibold">Status</span>
            <span className="font-bold text-[#2E7D32] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase text-xs">
              Processing
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 font-semibold">Estimated Delivery</span>
            <span className="font-bold text-[#1E293B]">Within 24 Hours</span>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link to={`/order-details/${orderId}`} className="flex-1 sm:flex-none">
            <Button variant="secondary" className="w-full gap-2" size="md">
              <Eye className="w-4 h-4" /> Track Order Status
            </Button>
          </Link>
          <Link to="/shop" className="flex-1 sm:flex-none">
            <Button variant="primary" className="w-full gap-2" size="md">
              <ShoppingBag className="w-4 h-4" /> Continue Shopping <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
