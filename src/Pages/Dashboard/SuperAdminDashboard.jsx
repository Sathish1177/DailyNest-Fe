import React, { useState, useEffect, useContext } from "react";
import { ShieldAlert, Users, Terminal, Settings, Plus, Edit, Trash2, Shield, Eye, Calendar, UserCheck, Store, ExternalLink, CheckCircle, Ban } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import SelectBox from "../../components/SelectBox";
import Toast from "../../components/Toast";
import Modal from "../../components/Modal";
import API from "../../utils/api";

const SuperAdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("admins");
  const [toast, setToast] = useState(null);

  // Admins CRUD states
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    role: "admin"
  });

  // Settings states
  const [settings, setSettings] = useState([]);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [settingData, setSettingData] = useState({
    key: "",
    value: "",
    description: ""
  });

  // Audit Logs states
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Partner Stores states
  const [stores, setStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(false);

  const fetchStores = async () => {
    setLoadingStores(true);
    try {
      const { data } = await API.get("/stores/admin/all");
      setStores(data || []);
    } catch (err) {
      console.error("Failed to load stores:", err.message);
    } finally {
      setLoadingStores(false);
    }
  };

  const handleToggleStoreStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "approved" ? "suspended" : "approved";
    try {
      await API.put(`/stores/admin/${id}/status`, { status: nextStatus });
      setToast({ type: "success", message: `Store status changed to ${nextStatus}` });
      fetchStores();
    } catch (err) {
      setToast({ type: "error", message: "Failed to update store status" });
    }
  };

  // Fetch admin accounts
  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const { data } = await API.get("/settings/admins");
      setAdmins(data);
    } catch (err) {
      console.error("Failed to load admin accounts:", err.message);
    } finally {
      setLoadingAdmins(false);
    }
  };

  // Fetch system configurations
  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const { data } = await API.get("/settings");
      setSettings(data);
    } catch (err) {
      console.error("Failed to load system settings:", err.message);
    } finally {
      setLoadingSettings(false);
    }
  };

  // Fetch audit logs
  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const { data } = await API.get("/settings/logs");
      setLogs(data);
    } catch (err) {
      console.error("Failed to load system audit logs:", err.message);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (activeTab === "admins") fetchAdmins();
    else if (activeTab === "settings") fetchSettings();
    else if (activeTab === "logs") fetchLogs();
    else if (activeTab === "stores") fetchStores();
  }, [activeTab]);

  // Admin account CRUD handlers
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!adminData.name || !adminData.mobileNumber || (!editingAdmin && !adminData.password)) {
      setToast({ type: "error", message: "Please fill out required fields." });
      return;
    }
    try {
      if (editingAdmin) {
        // Edit
        await API.put(`/settings/admins/${editingAdmin._id}`, adminData);
        setToast({ type: "success", message: "Admin details updated!" });
      } else {
        // Create
        await API.post("/settings/admins", adminData);
        setToast({ type: "success", message: "Admin created successfully!" });
      }
      setShowAdminModal(false);
      setEditingAdmin(null);
      setAdminData({ name: "", email: "", mobileNumber: "", password: "", role: "admin" });
      fetchAdmins();
    } catch (err) {
      setToast({ type: "error", message: err.response?.data?.message || "Failed to save admin user." });
    }
  };

  const handleAdminEditClick = (admin) => {
    setEditingAdmin(admin);
    setAdminData({
      name: admin.name,
      email: admin.email || "",
      mobileNumber: admin.mobileNumber,
      password: "", // Leave blank if not updating
      role: admin.role
    });
    setShowAdminModal(true);
  };

  const handleAdminDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin account?")) {
      try {
        await API.delete(`/settings/admins/${id}`);
        setToast({ type: "success", message: "Admin account deleted!" });
        setAdmins(admins.filter((a) => a._id !== id));
      } catch (err) {
        setToast({ type: "error", message: "Failed to delete admin." });
      }
    }
  };

  // Settings handlers
  const handleSettingSubmit = async (e) => {
    e.preventDefault();
    if (!settingData.key || !settingData.value) {
      setToast({ type: "error", message: "Key and Value are required." });
      return;
    }
    try {
      await API.post("/settings", settingData);
      setToast({ type: "success", message: "Setting updated successfully!" });
      setShowSettingModal(false);
      setSettingData({ key: "", value: "", description: "" });
      fetchSettings();
    } catch (err) {
      setToast({ type: "error", message: "Failed to save setting." });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Sidebar Control Panel - Clean Light Theme */}
      <div className="lg:col-span-1 bg-white border border-gray-200 text-slate-700 rounded-3xl p-6 shadow-sm h-fit space-y-6">
        <div className="flex flex-col items-center text-center pb-6 border-b border-gray-150">
          <div className="w-14 h-14 bg-amber-50 text-[#F59E0B] border border-amber-200 rounded-full flex items-center justify-center font-black text-2xl shadow-sm mb-3">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="font-bold text-sm text-[#1E293B] tracking-wide">Root Control Hub</h2>
          <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-0.5">Super Admin Gate</p>
        </div>

        <nav className="flex flex-col gap-1.5">
          {[
            { id: "admins", label: "Admin Accounts", icon: <Users className="w-4.5 h-4.5" /> },
            { id: "stores", label: "Partner Stores", icon: <Store className="w-4.5 h-4.5" /> },
            { id: "settings", label: "System Configs", icon: <Settings className="w-4.5 h-4.5" /> },
            { id: "logs", label: "Audit Command Log", icon: <Terminal className="w-4.5 h-4.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold text-left transition ${
                activeTab === tab.id
                  ? "bg-[#F59E0B] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold text-left text-red-600 hover:bg-red-50 transition border-t border-gray-150 mt-4 pt-4"
          >
            Sign Out
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-4 space-y-8">
        {/* Admin Accounts Manager Tab */}
        {activeTab === "admins" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
              <h3 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#F59E0B]" />
                <span>Manage Admin accounts</span>
              </h3>
              <Button
                onClick={() => {
                  setEditingAdmin(null);
                  setAdminData({ name: "", email: "", mobileNumber: "", password: "", role: "admin" });
                  setShowAdminModal(true);
                }}
                variant="accent"
                size="sm"
                className="gap-1 bg-[#F59E0B] hover:bg-[#d97706]"
              >
                <Plus className="w-4 h-4" /> Add Admin
              </Button>
            </div>

            {loadingAdmins ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F59E0B]"></div>
              </div>
            ) : admins.length === 0 ? (
              <p className="text-center py-8 text-xs text-gray-400">No admin accounts configured.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold">
                      <th className="p-3">Name</th>
                      <th className="p-3">Mobile Number</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Role Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-semibold text-[#1E293B]">
                    {admins.map((adm) => (
                      <tr key={adm._id} className="hover:bg-gray-50/50">
                        <td className="p-3 flex items-center gap-2">
                          <div className="bg-amber-100 text-amber-700 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                            {adm.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold">{adm.name}</span>
                        </td>
                        <td className="p-3 font-mono text-gray-600">{adm.mobileNumber}</td>
                        <td className="p-3 text-gray-500">{adm.email || "-"}</td>
                        <td className="p-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                            adm.role === "super-admin" ? "bg-red-50 text-red-600 border border-red-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                          }`}>
                            {adm.role}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => handleAdminEditClick(adm)}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAdminDelete(adm._id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Partner Stores Management Tab */}
        {activeTab === "stores" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
              <div>
                <h3 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#F59E0B]" />
                  <span>3rd Party Partner Stores ({stores.length})</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Manage vendor stores, view their products count, and toggle approval status.
                </p>
              </div>
            </div>

            {loadingStores ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : stores.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                <Store className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                No partner stores registered yet. They will appear here when sellers onboard via footer link.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Store</th>
                      <th className="py-3 px-4">Owner Contact</th>
                      <th className="py-3 px-4">City / Category</th>
                      <th className="py-3 px-4">Products</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stores.map((st) => (
                      <tr key={st._id} className="hover:bg-gray-50/60 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={st.logo || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=100"}
                              alt={st.name}
                              className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                            />
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{st.name}</p>
                              <Link
                                to={`/store/${st.slug}`}
                                target="_blank"
                                className="text-[11px] text-emerald-600 font-mono hover:underline flex items-center gap-1"
                              >
                                /store/{st.slug} <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-700">{st.owner?.name || "Partner"}</p>
                          <p className="text-gray-400 font-mono text-[11px]">{st.owner?.mobileNumber || st.phone}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-slate-700">{st.address?.city || "Tamil Nadu"}</p>
                          <p className="text-[11px] text-gray-400">{st.category}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                            {st.productCount || 0} items
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                              st.status === "approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {st.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/store/${st.slug}`}
                              target="_blank"
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition"
                              title="Preview Storefront"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleToggleStoreStatus(st._id, st.status)}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                                st.status === "approved"
                                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                            >
                              {st.status === "approved" ? "Suspend" : "Approve"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* System Settings Configurations Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
              <h3 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#F59E0B]" />
                <span>System Configuration Registry</span>
              </h3>
              <Button
                onClick={() => {
                  setSettingData({ key: "", value: "", description: "" });
                  setShowSettingModal(true);
                }}
                variant="accent"
                size="sm"
                className="bg-[#F59E0B] hover:bg-[#d97706]"
              >
                Add / Update Setting
              </Button>
            </div>

            {loadingSettings ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F59E0B]"></div>
              </div>
            ) : settings.length === 0 ? (
              <p className="text-center py-8 text-xs text-gray-400">No registry keys defined.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {settings.map((set) => (
                  <div key={set._id} className="border border-gray-150 rounded-2xl p-4.5 bg-slate-50 relative">
                    <button
                      onClick={() => {
                        setSettingData({ key: set.key, value: set.value, description: set.description || "" });
                        setShowSettingModal(true);
                      }}
                      className="absolute top-4 right-4 text-gray-400 hover:text-amber-600 transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <p className="font-mono font-black text-gray-700 uppercase mb-1.5">{set.key}</p>
                    <p className="bg-white border border-gray-200 p-2.5 rounded-lg font-mono text-gray-800 break-all select-all font-bold">
                      {set.value}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2 font-medium italic">{set.description || "No description provided."}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === "logs" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#1E293B] mb-6 pb-4 border-b border-gray-50 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#F59E0B]" />
              <span>Audit System Log Commands</span>
            </h3>

            {loadingLogs ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F59E0B]"></div>
              </div>
            ) : logs.length === 0 ? (
              <p className="text-center py-8 text-xs text-gray-400">Command audit history is clean.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px] font-mono">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">User Node</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">Details</th>
                      <th className="py-2.5 px-3 text-right">IP Route</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-600 font-semibold">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-55/30">
                        <td className="py-3 px-3 text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="py-3 px-3 text-[#1E293B] flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{log.user?.name || "System"}</span>
                        </td>
                        <td className="py-3 px-3 text-amber-700 font-bold uppercase">{log.action}</td>
                        <td className="py-3 px-3 max-w-[200px] truncate" title={log.details}>{log.details}</td>
                        <td className="py-3 px-3 text-right text-[10px] text-gray-400">{log.ipAddress || "127.0.0.1"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Admin Creator/Editor Modal */}
      {showAdminModal && (
        <Modal title={editingAdmin ? "Edit Admin Node" : "Register Admin Node"} onClose={() => setShowAdminModal(false)}>
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <InputBox
              label="Full Name"
              placeholder="e.g. Sathish L"
              value={adminData.name}
              onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
              required
            />
            <InputBox
              label="Mobile Number"
              placeholder="e.g. 9876543210"
              value={adminData.mobileNumber}
              onChange={(e) => setAdminData({ ...adminData, mobileNumber: e.target.value })}
              required
            />
            <InputBox
              label="Email (Optional)"
              type="email"
              placeholder="e.g. admin@dailynest.com"
              value={adminData.email}
              onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
            />
            <InputBox
              label={editingAdmin ? "Password (Leave blank to keep current)" : "Secret Password"}
              type="password"
              placeholder="Min 6 characters"
              value={adminData.password}
              onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
              required={!editingAdmin}
            />
            <SelectBox
              label="Admin Privilege Role"
              value={adminData.role}
              onChange={(e) => setAdminData({ ...adminData, role: e.target.value })}
              options={[
                { value: "admin", label: "Standard Admin" },
                { value: "super-admin", label: "Super Administrator" }
              ]}
              required
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowAdminModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Account
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* System Setting Modal */}
      {showSettingModal && (
        <Modal title="Configure System Registry" onClose={() => setShowSettingModal(false)}>
          <form onSubmit={handleSettingSubmit} className="space-y-4">
            <InputBox
              label="Registry key"
              placeholder="e.g. STRIPE_SECRET_KEY"
              value={settingData.key}
              onChange={(e) => setSettingData({ ...settingData, key: e.target.value.toUpperCase() })}
              required
              disabled={!!settingData.key && settings.some((s) => s.key === settingData.key)}
            />
            <InputBox
              label="Registry Value"
              placeholder="e.g. sk_test_..."
              value={settingData.value}
              onChange={(e) => setSettingData({ ...settingData, value: e.target.value })}
              required
            />
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Description / Documentation</label>
              <textarea
                placeholder="Brief summary of setting usage"
                value={settingData.description}
                onChange={(e) => setSettingData({ ...settingData, description: e.target.value })}
                className="w-full border border-gray-200 p-2 text-xs rounded-lg focus:outline-none"
                rows="3"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowSettingModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Registry Key
              </Button>
            </div>
          </form>
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

export default SuperAdminDashboard;
