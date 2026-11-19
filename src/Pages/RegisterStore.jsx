import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import Toast from "../components/Toast";
import API from "../utils/api";

const RegisterStore = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    storeName: "",
    category: "Grocery & Organic",
    tagline: "",
    description: "",
    city: "",
    addressLine1: "",
    phone: "",
    whatsapp: "",
    ownerName: "",
    mobileNumber: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.storeName || !formData.ownerName || !formData.mobileNumber || !formData.password) {
      setToast({ type: "error", message: "Please fill in all required fields" });
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/stores/register", formData);
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (setUser) setUser(data.user);

        setToast({ type: "success", message: "Store registered successfully! Opening your dashboard..." });
        setTimeout(() => {
          navigate("/store-dashboard");
        }, 1200);
      }
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Failed to register store. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar />

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      {/* Light Clean Header Section */}
      <div className="bg-white border-b border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] mb-3">
            DailyNest Store Partner Program
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E293B] tracking-tight mb-3">
            Start Selling & Get Your <span className="text-[#2E7D32]">Own Branded Store</span> Page!
          </h1>
          <p className="text-slate-600 text-base leading-relaxed max-w-3xl">
            Sell your products to DailyNest shoppers while having your very own dedicated storefront URL (e.g. <span className="font-mono text-xs bg-slate-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">/store/your-shop</span>) to share directly with your customers on WhatsApp & Instagram.
          </p>

          {/* Quick Perks - Light Clean Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-gray-100">
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
      </div>

      {/* Main Registration Form */}
      <div className="max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10">
          <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-800">
                Register Your Store
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your shop details and owner account information to create your partner portal.
              </p>
            </div>
            <Link
              to="/adminlogin"
              className="text-xs font-bold text-[#2E7D32] hover:underline"
            >
              Already registered? Login here
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Store Information */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                1. Store Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputBox
                  label="Store / Shop Name *"
                  name="storeName"
                  placeholder="e.g. Sri Murugan Store"
                  required
                  value={formData.storeName}
                  onChange={handleChange}
                />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Primary Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
                  >
                    <option value="Grocery & Organic">Grocery & Organic Essentials</option>
                    <option value="Fresh Fruits & Vegetables">Fresh Fruits & Vegetables</option>
                    <option value="Dairy, Bakery & Sweets">Dairy, Bakery & Sweets</option>
                    <option value="Spices & Traditional Oils">Spices & Traditional Oils</option>
                    <option value="Snacks & Beverages">Snacks & Beverages</option>
                    <option value="Home & Personal Care">Home & Personal Care</option>
                  </select>
                </div>

                <InputBox
                  label="Tagline / Short Hook"
                  name="tagline"
                  placeholder="e.g. 100% Farm Fresh Veggies & Pure Cold-Pressed Oils"
                  value={formData.tagline}
                  onChange={handleChange}
                />

                <InputBox
                  label="City / Town *"
                  name="city"
                  placeholder="e.g. Erode / Coimbatore / Chennai"
                  required
                  value={formData.city}
                  onChange={handleChange}
                />

                <div className="sm:col-span-2">
                  <InputBox
                    label="Store Address"
                    name="addressLine1"
                    placeholder="e.g. 14/2 Main Bazaar Street"
                    value={formData.addressLine1}
                    onChange={handleChange}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Store Story / About Your Products
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Tell your customers what makes your store special, your quality promises..."
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-lg p-3 text-sm text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Owner & Login Credentials */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                2. Store Owner Login Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputBox
                  label="Owner / Contact Person Name *"
                  name="ownerName"
                  placeholder="e.g. Sathish Kumar"
                  required
                  value={formData.ownerName}
                  onChange={handleChange}
                />

                <InputBox
                  label="Mobile Number (Login ID) *"
                  name="mobileNumber"
                  type="text"
                  placeholder="e.g. 9025585770"
                  required
                  value={formData.mobileNumber}
                  onChange={handleChange}
                />

                <InputBox
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="e.g. yourstore@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />

                <InputBox
                  label="Password *"
                  name="password"
                  type="password"
                  placeholder="Create strong password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />

                <InputBox
                  label="WhatsApp Number for Customer Enquiries"
                  name="whatsapp"
                  type="text"
                  placeholder="e.g. 9025585770"
                  value={formData.whatsapp}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                By registering, you agree to DailyNest's Partner Terms of Service and Merchant Guidelines.
              </p>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 text-sm font-bold"
              >
                {loading ? "Registering Store..." : "Create My Store & Launch"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterStore;
