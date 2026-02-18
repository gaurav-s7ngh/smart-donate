import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, ArrowLeft, Shield, CreditCard } from 'lucide-react';

export default function PaymentSummary({ formData, onBack, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <div className="text-center mb-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Payable</div>
          <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
            ₹{formData.amount.toLocaleString()}
          </div>
        </div>

        {/* Receipt Card */}
        <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200/60 space-y-4 relative overflow-hidden">
          {/* Decorative jagged line at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30"></div>

          <Row label="Donor" value={formData.fullName} />
          <Row label="Email" value={formData.email} />
          <Row label="PAN" value={formData.pan} mono />
          
          <div className="h-px bg-slate-200/80 my-2 border-dashed border-t border-slate-300"></div>
          
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium justify-center pt-2">
            <Lock size={10} />
            <span>256-bit SSL Encrypted • PCI DSS Compliant</span>
          </div>
        </div>

        {/* Payment Method Selector (Visual Only) */}
        <div className="mt-6">
           <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Payment Method</label>
           <div className="flex gap-3">
              <div className="flex-1 border-2 border-indigo-600 bg-indigo-50/20 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                 <CreditCard size={16} className="text-indigo-600"/>
                 <span className="text-sm font-bold text-indigo-900">Card</span>
              </div>
              <div className="flex-1 border border-slate-200 bg-white rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer opacity-60 grayscale hover:grayscale-0 transition-all">
                 <span className="text-sm font-bold text-slate-600">UPI</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} disabled={isProcessing} className="px-5 py-4 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex-1 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 flex justify-center items-center gap-3 relative overflow-hidden"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Shield size={18} className="text-emerald-400" />
              <span>Secure Pay</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="flex justify-between items-center text-sm group">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className={`font-bold text-slate-900 ${mono ? 'font-mono tracking-wide' : ''}`}>{value}</span>
    </div>
  );
}