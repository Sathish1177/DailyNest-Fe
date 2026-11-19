import React from "react";
import { User, ShieldCheck, Truck, Headphones, Target, Eye } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  const leadershipRoles = [
    {
      title: "Executive & Strategic Direction",
      division: "Founder & Management",
      icon: <User className="w-8 h-8 text-[#2E7D32]" />,
      description: "Guiding DailyNest's overall vision, vendor ecosystem, and sustainable retail growth."
    },
    {
      title: "Supply Chain & Logistics Operations",
      division: "Warehouse & Delivery Network",
      icon: <Truck className="w-8 h-8 text-[#2E7D32]" />,
      description: "Overseeing farm procurement, fresh stock rotation, and reliable hyper-local doorstep deliveries."
    },
    {
      title: "Customer Experience & Quality Assurance",
      division: "Quality & Partner Support",
      icon: <Headphones className="w-8 h-8 text-[#2E7D32]" />,
      description: "Ensuring 100% genuine product standards, hassle-free returns, and dedicated merchant relations."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-16 w-full">
        {/* Intro */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] mb-2">
            Welcome to DailyNest
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E293B] mb-4 tracking-tight">
            About DailyNest Platform
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            DailyNest is a modern multi-vendor e-commerce platform dedicated to connecting local farm producers, specialty stores, and trusted brands with families for their daily essentials and lifestyle needs.
          </p>
        </section>

        {/* Mission and Vision Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white p-8 border border-gray-200 rounded-3xl shadow-sm">
            <div className="bg-emerald-50 text-[#2E7D32] border border-emerald-200 rounded-2xl w-12 h-12 flex items-center justify-center font-bold text-lg mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] mb-3">Our Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To simplify daily shopping by providing a unified, transparent platform that delivers authentic goods, empowers local merchants, and delivers uncompromised freshness directly to your doorstep.
            </p>
          </div>

          <div className="bg-white p-8 border border-gray-200 rounded-3xl shadow-sm">
            <div className="bg-amber-50 text-amber-600 border border-amber-200 rounded-2xl w-12 h-12 flex items-center justify-center font-bold text-lg mb-6">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] mb-3">Our Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To become the most reliable and transparent daily shopping platform, establishing intelligent local delivery networks that reduce waste and support indigenous producers.
            </p>
          </div>
        </section>

        {/* Operational Leadership Section */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight">
              Platform Operations & Governance
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              The operational departments dedicated to daily quality, logistics, and merchant success.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {leadershipRoles.map((role, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm text-center flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  {/* Clean User Avatar Container - No external photos */}
                  <div className="w-20 h-20 rounded-full mx-auto bg-slate-50 border border-gray-200 flex items-center justify-center mb-5 shadow-sm">
                    {role.icon}
                  </div>
                  <h4 className="text-base font-bold text-[#1E293B] leading-snug">
                    {role.title}
                  </h4>
                  <p className="text-xs font-semibold text-[#2E7D32] mt-1.5 uppercase tracking-wide">
                    {role.division}
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-4 leading-relaxed border-t border-gray-100 pt-4">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
