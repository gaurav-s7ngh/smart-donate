import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Download, Heart } from 'lucide-react';

export default function Dashboard({ onBack, history = [] }) {
  // Calculate real totals from your dynamic history
  const totalDonated = history.reduce((sum, item) => sum + item.amount, 0);
  const totalUnits = history.reduce((sum, item) => sum + item.units, 0);
  
  // Calculate estimated tax saved based on 80G logic (approx 15-30% depending on slab)
  // In a full implementation, this uses the useTaxCalculator logic
  const totalTaxSaved = Math.round(totalDonated * 0.15);

  const stats = [
    { 
      label: "Total Donated", 
      value: `₹${totalDonated.toLocaleString()}`, 
      icon: TrendingUp, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50" 
    },
    { 
      label: "Impact Created", 
      value: `${totalUnits} Units`, 
      icon: Heart, 
      color: "text-rose-600", 
      bg: "bg-rose-50" 
    },
    { 
      label: "Tax Saved (80G)", 
      value: `₹${totalTaxSaved.toLocaleString()}`, 
      icon: Download, 
      color: "text-indigo-600", 
      bg: "bg-indigo-50" 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Sticky Premium Header */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-6 px-6 sticky top-0 z-20">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">My Impact Dashboard</h1>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-6 pt-6 space-y-6">
        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-2xl bg-white border border-slate-100 shadow-sm ${i === 0 ? 'col-span-2' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${stat.bg} ${stat.color}`}>
                <stat.icon size={16} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{stat.label}</p>
              <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* 80G Certificate Section */}
        <div className="bg-slate-900 rounded-2xl p-5 text-white flex items-center justify-between shadow-lg shadow-slate-900/20">
           <div>
             <h3 className="font-bold text-lg">80G Certificate</h3>
             <p className="text-xs text-slate-400">Download your FY 2024-25 Summary</p>
           </div>
           <button 
             disabled={history.length === 0}
             className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-slate-100 transition-colors"
           >
             Download
           </button>
        </div>

        {/* Real-time Donation History */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 font-bold text-slate-800">Contribution History</div>
          <div className="divide-y divide-slate-100">
            {history.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-400 text-sm">No contributions found yet.</p>
                <button onClick={onBack} className="text-indigo-600 text-xs font-bold mt-2 hover:underline">
                  Start your first impact
                </button>
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.causeTitle}</p>
                    <p className="text-xs text-slate-400">{item.date} • {item.units} Units</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-indigo-600">₹{item.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-emerald-600 font-medium">Verified</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}