import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBook,
  FaCreditCard,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

const AdminSidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 w-64 shadow-lg flex flex-col">

      <div className="bg-gradient-to-r from-blue-500 to-purple-700 h-20 flex items-center justify-center shadow-md">
        <div className="flex items-center space-x-4">
          <img
            src="/image.svg"
            alt="Journal Hub Logo"
            className="h-14 w-14 object-cover"
          />
          <h3
            className="text-2xl font-semibold tracking-wider text-white"
            style={{ fontFamily: "'Pacifico', cursive", letterSpacing: "2px" }}
          >
            Admin Hub
          </h3>
        </div>
      </div>

      <div className="px-4 space-y-2 mt-4">

      
        <NavLink
          to="/admin-dashboard"
          end
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : ""} flex items-center space-x-4 px-4 py-2.5 rounded hover:bg-blue-700 transition-colors`
          }
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>




        <NavLink
          to="/admin-dashboard/users"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : ""} flex items-center space-x-4 px-4 py-2.5 rounded hover:bg-blue-700 transition-colors`
          }
        >
          <FaUsers />
          <span>Manage Users</span>
        </NavLink>


        <NavLink
                  to="/admin-dashboard/subscriptions"
                  end
                  className={({ isActive }) =>
                    `${isActive ? "bg-blue-500" : ""} flex items-center space-x-4 px-4 py-2.5 rounded hover:bg-blue-700 transition-colors`
                  }
                >
                  <FaTachometerAlt />
                  <span>Manage-Subscription</span>
                </NavLink>






        <NavLink
          to="/admin-dashboard/journals"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : ""} flex items-center space-x-4 px-4 py-2.5 rounded hover:bg-blue-700 transition-colors`
          }
        >
          <FaBook />
          <span>Manage Journals</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/payments"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : ""} flex items-center space-x-4 px-4 py-2.5 rounded hover:bg-blue-700 transition-colors`
          }
        >
          <FaCreditCard />
          <span>Payments</span>
        </NavLink>

     
        <NavLink
          to="/admin-dashboard/reports"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : ""} flex items-center space-x-4 px-4 py-2.5 rounded hover:bg-blue-700 transition-colors`
          }
        >
          <FaChartBar />
          <span>Reports</span>
        </NavLink>

     
        <NavLink
          to="/admin-dashboard/settings"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : ""} flex items-center space-x-4 px-4 py-2.5 rounded hover:bg-blue-700 transition-colors`
          }
        >
          <FaCog />
          <span>Settings</span>
        </NavLink>

      </div>
    </div>
  );
};

export default AdminSidebar;