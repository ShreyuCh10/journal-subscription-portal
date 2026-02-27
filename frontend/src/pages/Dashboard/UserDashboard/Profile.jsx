import React, { useState, useRef, useEffect } from "react";
import { FaUserEdit, FaFingerprint, FaShieldAlt, FaMapMarkedAlt, FaBell, FaCamera } from "react-icons/fa";
import { getCurrentUser, updateCurrentUser } from "../../../Service/UserApi";

const Profile = () => {
  const [isNotifEnabled, setIsNotifEnabled] = useState(true);
  const [profileImg, setProfileImg] = useState("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    billingAddress: ""
  });
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await getCurrentUser();
        const user = response.data;


        setFormData({
          fullName: user.fullName || "Asmi Gupta",
          email: user.email || "itsasmigupta@gmail.com",
          billingAddress: user.billingAddress || ""
        });

        if (user.profilePicture) setProfileImg(user.profilePicture);
      } catch (err) {
        console.error("Error connecting to database:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateCurrentUser(formData);
      alert(`Success: ${formData.fullName}'s profile updated!`);
    } catch (err) {
      console.error("Database sync failed:", err);
      alert("Failed to update database records.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-indigo-600 text-xl">Connecting to Database...</div>;

  return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Dynamic Header */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {formData.fullName ? formData.fullName.split(' ')[0] : "User"}'s Profile
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Personal details and subscription records for {formData.fullName}.
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
            <p className="text-sm font-black text-indigo-600">{formData.email}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative overflow-hidden">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-indigo-50 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-inner overflow-hidden">
                  {profileImg ? (
                      <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                      <FaFingerprint className="text-indigo-200 text-6xl" />
                  )}
                </div>
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2.5 rounded-full border-4 border-white hover:bg-slate-900 transition-all shadow-lg cursor-pointer transform active:scale-90"
                >
                  <FaCamera className="text-sm" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>

              <h2 className="mt-5 text-2xl font-black text-slate-900 tracking-tight">
                {formData.fullName || "User Name"}
              </h2>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Verified User</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl shadow-slate-200">
              <h3 className="font-bold flex items-center gap-2 mb-2 text-sm">
                <FaShieldAlt className="text-indigo-400" /> Database Integration
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Your profile data is securely stored in your MySQL database for automatic receipt generation.
              </p>
            </div>
          </div>

          {/* Dynamic Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <FaUserEdit className="text-indigo-600" /> Personal Details
              </h3>

              <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                  <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email for Notifications</label>
                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-400 cursor-not-allowed outline-none"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <FaMapMarkedAlt className="text-[8px]" /> Billing Address
                  </label>
                  <textarea
                      name="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Enter your address for invoices"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                      type="submit"
                      disabled={isUpdating}
                      className="mt-4 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl disabled:bg-slate-400"
                  >
                    {isUpdating ? "Syncing with Database..." : "Update Database Records"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Profile;