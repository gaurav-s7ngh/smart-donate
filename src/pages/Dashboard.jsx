import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, PieChart, TrendingUp, Calendar, Download } from 'lucide-react';

export default function Dashboard({ onBack }) {
  const stats = [
    { label: "Total Donated", value: "₹24,500", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Lives Impacted", value: "18", icon: HeartIcon, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Tax Saved (FY)", value: "₹8,200", icon: PieChart, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-6 px-6 sticky top-0 z-20">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Impact Dashboard</h1>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-6 pt-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-2xl bg-white border border-slate-100 shadow-sm ${i === 0 ? 'col-span-2' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${stat.bg} ${stat.color}`}>
                <stat.icon size={16} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{stat.label}</p>
              <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent History */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent Contributions</h3>
            <button className="text-xs font-bold text-indigo-600">View All</button>
          </div>
          <div className="divide-y divide-slate-100">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                    {['🍲', '📚', '🏥'][i]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{['Meals for Kids', 'School Kit', 'Surgery Fund'][i]}</p>
                    <p className="text-xs text-slate-400">24 Feb, 2024</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">₹{['500', '1,200', '5,000'][i]}</p>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 justify-end">
                    <Download size={10} /> Receipt
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tax Report Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 text-white flex items-center justify-between shadow-lg shadow-slate-900/20">
           <div>
             <h3 className="font-bold text-lg">80G Certificate</h3>
             <p className="text-xs text-slate-400">FY 2023-24 Consolidated</p>
           </div>
           <button className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold">Download</button>
        </div>
      </main>
    </div>
  );
}

const HeartIcon = (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;