import React, { useEffect, useState } from "react";
import {
  fetchUserSubscriptions,
  cancelSubscription,
} from "../../../Service/SubscriptionApi";
import { downloadReceipt } from "../../../Service/ReceiptApi";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../../Service/CheckoutApi";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
} from "react-icons/fa";

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ MOVE OUTSIDE useEffect
  const loadSubscriptions = async () => {
    try {
      const stored = localStorage.getItem("user");
      const user = JSON.parse(stored);

      const response = await fetchUserSubscriptions(user.id);
      setSubscriptions(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handleDownload = async (receiptId) => {
    try {
      const response = await downloadReceipt(receiptId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${receiptId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  // 🔴 CANCEL
  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this subscription?"
    );
    if (!confirmCancel) return;

    try {
      await cancelSubscription(id);

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === id ? { ...sub, status: "CANCELLED" } : sub
        )
      );

      alert("Subscription cancelled.");
    } catch (error) {
      console.error(error);
      alert("Cancellation failed.");
    }
  };



  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400 font-bold">
        Loading subscriptions...
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400 font-bold">
        No subscriptions found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-black text-slate-900">
        Manage Subscriptions
      </h1>

      {subscriptions.map((sub) => {
        const isActive = sub.status === "ACTIVE";

        return (
          <div
            key={sub.id}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md"
          >
            <div className="flex justify-between items-center">

              {/* LEFT */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900">
                  {sub.journalTitle}
                </h2>

                <div className="text-sm text-slate-600 space-y-1 font-medium">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500 text-xs" />
                    <span>
                      {new Date(sub.startDate).toLocaleDateString()} -{" "}
                      {new Date(sub.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <FaCheckCircle className="text-emerald-500 text-xs" />
                    ) : (
                      <FaTimesCircle className="text-red-500 text-xs" />
                    )}
                    <span>{sub.status}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col gap-2 items-end">
                {sub.receiptId && (
                  <button
                    onClick={() => handleDownload(sub.receiptId)}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Download Receipt
                  </button>
                )}

                {isActive && (
                  <button
                    onClick={() => handleCancel(sub.id)}
                    className="bg-red-500 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MySubscriptions;