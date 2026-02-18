import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useTaxCalculator } from '../hooks/useTaxCalculator';

export default function SuccessScreen({ formData, onReset, onViewDashboard }) {
  const { saved } = useTaxCalculator(formData.amount);

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4 relative">
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/40 ring-4 ring-white"
      >
        <Check size={40} className="text-white" strokeWidth={4} />
      </motion.div>

      <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Impact Verified</h2>
      <p className="text-slate-500 text-sm mb-8">Your contribution is now active.</p>

      {/* Intelligence Summary Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8"
      >
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          <div className="text-left">
            <p className="text-[10px] text-slate-400 uppercase font-bold">You Funded</p>
            <p className="text-lg font-bold text-slate-800">{formData.units} x {formData.causeTitle}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Total</p>
            <p className="text-lg font-bold text-slate-800">₹{formData.amount.toLocaleString()}</p>
          </div>
          <div className="col-span-2 h-px bg-slate-200"></div>
          <div className="text-left">
            <p className="text-[10px] text-emerald-600 uppercase font-bold">Est. Tax Saved</p>
            <p className="text-sm font-bold text-emerald-600">₹{saved.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-indigo-600 uppercase font-bold">Effective Cost</p>
            <p className="text-sm font-bold text-indigo-600">₹{(formData.amount - saved).toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      <div className="w-full space-y-3">
        <button 
          onClick={onReset}
          className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition"
        >
          Make Another Impact <ArrowRight size={16} />
        </button>
        <button 
          onClick={onViewDashboard}
          className="w-full py-3.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition flex items-center justify-center gap-2"
        >
          <LayoutDashboard size={16} /> View Impact Dashboard
        </button>
      </div>
    </div>
  );
}