import React from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import Navbar from "../../../../Component/Navbar";

const UserDashboard = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Section */}
      <div className="flex-1 ml-64">
        
        {/* Navbar */}
        <div className="fixed top-0 left-64 right-0 z-10">
          <Navbar />
        </div>

        {/* Dynamic Page Content */}
        <div className="pt-20 px-8 pb-10">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
