import React, { createContext, useState, useEffect } from "react";
import API from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const { data } = await API.get("/auth/profile");
          setUser(data);
        } catch (err) {
          console.error("Auth init failure:", err.message);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  // LOGIN
  const loginUser = async (mobileNumber, password) => {
    try {
      const { data } = await API.post("/auth/login", { mobileNumber, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data);
      return { success: true, user: data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed"
      };
    }
  };

  // REGISTER
  const registerUser = async (name, mobileNumber, email, password) => {
    try {
      const { data } = await API.post("/auth/register", { name, mobileNumber, email, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data);
      return { success: true, user: data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed"
      };
    }
  };

  // GOOGLE LOGIN
  const googleAuth = async (credential) => {
    try {
      const { data } = await API.post("/auth/google-login", { credential });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data);
      return { success: true, user: data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Google authentication failed"
      };
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // UPDATE PROFILE
  const updateProfile = async (profileData) => {
    try {
      const { data } = await API.put("/auth/profile", profileData);
      setUser((prev) => ({ ...prev, ...data }));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Profile update failed"
      };
    }
  };

  // CHANGE PASSWORD
  const changePassword = async (oldPassword, newPassword) => {
    try {
      await API.put("/auth/change-password", { oldPassword, newPassword });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Password change failed"
      };
    }
  };

  // FORGOT PASSWORD
  const forgotPassword = async (mobileNumber) => {
    try {
      const { data } = await API.post("/auth/forgot-password", { mobileNumber });
      return { success: true, resetToken: data.resetToken };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Request failed"
      };
    }
  };

  // RESET PASSWORD
  const resetPassword = async (token, newPassword) => {
    try {
      await API.post("/auth/reset-password", { token, newPassword });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Password reset failed"
      };
    }
  };

  // ADDRESS CRUD HELPER
  const addAddress = async (address) => {
    try {
      const { data } = await API.post("/auth/addresses", address);
      setUser((prev) => ({ ...prev, addresses: data }));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Error adding address"
      };
    }
  };

  const updateAddress = async (addressId, address) => {
    try {
      const { data } = await API.put(`/auth/addresses/${addressId}`, address);
      setUser((prev) => ({ ...prev, addresses: data }));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Error updating address"
      };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const { data } = await API.delete(`/auth/addresses/${addressId}`);
      setUser((prev) => ({ ...prev, addresses: data }));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Error deleting address"
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginUser,
        registerUser,
        googleAuth,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        addAddress,
        updateAddress,
        deleteAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
