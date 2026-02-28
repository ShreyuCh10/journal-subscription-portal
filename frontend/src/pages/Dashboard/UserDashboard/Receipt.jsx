import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../Service/api";

const Receipt = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      const res = await api.get(`/api/receipts/${id}`);
      setReceipt(res.data);
    };

    fetchReceipt();
  }, [id]);

  if (!receipt) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6">Payment Successful 🎉</h1>

      <div className="space-y-3 text-slate-700">
        <p><strong>Receipt No:</strong> {receipt.receiptNumber}</p>
        <p><strong>Payment Method:</strong> {receipt.paymentMethod}</p>
        <p><strong>Amount Paid:</strong> ₹ {receipt.amount}</p>
        <p><strong>Date:</strong> {receipt.paymentDate}</p>
      </div>
    </div>
  );
};

export default Receipt;