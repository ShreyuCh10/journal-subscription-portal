import React, { useState } from "react"; // Ensure this import is exactly like this!
import { FaLock, FaShieldAlt, FaBell, FaEye, FaEyeSlash, FaUserShield } from "react-icons/fa";

const Settings = () => {
  // State for toggles and password visibility
  const [emailNotif, setEmailNotif] = useState(true);
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 mt-2 font-medium">
          Configure your security preferences and communication rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Security & Password Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <FaLock className="text-indigo-600" /> Change Password
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
              <div className="relative">
                <input 
                  type={showPass ? "text" : "password"} 
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative">
                <input 
                  type={showPass ? "text" : "password"} 
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all"
                  placeholder="••••••••"
                />
                <button 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100">
              Update Security Credentials
            </button>
          </div>
        </div>

        {/* Preferences & Notifications Section */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <FaBell className="text-indigo-600" /> App Preferences
            </h3>
            
            <div className="space-y-4">
              {/* Communication Toggle (Req 1) */}
              <div 
                onClick={() => setEmailNotif(!emailNotif)}
                className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl cursor-pointer hover:border-slate-200 border border-transparent transition-all"
              >
                <div>
                  <p className="font-bold text-slate-900 text-sm">Email Alerts</p>
                  <p className="text-[10px] text-slate-500 font-medium italic">Notifications for non-subscribed journals.</p>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${emailNotif ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${emailNotif ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl opacity-60">
                <div>
                  <p className="font-bold text-slate-900 text-sm">Two-Factor Auth</p>
                  <p className="text-[10px] text-slate-500 font-medium">Extra layer of security for payments.</p>
                </div>
                <div className="w-10 h-5 bg-slate-200 rounded-full relative">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100">
            <h3 className="text-lg font-black text-red-900 flex items-center gap-2">
              <FaUserShield /> Privacy Control
            </h3>
            <p className="text-red-600/70 text-[11px] font-medium mt-2 leading-relaxed">
              Deleting your account will permanently remove all subscription history and stored receipts from the system database.
            </p>
            <button className="mt-4 text-red-600 font-black text-[10px] uppercase tracking-widest hover:underline">
              Request Data Deletion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;