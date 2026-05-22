import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  const team = [
    { name: "Sathish Kumar", role: "CEO & Founder", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" },
    { name: "Divya Rajan", role: "Head of Logistics", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" },
    { name: "Arun Prasath", role: "Lead Developer", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Intro */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-[#1E293B] mb-4">About DailyNest</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            DailyNest is a modern e-commerce platform dedicated to bringing you the freshest farm produce, tech innovations, curated fashion, and quality home needs directly to your doorstep.
          </p>
        </section>

        {/* Mission and Vision Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          <div className="bg-white p-8 border border-gray-100 rounded-2xl shadow-sm">
            <div className="bg-[#2E7D32]/10 text-[#2E7D32] rounded-lg w-12 h-12 flex items-center justify-center font-bold text-lg mb-6">M</div>
            <h3 className="text-xl font-bold text-[#1E293B] mb-3">Our Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To simplify daily shopping for millions by providing a unified, reliable platform that delivers authentic goods at transparent prices, supporting local manufacturers and eco-friendly packaging.
            </p>
          </div>

          <div className="bg-white p-8 border border-gray-100 rounded-2xl shadow-sm">
            <div className="bg-[#F59E0B]/10 text-[#F59E0B] rounded-lg w-12 h-12 flex items-center justify-center font-bold text-lg mb-6">V</div>
            <h3 className="text-xl font-bold text-[#1E293B] mb-3">Our Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To become the world's most trusted daily essential e-commerce storefront, building intelligent supply chains that eliminate waste and deliver products under 2 hours.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-3xl font-extrabold text-center text-[#1E293B] mb-12">Meet Our Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover mb-4 border-2 border-emerald-500/20"
                />
                <h4 className="text-lg font-bold text-[#1E293B]">{member.name}</h4>
                <p className="text-xs font-semibold text-[#2E7D32] mt-1">{member.role}</p>
                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  Dedicated to delivering excellence and scaling platform operations daily.
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
