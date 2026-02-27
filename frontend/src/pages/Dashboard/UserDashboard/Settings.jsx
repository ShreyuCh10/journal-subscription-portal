import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLock, FaShieldAlt, FaBell, FaUserShield,
  FaCreditCard, FaGlobe, FaMoon, FaSun, FaFileInvoiceDollar
} from "react-icons/fa";

const Settings = () => {
  const navigate = useNavigate();

  const [emailNotif, setEmailNotif] = useState(true);
  const [autoRenew, setAutoRenew] = useState(true);
  const [darkMode, setDarkMode] = useState(false);


  const [currency, setCurrency] = useState("INR");

  return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Settings</h1>
            <p className="text-slate-500 mt-2 font-medium">
              Configure your security, billing, and notification preferences.
            </p>
          </div>
          <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-600 hover:text-indigo-600 transition-all"
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Security Section: Connected to ResetPassword.jsx */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <FaLock className="text-indigo-600" /> Account Security
              </h3>

              <div className="space-y-4">
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Password changes require email verification via a secure 6-digit reset code.
                </p>

                <button
                    onClick={() => navigate("/reset-password")}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  <FaShieldAlt className="text-[10px]" /> Change Password
                </button>

                <div className="pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Security Status</p>
                  <div className="flex items-center gap-2 text-green-600 font-bold text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Protected by Clerk Auth
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100">
              <h3 className="text-lg font-black text-red-900 flex items-center gap-2">
                <FaUserShield /> Privacy Control
              </h3>
              <p className="text-red-600/70 text-[11px] font-medium mt-2">
                Deleting your account permanently removes all subscription history from our database.
              </p>
              <button className="mt-4 text-red-600 font-black text-[10px] uppercase tracking-widest hover:underline bg-transparent border-none cursor-pointer">
                Request Data Deletion
              </button>
            </div>
          </div>

          {/* Subscription & Regional Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <FaCreditCard className="text-indigo-600" /> Subscription
              </h3>

              <div className="space-y-4">
                <div
                    onClick={() => setAutoRenew(!autoRenew)}
                    className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl cursor-pointer hover:bg-slate-100 transition-all"
                >
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Auto-Renewal</p>
                    <p className="text-[10px] text-slate-500 font-medium">Manage your 02 active plans.</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative ${autoRenew ? 'bg-green-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${autoRenew ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Automated Invoices</p>
                    <p className="text-[10px] text-slate-500 font-medium">Syncing with MySQL database records.</p>
                  </div>
                  <FaFileInvoiceDollar className="text-slate-400" />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <FaGlobe className="text-indigo-600" /> Regional
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Currency</label>
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none appearance-none"
                >
                  <option value="INR">₹ INR (Indian Rupee)</option>
                  <option value="USD">$ USD (US Dollar)</option>
                  <option value="EUR">€ EUR (Euro)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <FaBell className="text-indigo-600" /> Notifications
              </h3>

              <div className="space-y-4">
                <div
                    onClick={() => setEmailNotif(!emailNotif)}
                    className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl cursor-pointer hover:bg-slate-100 transition-all"
                >
                  <div>
                    <p className="font-bold text-slate-900 text-sm">New Journal Alerts</p>
                    <p className="text-[10px] text-slate-500 font-medium">Notifications for non-subscribed items.</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative ${emailNotif ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${emailNotif ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Security Alerts</p>
                    <p className="text-[10px] text-slate-500 font-medium italic">When a reset code is requested.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-indigo-600 h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
  );
};

export default Settings;