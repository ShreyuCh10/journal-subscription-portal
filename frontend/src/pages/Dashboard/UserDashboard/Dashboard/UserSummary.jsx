import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaCreditCard,
  FaTruck,
  FaBoxOpen,
  FaChevronRight,
  FaSearch,
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaShippingFast,
} from "react-icons/fa";

import { getMyPayments } from "../../../../Service/PaymentApi";
import { getUserShipments } from "../../../../Service/DispatchApi";
import { getAllSubscriptions } from "../../../../Service/SubscriptionApi";
import { getCurrentUser } from "../../../../Service/UserApi";

const UserSummary = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [dispatch, setDispatch] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userRes, subRes, payRes, shipRes] = await Promise.all([
        getCurrentUser(),
        getAllSubscriptions(),
        getMyPayments(),
        getUserShipments(),
      ]);
      setUser(userRes.data);
      setSubscriptions(subRes.data);
      setPayments(payRes.data);
      setDispatch(shipRes.data);
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  const activeSubs = subscriptions.filter((s) => s.status === "ACTIVE").length;
  const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingShipments = dispatch.filter((d) => d.status !== "DELIVERED").length;

  // Calculate days until next expiry
  const nextExpiry = subscriptions
    .filter((s) => s.status === "ACTIVE" && s.endDate)
    .map((s) => ({ ...s, daysLeft: Math.ceil((new Date(s.endDate) - new Date()) / (1000 * 60 * 60 * 24)) }))
    .sort((a, b) => a.daysLeft - b.daysLeft)[0];

  const getStatusBadge = (status) => {
    const map = {
      PENDING: { color: "bg-amber-100 text-amber-700", label: "Pending" },
      PACKED: { color: "bg-blue-100 text-blue-700", label: "Packed" },
      SHIPPED: { color: "bg-indigo-100 text-indigo-700", label: "Shipped" },
      IN_TRANSIT: { color: "bg-purple-100 text-purple-700", label: "In Transit" },
      DELIVERED: { color: "bg-emerald-100 text-emerald-700", label: "Delivered" },
    };
    const s = map[status] || map.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.color}`}>
        {s.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-white/5 rounded-full translate-y-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.fullName?.split(" ")[0] || "User"} 👋
          </h1>
          <p className="text-indigo-200 text-sm">
            Here's an overview of your journal subscriptions and activity.
          </p>
          {nextExpiry && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl text-sm">
              <FaClock className="text-amber-300" />
              <span>
                <strong>{nextExpiry.journalTitle}</strong> expires in{" "}
                <strong>{nextExpiry.daysLeft} days</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-5">
        <div
          onClick={() => navigate("/dashboard/subscriptions")}
          className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
            <FaBookOpen className="text-indigo-600" />
          </div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Active Subscriptions
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">{activeSubs}</h2>
          <p className="text-xs text-gray-400 mt-2">
            {subscriptions.length} total subscriptions
          </p>
        </div>

        <div
          onClick={() => navigate("/dashboard/payments")}
          className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
            <FaCreditCard className="text-emerald-600" />
          </div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Total Payments
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {payments.length}
          </h2>
          <p className="text-xs text-gray-400 mt-2">₹{totalSpent.toLocaleString()} spent</p>
        </div>

        <div
          onClick={() => navigate("/dashboard/shipments")}
          className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
            <FaTruck className="text-orange-500" />
          </div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            My Shipments
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {dispatch.length}
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            {pendingShipments} in progress
          </p>
        </div>

        <div
          onClick={() => navigate("/dashboard/browse")}
          className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
            <FaSearch className="text-purple-600" />
          </div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Browse Journals
          </p>
          <h2 className="text-lg font-bold text-gray-900 mt-1">Explore</h2>
          <p className="text-xs text-gray-400 mt-2">
            Discover new journals
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <FaCreditCard className="text-emerald-500" /> Recent Payments
            </h2>
            <button
              onClick={() => navigate("/dashboard/payments")}
              className="text-indigo-600 flex items-center gap-1 text-xs font-semibold hover:underline"
            >
              View All <FaChevronRight className="text-[10px]" />
            </button>
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <FaCreditCard className="text-3xl mx-auto mb-3 text-gray-200" />
              <p className="text-sm font-medium">No payments yet</p>
              <p className="text-xs mt-1">Subscribe to a journal to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <FaBoxOpen className="text-indigo-500 text-sm" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {p.journalTitle}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(p.paymentDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-gray-900">₹{p.amount}</p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.status === "SUCCESS"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Shipments */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <FaShippingFast className="text-orange-500" /> Recent Shipments
            </h2>
            <button
              onClick={() => navigate("/dashboard/shipments")}
              className="text-indigo-600 flex items-center gap-1 text-xs font-semibold hover:underline"
            >
              View All <FaChevronRight className="text-[10px]" />
            </button>
          </div>

          {dispatch.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <FaTruck className="text-3xl mx-auto mb-3 text-gray-200" />
              <p className="text-sm font-medium">No shipments yet</p>
              <p className="text-xs mt-1">Shipments appear after you subscribe</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dispatch.slice(0, 4).map((d) => (
                <div
                  key={d.id}
                  className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
                      <FaTruck className="text-orange-500 text-sm" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {d.journalTitle || `Shipment #${d.id}`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {d.trackingNumber || "Tracking pending"}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(d.status)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Subscriptions */}
      {subscriptions.filter((s) => s.status === "ACTIVE").length > 0 && (
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <FaCalendarCheck className="text-indigo-500" /> Active Subscriptions
            </h2>
            <button
              onClick={() => navigate("/dashboard/subscriptions")}
              className="text-indigo-600 flex items-center gap-1 text-xs font-semibold hover:underline"
            >
              Manage <FaChevronRight className="text-[10px]" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {subscriptions
              .filter((s) => s.status === "ACTIVE")
              .slice(0, 4)
              .map((sub) => {
                const daysLeft = Math.ceil(
                  (new Date(sub.endDate) - new Date()) / (1000 * 60 * 60 * 24)
                );
                const isExpiring = daysLeft <= 7;

                return (
                  <div
                    key={sub.id}
                    className={`p-4 rounded-xl border ${
                      isExpiring
                        ? "border-amber-200 bg-amber-50/50"
                        : "border-gray-100 hover:border-indigo-200"
                    } transition-all`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm text-gray-900">
                          {sub.journalTitle}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(sub.startDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}{" "}
                          →{" "}
                          {new Date(sub.endDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaCheckCircle
                          className={
                            isExpiring ? "text-amber-500" : "text-emerald-500"
                          }
                        />
                        <span
                          className={`text-xs font-bold ${
                            isExpiring ? "text-amber-600" : "text-emerald-600"
                          }`}
                        >
                          {daysLeft}d left
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isExpiring ? "bg-amber-400" : "bg-indigo-500"
                          }`}
                          style={{
                            width: `${Math.max(
                              5,
                              Math.min(
                                100,
                                ((new Date() - new Date(sub.startDate)) /
                                  (new Date(sub.endDate) -
                                    new Date(sub.startDate))) *
                                  100
                              )
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate("/dashboard/browse")}
          className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all group text-left"
        >
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <FaSearch className="text-indigo-600" />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900">Browse Journals</p>
            <p className="text-xs text-gray-400">Find new journals to subscribe</p>
          </div>
        </button>

        <button
          onClick={() => navigate("/dashboard/profile")}
          className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-purple-300 hover:shadow-md transition-all group text-left"
        >
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
            <FaBoxOpen className="text-purple-600" />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900">Edit Profile</p>
            <p className="text-xs text-gray-400">Update your account details</p>
          </div>
        </button>

        <button
          onClick={() => navigate("/dashboard/settings")}
          className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-emerald-300 hover:shadow-md transition-all group text-left"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
            <FaCalendarCheck className="text-emerald-600" />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900">Settings</p>
            <p className="text-xs text-gray-400">Manage preferences & security</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default UserSummary;