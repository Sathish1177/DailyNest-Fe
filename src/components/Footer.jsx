import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Button from "./Button";
import InputBox from "./InputBox";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubsubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubsubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#1E293B] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-slate-800 pb-12">
        {/* About Branding Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5">
            <span className="bg-[#2E7D32] text-white font-black px-2.5 py-1.5 rounded-lg text-lg tracking-wider">DN</span>
            <span className="text-xl font-bold text-white tracking-tight">
              Daily<span className="text-[#2E7D32]">Nest</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your premium daily e-commerce helper. Shop fresh groceries, electronics, fashion, and home essentials with trust and speed.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="p-2 bg-slate-800 hover:bg-[#2E7D32] hover:text-white rounded-lg transition" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            <a href="#" className="p-2 bg-slate-800 hover:bg-[#2E7D32] hover:text-white rounded-lg transition" aria-label="Instagram">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="p-2 bg-slate-800 hover:bg-[#2E7D32] hover:text-white rounded-lg transition" aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Directory Links Column */}
        <div>
          <h4 className="text-white font-bold text-base mb-5 tracking-wide">Quick Links</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <Link to="/shop" className="hover:text-white hover:translate-x-1 inline-block transition">Shop All Products</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white hover:translate-x-1 inline-block transition">Our Story</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white hover:translate-x-1 inline-block transition">Contact Support</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white hover:translate-x-1 inline-block transition">Sign In</Link>
            </li>
          </ul>
        </div>

        {/* Customer Support Contact details */}
        <div>
          <h4 className="text-white font-bold text-base mb-5 tracking-wide">Contact Details</h4>
          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#2E7D32] shrink-0" />
              <span>Sivagiri, Erode, Tamilnadu - 638109</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#2E7D32] shrink-0" />
              <span>+91 9025585770</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#2E7D32] shrink-0" />
              <span>lsathish017@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter subscription */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-base tracking-wide">Newsletter</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            Subscribe to receive notifications about daily flash offers and new catalog updates.
          </p>
          
          {subscribed ? (
            <div className="bg-[#2E7D32]/10 border border-[#2E7D32]/25 text-emerald-400 px-4 py-2.5 rounded-lg text-sm font-semibold">
              🎉 Thanks for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
              />
              <Button type="submit" variant="primary" className="px-3 shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <div>© 2026 DailyNest E-Commerce. All Rights Reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-400">Privacy Policy</a>
          <a href="#" className="hover:text-slate-400">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
