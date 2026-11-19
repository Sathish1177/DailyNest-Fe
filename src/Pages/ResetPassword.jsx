import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import Toast from "../components/Toast";
import Logo from "../components/Logo";

const ResetPassword = () => {
  const { resetPassword } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!token || !newPassword) {
      setToast({ type: "error", message: "Token and password are required" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({ type: "error", message: "Passwords do not match" });
      return;
    }

    setLoading(true);
    const res = await resetPassword(token, newPassword);
    setLoading(false);

    if (res.success) {
      setToast({ type: "success", message: "Password updated successfully!" });
      setTimeout(() => navigate("/login"), 1500);
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
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        <h2 className="text-3xl font-extrabold text-[#1E293B]">Reset Password</h2>
        <p className="mt-2 text-sm text-gray-500">
          Enter the security token and set your new account password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-100 shadow-xl rounded-2xl sm:px-10">
          <form className="space-y-4" onSubmit={handleReset}>
            <InputBox
              label="Reset Token"
              name="token"
              type="text"
              required
              placeholder="Paste security reset token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />

            <InputBox
              label="New Password"
              name="newPassword"
              type="password"
              required
              placeholder="Min 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <InputBox
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
              Save New Password
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-semibold text-gray-500 hover:text-[#2E7D32]">
              Cancel and Return
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
