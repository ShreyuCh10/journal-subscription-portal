import React from "react";
import { FaFileInvoiceDollar, FaReceipt, FaDownload, FaHistory, FaCreditCard } from "react-icons/fa";

const Payments = () => {
  // Sample Data reflecting the Functional Requirements
  const paymentHistory = [
    { 
      id: "RCPT-9921", 
      date: "Feb 12, 2026", 
      amount: "₹2,499", 
      status: "Paid", 
      desc: "Medical Journal - 1 Year Subscription" 
    },
    { 
      id: "INV-8740", 
      date: "Feb 10, 2026", 
      amount: "₹1,800", 
      status: "Pending", 
      desc: "Technology AI Bundle - 1 Year" 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Billing & Receipts</h1>
        <p className="text-slate-500 mt-2 font-medium">
          Access your automatically generated invoices and secure payment receipts.
        </p>
      </div>

      {/* Payment Confirmation Overview (Req 5) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Invested</p>
            <p className="text-3xl font-black mt-1">₹4,299</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white/20 w-fit px-3 py-1 rounded-full">
              <FaHistory className="text-[10px]" /> Verified Records
            </div>
          </div>
          <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-2xl">
              <FaCreditCard />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Default Option</p>
              <h3 className="text-xl font-black text-slate-800">Net Banking / UPI</h3>
              <p className="text-slate-500 text-xs font-medium mt-1">Available for all generated invoices.</p>
            </div>
          </div>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">
            Update Methods
          </button>
        </div>
      </div>

      {/* Transaction & Receipt Management (Req 4 & 5) */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <FaFileInvoiceDollar className="text-indigo-600" /> Invoices & Receipts Ledger
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                <th className="px-8 py-5">Reference ID</th>
                <th className="px-8 py-5">Subscription Item</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paymentHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 text-sm font-bold text-slate-900 italic">#{item.id}</td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-600">{item.desc}</td>
                  <td className="px-8 py-6 text-xs text-slate-400 font-bold uppercase">{item.date}</td>
                  <td className="px-8 py-6 text-sm font-black text-slate-900">{item.amount}</td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                      item.status === "Paid" 
                      ? "bg-emerald-100 text-emerald-600" 
                      : "bg-amber-100 text-amber-600"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    {item.status === "Paid" ? (
                      <button className="flex items-center gap-2 mx-auto bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                        <FaDownload className="text-[8px]" /> Get Receipt
                      </button>
                    ) : (
                      <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline">
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Note */}
      <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
          <FaReceipt />
        </div>
        <p className="text-xs text-slate-500 font-medium">
          A copy of every receipt is securely stored in our system database for your future reference and record-keeping.
        </p>
      </div>
    </div>
  );
};

export default Payments;