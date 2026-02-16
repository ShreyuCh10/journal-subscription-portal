import React from "react";
import { 
  FaBookOpen, 
  FaWallet, 
  FaClock, 
  FaArrowUp, 
  FaChevronRight, 
  FaStar 
} from "react-icons/fa";

const UserSummary = () => {
  // Sample Data for a professional look
  const stats = [
    { 
      id: 1, 
      label: "Active Subscriptions", 
      value: "₹2,499", 
      subValue: "Monthly spend",
      icon: <FaWallet />, 
      color: "bg-indigo-600",
      trend: "+₹200 this month"
    },
    { 
      id: 2, 
      label: "Journals Read", 
      value: "42", 
      subValue: "Total library",
      icon: <FaBookOpen />, 
      color: "bg-blue-600",
      trend: "8 new this week"
    },
    { 
      id: 3, 
      label: "Reading Time", 
      value: "18h 45m", 
      subValue: "Avg 40m / day",
      icon: <FaClock />, 
      color: "bg-emerald-500",
      trend: "Top 5% of users"
    },
  ];

  const recentJournals = [
    { title: "Clinical Cardiology Update", date: "12 Feb 2026", cat: "Medical", cost: "₹450" },
    { title: "AI in Financial Markets", date: "10 Feb 2026", cat: "Business", cost: "₹899" },
    { title: "Neural Networks Deep Dive", date: "08 Feb 2026", cat: "Technology", cost: "₹1,200" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Namaste, Asmi! 👋
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">
            Your reading streak is currently at <span className="text-indigo-600 font-bold">12 days</span>. Keep it up!
          </p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
          Subscribe to New Journal
        </button>
      </div>

      {/* Main Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} w-12 h-12 rounded-2xl text-white flex items-center justify-center text-xl shadow-lg shadow-indigo-100`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                <FaArrowUp className="text-[8px]" /> {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800 tracking-tight mt-1">{stat.value}</p>
              <p className="text-xs text-slate-400 font-medium mt-1">{stat.subValue}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Purchases/History */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Recent Transactions</h2>
            <button className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-2">
              All Payments <FaChevronRight />
            </button>
          </div>
          
          <div className="space-y-3">
            {recentJournals.map((journal, idx) => (
              <div key={idx} className="group flex items-center justify-between p-4 bg-slate-50 hover:bg-white hover:shadow-lg rounded-2xl transition-all border border-transparent hover:border-slate-100 cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                    <FaBookOpen />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{journal.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{journal.date} • {journal.cat}</p>
                  </div>
                </div>
                <p className="font-black text-slate-900 text-sm">{journal.cost}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade / Promo Card */}
        <div className="bg-gradient-to-br from-indigo-700 to-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <div className="bg-white/10 backdrop-blur-md w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <FaStar className="text-amber-400 text-xl" />
            </div>
            <h2 className="text-2xl font-black mb-3 leading-tight">Unlock Pro Library</h2>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-80">
              Get 20% off on your first three premium journal subscriptions.
            </p>
          </div>
          
          <button className="relative z-10 mt-8 bg-white text-indigo-900 w-full py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
            Upgrade for ₹999/yr
          </button>

          {/* Abstract Design Shape */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full"></div>
        </div>
      </div>

    </div>
  );
};

export default UserSummary;