import React, { useEffect, useState } from "react";

const ManageSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/subscriptions")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch subscriptions");
        }
        return res.json();
      })
      .then((data) => {
        setSubscriptions(data.data); 
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load subscriptions");
        setLoading(false);
      });
  }, []);

  const handleCancel = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/subscriptions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub._id === id ? { ...sub, status: "cancelled" } : sub
        )
      );
    } catch (error) {
      console.error("Cancel failed:", error);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "expired":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  if (loading) return <div className="text-lg">Loading subscriptions...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Subscriptions</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Plan</th>
              <th className="px-6 py-3">Price (₹)</th>
              <th className="px-6 py-3">Start Date</th>
              <th className="px-6 py-3">End Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {subscriptions?.map((sub) => (
              <tr key={sub._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">
                  <div className="font-medium">{sub.userName}</div>
                  <div className="text-sm text-gray-500">{sub.email}</div>
                </td>

                <td className="px-6 py-3">{sub.plan}</td>
                <td className="px-6 py-3">₹{sub.price}</td>
                <td className="px-6 py-3">
                  {new Date(sub.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-3">
                  {new Date(sub.endDate).toLocaleDateString()}
                </td>

                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 text-sm rounded-full capitalize ${getStatusStyle(
                      sub.status
                    )}`}
                  >
                    {sub.status}
                  </span>
                </td>

                <td className="px-6 py-3 text-center">
                  {sub.status === "active" && (
                    <button
                      onClick={() => handleCancel(sub._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {subscriptions.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No subscriptions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSubscription;