import React, { useState } from "react";
import { FaCheckCircle, FaPaperPlane, FaFileInvoice, FaHistory, FaClock } from "react-icons/fa";

const Subscriptions = () => {
  const [isInterested, setIsInterested] = useState(false);
  const [step, setStep] = useState(1); // 1: Invitation, 2: Details Form, 3: Invoice Pending

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Subscription Hub</h1>
        <p className="text-slate-500 mt-2 font-medium">Manage your journal access, track interests, and view invoices.</p>
      </div>

      {/* 1. Email Invitation / Interest Tracking Section (Req 1 & 2) */}
      {!isInterested ? (
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <span className="bg-blue-500 text-[10px] font-black uppercase px-3 py-1 rounded-full">New Invitation</span>
              <h2 className="text-3xl font-black mt-4 mb-3">Join our Premium Journal Network?</h2>
              <p className="text-slate-400 font-medium">We noticed you aren't subscribed yet. Would you like to receive exclusive research updates and full journal access?</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => { setIsInterested(true); setStep(2); }}
                className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-xl"
              >
                Yes, I'm Interested
              </button>
              <button className="bg-slate-800 text-slate-400 px-10 py-4 rounded-2xl font-black hover:bg-slate-700 transition-all border border-slate-700">
                No
              </button>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600/20 blur-3xl rounded-full"></div>
        </div>
      ) : (
        /* 2. Subscription Details Collection (Req 3) */
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">
              <FaCheckCircle />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Interest Recorded!</h3>
              <p className="text-slate-400 text-sm font-medium">Please provide the details below to generate your invoice.</p>
            </div>
          </div>

          {step === 2 ? (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subscription Duration</label>
                <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                  <option>1 Year</option>
                  <option>2 Years</option>
                  <option>3 Years</option>
                  <option>5 Years (Best Value)</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Category of Interest</label>
                <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                  <option>Medical</option>
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>All Categories (Bundle)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button 
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
                >
                  <FaPaperPlane className="text-xs" /> Generate & Email My Invoice
                </button>
              </div>
            </form>
          ) : (
            /* 3. Invoice & Payment Status (Req 4 & 5) */
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white rounded-2xl text-emerald-600 shadow-sm">
                  <FaFileInvoice />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">Invoice #INV-2026-001 Generated</h4>
                  <p className="text-slate-500 text-xs font-medium">Sent to your email. Check your inbox to complete the payment.</p>
                </div>
              </div>
              <button className="mt-4 md:mt-0 text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline">
                View Invoice PDF
              </button>
            </div>
          )}
        </div>
      )}

      {/* Summary Tracker Section (Admin/Record Keeping View) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <FaHistory className="text-blue-500" /> Subscription History
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-emerald-500" />
                <p className="text-sm font-bold text-slate-800">Interested in Medical Journals</p>
              </div>
              <span className="text-[10px] font-black text-slate-400 italic">Feb 12, 2026</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <FaClock className="text-amber-500" /> Recent Receipts
          </h3>
          <p className="text-slate-400 text-sm font-medium italic">No payment receipts available yet. Complete payment to generate.</p>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;