import React from "react";
import { FaStar, FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const JournalCard = ({ journal }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dashboard/journals/${journal.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-2xl border border-gray-100
                 shadow-sm hover:shadow-lg transition-all duration-300
                 flex flex-col h-full overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400"
          alt={journal.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <span className="absolute top-3 left-3 bg-white text-xs font-medium
                         text-gray-700 px-3 py-1 rounded-full border border-gray-200">
          {journal.publisher || "Journal"}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
          <FaStar className="text-amber-400 text-xs" />
          <span className="font-medium">4.8</span>
        </div>

        {/* Title */}
        <h2 className="text-base font-semibold text-gray-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
          {journal.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {journal.description}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">

          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Monthly
            </span>
            <div className="text-lg font-semibold text-gray-900">
              ₹{journal.price}
            </div>
          </div>

          <FaExternalLinkAlt className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default JournalCard;