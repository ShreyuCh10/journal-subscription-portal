import React, { useEffect, useState } from "react";
import {
  fetchUserSubscriptions,
  cancelSubscription,
} from "../../../Service/SubscriptionApi";
import { downloadReceiptByPaymentId } from "../../../Service/ReceiptApi";
import { getCurrentUser } from "../../../Service/UserApi";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
} from "react-icons/fa";

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cancellingId, setCancellingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadSubscriptions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [subscriptions, search, statusFilter]);

  // ================= LOAD =================
  const loadSubscriptions = async () => {
    try {
      const userRes = await getCurrentUser();
      const user = userRes.data;

      if (!user?.id) return;

      const response = await fetchUserSubscriptions(user.id);
      setSubscriptions(response.data);
      setFiltered(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= FILTER =================
  const applyFilters = () => {
    let data = [...subscriptions];

    if (statusFilter !== "all") {
      data = data.filter((s) => s.status === statusFilter);
    }

    if (search.trim()) {
      data = data.filter((s) =>
        s.journalTitle?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(data);
  };

  // ================= HELPERS =================
  const getDaysLeft = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  };

  const getProgress = (start, end) => {
    const total = new Date(end) - new Date(start);
    const done = new Date() - new Date(start);
    return Math.min((done / total) * 100, 100);
  };

  // ================= ACTIONS =================

  const handleDownload = async (receiptId) => {
    try {
      const response = await downloadReceiptByPaymentId(receiptId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${receiptId}.pdf`);
      link.click();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) return;

    setCancellingId(id);

    try {
      await cancelSubscription(id);

      // ✅ UPDATE UI
      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: "CANCELLED" } : s
        )
      );
    } catch (err) {
      console.error(err);
      alert("Cancel failed");
    } finally {
      setCancellingId(null);
    }
  };

  const handleViewShipments = (journalId) => {
    navigate(`/dashboard/shipments?journal=${journalId}`);
  };

  const handleRenew = (sub) => {
    navigate(`/checkout?renew=${sub.id}`);
  };

  // ================= STATS =================
  const activeCount = subscriptions.filter(s => s.status === "ACTIVE").length;
  const cancelledCount = subscriptions.filter(s => s.status === "CANCELLED").length;

  // ================= UI =================

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <h1 className="text-3xl font-black">My Subscriptions</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold">{subscriptions.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="text-xl font-bold text-red-600">{cancelledCount}</p>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search journal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-xl w-full"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded-xl"
        >
          <option value="all">All</option>
          <option value="ACTIVE">Active</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 font-semibold">
          No subscriptions found
        </div>
      ) : (
        filtered.map((sub) => {
          const isActive = sub.status === "ACTIVE";
          const daysLeft = getDaysLeft(sub.endDate);

          return (
            <div key={sub.id} className="bg-white rounded-2xl p-6 shadow border">
              <div className="flex justify-between">

                {/* LEFT */}
                <div className="space-y-3 w-full">
                  <h2 className="font-bold text-lg">{sub.journalTitle}</h2>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCalendarAlt />
                    {new Date(sub.startDate).toLocaleDateString()} -{" "}
                    {new Date(sub.endDate).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    {isActive ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaTimesCircle className="text-red-500" />
                    )}
                    {sub.status}
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${getProgress(sub.startDate, sub.endDate)}%` }}
                    />
                  </div>

                  {isActive && daysLeft <= 30 && (
                    <p className="text-red-500 text-xs font-bold">
                      ⚠ Expiring in {daysLeft} days
                    </p>
                  )}
                </div>

                {/* RIGHT */}
                <div className="flex flex-col gap-2 items-end">



                  <button
                    onClick={() => handleViewShipments(sub.journalId)}
                    className="text-indigo-600 text-xs font-bold"
                  >
                    Shipments
                  </button>

                  {isActive && (
                    <>
                      <button
                        onClick={() => handleRenew(sub)}
                        className="bg-indigo-600 text-white px-4 py-1 rounded-lg text-xs"
                      >
                        Renew
                      </button>

                      <button
                        onClick={() => handleCancel(sub.id)}
                        disabled={cancellingId === sub.id}
                        className="bg-red-500 text-white px-4 py-1 rounded-lg text-xs"
                      >
                        {cancellingId === sub.id ? "Cancelling..." : "Cancel"}
                      </button>
                    </>
                  )}
                </div>

              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MySubscriptions;