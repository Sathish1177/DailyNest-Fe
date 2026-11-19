import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  ShoppingBag,
  FolderOpen,
  Tag,
  MessageSquare,
  Image as ImageIcon,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  Package,
  Layers,
  ChevronDown
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import SelectBox from "../../components/SelectBox";
import Toast from "../../components/Toast";
import Modal from "../../components/Modal";
import API, { getImageUrl } from "../../utils/api";

const COLORS = ["#2E7D32", "#1E293B", "#F59E0B", "#EF4444", "#3B82F6"];

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast] = useState(null);

  // General States
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Products CRUD States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productAction, setProductAction] = useState("list"); // "list" | "add" | "edit"
  const [editingProduct, setEditingProduct] = useState(null);
  const [productData, setProductData] = useState({
    name: "",
    SKU: "",
    price: "",
    discountPrice: "",
    stock: "",
    description: "",
    shortDescription: "",
    category: "",
    subcategory: "",
    tags: "",
    isFeatured: false,
    isTrending: false,
    isBestSeller: false,
    isComingSoon: false,
    isActive: true,
    origin: "",
    shelfLife: "",
    dimensions: "",
    warranty: "",
    weight: ""
  });
  const [productImages, setProductImages] = useState([]);

  // Category Catalog States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryData, setCategoryData] = useState({ name: "", description: "" });
  const [categoryImage, setCategoryImage] = useState(null);

  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [subcategoryData, setSubcategoryData] = useState({ name: "", description: "", mainCategory: "" });

  // Orders Management States
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState("");
  const [orderTrackingNumber, setOrderTrackingNumber] = useState("");

  // Coupons States
  const [coupons, setCoupons] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponData, setCouponData] = useState({
    code: "",
    discountType: "Percentage",
    discountValue: "",
    minPurchase: "",
    maxDiscount: "",
    expiryDate: "",
    usageLimit: ""
  });

  // Banners States
  const [banners, setBanners] = useState([]);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [bannerData, setBannerData] = useState({ title: "", description: "", link: "", type: "Hero", order: 0 });
  const [bannerImage, setBannerImage] = useState(null);

  // Reviews States
  const [reviews, setReviews] = useState([]);

  // Fetch stats & general initial lists
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const { data } = await API.get("/dashboard/stats");
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard statistics:", err.message);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Sync category, products, orders, coupons, reviews, banners on tab switch
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "products") {
          const prodRes = await API.get("/products?limit=100");
          setProducts(prodRes.data.products || []);
          const catRes = await API.get("/categories");
          setCategories(catRes.data || []);
          const subRes = await API.get("/categories/subcategories");
          setSubcategories(subRes.data || []);
        } else if (activeTab === "categories") {
          const catRes = await API.get("/categories");
          setCategories(catRes.data || []);
          const subRes = await API.get("/categories/subcategories");
          setSubcategories(subRes.data || []);
        } else if (activeTab === "orders") {
          const ordRes = await API.get("/orders");
          setOrders(ordRes.data || []);
        } else if (activeTab === "coupons") {
          const coupRes = await API.get("/coupons");
          setCoupons(coupRes.data || []);
        } else if (activeTab === "banners") {
          const banRes = await API.get("/banners");
          setBanners(banRes.data || []);
        } else if (activeTab === "reviews") {
          const revRes = await API.get("/reviews");
          setReviews(revRes.data || []);
        }
      } catch (err) {
        console.error(`Failed to fetch data for tab ${activeTab}:`, err.message);
      }
    };
    fetchData();
  }, [activeTab]);

  // Product Operations
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });
    if (productImages.length > 0) {
      for (const img of productImages) {
        formData.append("images", img);
      }
    }

    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setToast({ type: "success", message: "Product updated successfully!" });
      } else {
        await API.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setToast({ type: "success", message: "Product added successfully!" });
      }
      setProductAction("list");
      setEditingProduct(null);
      setProductImages([]);
      const prodRes = await API.get("/products?limit=100");
      setProducts(prodRes.data.products || []);
    } catch (err) {
      setToast({ type: "error", message: err.response?.data?.message || "Failed to save product." });
    }
  };

  const handleProductEditClick = (prod) => {
    setEditingProduct(prod);
    setProductData({
      name: prod.name,
      SKU: prod.SKU,
      price: prod.price,
      discountPrice: prod.discountPrice || "",
      stock: prod.stock,
      description: prod.description,
      shortDescription: prod.shortDescription || "",
      category: prod.category?._id || prod.category || "",
      subcategory: prod.subcategory?._id || prod.subcategory || "",
      tags: prod.tags ? prod.tags.join(", ") : "",
      isFeatured: prod.isFeatured || false,
      isTrending: prod.isTrending || false,
      isBestSeller: prod.isBestSeller || false,
      isComingSoon: prod.isComingSoon || false,
      isActive: prod.isActive ?? true,
      origin: prod.origin || "",
      shelfLife: prod.shelfLife || "",
      dimensions: prod.dimensions || "",
      warranty: prod.warranty || "",
      weight: prod.weight || "",
      modelNumber: prod.modelNumber || "",
      warrantyPeriod: prod.warrantyPeriod || "",
      material: prod.material || "",
      gender: prod.gender || "",
      capacity: prod.capacity || "",
      skinType: prod.skinType || "",
      ingredients: prod.ingredients || "",
      volume: prod.volume || ""
    });
    setProductAction("edit");
  };

  const handleProductDelete = async (prodId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/products/${prodId}`);
        setToast({ type: "success", message: "Product deleted successfully!" });
        setProducts(products.filter((p) => p._id !== prodId));
      } catch (err) {
        setToast({ type: "error", message: "Failed to delete product." });
      }
    }
  };

  // Category & Subcategory Operations
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("description", categoryData.description);
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    try {
      if (editingCategory) {
        await API.put(`/categories/${editingCategory._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setToast({ type: "success", message: "Category updated!" });
      } else {
        await API.post("/categories", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setToast({ type: "success", message: "Category added!" });
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryImage(null);
      const catRes = await API.get("/categories");
      setCategories(catRes.data || []);
    } catch (err) {
      setToast({ type: "error", message: "Failed to save category." });
    }
  };

  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubcategory) {
        await API.put(`/categories/subcategory/${editingSubcategory._id}`, subcategoryData);
        setToast({ type: "success", message: "Subcategory updated!" });
      } else {
        await API.post("/categories/subcategory", subcategoryData);
        setToast({ type: "success", message: "Subcategory added!" });
      }
      setShowSubcategoryModal(false);
      setEditingSubcategory(null);
      const subRes = await API.get("/categories/subcategories");
      setSubcategories(subRes.data || []);
    } catch (err) {
      setToast({ type: "error", message: "Failed to save subcategory." });
    }
  };

  // Orders Management Operations
  const handleOrderStatusUpdate = async () => {
    try {
      await API.put(`/orders/${selectedOrder._id}/status`, {
        orderStatus: updatingOrderStatus,
        trackingNumber: orderTrackingNumber
      });
      setToast({ type: "success", message: "Order updated successfully!" });
      setShowOrderModal(false);
      const ordRes = await API.get("/orders");
      setOrders(ordRes.data || []);
    } catch (err) {
      setToast({ type: "error", message: "Failed to update order status." });
    }
  };

  const handleReturnManage = async (orderId, status) => {
    if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this return request?`)) {
      try {
        await API.put(`/orders/${orderId}/return-manage`, { status });
        setToast({ type: "success", message: `Return request ${status}!` });
        setShowOrderModal(false);
        const ordRes = await API.get("/orders");
        setOrders(ordRes.data || []);
      } catch (err) {
        setToast({ type: "error", message: "Failed to manage return request." });
      }
    }
  };

  // Coupons Operations
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/coupons", couponData);
      setToast({ type: "success", message: "Coupon created successfully!" });
      setShowCouponModal(false);
      setCouponData({
        code: "",
        discountType: "Percentage",
        discountValue: "",
        minPurchase: "",
        maxDiscount: "",
        expiryDate: "",
        usageLimit: ""
      });
      const coupRes = await API.get("/coupons");
      setCoupons(coupRes.data || []);
    } catch (err) {
      setToast({ type: "error", message: "Failed to create coupon." });
    }
  };

  const handleCouponDelete = async (id) => {
    if (window.confirm("Delete this coupon?")) {
      try {
        await API.delete(`/coupons/${id}`);
        setToast({ type: "success", message: "Coupon deleted!" });
        setCoupons(coupons.filter((c) => c._id !== id));
      } catch (err) {
        setToast({ type: "error", message: "Failed to delete coupon." });
      }
    }
  };

  // Banner Operations
  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(bannerData).forEach((k) => formData.append(k, bannerData[k]));
    if (bannerImage) {
      formData.append("image", bannerImage);
    }

    try {
      await API.post("/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setToast({ type: "success", message: "Banner uploaded successfully!" });
      setShowBannerModal(false);
      setBannerImage(null);
      setBannerData({ title: "", description: "", link: "", type: "Hero", order: 0 });
      const banRes = await API.get("/banners");
      setBanners(banRes.data || []);
    } catch (err) {
      setToast({ type: "error", message: "Failed to upload banner." });
    }
  };

  // Reviews operations
  const handleReviewApprove = async (revId) => {
    try {
      await API.put(`/reviews/${revId}/approve`);
      setToast({ type: "success", message: "Review approved!" });
      setReviews(reviews.map((r) => (r._id === revId ? { ...r, isApproved: true } : r)));
    } catch (err) {
      setToast({ type: "error", message: "Failed to approve review." });
    }
  };

  const handleReviewDelete = async (revId) => {
    if (window.confirm("Delete this review?")) {
      try {
        await API.delete(`/reviews/${revId}`);
        setToast({ type: "success", message: "Review deleted!" });
        setReviews(reviews.filter((r) => r._id !== revId));
      } catch (err) {
        setToast({ type: "error", message: "Failed to delete review." });
      }
    }
  };

  // Prepare Chart Data
  const revenueChartData = stats?.monthlyRevenue && stats.monthlyRevenue.length > 0
    ? stats.monthlyRevenue.map((item) => ({
        name: `${item._id.month}/${item._id.year}`,
        sales: item.revenue
      })).reverse()
    : [
        { name: "Jan", sales: 4000 },
        { name: "Feb", sales: 6500 },
        { name: "Mar", sales: 9000 },
        { name: "Apr", sales: 12000 }
      ];

  const pieChartData = stats?.orderStatusBreakdown && stats.orderStatusBreakdown.length > 0
    ? stats.orderStatusBreakdown.map((item) => ({
        name: item._id,
        value: item.count
      }))
    : [{ name: "Delivered", value: 10 }, { name: "Processing", value: 5 }];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Sidebar navigation */}
      <div className="lg:col-span-1 bg-[#1E293B] text-white rounded-3xl p-6 shadow-sm h-fit space-y-6">
        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-800">
          <span className="bg-[#2E7D32] text-white font-black px-3.5 py-2 rounded-xl text-lg tracking-wider mb-3">
            DN
          </span>
          <h2 className="font-bold text-base truncate max-w-full">Nest Control Room</h2>
          <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase mt-0.5">Admin Desk</p>
        </div>

        <nav className="flex flex-col gap-1">
          {[
            { id: "overview", label: "Dashboard Hub", icon: <TrendingUp className="w-4.5 h-4.5" /> },
            { id: "products", label: "Products CRUD", icon: <Package className="w-4.5 h-4.5" /> },
            { id: "categories", label: "Category Catalogs", icon: <Layers className="w-4.5 h-4.5" /> },
            { id: "orders", label: "Orders Hub", icon: <ShoppingBag className="w-4.5 h-4.5 text-[#F59E0B]" /> },
            { id: "coupons", label: "Coupons Promo", icon: <Tag className="w-4.5 h-4.5" /> },
            { id: "banners", label: "Hero Banners", icon: <ImageIcon className="w-4.5 h-4.5" /> },
            { id: "reviews", label: "Review Checks", icon: <MessageSquare className="w-4.5 h-4.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold text-left transition ${
                activeTab === tab.id
                  ? "bg-[#2E7D32] text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold text-left text-red-400 hover:bg-red-950/30 transition border-t border-slate-800 mt-4"
          >
            Sign Out
          </button>
        </nav>
      </div>

      {/* Main Admin Desk Content */}
      <div className="lg:col-span-4 space-y-8">
        {activeTab === "overview" && (
          loadingStats ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E7D32]"></div>
            </div>
          ) : (
            <div className="space-y-8">
            {/* Quick Aggregate Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Total Income", val: `Rs. ${stats?.totalSales?.toFixed(2) || "0.00"}`, bg: "bg-emerald-50 text-[#2E7D32] border border-emerald-100" },
                { title: "Total Bookings", val: stats?.totalOrders || 0, bg: "bg-slate-50 text-[#1E293B] border border-slate-100" },
                { title: "Total Products", val: stats?.totalProducts || 0, bg: "bg-amber-50 text-[#B45309] border border-amber-100" },
                { title: "Nesting Customers", val: stats?.totalCustomers || 0, bg: "bg-blue-50 text-blue-800 border border-blue-100" }
              ].map((card, idx) => (
                <div key={idx} className={`${card.bg} rounded-3xl p-6 shadow-sm flex flex-col justify-between`}>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{card.title}</span>
                  <span className="text-2xl font-black">{card.val}</span>
                </div>
              ))}
            </div>

            {/* Recharts Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 text-sm mb-6 uppercase tracking-wider">Revenue Stream Monthly</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="sales" stroke="#2E7D32" fill="#E8F5E9" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <h3 className="font-bold text-gray-700 text-sm mb-4 uppercase tracking-wider">Order Status Distribution</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieChartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-xs mt-4">
                  {pieChartData.map((entry, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 font-bold text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                      {entry.name} ({entry.value})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Alerts & Recents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Low Stock Alerts */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 text-sm mb-4 uppercase tracking-wider flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" /> Low Stock Alerts
                </h3>
                {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {stats.lowStockProducts.map((p) => (
                      <div key={p._id} className="py-3 flex justify-between text-xs font-bold text-[#1E293B]">
                        <span>{p.name} (SKU: {p.SKU})</span>
                        <span className="text-red-600">Only {p.stock} left</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 py-4">All products have healthy stock counts.</p>
                )}
              </div>

              {/* Recent Orders List */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#2E7D32]" /> Recent Orders
                </h3>
                {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                  <div className="divide-y divide-gray-50 text-xs">
                    {stats.recentOrders.map((ord) => (
                      <div key={ord._id} className="py-3 flex justify-between items-center font-bold text-[#1E293B]">
                        <div>
                          <p className="truncate font-semibold max-w-[150px]">{ord.user?.name || "Customer"}</p>
                          <p className="text-[10px] text-gray-400">{new Date(ord.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="text-emerald-700">Rs. {ord.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 py-4">No recent bookings recorded.</p>
                )}
              </div>
            </div>
          </div>
        )
      )}

        {/* Product Management Section */}
        {activeTab === "products" && (
          productAction === "list" ? (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
                <h3 className="text-lg font-bold text-[#1E293B]">Manage Store Products</h3>
                <Button onClick={() => {
                  setEditingProduct(null);
                  setProductData({
                    name: "", SKU: "", price: "", discountPrice: "", stock: "", description: "",
                    shortDescription: "", category: "", subcategory: "", tags: "",
                    isFeatured: false, isTrending: false, isBestSeller: false, isComingSoon: false, isActive: true,
                    origin: "", shelfLife: "", dimensions: "", warranty: "", weight: "",
                    modelNumber: "", warrantyPeriod: "", material: "", gender: "", capacity: "", skinType: "", ingredients: "", volume: ""
                  });
                  setProductAction("add");
                }} variant="primary" size="sm" className="gap-1">
                  <Plus className="w-4 h-4" /> Add Product
                </Button>
              </div>

              {/* List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold">
                      <th className="p-3">Product Name</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Base Price</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Featured / Soon</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-semibold text-[#1E293B]">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50/50">
                        <td className="p-3 flex items-center gap-2">
                          <img
                            src={getImageUrl(p.images?.[0], "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60")}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded border border-gray-100 bg-gray-50"
                          />
                          <span className="truncate max-w-[120px] font-bold">{p.name}</span>
                        </td>
                        <td className="p-3 font-mono text-gray-500">{p.SKU}</td>
                        <td className="p-3">Rs. {p.price.toFixed(2)}</td>
                        <td className="p-3 text-emerald-700">{p.discountPrice ? `Rs. ${p.discountPrice.toFixed(2)}` : "-"}</td>
                        <td className={`p-3 font-bold ${p.stock <= 5 ? "text-red-500" : "text-gray-700"}`}>{p.stock} units</td>
                        <td className="p-3 text-[10px] space-x-1">
                          {p.isFeatured && <span className="bg-emerald-50 text-[#2E7D32] px-1.5 py-0.5 rounded font-bold">Featured</span>}
                          {p.isComingSoon && <span className="bg-amber-50 text-[#B45309] px-1.5 py-0.5 rounded font-bold">Soon</span>}
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button onClick={() => handleProductEditClick(p)} className="p-1 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleProductDelete(p._id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-150">
                <div>
                  <h3 className="text-xl font-black text-[#1E293B]">{productAction === "edit" ? "Edit Nest Product" : "Add Nest Product"}</h3>
                  <p className="text-gray-500 text-xs mt-1">Fill in the fields below to customize the catalog listing.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setProductAction("list")}>
                  ← Back to Products List
                </Button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputBox label="Product Name" value={productData.name} onChange={(e) => setProductData({ ...productData, name: e.target.value })} required />
                  <InputBox label="SKU Code" value={productData.SKU} onChange={(e) => setProductData({ ...productData, SKU: e.target.value })} required />
                  <InputBox label="Price (Rs.)" type="number" value={productData.price} onChange={(e) => setProductData({ ...productData, price: e.target.value })} required />
                  <InputBox label="Discount Price (Rs.)" type="number" value={productData.discountPrice} onChange={(e) => setProductData({ ...productData, discountPrice: e.target.value })} />
                  <InputBox label="Stock Inventory" type="number" value={productData.stock} onChange={(e) => setProductData({ ...productData, stock: e.target.value })} required />
                  <InputBox label="Comma Tags (e.g. organic, fresh)" value={productData.tags} onChange={(e) => setProductData({ ...productData, tags: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectBox
                    label="Main Category"
                    placeholder="Choose Main Category"
                    value={productData.category}
                    onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                    options={categories.map((c) => ({ value: c._id, label: c.name }))}
                    required
                  />
                  <SelectBox
                    label="Subcategory"
                    placeholder="Choose Subcategory"
                    value={productData.subcategory}
                    onChange={(e) => setProductData({ ...productData, subcategory: e.target.value })}
                    options={subcategories.filter((s) => s.mainCategory?._id === productData.category).map((s) => ({ value: s._id, label: s.name }))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">Short Description</label>
                  <textarea
                    value={productData.shortDescription}
                    onChange={(e) => setProductData({ ...productData, shortDescription: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                    rows="2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">Detailed Description</label>
                  <textarea
                    value={productData.description}
                    onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                    rows="4"
                    required
                  />
                </div>

                {/* Custom Specifications Grid based on Category */}
                <div className="border-t border-gray-150 pt-6">
                  {(() => {
                    const selectedCategoryObj = categories.find((c) => c._id === productData.category);
                    const categoryName = selectedCategoryObj ? selectedCategoryObj.name.toLowerCase() : "";
                    
                    if (categoryName.includes("elect")) {
                      return (
                        <div>
                          <h4 className="text-xs font-bold text-[#2E7D32] uppercase tracking-wide mb-4">🔧 Electronics Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputBox label="Model Number" value={productData.modelNumber} onChange={(e) => setProductData({ ...productData, modelNumber: e.target.value })} />
                            <InputBox label="Warranty Period (e.g. 1 Year)" value={productData.warrantyPeriod} onChange={(e) => setProductData({ ...productData, warrantyPeriod: e.target.value })} />
                          </div>
                        </div>
                      );
                    } else if (categoryName.includes("fash") || categoryName.includes("cloth")) {
                      return (
                        <div>
                          <h4 className="text-xs font-bold text-[#2E7D32] uppercase tracking-wide mb-4">👕 Fashion Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-xs font-bold text-gray-700">Gender Target</label>
                              <select
                                value={productData.gender}
                                onChange={(e) => setProductData({ ...productData, gender: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none bg-white h-10"
                              >
                                <option value="">Select Gender</option>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Unisex">Unisex</option>
                                <option value="Kids">Kids</option>
                              </select>
                            </div>
                            <InputBox label="Material (e.g. Cotton, Leather)" value={productData.material} onChange={(e) => setProductData({ ...productData, material: e.target.value })} />
                          </div>
                        </div>
                      );
                    } else if (categoryName.includes("home") || categoryName.includes("kitchen")) {
                      return (
                        <div>
                          <h4 className="text-xs font-bold text-[#2E7D32] uppercase tracking-wide mb-4">🏠 Home & Kitchen Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputBox label="Material / Composition" value={productData.material} onChange={(e) => setProductData({ ...productData, material: e.target.value })} />
                            <InputBox label="Capacity (e.g. 5 Litres, 1200W)" value={productData.capacity} onChange={(e) => setProductData({ ...productData, capacity: e.target.value })} />
                          </div>
                        </div>
                      );
                    } else if (categoryName.includes("beauty") || categoryName.includes("care") || categoryName.includes("cosmetic")) {
                      return (
                        <div>
                          <h4 className="text-xs font-bold text-[#2E7D32] uppercase tracking-wide mb-4">💄 Beauty & Personal Care Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputBox label="Skin Type Target (e.g. All, Dry)" value={productData.skinType} onChange={(e) => setProductData({ ...productData, skinType: e.target.value })} />
                            <InputBox label="Volume / Size (e.g. 100ml, 50g)" value={productData.volume} onChange={(e) => setProductData({ ...productData, volume: e.target.value })} />
                            <div className="md:col-span-2 space-y-1">
                              <label className="block text-xs font-bold text-gray-700">Ingredients List</label>
                              <textarea
                                value={productData.ingredients}
                                onChange={(e) => setProductData({ ...productData, ingredients: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                                rows="2"
                                placeholder="List key ingredients..."
                              />
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          <h4 className="text-xs font-bold text-[#2E7D32] uppercase tracking-wide mb-4">📦 General Specifications</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputBox label="Product Weight / Unit (e.g. 500g, 1L)" value={productData.weight} onChange={(e) => setProductData({ ...productData, weight: e.target.value })} />
                            <InputBox label="Country of Origin / Source" value={productData.origin} onChange={(e) => setProductData({ ...productData, origin: e.target.value })} />
                            <InputBox label="Shelf Life / Expiry Info" value={productData.shelfLife} onChange={(e) => setProductData({ ...productData, shelfLife: e.target.value })} />
                            <InputBox label="Dimensions (e.g. 10x10x5 cm)" value={productData.dimensions} onChange={(e) => setProductData({ ...productData, dimensions: e.target.value })} />
                            <InputBox label="Warranty Description" value={productData.warranty} onChange={(e) => setProductData({ ...productData, warranty: e.target.value })} />
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-4 text-xs font-bold pt-4 border-t border-gray-100">
                  {["isFeatured", "isTrending", "isBestSeller", "isComingSoon"].map((flag) => (
                    <label key={flag} className="flex items-center gap-1.5 capitalize text-gray-600">
                      <input
                        type="checkbox"
                        checked={productData[flag]}
                        onChange={(e) => setProductData({ ...productData, [flag]: e.target.checked })}
                        className="w-4 h-4 text-[#2E7D32]"
                      />
                      {flag.replace("is", "").replace(/([A-Z])/g, " $1").trim()}
                    </label>
                  ))}
                </div>

                {/* Upload File */}
                <div className="space-y-1 pt-4 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-700">Upload Product Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setProductImages(Array.from(e.target.files))}
                    className="w-full text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button variant="outline" size="sm" onClick={() => setProductAction("list")}>Cancel</Button>
                  <Button type="submit" variant="primary" size="sm">Save Product</Button>
                </div>
              </form>
            </div>
          )
        )}

        {/* Categories Catalog Manager Tab */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Categories */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-50">
                <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wider">Main Categories</h3>
                <Button onClick={() => {
                  setEditingCategory(null);
                  setCategoryData({ name: "", description: "" });
                  setShowCategoryModal(true);
                }} variant="primary" size="sm">
                  Add Category
                </Button>
              </div>
              <div className="divide-y divide-gray-50 text-xs">
                {categories.map((cat) => (
                  <div key={cat._id} className="py-3.5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={getImageUrl(cat.image)}
                        alt={cat.name}
                        className="w-8 h-8 rounded-lg object-cover bg-gray-50 border border-gray-100"
                      />
                      <span className="font-bold text-gray-800">{cat.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 italic truncate max-w-[120px]">{cat.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subcategories */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-50">
                <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wider">Subcategories</h3>
                <Button onClick={() => {
                  setEditingSubcategory(null);
                  setSubcategoryData({ name: "", description: "", mainCategory: categories[0]?._id || "" });
                  setShowSubcategoryModal(true);
                }} variant="secondary" size="sm">
                  Add Subcategory
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {subcategories.map((sub) => (
                  <div key={sub._id} className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-sm transition-all duration-200">
                    <div>
                      <p className="font-bold text-[#1E293B] text-sm">{sub.name}</p>
                      <p className="text-[10px] text-[#2E7D32] font-semibold mt-0.5">Parent: {sub.mainCategory?.name || "None"}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 italic mt-2.5 line-clamp-2">{sub.description || "No description provided."}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Management Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#1E293B] mb-6 pb-4 border-b border-gray-50">Customer Bookings & Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Total Paid</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Return Requests</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-semibold text-[#1E293B]">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-mono text-[10px] text-gray-500">{ord._id}</td>
                      <td className="p-3 truncate max-w-[100px]">{ord.user?.name || "Deleted User"}</td>
                      <td className="p-3">Rs. {ord.totalPrice.toFixed(2)}</td>
                      <td className="p-3 font-mono uppercase text-gray-600">{ord.paymentMethod} ({ord.paymentStatus})</td>
                      <td className="p-3">
                        <span className="text-[10px] bg-slate-50 border border-slate-100 px-2 py-0.5 rounded font-bold uppercase">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        {ord.returnRequestStatus ? (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            ord.returnRequestStatus === "Requested" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                          }`}>
                            Return {ord.returnRequestStatus}
                          </span>
                        ) : "-"}
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={() => {
                          setSelectedOrder(ord);
                          setUpdatingOrderStatus(ord.orderStatus);
                          setOrderTrackingNumber(ord.trackingNumber || "");
                          setShowOrderModal(true);
                        }} className="text-gray-400 hover:text-emerald-700 p-1.5 hover:bg-emerald-50 rounded transition">
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Coupons Tab */}
        {activeTab === "coupons" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
              <h3 className="text-lg font-bold text-[#1E293B]">Active Store Coupons</h3>
              <Button onClick={() => setShowCouponModal(true)} variant="primary" size="sm">
                New Coupon
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold">
                    <th className="p-3">Code</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Value</th>
                    <th className="p-3">Min Purchase</th>
                    <th className="p-3">Uses</th>
                    <th className="p-3">Expiry</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-semibold text-[#1E293B]">
                  {coupons.map((c) => (
                    <tr key={c._id}>
                      <td className="p-3 font-mono font-bold text-[#2E7D32]">{c.code}</td>
                      <td className="p-3">{c.discountType}</td>
                      <td className="p-3">{c.discountType === "Percentage" ? `${c.discountValue}%` : `Rs. ${c.discountValue}`}</td>
                      <td className="p-3">Rs. {c.minPurchase}</td>
                      <td className="p-3">{c.usageCount}</td>
                      <td className="p-3 text-xs text-gray-500">{new Date(c.expiryDate).toLocaleDateString()}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleCouponDelete(c._id)} className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Banners CMS Control Tab */}
        {activeTab === "banners" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
              <h3 className="text-lg font-bold text-[#1E293B]">Homepage Banners CMS</h3>
              <Button onClick={() => setShowBannerModal(true)} variant="primary" size="sm">
                Add Banner Banner
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((b) => (
                <div key={b._id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
                  <img
                    src={getImageUrl(b.image)}
                    alt={b.title}
                    className="w-full h-36 object-cover bg-gray-50"
                  />
                  <div className="p-4 text-xs space-y-2">
                    <p className="font-bold text-gray-800 text-sm">{b.title}</p>
                    <p className="text-gray-500">{b.description}</p>
                    <p className="text-gray-400 font-mono">Link: {b.link} | Type: {b.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews tab */}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#1E293B] mb-6 pb-4 border-b border-gray-50">Product Reviews Approval Desk</h3>
            <div className="divide-y divide-gray-50 text-xs">
              {reviews.map((r) => (
                <div key={r._id} className="py-4.5 flex justify-between items-start gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800">{r.userName}</span>
                      <span className="bg-amber-100 text-[#B45309] font-bold px-1.5 py-0.5 rounded text-[10px]">
                        ★ {r.rating} / 5
                      </span>
                    </div>
                    <p className="text-gray-600 italic">"{r.comment}"</p>
                    <p className="text-[10px] text-gray-400">On Product: <strong className="text-gray-700">{r.product?.name || "N/A"}</strong></p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!r.isApproved && (
                      <Button onClick={() => handleReviewApprove(r._id)} variant="primary" size="sm" className="py-1 px-3.5">
                        Approve
                      </Button>
                    )}
                    <Button onClick={() => handleReviewDelete(r._id)} variant="outline" size="sm" className="py-1 px-3.5 text-red-600 border-red-200 hover:bg-red-50">
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}

      {/* Product Save Modal Removed (Form rendered inline on page instead) */}

      {/* Main Category Save Modal */}
      {showCategoryModal && (
        <Modal title={editingCategory ? "Edit Main Category" : "Add Main Category"} onClose={() => setShowCategoryModal(false)}>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <InputBox label="Category Name" value={categoryData.name} onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })} required />
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Description</label>
              <textarea
                value={categoryData.description}
                onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })}
                className="w-full border border-gray-200 p-2 text-xs rounded-lg"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Image Upload</label>
              <input type="file" accept="image/*" onChange={(e) => setCategoryImage(e.target.files[0])} className="text-xs" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowCategoryModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">Save Category</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Subcategory Save Modal */}
      {showSubcategoryModal && (
        <Modal title={editingSubcategory ? "Edit Subcategory" : "Add Subcategory"} onClose={() => setShowSubcategoryModal(false)}>
          <form onSubmit={handleSubcategorySubmit} className="space-y-4">
            <InputBox label="Subcategory Name" value={subcategoryData.name} onChange={(e) => setSubcategoryData({ ...subcategoryData, name: e.target.value })} required />
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Description</label>
              <textarea
                value={subcategoryData.description}
                onChange={(e) => setSubcategoryData({ ...subcategoryData, description: e.target.value })}
                className="w-full border border-gray-200 p-2 text-xs rounded-lg"
                rows="3"
              />
            </div>
            <SelectBox
              label="Parent Category"
              value={subcategoryData.mainCategory}
              onChange={(e) => setSubcategoryData({ ...subcategoryData, mainCategory: e.target.value })}
              options={categories.map((c) => ({ value: c._id, label: c.name }))}
              required
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowSubcategoryModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">Save Subcategory</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <Modal title="Create Coupon Promo" onClose={() => setShowCouponModal(false)}>
          <form onSubmit={handleCouponSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputBox label="Coupon Code" value={couponData.code} onChange={(e) => setCouponData({ ...couponData, code: e.target.value.toUpperCase() })} required />
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Discount Type</label>
                <select
                  value={couponData.discountType}
                  onChange={(e) => setCouponData({ ...couponData, discountType: e.target.value })}
                  className="w-full border border-gray-200 p-2 text-xs rounded-lg"
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed">Fixed Amount</option>
                </select>
              </div>
              <InputBox label="Discount Value" type="number" value={couponData.discountValue} onChange={(e) => setCouponData({ ...couponData, discountValue: e.target.value })} required />
              <InputBox label="Min Purchase" type="number" value={couponData.minPurchase} onChange={(e) => setCouponData({ ...couponData, minPurchase: e.target.value })} required />
              <InputBox label="Max Discount Cap" type="number" value={couponData.maxDiscount} onChange={(e) => setCouponData({ ...couponData, maxDiscount: e.target.value })} />
              <InputBox label="Expiry Date" type="date" value={couponData.expiryDate} onChange={(e) => setCouponData({ ...couponData, expiryDate: e.target.value })} required />
              <InputBox label="Usage limit (Total)" type="number" value={couponData.usageLimit} onChange={(e) => setCouponData({ ...couponData, usageLimit: e.target.value })} required />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowCouponModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">Create Coupon</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Banner Upload Modal */}
      {showBannerModal && (
        <Modal title="Add Homepage Slider Banner" onClose={() => setShowBannerModal(false)}>
          <form onSubmit={handleBannerSubmit} className="space-y-4">
            <InputBox label="Banner Title" value={bannerData.title} onChange={(e) => setBannerData({ ...bannerData, title: e.target.value })} required />
            <InputBox label="Subtitle / Description" value={bannerData.description} onChange={(e) => setBannerData({ ...bannerData, description: e.target.value })} />
            <InputBox label="Target Link URL" value={bannerData.link} onChange={(e) => setBannerData({ ...bannerData, link: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Banner Type</label>
                <select
                  value={bannerData.type}
                  onChange={(e) => setBannerData({ ...bannerData, type: e.target.value })}
                  className="w-full border border-gray-200 p-2 text-xs rounded-lg"
                >
                  <option value="Hero">Hero Slide</option>
                  <option value="Offer">Offer Block</option>
                </select>
              </div>
              <InputBox label="Sort Order" type="number" value={bannerData.order} onChange={(e) => setBannerData({ ...bannerData, order: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Banner Image File</label>
              <input type="file" accept="image/*" onChange={(e) => setBannerImage(e.target.files[0])} required className="text-xs" />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowBannerModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">Upload Banner</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Admin Order Details/Edit Modal */}
      {showOrderModal && selectedOrder && (
        <Modal title={`Booking details #${selectedOrder._id}`} onClose={() => setShowOrderModal(false)}>
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 text-xs">
            {/* Status change actions */}
            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-bold text-gray-700 mb-3 text-sm">Update Order Status</h4>
              <div className="flex flex-col md:flex-row gap-3 items-end">
                <div className="flex-1 w-full">
                  <label className="block font-bold text-gray-400 mb-1 text-[10px] uppercase">Select Status</label>
                  <select
                    value={updatingOrderStatus}
                    onChange={(e) => setUpdatingOrderStatus(e.target.value)}
                    className="w-full border border-gray-200 p-2 rounded-lg bg-white"
                  >
                    {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 w-full">
                  <label className="block font-bold text-gray-400 mb-1 text-[10px] uppercase">Tracking ID / Waybill</label>
                  <input
                    type="text"
                    value={orderTrackingNumber}
                    onChange={(e) => setOrderTrackingNumber(e.target.value)}
                    className="w-full border border-gray-200 p-2 rounded-lg bg-white"
                    placeholder="e.g. TRK987654"
                  />
                </div>

                <Button onClick={handleOrderStatusUpdate} variant="primary" size="sm" className="w-full md:w-auto h-9">
                  Save
                </Button>
              </div>
            </div>

            {/* Return Request management block if requested */}
            {selectedOrder.returnRequestStatus === "Requested" && (
              <div className="border-b border-amber-100 bg-amber-50 p-4 rounded-xl space-y-3">
                <div>
                  <h4 className="font-black text-amber-800 text-sm">Return Request Received!</h4>
                  <p className="text-gray-600 mt-1">Reason: <span className="font-bold">"{selectedOrder.returnRequestReason}"</span></p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleReturnManage(selectedOrder._id, "Approved")} variant="primary" size="sm">
                    Approve Return & Refund
                  </Button>
                  <Button onClick={() => handleReturnManage(selectedOrder._id, "Rejected")} variant="danger" size="sm">
                    Reject Request
                  </Button>
                </div>
              </div>
            )}

            {/* General Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Customer Name</p>
                <p className="font-bold text-gray-800 mt-0.5">{selectedOrder.user?.name || "Deleted User"}</p>
                <p className="text-gray-500">{selectedOrder.user?.email || ""}</p>
                <p className="text-gray-500">{selectedOrder.user?.mobileNumber || ""}</p>
              </div>

              <div>
                <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Shipping Address</p>
                <p className="font-semibold text-gray-700 mt-0.5">{selectedOrder.shippingAddress.street}</p>
                <p className="text-gray-600">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-2">Order Items</p>
              <div className="border border-gray-100 rounded-xl divide-y divide-gray-100 overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center bg-white hover:bg-gray-50/50">
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Qty: {item.quantity} | Unit Price: Rs. {item.price}</p>
                    </div>
                    <span className="font-bold text-gray-800">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total summary */}
            <div className="flex justify-end pt-3 border-t border-gray-100 text-xs">
              <div className="w-48 space-y-1.5 font-bold text-gray-500 text-right">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-800">Rs. {selectedOrder.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST</span>
                  <span className="text-gray-800">Rs. {selectedOrder.taxPrice.toFixed(2)}</span>
                </div>
                {selectedOrder.discountPrice > 0 && (
                  <div className="flex justify-between text-[#2E7D32]">
                    <span>Discount</span>
                    <span>- Rs. {selectedOrder.discountPrice.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-900 text-sm font-black border-t border-gray-100 pt-1.5">
                  <span>Grand Total</span>
                  <span className="text-[#2E7D32]">Rs. {selectedOrder.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

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

export default AdminDashboard;
