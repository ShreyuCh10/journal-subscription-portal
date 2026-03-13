import React, { useState, useRef, useEffect } from "react";
import {
  FaUserEdit,
  FaFingerprint,
  FaShieldAlt,
  FaMapMarkedAlt,
  FaCamera
} from "react-icons/fa";

import {
  getCurrentUser,
  updateCurrentUser,
  uploadProfileImage
} from "../../../Service/UserApi";

const Profile = () => {

  const fileInputRef = useRef(null);

  const [profileImg, setProfileImg] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    billingAddress: ""
  });

  const [subscriptions, setSubscriptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {

        const res = await getCurrentUser();
        const user = res.data;
        console.log(res.data);

        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          billingAddress: user.billingAddress || ""
        });

        if (user.profilePicture) {
          setProfileImg(user.profilePicture);
        }

        if (user.subscriptions) {
          setSubscriptions(user.subscriptions);
        }

      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();

  }, []);

  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };

  const handleUpdate = async (e) => {

    e.preventDefault();
    setIsUpdating(true);

    try {

      await updateCurrentUser(formData);

      alert("Profile updated successfully");

    } catch (err) {

      console.error("Update failed", err);
      alert("Failed to update profile");

    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = async (event) => {

    const file = event.target.files[0];

    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {

      const res = await uploadProfileImage(data);
      setProfileImg(res.data);

    } catch (err) {

      console.error("Image upload failed", err);

    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center font-black animate-pulse text-indigo-600 text-xl">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}

      <header className="flex justify-between items-end">

        <div>

          <h1 className="text-4xl font-black text-slate-900">
            {formData.fullName
              ? formData.fullName.split(" ")[0]
              : "User"}'s Profile
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your personal details
          </p>

        </div>

        <div className="hidden md:block text-right">

          <p className="text-xs text-slate-400 uppercase">
            Signed in as
          </p>

          <p className="font-bold text-indigo-600">
            {formData.email}
          </p>

        </div>

      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Profile Card */}

        <div className="bg-white p-8 rounded-3xl shadow text-center">

          <div className="relative inline-block">

            <div className="w-32 h-32 bg-indigo-50 rounded-full overflow-hidden">

              {profileImg ? (

                <img
                  src={`http://localhost:8080${profileImg}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />

              ) : (

                <FaFingerprint className="text-indigo-200 text-6xl m-auto mt-6" />

              )}

            </div>

            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full"
            >
              <FaCamera />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />

          </div>

          <h2 className="mt-5 text-2xl font-bold">
            {formData.fullName || "User"}
          </h2>

        </div>

        {/* Form */}

        <div className="lg:col-span-2 bg-white p-10 rounded-3xl shadow">

          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">

            <FaUserEdit /> Personal Details

          </h3>

          <form
            onSubmit={handleUpdate}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="p-4 rounded-xl bg-slate-50"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="p-4 rounded-xl bg-slate-100"
            />

            <textarea
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleInputChange}
              placeholder="Billing Address"
              className="md:col-span-2 p-4 rounded-xl bg-slate-50"
            />

            <button
              type="submit"
              disabled={isUpdating}
              className="md:col-span-2 bg-slate-900 text-white py-4 rounded-xl"
            >
              {isUpdating
                ? "Updating..."
                : "Update Profile"}
            </button>

          </form>

        </div>

      </div>

      {/* Subscription History */}

      <div className="bg-white p-10 rounded-3xl shadow">

        <h3 className="text-xl font-bold mb-6">
          Subscription History
        </h3>

        {subscriptions.length === 0 && (
          <p className="text-gray-400">
            No subscriptions yet
          </p>
        )}

        {subscriptions.map((sub) => (

          <div
            key={sub.id}
            className="flex justify-between border-b py-4"
          >

            <div>

              <p className="font-bold">
                {sub.planName}
              </p>

              <p className="text-sm text-gray-500">
                {sub.startDate}
              </p>

            </div>

            <p className="font-bold text-indigo-600">
              ₹{sub.amount}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Profile;