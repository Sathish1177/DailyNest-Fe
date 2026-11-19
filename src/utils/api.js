import axios from "axios";

// Central Single Source of Truth for Backend URL
export const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://dailynest-be.onrender.com";

// Central helper to resolve image URLs across the entire application
export const getImageUrl = (imagePath, fallback = "") => {
  if (!imagePath || typeof imagePath !== "string") return fallback;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${BASE_URL}${cleanPath}`;
};

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `${BASE_URL}/api`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request Interceptor: Attach JWT Token if exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 Unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and reload if unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Let context handle the redirect or state clean up
    }
    return Promise.reject(error);
  }
);

export default API;
