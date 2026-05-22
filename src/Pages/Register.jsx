import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import Toast from "../components/Toast";

const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !mobileNumber || !password) {
      setToast({ type: "error", message: "Please fill in all required fields" });
      return;
    }

    if (password !== confirmPassword) {
      setToast({ type: "error", message: "Passwords do not match" });
      return;
    }

    setLoading(true);
    const res = await registerUser(name, mobileNumber, email || undefined, password);
    setLoading(false);

    if (res.success) {
      setToast({ type: "success", message: "Registered successfully!" });
      setTimeout(() => navigate("/"), 1000);
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
          <span className="bg-[#2E7D32] text-white font-black px-2.5 py-1.5 rounded-lg text-lg tracking-wider">DN</span>
          <span className="text-xl font-bold text-[#1E293B] tracking-tight">
            Daily<span className="text-[#2E7D32]">Nest</span>
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold text-[#1E293B]">Create your account</h2>
        <p className="mt-2 text-sm text-gray-500">
          Or{" "}
          <Link to="/login" className="font-semibold text-[#2E7D32] hover:text-[#256428]">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-100 shadow-xl rounded-2xl sm:px-10">
          <form className="space-y-4" onSubmit={handleRegister}>
            <InputBox
              label="Full Name"
              name="name"
              type="text"
              required
              placeholder="e.g. Sathish Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <InputBox
              label="Mobile Number"
              name="mobileNumber"
              type="tel"
              required
              placeholder="e.g. 9876543210"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />

            <InputBox
              label="Email Address (Optional)"
              name="email"
              type="email"
              placeholder="e.g. sathish@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputBox
              label="Password"
              name="password"
              type="password"
              required
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <InputBox
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-[#2E7D32] border-gray-300 rounded focus:ring-[#2E7D32]"
              />
              <label htmlFor="terms" className="ml-2 block text-xs text-gray-500">
                I agree to the terms of service and privacy policies.
              </label>
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
              Register
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
