import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaBook, FaStore, FaStar } from "react-icons/fa";
import { getJournalById } from "../../../Service/JournalApi";

const JournalDetail = () => {
  const { id } = useParams();
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

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!journal) return null;

  return (
    <>
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/dashboard/browse"
          className="text-blue-600 font-semibold hover:underline"
        >
          ← Go Back
        </Link>
      </div>

      <div className="flex flex-wrap gap-10">
        {/* Image Section */}
        <div className="w-full md:w-[28rem]">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600"
            alt={journal.title}
            className="w-full rounded-2xl shadow-lg"
          />
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-between max-w-xl">
          <h1 className="text-3xl font-bold mb-4">{journal.title}</h1>

          <p className="text-slate-500 mb-4">{journal.description}</p>

          <p className="text-4xl font-extrabold mb-6">₹ {journal.price}</p>

          <div className="flex flex-col gap-3 text-slate-700">
            <div className="flex items-center gap-2">
              <FaStore /> <span>Publisher: {journal.publisher}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaBook /> <span>Category: Journal</span>
            </div>

            <div className="flex items-center gap-2">
              <FaStar /> <span>Rating: 4.8</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <button className="bg-slate-900 text-white py-3 px-6 rounded-xl hover:bg-blue-600 transition-colors">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default JournalDetail;