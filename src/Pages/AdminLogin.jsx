import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import Toast from "../components/Toast";
import { ShieldAlert, ShieldCheck } from "lucide-react";

const AdminLogin = () => {
  const { loginUser, logout } = useContext(AuthContext);
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!mobileNumber || !password) {
      setToast({ type: "error", message: "Please fill in all fields" });
      return;
    }

    setLoading(true);
    const res = await loginUser(mobileNumber, password);
    setLoading(false);

    if (res.success) {
      const role = res.user?.role;
      if (role === "super-admin") {
        setToast({ type: "success", message: `Welcome Back, ${res.user.name || "Super Admin"}!` });
        setTimeout(() => navigate("/DNsuperadmin"), 1000);
      } else if (role === "admin") {
        setToast({ type: "success", message: `Welcome Back, ${res.user.name || "Admin"}!` });
        setTimeout(() => navigate("/DNAdmin"), 1000);
      } else {
        // Disallowed role: log them out immediately to clean storage
        logout();
        setToast({
          type: "error",
          message: "Access Denied. Only administrators can log in here."
        });
      }
    } else {
      setToast({ type: "error", message: res.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-1.5 focus:outline-none mb-6">
          <span className="bg-[#1E293B] text-white font-black px-2.5 py-1.5 rounded-lg text-lg tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </span>
          <span className="text-xl font-bold text-[#1E293B] tracking-tight">
            Daily<span className="text-[#2E7D32]">Nest</span> <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded ml-1">Portal</span>
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold text-[#1E293B]">Admin Console Login</h2>
        <p className="mt-2 text-sm text-gray-500">
          Authorized personnel access only. Customers please login{" "}
          <Link to="/login" className="font-semibold text-[#2E7D32] hover:text-[#256428]">
            here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-100 shadow-xl rounded-2xl sm:px-10">
          <div className="mb-6 bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-normal">
              If you require access, please contact the Super Administrator to set up your profile credentials.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleAdminLogin}>
            <InputBox
              label="Admin Mobile Number"
              name="mobileNumber"
              type="text"
              required
              placeholder="e.g. 9025585770"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />

            <InputBox
              label="Password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" variant="primary" className="w-full bg-[#1E293B] hover:bg-[#0f172a]" isLoading={loading}>
              Access Console
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs font-medium text-gray-500 hover:text-gray-700 transition">
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
