import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaBook, FaStore, FaStar } from "react-icons/fa";
import { getJournalById } from "../../../Service/JournalApi";

const JournalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJournal = async () => {
      try {
        const res = await getJournalById(id);
        setJournal(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load journal details");
      } finally {
        setLoading(false);
      }
    };

    loadJournal();
  }, [id]);

  const addToCartHandler = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find((item) => item.id === journal.id);

    if (existingItem) {
      existingItem.months += 1; // add 1 more month
    } else {
      cart.push({
        ...journal,
        months: 1, // start with 1 month
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Subscription updated 🛒");
  };



  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!journal) return null;

return (
  <div className="max-w-6xl mx-auto">

    {/* Back Link */}
    <div className="mb-8">
      <Link
        to="/dashboard/browse"
        className="text-sm text-indigo-600 hover:underline font-medium"
      >
        ← Back to Browse
      </Link>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

      {/* Image Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600"
          alt={journal.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details Section */}
      <div className="flex flex-col">

        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-900 mb-4 leading-tight">
          {journal.title}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <FaStar className="text-amber-400 text-xs" />
          <span className="font-medium">4.8</span>
          <span className="text-gray-300">•</span>
          <span>{journal.publisher}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-8">
          {journal.description}
        </p>

        {/* Price Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
          <div className="text-xs text-gray-400 uppercase tracking-wide">
            Monthly Subscription
          </div>
          <div className="text-3xl font-semibold text-gray-900 mt-1">
            ₹ {journal.price}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 text-sm text-gray-600 mb-10">
          <div className="flex items-center gap-3">
            <FaStore className="text-gray-400" />
            <span>Publisher: {journal.publisher}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaBook className="text-gray-400" />
            <span>Category: Journal</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={addToCartHandler}
            className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-black transition"
          >
            Add to Cart
          </button>

          <button
            onClick={() => navigate("/dashboard/cart")}
            className="flex-1 border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
          >
            Go to Cart
          </button>
        </div>

      </div>
    </div>
  </div>
);
};

export default JournalDetail;