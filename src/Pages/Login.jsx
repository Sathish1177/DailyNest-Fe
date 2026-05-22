import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import Toast from "../components/Toast";

const Login = () => {
  const { loginUser, googleAuth } = useContext(AuthContext);
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");


  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!mobileNumber || !password) {
      setToast({ type: "error", message: "Please fill in all credentials" });
      return;
    }

    setLoading(true);
    const res = await loginUser(mobileNumber, password);
    setLoading(false);

    if (res.success) {
      setToast({ type: "success", message: "Logged in successfully!" });
      const role = res.user?.role;
      setTimeout(() => {
        if (role === "super-admin") {
          navigate("/DNsuperadmin");
        } else if (role === "admin") {
          navigate("/DNAdmin");
        } else {
          navigate("/");
        }
      }, 1000);
    } else {
      setToast({ type: "error", message: res.message });
    }
  };

  // Google Login Simulator
  const handleGoogleLogin = async () => {
    setLoading(true);
    // Simulate a Google OAuth verification ID token
    const mockGoogleJwt = `header.${btoa(JSON.stringify({
      sub: "g-id-" + Date.now(),
      email: "guest_google@gmail.com",
      name: "Google Guest User",
      picture: ""
    }))}.signature`;

    const res = await googleAuth(mockGoogleJwt);
    setLoading(false);

    if (res.success) {
      setToast({ type: "success", message: "Google Sign-In success!" });
      const role = res.user?.role;
      setTimeout(() => {
        if (role === "super-admin") {
          navigate("/DNsuperadmin");
        } else if (role === "admin") {
          navigate("/DNAdmin");
        } else {
          navigate("/");
        }
      }, 1000);
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
        <h2 className="text-3xl font-extrabold text-[#1E293B]">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-500">
          Or{" "}
          <Link to="/register" className="font-semibold text-[#2E7D32] hover:text-[#256428]">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-100 shadow-xl rounded-2xl sm:px-10">
          <form className="space-y-4" onSubmit={handleLogin}>
            <InputBox
              label="Mobile Number"
              name="mobileNumber"
              type="text"
              required
              placeholder="e.g. 9876543210"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />

            <div className="relative">
              <InputBox
                label="Password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute right-0 top-0 mt-1">
                <Link to="/forgot-password" className="text-xs font-semibold text-[#2E7D32] hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
              Sign In
            </Button>
          </form>

          {/* Social login line */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400 font-semibold">Or continue with</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-lg bg-white text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none transition active:scale-95"
              >
                {/* Google SVG Icon */}
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.11C18.28 1.845 15.547 1 12.24 1 5.922 1 1 5.922 1 12.24s4.922 11.24 11.24 11.24c6.6 0 11-4.606 11-11.24 0-.756-.08-1.34-.18-1.955H12.24z"/>
                </svg>
                Sign In with Google
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Login;
