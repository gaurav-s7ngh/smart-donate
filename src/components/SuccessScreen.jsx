import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, LayoutDashboard, CreditCard, Smartphone } from 'lucide-react';
import { useTaxCalculator } from '../hooks/useTaxCalculator';

export default function SuccessScreen({ formData, onReset, onViewDashboard }) {
const { taxSaved } = useTaxCalculator(formData.cart, 'old');  const cart = formData.cart || [];
  
  // CHANGED: Helper to get payment method display
  const isPhonePe = formData.paymentMethod === 'phonepe';
  const paymentLabel = isPhonePe ? 'PhonePe' : 'Razorpay';
  const PaymentIcon = isPhonePe ? Smartphone : CreditCard;

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4 relative">
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/40 ring-4 ring-white"
      >
        <Check size={40} className="text-white" strokeWidth={4} />
      </motion.div>

      <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Impact Verified</h2>
      
      {/* CHANGED: Display Payment Method */}
      <div className="flex items-center justify-center gap-1.5 text-slate-500 mb-6 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
        <PaymentIcon size={12} />
        <span>Paid via {paymentLabel}</span>
      </div>

      {/* Intelligence Summary Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 text-left"
      >
        <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Impact Summary</p>
        <div className="space-y-2 mb-4">
            {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-700 font-medium">{item.quantity} x {item.title}</span>
                    <span className="text-slate-900 font-bold">₹{item.total.toLocaleString()}</span>
                </div>
            ))}
        </div>
        
        <div className="h-px bg-slate-200 mb-4"></div>
        
        <div className="grid grid-cols-2 gap-y-1">
          <div className="text-left">
            <p className="text-[10px] text-emerald-600 uppercase font-bold">Tax Saved</p>
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