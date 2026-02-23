import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import AdminSidebar from "./AdminSidebar";
import Navbar from "../../../Component/Navbar";

const AdminDashboard = () => {
  console.log("AdminDashboard Rendered");
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      console.log("User Name:", user.fullName);
      console.log("User Email:", user.primaryEmailAddress?.emailAddress);
      console.log("User Role:", user.publicMetadata?.role);
    }
  }, [isLoaded, user]);

  return (
    <div className="flex bg-gray-100 min-h-screen">


      <AdminSidebar />


      <div className="flex-1 ml-64">


        <div className="fixed top-0 left-64 right-0 z-10">
          <Navbar />
        </div>


        <div className="pt-20 px-8 pb-10">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

