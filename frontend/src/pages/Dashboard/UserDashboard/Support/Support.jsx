import React, { useState } from "react";
import { FaQuestionCircle, FaHeadset, FaFileInvoice, FaShieldAlt, FaPaperPlane } from "react-icons/fa";

const Support = () => {
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    { q: "I haven't received my invoice email?", a: "Invoices are generated automatically based on your subscription form. Please check your spam folder or trigger a resend from the Payments page." },
    { q: "How do I access my payment receipts?", a: "Once payment is confirmed, receipts are sent to your registered email and securely stored in your account database for future reference." },
    { q: "How do I change my subscription duration?", a: "You can update your interest and duration by resubmitting the structured subscription form in the Subscriptions tab." },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Help & Support</h1>
        <p className="text-slate-500 mt-2 font-medium">
          Get assistance with subscription tracking, invoicing, and payment receipts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <FaHeadset className="text-indigo-600" /> Submit a Support Ticket
            </h3>
            
            {!submitted ? (
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Category</label>
                    <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                      <option>Invoice Not Received</option>
                      <option>Payment Confirmation Issue</option>
                      <option>Accessing Receipts</option>
                      <option>Other Technical Support</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference ID (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. INV-2026-001"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    rows="4"
                    placeholder="Describe your issue in detail..."
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all resize-none"
                  />
                </div>

                <button 
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 flex items-center gap-2"
                >
                  <FaPaperPlane /> Send Support Request
                </button>
              </form>
            ) : (
              <div className="py-10 text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                  <FaShieldAlt />
                </div>
                <h4 className="text-2xl font-black text-slate-900">Request Received</h4>
                <p className="text-slate-500 font-medium">Our team will review your record in the database and get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Send another message</button>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
            <h3 className="text-lg font-black flex items-center gap-2 mb-6">
              <FaQuestionCircle className="text-indigo-400" /> Quick FAQ
            </h3>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-xs font-black text-indigo-400 uppercase tracking-tight">{faq.q}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
            <h4 className="text-indigo-900 font-black text-sm flex items-center gap-2">
              <FaFileInvoice className="text-indigo-500" /> Missing a Receipt?
            </h4>
            <p className="text-indigo-700/70 text-[10px] font-bold mt-2 leading-relaxed uppercase tracking-tighter">
              All receipts are stored in the system database. If you cannot find one, please include your Reference ID in the support ticket.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;