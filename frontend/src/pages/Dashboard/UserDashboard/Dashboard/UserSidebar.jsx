import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBookOpen,
  FaCreditCard,
  FaUser,
  FaCog,
  FaLifeRing,
} from "react-icons/fa";

const UserSidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 w-64 shadow-lg flex flex-col">
      
      {/* Sidebar Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-20 flex items-center justify-center shadow-md">
        <div className="flex items-center space-x-6">
          <img
            src="/image.svg"
            alt="Journal Hub Logo"
            className="h-16 w-16 object-cover"
          />
        </div>
        <h3
          className="text-2xl font-semibold tracking-wider text-white"
          style={{ fontFamily: "'Pacifico', cursive", letterSpacing: "2px" }}
        >
          Journal Hub
        </h3>
      </div>

      {/* Sidebar Links */}
      <div className="px-4 space-y-2 mt-4">
        {/* DASHBOARD LINK - Added 'end' prop here */}
        <NavLink
          to="/userdashboard"
          end
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : ""} flex items-center space-x-4 px-4 py-2.5 rounded hover:bg-blue-700 transition-colors`
          }
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/dashboard/browse"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : ""} flex items-center space-x-4 px-4 py-2.5 rounded hover:bg-blue-700 transition-colors`
          }
        >
          <FaBookOpen />
          <span>Browse Journals</span>
        </NavLink>

        <NavLink
          to="/userdashboard/subscriptions"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : ""} flex items-center space-x-4 px-4 py-2.5 rounded hover:bg-blue-700 transition-colors`
          }
        >
          <FaBookOpen />
          <span>My Subscriptions</span>
        </NavLink>

        <NavLink
          to="/userdashboard/payments"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : ""} flex items-center space-x-4 px-4 py-2.5 rounded hover:bg-blue-700 transition-colors`
          }
        >
          <FaCreditCard />
          <span>Payments</span>
        </NavLink>

        <NavLink
          to="/userdashboard/profile"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : ""} flex items-center space-x-4 px-4 py-2.5 rounded hover:bg-blue-700 transition-colors`
          }
        >
          <FaUser />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/userdashboard/settings"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : ""} flex items-center space-x-4 px-4 py-2.5 rounded hover:bg-blue-700 transition-colors`
          }
        >
          <FaCog />
          <span>Settings</span>
        </NavLink>

        <NavLink
          to="/userdashboard/support"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : ""} flex items-center space-x-4 px-4 py-2.5 rounded hover:bg-blue-700 transition-colors`
          }
        >
          <FaLifeRing />
          <span>Support</span>
        </NavLink>
      </div>
    </div>
  );
};

export default UserSidebar;