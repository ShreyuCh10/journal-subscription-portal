import React, { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaCreditCard,
  FaTruck,
  FaBoxOpen,
  FaChevronRight
} from "react-icons/fa";

import { getMyPayments } from "../../../../Service/PaymentApi";
import { getUserShipments } from "../../../../Service/DispatchApi";
import { getAllSubscriptions } from "../../../../Service/SubscriptionApi";

const UserSummary = () => {

  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [dispatch, setDispatch] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    try {

      const subRes = await getAllSubscriptions();
      const payRes = await getMyPayments();
      const shipRes = await getUserShipments();

      setSubscriptions(subRes.data);
      setPayments(payRes.data);
      setDispatch(shipRes.data);

    } catch (err) {
      console.error("Dashboard error", err);
    }

  };

  const activeSubs =
    subscriptions.filter(s => s.status === "ACTIVE").length;

  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-500">
          Manage your journals, payments and shipments
        </p>
      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6">

        {/* Subscriptions */}

        <div className="bg-white border p-6 rounded-xl shadow-sm">

          <FaBookOpen className="text-indigo-600 text-lg mb-3"/>

          <p className="text-gray-500 text-sm">
            Active Subscriptions
          </p>

          <h2 className="text-2xl font-semibold">
            {activeSubs}
          </h2>

        </div>


        {/* Payments */}

        <div className="bg-white border p-6 rounded-xl shadow-sm">

          <FaCreditCard className="text-green-600 text-lg mb-3"/>

          <p className="text-gray-500 text-sm">
            Total Payments
          </p>

          <h2 className="text-2xl font-semibold">
            {payments.length}
          </h2>

        </div>


        {/* Shipments */}

        <div className="bg-white border p-6 rounded-xl shadow-sm">

          <FaTruck className="text-orange-500 text-lg mb-3"/>

          <p className="text-gray-500 text-sm">
            My Shipments
          </p>

          <h2 className="text-2xl font-semibold">
            {dispatch.length}
          </h2>

        </div>

      </div>


      {/* Recent Payments */}

      <div className="bg-white border p-6 rounded-xl shadow-sm">

        <div className="flex justify-between mb-5">

          <h2 className="font-semibold">
            Recent Payments
          </h2>

          <button className="text-indigo-600 flex items-center gap-1 text-sm">
            View All <FaChevronRight/>
          </button>

        </div>

        <div className="space-y-3">

          {payments.slice(0,5).map((p) => (

            <div
              key={p.id}
              className="flex justify-between items-center p-4 rounded-lg hover:bg-gray-50"
            >

              <div className="flex items-center gap-4">

                <FaBoxOpen className="text-indigo-500"/>

                <div>

                  <p className="font-medium">
                    {p.journalTitle}
                  </p>

                  <p className="text-sm text-gray-400">
                    {new Date(p.paymentDate).toLocaleDateString()}
                  </p>

                </div>

              </div>

              <p className="font-semibold">
                ₹{p.amount}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default UserSummary;