import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CustomerDashboard from "./CustomerDashboard";
import AdminDashboard from "./AdminDashboard";
import SuperAdminDashboard from "./SuperAdminDashboard";

const DashboardIndex = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login?redirect=dashboard");
      } else if (user.role === "super-admin") {
        navigate("/DNsuperadmin");
      } else if (user.role === "admin") {
        navigate("/DNAdmin");
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E7D32]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        {user.role === "super-admin" ? (
          <SuperAdminDashboard />
        ) : user.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <CustomerDashboard initialTab={tab} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DashboardIndex;
