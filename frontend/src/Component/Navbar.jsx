import React from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) return null;

  const role = user?.publicMetadata?.role;

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/login" });
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">

      {/* Left Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {role === "admin" ? "Admin Dashboard" : "User Dashboard"}
        </h2>
        <p className="text-xs text-gray-400">
          Welcome back, {user?.firstName || "User"}
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">

        {/* Role Badge */}
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-600">
          {role === "admin" ? "Admin" : "User"}
        </span>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <img
            src={user?.imageUrl}
            alt="profile"
            className="w-9 h-9 rounded-full border border-gray-200"
          />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Navbar;
