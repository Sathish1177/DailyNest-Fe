import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, ArrowRight } from "lucide-react";
import Button from "./Button";
import Logo from "./Logo";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-white text-slate-600 pt-16 pb-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-200 pb-12">
        
        {/* Brand Information Column */}
        <div className="flex flex-col gap-4">
          <Logo size="md" />
          <p className="text-sm text-slate-500 leading-relaxed mt-1">
            Your premium daily e-commerce helper. Shop fresh groceries, organic staples, home essentials, and lifestyle products with trust and rapid delivery.
          </p>
          
          {/* Social Media Links */}
          <div className="flex gap-2.5 mt-2">
            <a
              href="#"
              className="p-2.5 bg-slate-50 hover:bg-[#2E7D32] text-slate-600 hover:text-white rounded-xl border border-gray-200 transition shadow-sm"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </a>
            <a
              href="#"
              className="p-2.5 bg-slate-50 hover:bg-[#2E7D32] text-slate-600 hover:text-white rounded-xl border border-gray-200 transition shadow-sm"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="#"
              className="p-2.5 bg-slate-50 hover:bg-[#2E7D32] text-slate-600 hover:text-white rounded-xl border border-gray-200 transition shadow-sm"
              aria-label="Twitter"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Directory Quick Links */}
        <div>
          <h4 className="text-[#1E293B] font-bold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <Link to="/shop" className="text-slate-600 hover:text-[#2E7D32] hover:translate-x-1 inline-block transition">
                Shop All Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-slate-600 hover:text-[#2E7D32] hover:translate-x-1 inline-block transition">
                Our Story
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-slate-600 hover:text-[#2E7D32] hover:translate-x-1 inline-block transition">
                Contact Support
              </Link>
            </li>
            <li>
              <Link
                to="/register-store"
                className="text-slate-600 hover:text-[#2E7D32] hover:translate-x-1 inline-block transition"
              >
                Sell on DailyNest
              </Link>
            </li>
            <li>
              <Link to="/adminlogin" className="text-slate-600 hover:text-[#2E7D32] hover:translate-x-1 inline-block transition">
                Partner & Admin Portal
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-slate-600 hover:text-[#2E7D32] hover:translate-x-1 inline-block transition">
                Customer Sign In
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Details */}
        <div>
          <h4 className="text-[#1E293B] font-bold text-sm uppercase tracking-wider mb-5">Contact Details</h4>
          <ul className="flex flex-col gap-3.5 text-sm">
            <li className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#2E7D32] shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-slate-600 text-xs leading-relaxed">Sivagiri, Erode, Tamilnadu - 638109</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#2E7D32] shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-slate-600 text-xs font-semibold">+91 9025585770</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#2E7D32] shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-slate-600 text-xs font-semibold">lsathish017@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Footer Newsletter */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[#1E293B] font-bold text-sm uppercase tracking-wider">Newsletter</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Subscribe to receive notifications about daily flash offers and new catalog updates.
          </p>

          {subscribed ? (
            <div className="bg-emerald-50 border border-emerald-200 text-[#2E7D32] px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
              <span>🎉 Thanks for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
              />
              <Button type="submit" variant="primary" className="px-3.5 py-2.5 rounded-xl shrink-0">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <div>© 2026 DailyNest E-Commerce. All Rights Reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#2E7D32] transition">Privacy Policy</a>
          <a href="#" className="hover:text-[#2E7D32] transition">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
