import React from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import Navbar from "../../../../Component/Navbar";

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Sidebar */}
      <UserSidebar />

      {/* Main Layout */}
      <div className="ml-64 flex flex-col min-h-screen">

        {/* Navbar */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <Navbar />
        </div>

        {/* Page Content */}
        <main className="flex-1 px-10 py-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default UserDashboard;
