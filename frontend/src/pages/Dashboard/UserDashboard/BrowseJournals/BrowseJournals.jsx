import React from "react";
import { FaSearch, FaFilter, FaStar, FaExternalLinkAlt } from "react-icons/fa";

const BrowseJournals = () => {
  // Professional Sample Data with 2-line descriptions
  const journals = [
    { 
      id: 1, 
      title: "Medical Lancet", 
      category: "Medical", 
      price: "₹2,499", 
      rating: 4.9, 
      desc: "Comprehensive insights into clinical oncology and modern surgical breakthroughs.",
      img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: 2, 
      title: "TechCrunch AI", 
      category: "Technology", 
      price: "₹1,800", 
      rating: 4.8, 
      desc: "Exploring the next frontier of generative AI and autonomous robotics systems.",
      img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: 3, 
      title: "Forbes Business", 
      category: "Business", 
      price: "₹999", 
      rating: 4.7, 
      desc: "Strategies for startup growth and detailed analysis of global market shifts.",
      img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: 4, 
      title: "Astrophysics", 
      category: "Science", 
      price: "₹3,200", 
      rating: 5.0, 
      desc: "Deep dives into black hole theories and recent deep-space telescope discoveries.",
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: 5, 
      title: "Psychology Today", 
      category: "Psychology", 
      price: "₹750", 
      rating: 4.6, 
      desc: "Understanding behavioral patterns and modern therapeutic approaches for well-being.",
      img: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: 6, 
      title: "Modern Eng.", 
      category: "Engineering", 
      price: "₹2,100", 
      rating: 4.8, 
      desc: "Sustainable structural designs and the future of renewable energy infrastructure.",
      img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: 7, 
      title: "Creative Design", 
      category: "Design", 
      price: "₹1,200", 
      rating: 4.9, 
      desc: "Visual storytelling techniques and the evolution of digital user experiences.",
      img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: 8, 
      title: "Finance Weekly", 
      category: "Finance", 
      price: "₹1,500", 
      rating: 4.7, 
      desc: "Analysis of stock market trends and risk management in the digital economy.",
      img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400" 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Explore Journals</h1>
        <p className="text-slate-500 mt-2 font-medium italic">Your gateway to professional knowledge and research.</p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center">
        <div className="relative w-full max-w-xl">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search journals..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 shadow-sm rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
          />
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {journals.map((j) => (
          <div key={j.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-50 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
            {/* Image Section */}
            <div className="relative h-44 overflow-hidden">
              <img src={j.img} alt={j.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[9px] font-black uppercase px-2 py-1 rounded-full">
                  {j.category}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-center gap-1 mb-2">
                <FaStar className="text-amber-400 text-xs" />
                <span className="text-[10px] font-bold text-slate-500">{j.rating}</span>
              </div>

              {/* Title: Truncated for visibility */}
              <h2 className="text-base font-black text-slate-800 leading-tight mb-2 truncate" title={j.title}>
                {j.title}
              </h2>

              {/* Description: Visible 2 lines only */}
              <p className="text-slate-500 text-[11px] font-medium mb-4 line-clamp-2 leading-relaxed">
                {j.desc}
              </p>

              {/* Price and Action */}
              <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                <div>
                  <span className="text-[8px] text-slate-400 font-black uppercase block">Monthly</span>
                  <span className="text-lg font-black text-slate-900">{j.price}</span>
                </div>
                <button className="bg-slate-900 text-white w-9 h-9 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <FaExternalLinkAlt className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseJournals;