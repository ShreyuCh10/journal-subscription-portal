import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  const handleLogout = () => {
    navigate("/login");
  };

  if (!isLoaded) return null;

  const role = user?.publicMetadata?.role;   

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-16 flex items-center justify-end px-6 shadow-md">
      <h2 className="text-xl font-bold text-white mr-6">
        {role === "admin" ? "Welcome, Admin" : "Welcome, User"}
      </h2>

      <button
        onClick={handleLogout}
        className="bg-white text-blue-700 font-semibold px-4 py-1.5 rounded-md hover:bg-gray-100 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
