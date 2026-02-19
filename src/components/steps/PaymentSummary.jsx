import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, ArrowLeft, Loader2, CreditCard, Smartphone } from 'lucide-react';
import { useTaxCalculator } from '../../hooks/useTaxCalculator';
import { processPaymentWithProtection } from '../../services/paymentOrchestrator';

export default function PaymentSummary({ formData, setFormData, onBack, onSuccess, isDesktop = false }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); 
  const [paymentLog, setPaymentLog] = useState('');
  
  const cart = formData.cart || [];
  
  // Consuming the progressive variables from the updated hook
  const { taxSaved, effectiveCost } = useTaxCalculator(cart, 'old');

  const handlePay = async () => {
    setIsProcessing(true);
    setPaymentLog('Securing connection...');

    try {
      // Run the simulated Orchestrator and pass setPaymentLog to update the UI live
      await processPaymentWithProtection(formData.amount, cart, setPaymentLog);
      
      if (setFormData) {
        setFormData(prev => ({ ...prev, paymentMethod: paymentMethod }));
      }
      setIsProcessing(false);
      onSuccess();
    } catch (e) {
      setPaymentLog('Transaction failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">3. Confirm & Pay</h2>
        <p className="text-sm text-slate-500">Review your cart before donating.</p>
      </div>

      <div className="space-y-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
        
        {/* Cart Items List */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
           {cart.map((item, index) => (
             <div key={item.id} className={`p-4 flex justify-between items-center ${index !== cart.length - 1 ? 'border-b border-slate-200' : ''}`}>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.category}</p>
                   <p className="font-bold text-slate-900">{item.title}</p>
                   <p className="text-xs text-slate-500">{item.quantity} units x ₹{item.unitCost}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                   <span className="font-bold text-slate-900">₹{item.total.toLocaleString()}</span>
                   {/* Dynamic deduction badge */}
                   <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md mt-1 ${item.deductionRate === 100 ? 'bg-amber-400 text-amber-900' : 'bg-emerald-500 text-white'}`}>
                     {item.deductionRate || 50}% Deductible
                   </span>
                </div>
             </div>
           ))}
           
           <div className="bg-slate-100 px-4 py-3 flex justify-between items-center border-t border-slate-200">
              <span className="text-slate-600 font-bold text-sm">Total Donation</span>
              <span className="text-xl font-extrabold text-slate-900">₹{formData.amount?.toLocaleString()}</span>
           </div>
        </div>

        {/* Intelligence Breakdown */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
           <div>
             <div className="flex items-center gap-1.5 mb-1">
               <ShieldCheck size={14} className="text-emerald-600" />
               <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Smart Benefit</span>
             </div>
             <p className="text-xs text-slate-500">Est. Tax Savings (80G)</p>
           </div>
           <div className="text-right">
             <span className="block text-emerald-600 font-black text-lg">- ₹{taxSaved?.toLocaleString() || 0}</span>
             <span className="text-[10px] font-bold text-slate-500">Effective Cost: ₹{effectiveCost?.toLocaleString() || formData.amount}</span>
           </div>
        </div>

        {/* Payment Methods */}
        <div className="pt-2">
           <h3 className="text-sm font-bold text-slate-900 mb-2">Select Payment Method</h3>
           <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => setPaymentMethod('razorpay')}
                className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                  paymentMethod === 'razorpay' 
                    ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                   <CreditCard size={16} />
                </div>
                <span className={`text-sm font-bold ${paymentMethod === 'razorpay' ? 'text-blue-700' : 'text-slate-600'}`}>Razorpay</span>
              </div>

              <div 
                onClick={() => setPaymentMethod('phonepe')}
                className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                  paymentMethod === 'phonepe' 
                    ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500 shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                   <Smartphone size={16} />
                </div>
                <span className={`text-sm font-bold ${paymentMethod === 'phonepe' ? 'text-purple-700' : 'text-slate-600'}`}>PhonePe</span>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <div className="flex gap-3">
            {!isDesktop && (
                <button
                onClick={onBack}
                disabled={isProcessing}
                className="px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                <ArrowLeft size={20} />
                </button>
            )}
            
            <div className="flex-1">
              {/* Revenue Protection Badge */}
              <div className="flex items-center justify-between mb-3 px-2">
                 <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                   <ShieldCheck size={14} /> Revenue Protection Active
                 </span>
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Smart Routing Engine</span>
              </div>

              <button
              onClick={handlePay}
              disabled={isProcessing || !formData.amount}
              className={`w-full py-4 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 flex flex-col items-center justify-center gap-1 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-90 disabled:cursor-not-allowed ${
                 paymentMethod === 'phonepe' ? 'bg-purple-600 shadow-purple-500/20' : 'bg-slate-900'
              }`}
              >
              {isProcessing ? (
                  <div className="flex flex-col items-center w-full px-4">
                    <span className="text-sm font-bold text-white mb-1.5">{paymentLog}</span>
                    <div className="w-full max-w-[200px] h-1 bg-white/20 rounded-full overflow-hidden">
                       <div className="w-1/2 h-full bg-white animate-[slide_1s_ease-in-out_infinite]" />
                    </div>
                  </div>
              ) : (
                  <div className="flex items-center gap-2">
                    <span>Pay ₹{formData.amount?.toLocaleString()}</span>
                    <ArrowRight size={18} />
                  </div>
              )}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}