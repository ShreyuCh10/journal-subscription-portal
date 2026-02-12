import React, { useState, useRef } from "react";
import { FaUserEdit, FaEnvelope, FaFingerprint, FaShieldAlt, FaMapMarkedAlt, FaBell, FaCamera } from "react-icons/fa";

const Profile = () => {
  // State for the communication toggle
  const [isNotifEnabled, setIsNotifEnabled] = useState(true);
  
  // State for the profile image - Defaulting to a professional placeholder
  const [profileImg, setProfileImg] = useState("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400");
  
  // Reference to the hidden file input
  const fileInputRef = useRef(null);

  // Function to handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to trigger the file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Profile</h1>
        <p className="text-slate-500 mt-2 font-medium">
          Manage the core details used for your subscription and invoicing records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Account Identity Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative overflow-hidden">
            <div className="relative inline-block group">
              {/* Profile Image Container */}
              <div className="w-32 h-32 bg-indigo-50 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-inner overflow-hidden">
                {profileImg ? (
                  <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FaFingerprint className="text-indigo-200 text-6xl" />
                )}
              </div>

              {/* Functional Camera Button */}
              <button 
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2.5 rounded-full border-4 border-white hover:bg-slate-900 transition-all shadow-lg cursor-pointer transform active:scale-90"
                title="Change Profile Picture"
              >
                <FaCamera className="text-sm" />
              </button>

              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            
            <h2 className="mt-5 text-2xl font-black text-slate-900 tracking-tight">Asmi Gupta</h2>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Verified User</p>
            
            <div className="mt-8 pt-8 border-t border-slate-50 flex justify-center gap-10">
              <div>
                <p className="text-xl font-black text-slate-900">₹4.3k</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Total Spent</p>
              </div>
              <div className="w-px h-10 bg-slate-100"></div>
              <div>
                <p className="text-xl font-black text-slate-900">02</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Active Plans</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl shadow-slate-200">
            <h3 className="font-bold flex items-center gap-2 mb-2 text-sm">
              <FaShieldAlt className="text-indigo-400" /> Database Integration
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Your profile data is securely stored and used to automatically generate receipts and invoices upon payment.
            </p>
          </div>
        </div>

        {/* Detailed Information Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <FaUserEdit className="text-indigo-600" /> Personal Details
            </h3>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                <input 
                  type="text" 
                  defaultValue="Asmi Gupta"
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email for Notifications</label>
                <input 
                  type="email" 
                  defaultValue="itsasmigupta@gmail.com"
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <FaMapMarkedAlt className="text-[8px]" /> Billing Address
                </label>
                <textarea 
                  rows="3"
                  placeholder="Enter your address here"
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all resize-none"
                />
              </div>
            </form>
            
            <button className="mt-10 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100">
              Update Database Records
            </button>
          </div>

          {/* Communication Settings */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <FaBell className="text-indigo-600" /> Communication Settings
            </h3>
            
            <div className="space-y-4">
              <div 
                onClick={() => setIsNotifEnabled(!isNotifEnabled)}
                className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-100 transition-all cursor-pointer"
              >
                <div className="max-w-md">
                  <p className="font-bold text-slate-900 text-sm">New Journal Notifications</p>
                  <p className="text-xs text-slate-500 font-medium italic">Automatically receive email invitations for non-subscribed journals.</p>
                </div>
                
                <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isNotifEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${isNotifEnabled ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;