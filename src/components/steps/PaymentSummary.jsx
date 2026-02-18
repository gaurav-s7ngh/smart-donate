import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useTaxCalculator } from '../../hooks/useTaxCalculator';

export default function PaymentSummary({ formData, onBack, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { saved } = useTaxCalculator(formData.amount);

  const handlePay = () => {
    setIsProcessing(true);
    // Mock Payment Delay
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Confirm Impact</h2>
        <p className="text-sm text-slate-500">Review your contribution details.</p>
      </div>

      <div className="space-y-4">
        {/* Main Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Cause</p>
              <p className="text-lg font-bold text-slate-900">{formData.causeTitle}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase">Units</p>
              <p className="text-lg font-bold text-slate-900">{formData.units}</p>
            </div>
          </div>
          
          <div className="h-px bg-slate-200 my-2" />
          
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-600 font-medium">Donation Amount</span>
            <span className="text-xl font-bold text-slate-900">₹{formData.amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Intelligence Breakdown */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
           <div>
             <div className="flex items-center gap-1.5 mb-1">
               <ShieldCheck size={14} className="text-emerald-500" />
               <span className="text-xs font-bold text-emerald-600 uppercase">Smart Benefit</span>
             </div>
             <p className="text-xs text-slate-500">Est. Tax Savings (80G)</p>
           </div>
           <div className="text-right">
             <span className="block text-emerald-600 font-bold">+ ₹{saved.toLocaleString()}</span>
             <span className="text-[10px] text-slate-400">Effective Cost: ₹{(formData.amount - saved).toLocaleString()}</span>
           </div>
        </div>
      </div>

      <div className="mt-auto flex gap-3 pt-6">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={handlePay}
          disabled={isProcessing}
          className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-80 disabled:cursor-wait"
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Pay ₹{formData.amount.toLocaleString()}</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}