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
      className="cursor-pointer bg-white rounded-[2rem] overflow-hidden border border-slate-50 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-44 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400"
          alt={journal.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[9px] font-black uppercase px-2 py-1 rounded-full">
            {journal.publisher || "Journal"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2">
          <FaStar className="text-amber-400 text-xs" />
          <span className="text-[10px] font-bold text-slate-500">4.8</span>
        </div>

        <h2 className="text-base font-black text-slate-800 leading-tight mb-2 truncate">
          {journal.title}
        </h2>

        <p className="text-slate-500 text-[11px] font-medium mb-4 line-clamp-2 leading-relaxed">
          {journal.description}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
          <div>
            <span className="text-[8px] text-slate-400 font-black uppercase block">
              Monthly
            </span>
            <span className="text-lg font-black text-slate-900">
              ₹{journal.price}
            </span>
          </div>
          <FaExternalLinkAlt className="text-xs text-slate-600" />
        </div>
      </div>
    </div>
  );
};

export default JournalCard;