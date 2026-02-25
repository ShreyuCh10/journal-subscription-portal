import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { getAllJournals } from "../../../Service/JournalApi";
import JournalCard from "../../../Component/JournalCard";

const BrowseJournals = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadJournals = async () => {
      try {
        const res = await getAllJournals();
        setJournals(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load journals");
      } finally {
        setLoading(false);
      }
    };

    loadJournals();
  }, []);

  const filteredJournals = journals.filter((j) =>
    j.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 font-semibold">
        Loading journals...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Explore Journals
        </h1>
        <p className="text-slate-500 mt-2 font-medium italic">
          Your gateway to professional knowledge and research.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center">
        <div className="relative w-full max-w-xl">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search journals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 shadow-sm rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredJournals.map((journal) => (
          <JournalCard key={journal.id} journal={journal} />
        ))}

        {filteredJournals.length === 0 && (
          <div className="col-span-full text-center text-slate-500 font-semibold py-10">
            No journals found
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseJournals;