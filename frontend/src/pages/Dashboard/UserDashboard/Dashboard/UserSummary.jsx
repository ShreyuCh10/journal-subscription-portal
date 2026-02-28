import React from "react";
import {
  FaBookOpen,
  FaWallet,
  FaClock,
  FaArrowUp,
  FaChevronRight,
  FaStar,
} from "react-icons/fa";

const UserSummary = () => {
  const stats = [
    {
      id: 1,
      label: "Active Subscriptions",
      value: "₹2,499",
      subValue: "Monthly spend",
      icon: <FaWallet />,
      trend: "+₹200 this month",
    },
    {
      id: 2,
      label: "Journals Read",
      value: "42",
      subValue: "Total library",
      icon: <FaBookOpen />,
      trend: "8 new this week",
    },
    {
      id: 3,
      label: "Reading Time",
      value: "18h 45m",
      subValue: "Avg 40m / day",
      icon: <FaClock />,
      trend: "Top 5% of users",
    },
  ];

  const recentJournals = [
    {
      title: "Clinical Cardiology Update",
      date: "12 Feb 2026",
      cat: "Medical",
      cost: "₹450",
    },
    {
      title: "AI in Financial Markets",
      date: "10 Feb 2026",
      cat: "Business",
      cost: "₹899",
    },
    {
      title: "Neural Networks Deep Dive",
      date: "08 Feb 2026",
      cat: "Technology",
      cost: "₹1,200",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Welcome back 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Your reading streak is at{" "}
            <span className="font-semibold text-indigo-600">
              12 days
            </span>.
          </p>
        </div>

        <button className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-black transition">
          Subscribe to Journal
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="bg-gray-100 text-gray-900 w-10 h-10 rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>

              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <FaArrowUp className="text-[10px]" />
                {stat.trend}
              </span>
            </div>

            <p className="text-xs text-gray-400 uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {stat.value}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {stat.subValue}
            </p>
          </div>
        ))}
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h2>
            <button className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
              View All <FaChevronRight />
            </button>
          </div>

          <div className="space-y-3">
            {recentJournals.map((journal, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center text-indigo-600">
                    <FaBookOpen />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {journal.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {journal.date} • {journal.cat}
                    </p>
                  </div>
                </div>

                <p className="font-medium text-gray-900">
                  {journal.cost}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Card */}
        <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-lg flex flex-col justify-between">
          <div>
            <FaStar className="text-yellow-400 text-xl mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Upgrade to Pro
            </h2>
            <p className="text-gray-300 text-sm">
              Get 20% off on premium journal access.
            </p>
          </div>

          <button className="mt-6 bg-white text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-200 transition">
            Upgrade for ₹999/yr
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSummary;