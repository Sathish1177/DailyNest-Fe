import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Store,
  Package,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Settings,
  Star,
  LogOut,
  Image,
  Tag,
  CheckCircle,
  Eye,
  AlertTriangle,
  MessageCircle,
  Share2
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import Toast from "../../components/Toast";
import Modal from "../../components/Modal";
import Logo from "../../components/Logo";
import API from "../../utils/api";

const StoreAdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("products"); // "products", "profile", "preview"
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Product Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    imageUrl: "",
    brand: ""
  });
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Store Profile states
  const [profileForm, setProfileForm] = useState({
    name: "",
    tagline: "",
    description: "",
    category: "",
    logo: "",
    banner: "",
    phone: "",
    whatsapp: "",
    city: "",
    addressLine1: ""
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchStoreData();
    fetchCategories();
  }, []);

  const fetchStoreData = async () => {
    setLoading(true);
    try {
      const { data: storeData } = await API.get("/stores/my-store");
      setStore(storeData);
      setProfileForm({
        name: storeData.name || "",
        tagline: storeData.tagline || "",
        description: storeData.description || "",
        category: storeData.category || "Grocery & Organic",
        logo: storeData.logo || "",
        banner: storeData.banner || "",
        phone: storeData.phone || "",
        whatsapp: storeData.socialLinks?.whatsapp || "",
        city: storeData.address?.city || "",
        addressLine1: storeData.address?.addressLine1 || ""
      });

      // Fetch products
      const { data: prods } = await API.get("/stores/my-store/products");
      setProducts(prods || []);
    } catch (err) {
      console.error("Failed to load store data:", err);
      setToast({ type: "error", message: err.response?.data?.message || "Failed to load store data" });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/categories");
      setCategories(data || []);
      if (data && data.length > 0 && !productForm.category) {
        setProductForm((prev) => ({ ...prev, category: data[0]._id }));
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      shortDescription: "",
      description: "",
      price: "",
      discountPrice: "",
      stock: "50",
      category: categories[0]?._id || "",
      imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80",
      brand: store?.name || ""
    });
    setShowProductModal(true);
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      shortDescription: prod.shortDescription || prod.name,
      description: prod.description || prod.name,
      price: prod.price,
      discountPrice: prod.discountPrice || "",
      stock: prod.stock,
      category: prod.category?._id || prod.category || categories[0]?._id || "",
      imageUrl: prod.images?.[0] || "",
      brand: prod.brand || store?.name || ""
    });
    setShowProductModal(true);
  };

  // Submit Product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.stock) {
      setToast({ type: "error", message: "Please fill in all required fields" });
      return;
    }

    setSubmittingProduct(true);
    try {
      const payload = {
        name: productForm.name,
        shortDescription: productForm.shortDescription || productForm.name,
        description: productForm.description || productForm.name,
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : undefined,
        stock: Number(productForm.stock),
        category: productForm.category,
        brand: productForm.brand || store?.name,
        images: [productForm.imageUrl]
      };

      if (editingProduct) {
        await API.put(`/stores/my-store/products/${editingProduct._id}`, payload);
        setToast({ type: "success", message: "Product updated successfully!" });
      } else {
        await API.post("/stores/my-store/products", payload);
        setToast({ type: "success", message: "Product created and published to your store!" });
      }

      setShowProductModal(false);
      // Refresh products list
      const { data: prods } = await API.get("/stores/my-store/products");
      setProducts(prods || []);
    } catch (err) {
      setToast({ type: "error", message: err.response?.data?.message || "Failed to save product" });
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product from your store?")) return;

    try {
      await API.delete(`/stores/my-store/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      setToast({ type: "success", message: "Product removed from store" });
    } catch (err) {
      setToast({ type: "error", message: err.response?.data?.message || "Failed to delete product" });
    }
  };

  // Save Store Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload = {
        name: profileForm.name,
        tagline: profileForm.tagline,
        description: profileForm.description,
        category: profileForm.category,
        logo: profileForm.logo,
        banner: profileForm.banner,
        phone: profileForm.phone,
        address: {
          city: profileForm.city,
          addressLine1: profileForm.addressLine1
        },
        socialLinks: {
          whatsapp: profileForm.whatsapp
        }
      };

      const { data } = await API.put("/stores/my-store", payload);
      setStore(data.store);
      setToast({ type: "success", message: "Store profile & branding updated successfully!" });
    } catch (err) {
      setToast({ type: "error", message: err.response?.data?.message || "Failed to update profile" });
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading your Store Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      {/* Top Navbar Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-gray-300">/</span>
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-[#2E7D32]" />
              <span className="font-bold text-slate-800 text-sm hidden sm:inline">{store?.name || "Store Portal"}</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                {store?.status || "LIVE"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {store?.slug && (
              <Link
                to={`/store/${store.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-[#2E7D32] border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition shadow-sm"
              >
                <Eye className="w-4 h-4" /> View Live Storefront
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}

            <button
              onClick={() => {
                logout();
                navigate("/adminlogin");
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-red-600 transition px-2.5 py-1.5"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Store Banner Hero - Clean Light Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <div
            className="h-36 sm:h-48 w-full bg-cover bg-center bg-slate-100"
            style={{ backgroundImage: `url(${store?.banner || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80"})` }}
          />
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-4">
                <img
                  src={store?.logo || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&auto=format&fit=crop&q=80"}
                  alt={store?.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-gray-100 shadow -mt-10 sm:-mt-14 bg-white"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
                    {store?.name}
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase">
                      Live Store
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">{store?.tagline}</p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>📍 {store?.address?.city || "Tamil Nadu"}</span>
                    <span>•</span>
                    <span className="text-amber-500 font-bold flex items-center gap-1">★ {store?.rating || "4.8"} Rating</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Products</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{products.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Stock</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {products.reduce((acc, p) => acc + (p.stock || 0), 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Store Rating</p>
            <p className="text-2xl font-black text-amber-500 mt-1">★ {store?.rating || "4.8"}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Storefront URL</p>
            <p className="text-xs font-mono font-semibold text-indigo-600 mt-2 truncate">
              /store/{store?.slug}
            </p>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-gray-200 mt-8 gap-6">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === "products"
                ? "border-[#2E7D32] text-[#2E7D32]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Package className="w-4 h-4" /> My Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === "profile"
                ? "border-[#2E7D32] text-[#2E7D32]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Settings className="w-4 h-4" /> Store Profile & Branding
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === "preview"
                ? "border-[#2E7D32] text-[#2E7D32]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Eye className="w-4 h-4" /> Live Storefront Preview
          </button>
        </div>

        {/* TAB 1: PRODUCTS LIST */}
        {activeTab === "products" && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">Products in Your Store</h2>
              <Button
                variant="primary"
                onClick={handleOpenAddModal}
                className="px-3.5 py-2 text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </Button>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">No products added yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Add your first product to display it both in your personal storefront and on the main DailyNest marketplace.
                </p>
                <Button
                  variant="primary"
                  onClick={handleOpenAddModal}
                  className="mt-4 px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Product Now
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-gray-200 text-slate-600 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Product</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Stock</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images?.[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100"}
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                              />
                              <div>
                                <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">SKU: {p.SKU}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-800">₹{p.price}</span>
                            {p.discountPrice && (
                              <span className="text-[10px] text-slate-400 line-through ml-1.5">
                                ₹{p.discountPrice}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold ${
                                p.stock > 10
                                  ? "bg-emerald-100 text-emerald-800"
                                  : p.stock > 0
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium">
                            {p.category?.name || "Grocery"}
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-emerald-50 text-[#2E7D32] border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                              Active
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p._id)}
                                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STORE PROFILE & BRANDING */}
        {activeTab === "profile" && (
          <div className="mt-6 max-w-4xl bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Customize Your Store Branding</h2>
            <p className="text-xs text-slate-500 mb-6">
              Update your store appearance, logo, header banner, and contact information.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputBox
                  label="Store Display Name *"
                  name="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />

                <InputBox
                  label="Tagline / Short Motto"
                  name="tagline"
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                />

                <InputBox
                  label="Logo Image URL"
                  name="logo"
                  value={profileForm.logo}
                  onChange={(e) => setProfileForm({ ...profileForm, logo: e.target.value })}
                  placeholder="https://..."
                />

                <InputBox
                  label="Hero Banner Image URL"
                  name="banner"
                  value={profileForm.banner}
                  onChange={(e) => setProfileForm({ ...profileForm, banner: e.target.value })}
                  placeholder="https://..."
                />

                <InputBox
                  label="Official Store Phone"
                  name="phone"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />

                <InputBox
                  label="WhatsApp Number for Customer Chats"
                  name="whatsapp"
                  value={profileForm.whatsapp}
                  onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                />

                <InputBox
                  label="City"
                  name="city"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                />

                <InputBox
                  label="Store Address"
                  name="addressLine1"
                  value={profileForm.addressLine1}
                  onChange={(e) => setProfileForm({ ...profileForm, addressLine1: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Store Story / Description
                </label>
                <textarea
                  rows="4"
                  value={profileForm.description}
                  onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-gray-200 rounded-lg p-3 text-sm text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={savingProfile}
                  className="px-6 py-2.5 text-sm font-bold"
                >
                  {savingProfile ? "Saving Changes..." : "Save Store Profile"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: LIVE STOREFRONT PREVIEW */}
        {activeTab === "preview" && (
          <div className="mt-6 max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Customer View Card</h3>
                <p className="text-xs text-slate-500">
                  This is how your store appears when customers visit your dedicated URL:
                </p>
              </div>
              <Link
                to={`/store/${store?.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#256428] transition shadow-md"
              >
                Open Full Storefront Page <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-md">
              <div
                className="h-40 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${store?.banner})` }}
              />
              <div className="p-6 bg-white relative">
                <img
                  src={store?.logo}
                  alt={store?.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow -mt-12 mb-3 bg-white"
                />
                <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  {store?.name}
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">{store?.tagline}</p>
                <p className="text-xs text-slate-600 mt-3">{store?.description}</p>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs font-medium text-slate-500">
                  <span>📍 {store?.address?.city || "Tamil Nadu"}</span>
                  <span>📦 {products.length} Products Available</span>
                  <span>★ {store?.rating} Verified Rating</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      <Modal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        title={editingProduct ? "Edit Store Product" : "Add New Product to Your Store"}
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <InputBox
            label="Product Name *"
            value={productForm.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
            placeholder="e.g. Cold Pressed Sesame Oil (1L)"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <InputBox
              label="Price (₹) *"
              type="number"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              placeholder="e.g. 350"
              required
            />

            <InputBox
              label="Original MRP / Discount (₹)"
              type="number"
              value={productForm.discountPrice}
              onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
              placeholder="e.g. 399"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputBox
              label="Stock Quantity *"
              type="number"
              value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
              placeholder="e.g. 50"
              required
            />

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Category *
              </label>
              <select
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="w-full bg-[#F8FAFC] border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <InputBox
            label="Image URL *"
            value={productForm.imageUrl}
            onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            required
          />

          <InputBox
            label="Short Description"
            value={productForm.shortDescription}
            onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
            placeholder="Brief 1-line description"
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowProductModal(false)}
              className="text-xs px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submittingProduct}
              className="text-xs px-5 font-bold"
            >
              {submittingProduct ? "Saving..." : editingProduct ? "Update Product" : "Publish to Store"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StoreAdminDashboard;

