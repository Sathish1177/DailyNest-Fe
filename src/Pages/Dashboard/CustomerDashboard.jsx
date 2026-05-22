import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, MapPin, ShoppingBag, Heart, LogOut, Eye, Plus, Trash2, Key, Mail, Phone, Edit, Check } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import Toast from "../../components/Toast";
import API from "../../utils/api";

const CustomerDashboard = () => {
  const { user, updateProfile, changePassword, addAddress, deleteAddress, logout } = useContext(AuthContext);
  const { wishlistItems, toggleWishlist } = useContext(CartContext);

  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [toast, setToast] = useState(null);

  // Profile fields state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || ""
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Change password fields state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [changingPass, setChangingPass] = useState(false);

  // Add Address State
  const [addressData, setAddressData] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    addressType: "Home"
  });
  const [addingAddr, setAddingAddr] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Load orders history
  useEffect(() => {
    if (activeTab === "orders") {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const { data } = await API.get("/orders/myorders");
          setOrders(data);
        } catch (err) {
          console.error("Failed to load orders history:", err.message);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    const result = await updateProfile(profileData);
    setUpdatingProfile(false);
    if (result.success) {
      setToast({ type: "success", message: "Profile details updated!" });
    } else {
      setToast({ type: "error", message: result.message || "Failed to update profile" });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ type: "error", message: "Passwords do not match." });
      return;
    }
    setChangingPass(true);
    const result = await changePassword(passwordData.oldPassword, passwordData.newPassword);
    setChangingPass(false);
    if (result.success) {
      setToast({ type: "success", message: "Password updated successfully!" });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      setToast({ type: "error", message: result.message || "Failed to change password" });
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddingAddr(true);
    const result = await addAddress(addressData);
    setAddingAddr(false);
    if (result.success) {
      setToast({ type: "success", message: "Address added successfully!" });
      setShowAddressForm(false);
      setAddressData({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        addressType: "Home"
      });
    } else {
      setToast({ type: "error", message: result.message || "Failed to add address." });
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      const result = await deleteAddress(addrId);
      if (result.success) {
        setToast({ type: "success", message: "Address deleted!" });
      } else {
        setToast({ type: "error", message: "Failed to delete address" });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Panel */}
      <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit space-y-6">
        <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
          <div className="w-20 h-20 bg-emerald-100 text-[#2E7D32] rounded-full flex items-center justify-center font-black text-3xl shadow-sm mb-4">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-bold text-[#1E293B] text-lg">{user?.name}</h2>
          <p className="text-xs text-gray-400 capitalize font-bold mt-1 bg-emerald-50 px-2 py-0.5 rounded text-[#2E7D32]">
            {user?.role} Account
          </p>
        </div>

        {/* Tab Links */}
        <nav className="flex flex-col gap-1.5">
          {[
            { id: "profile", label: "My Profile", icon: <User className="w-4.5 h-4.5" /> },
            { id: "orders", label: "Order History", icon: <ShoppingBag className="w-4.5 h-4.5" /> },
            { id: "addresses", label: "Addresses Management", icon: <MapPin className="w-4.5 h-4.5" /> },
            { id: "wishlist", label: "My Wishlist", icon: <Heart className="w-4.5 h-4.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-left transition ${
                activeTab === tab.id
                  ? "bg-emerald-50 text-[#2E7D32]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-left text-red-600 hover:bg-red-50 transition border-t border-gray-50 mt-4"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sign Out</span>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3 space-y-6">
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Account Details */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-[#1E293B] mb-6 flex items-center gap-2 border-b border-gray-50 pb-3">
                <Edit className="w-5 h-5 text-[#2E7D32]" /> Profile Details
              </h3>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <InputBox
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
                <InputBox
                  label="Email Address"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
                <InputBox
                  label="Mobile Number"
                  value={profileData.mobileNumber}
                  onChange={(e) => setProfileData({ ...profileData, mobileNumber: e.target.value })}
                  required
                  disabled // User primary key identifier
                />
                <Button type="submit" variant="primary" className="w-full" isLoading={updatingProfile}>
                  Update Profile
                </Button>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-[#1E293B] mb-6 flex items-center gap-2 border-b border-gray-50 pb-3">
                <Key className="w-5 h-5 text-[#2E7D32]" /> Change Password
              </h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <InputBox
                  label="Current Password"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  required
                />
                <InputBox
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
                <InputBox
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
                <Button type="submit" variant="secondary" className="w-full" isLoading={changingPass}>
                  Update Password
                </Button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#1E293B] mb-6 flex items-center gap-2 border-b border-gray-50 pb-3">
              <ShoppingBag className="w-5 h-5 text-[#2E7D32]" /> Order History
            </h3>

            {loadingOrders ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2E7D32]"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">You haven't placed any orders yet.</p>
                <Link to="/shop" className="mt-4 inline-block text-sm font-bold text-[#2E7D32] hover:underline">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Grand Total</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-semibold text-[#1E293B]">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-gray-50/50">
                        <td className="py-4 px-4 font-mono text-xs text-gray-500">{ord._id}</td>
                        <td className="py-4 px-4 text-xs">{new Date(ord.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-4">Rs. {ord.totalPrice.toFixed(2)}</td>
                        <td className="py-4 px-4 text-xs font-bold text-gray-600 uppercase">{ord.paymentMethod}</td>
                        <td className="py-4 px-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            ord.orderStatus === "Delivered"
                              ? "bg-emerald-50 text-[#2E7D32] border border-emerald-100"
                              : ord.orderStatus === "Pending"
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : ord.orderStatus === "Cancelled"
                              ? "bg-red-50 text-red-600 border border-red-100"
                              : "bg-blue-50 text-blue-600 border border-blue-100"
                          }`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link to={`/order-details/${ord._id}`}>
                            <button className="text-gray-400 hover:text-[#2E7D32] transition p-1.5 rounded-lg hover:bg-emerald-50">
                              <Eye className="w-4.5 h-4.5" />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-3">
              <h3 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2E7D32]" /> Saved Addresses
              </h3>
              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="text-xs font-bold text-[#2E7D32] hover:text-[#1E293B] transition flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Address
                </button>
              )}
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddressSubmit} className="space-y-4 border border-emerald-50 bg-emerald-50/20 p-5 rounded-2xl mb-6">
                <h4 className="font-bold text-sm text-[#2E7D32]">New Address Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputBox
                    label="Street Address"
                    placeholder="e.g. 123 Main St, Apartment 4B"
                    value={addressData.street}
                    onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                    required
                  />
                  <InputBox
                    label="City"
                    placeholder="e.g. Chennai"
                    value={addressData.city}
                    onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                    required
                  />
                  <InputBox
                    label="State"
                    placeholder="e.g. Tamil Nadu"
                    value={addressData.state}
                    onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                    required
                  />
                  <InputBox
                    label="Postal Code (PIN)"
                    placeholder="e.g. 600001"
                    value={addressData.postalCode}
                    onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })}
                    required
                  />
                  <InputBox
                    label="Country"
                    placeholder="Country"
                    value={addressData.country}
                    onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Type</label>
                    <div className="flex gap-4">
                      {["Home", "Work", "Other"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAddressData({ ...addressData, addressType: type })}
                          className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold border transition ${
                            addressData.addressType === type
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
                  <Button type="submit" variant="primary" size="sm" isLoading={addingAddr}>
                    Save Address
                  </Button>
                </div>
              </form>
            )}

            {user?.addresses && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="border border-gray-200 p-4.5 rounded-2xl bg-white relative flex justify-between items-start hover:border-gray-300 transition"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 capitalize">
                        {addr.addressType}
                      </span>
                      <p className="text-sm font-bold text-[#1E293B] mt-2">{addr.street}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{addr.country}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <p className="text-sm">No saved addresses yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "wishlist" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#1E293B] mb-6 flex items-center gap-2 border-b border-gray-50 pb-3">
              <Heart className="w-5 h-5 text-[#2E7D32]" /> My Wishlist
            </h3>

            {wishlistItems.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">Your wishlist is empty.</p>
                <Link to="/shop" className="mt-4 inline-block text-sm font-bold text-[#2E7D32] hover:underline">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {wishlistItems.map((prod) => (
                  <div
                    key={prod._id}
                    className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition bg-white flex flex-col justify-between"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      <img
                        src={
                          prod.images && prod.images[0]
                            ? prod.images[0].startsWith("http")
                              ? prod.images[0]
                              : `http://localhost:8000${prod.images[0]}`
                            : "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60"
                        }
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => toggleWishlist(prod)}
                        className="absolute top-3 right-3 bg-white text-red-500 rounded-full p-1.5 shadow hover:scale-115 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-[#1E293B] truncate hover:text-[#2E7D32]">
                          <Link to={`/product/${prod._id}`}>{prod.name}</Link>
                        </h4>
                        <div className="flex gap-2 items-center mt-2.5">
                          <span className="text-[#2E7D32] font-black text-sm">
                            Rs. {(prod.discountPrice || prod.price).toFixed(2)}
                          </span>
                          {prod.discountPrice && (
                            <span className="text-gray-400 line-through text-xs font-semibold">
                              Rs. {prod.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link to={`/product/${prod._id}`} className="block">
                          <Button variant="outline" className="w-full" size="sm">
                            View Product
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default CustomerDashboard;
