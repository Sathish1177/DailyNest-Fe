import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import Toast from "../components/Toast";
import Logo from "../components/Logo";

const ForgotPassword = () => {
  const { forgotPassword } = useContext(AuthContext);
  const [mobileNumber, setMobileNumber] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!mobileNumber) return;

    setLoading(true);
    const res = await forgotPassword(mobileNumber);
    setLoading(false);

    if (res.success) {
      setToast({ type: "success", message: "Reset token generated successfully!" });
      setResetToken(res.resetToken);
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
        <h2 className="text-3xl font-extrabold text-[#1E293B]">Forgot Password</h2>
        <p className="mt-2 text-sm text-gray-500">
          Enter your mobile number to obtain a security reset token.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-100 shadow-xl rounded-2xl sm:px-10">
          {!resetToken ? (
            <form className="space-y-4" onSubmit={handleForgot}>
              <InputBox
                label="Registered Mobile Number"
                name="mobileNumber"
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />

              <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
                Generate Reset Token
              </Button>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800 text-sm font-semibold">
                Token generated! (Simulated SMS delivery)
              </div>
              <div className="bg-slate-100 p-3.5 rounded-lg font-mono text-sm border border-slate-200 select-all">
                {resetToken}
              </div>
              <p className="text-xs text-gray-500">
                Copy this token value and click below to enter your new password.
              </p>
              <Button
                onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                variant="accent"
                className="w-full"
              >
                Go to Reset Password
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-semibold text-[#2E7D32] hover:text-[#256428]">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
