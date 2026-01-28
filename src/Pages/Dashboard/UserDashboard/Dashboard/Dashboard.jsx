import React from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import Navbar from "./Navbar";

const UserDashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main content area */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <Navbar />

        {/* Page content */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Welcome User!</h1>
          <p className="mb-6">This is your dashboard.</p>

          {/* Optional summary cards */}
          {/* <UserSummary /> */}

          {/* Nested routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
