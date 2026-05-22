import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import Toast from "../components/Toast";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast({ type: "success", message: "Your message has been sent successfully!" });
      setName("");
      setEmail("");
      setMessage("");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar />

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-16 w-full">
        <section className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-[#1E293B] mb-4">Contact Customer Support</h1>
          <p className="text-lg text-gray-600">
            Have questions about catalog pricing, logistics shipping, or refunds? Get in touch!
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Support Details */}
          <div className="flex flex-col justify-between space-y-8 bg-white p-8 border border-gray-100 rounded-2xl shadow-sm">
            <div>
              <h3 className="text-2xl font-bold text-[#1E293B] mb-6">Contact Information</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Feel free to reach out directly. Our average response time via support email is less than 6 hours.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-[#2E7D32]/10 p-3 rounded-lg text-[#2E7D32]">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400">PHONE INQUIRIES</div>
                    <div className="text-sm font-semibold text-[#1E293B]">+91 9025585770</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-[#2E7D32]/10 p-3 rounded-lg text-[#2E7D32]">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400">EMAIL SUPPORT</div>
                    <div className="text-sm font-semibold text-[#1E293B]">lsathish017@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-[#2E7D32]/10 p-3 rounded-lg text-[#2E7D32]">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400">HEADQUARTERS</div>
                    <div className="text-sm font-semibold text-[#1E293B]">Sivagiri, Erode, Tamilnadu - 638109</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Google Map */}
            <div className="w-full h-56 bg-slate-100 border border-slate-200 rounded-xl overflow-hidden relative shadow-inner">
              <iframe
                title="Office Location Map"
                src="https://maps.google.com/maps?q=Sivagiri,%20Erode,%20Tamilnadu%20-%20638109&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-300"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 border border-gray-100 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-bold text-[#1E293B] mb-6">Send Us A Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputBox
                label="Full Name"
                name="name"
                required
                placeholder="e.g. Sathish L"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <InputBox
                label="Email Address"
                name="email"
                type="email"
                required
                placeholder="e.g. sathish@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="flex flex-col w-full mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Type your message details here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all"
                ></textarea>
              </div>

              <Button type="submit" variant="primary" className="w-full py-3" isLoading={loading}>
                <Send className="w-4 h-4 mr-2" />
                Submit Message
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
