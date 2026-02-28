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
  const linkClasses = ({ isActive }) =>
    `
    relative flex items-center gap-3 px-5 py-3 rounded-xl
    transition-all duration-200
    ${
      isActive
        ? "bg-gray-900 text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100 hover:text-black"
    }
  `;

  return (
    <div className="h-screen w-64 fixed left-0 top-0 bg-white border-r border-gray-200 flex flex-col">

      {/* Header */}
      <div className="h-20 flex items-center px-6 border-b border-gray-200">
        <img
          src="/image.svg"
          alt="Journal Hub Logo"
          className="h-10 w-10 object-contain"
        />
        <h3 className="ml-3 text-xl font-semibold text-gray-900 tracking-tight">
          Journal Hub
        </h3>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-2">

        <NavLink to="/dashboard" end className={linkClasses}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/dashboard/browse" className={linkClasses}>
          <FaBookOpen />
          <span>Browse Journals</span>
        </NavLink>

        <NavLink to="/dashboard/cart" className={linkClasses}>
          <FaBookOpen />
          <span>My Cart</span>
        </NavLink>

        <NavLink to="/dashboard/subscriptions" className={linkClasses}>
          <FaBookOpen />
          <span>My Subscriptions</span>
        </NavLink>

        <NavLink to="/dashboard/payments" className={linkClasses}>
          <FaCreditCard />
          <span>Payments</span>
        </NavLink>

        <NavLink to="/dashboard/profile" className={linkClasses}>
          <FaUser />
          <span>Profile</span>
        </NavLink>

        <NavLink to="/dashboard/settings" className={linkClasses}>
          <FaCog />
          <span>Settings</span>
        </NavLink>

        <NavLink to="/dashboard/support" className={linkClasses}>
          <FaLifeRing />
          <span>Support</span>
        </NavLink>

      </div>
    </div>
  );
};

export default UserSidebar;