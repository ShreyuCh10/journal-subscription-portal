import React from "react";
import Navbar from "../Dashboard/Navbar";
import UserSidebar from "../Dashboard/UserSidebar";
import { FaSearch } from "react-icons/fa";

const BrowseJournals = () => {
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

        {/* Page Content */}
        <div className="pt-20 px-8 pb-10">
          
          {/* Page Title */}
          <h1 className="text-3xl font-bold mb-6">Browse Journals</h1>

          {/* Search + Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            
            {/* Search */}
            <div className="flex items-center bg-white shadow-md rounded-lg px-4 py-3 w-full md:w-1/2">
              <FaSearch className="text-gray-500 mr-3" />
              <input
                type="text"
                placeholder="Search journals by title, category..."
                className="outline-none w-full"
              />
            </div>

            {/* Category Filter */}
            <select className="bg-white shadow-md px-4 py-3 rounded-lg w-full md:w-1/4">
              <option>All Categories</option>
              <option>Technology</option>
              <option>Medical</option>
              <option>Business</option>
              <option>Science</option>
            </select>
          </div>

          {/* Journals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {[1, 2, 3, 4, 5, 6].map((journal) => (
              <div
                key={journal}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300"
              >
                <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>

                <h2 className="text-xl font-semibold mb-2">
                  Journal Title {journal}
                </h2>

                <p className="text-gray-600 text-sm mb-4">
                  This journal covers research and insights related to modern
                  developments in its field.
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-semibold">
                    $29 / month
                  </span>

                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default BrowseJournals;
