import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Download, MessageSquare, Send } from 'lucide-react';

export default function ReceiptCard({ 
  formData, 
  txnId, 
  receiptData,
  resetDonation, 
  feedbackText, 
  setFeedbackText, 
  handleFeedbackSubmit, 
  feedbackSubmitted 
}) {
  const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#EAE3D2] pt-24 pb-12 px-6 flex flex-col items-center relative print:bg-white print:p-0">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-card, #receipt-card * { visibility: visible; }
          #receipt-card { position: absolute; left: 0; top: 0; width: 100%; max-width: 100%; padding: 40px; margin: 0; background: white; border: none; box-shadow: none; border-radius: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `}</style>
      
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl mt-12">
        
        <div className="text-center mb-8 no-print">
           <div className="w-20 h-20 bg-[#6B8060] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#6B8060]/40">
             <CheckCircle2 size={40} className="text-[#F5F2EB]" />
           </div>
           <h2 className="text-4xl font-black text-[#1A1F16]">Payment Successful!</h2>
           <p className="text-[#4A5E40] mt-2 text-lg">
             Thank you, <span className="font-bold text-[#1A1F16]">{formData.fullName}</span>. 
             You funded <span className="font-bold text-[#1A1F16]">{formData.cart?.map(item => `${item.quantity}x ${item.title}`).join(' and ')}</span>.
           </p>
        </div>

        {/* RECEIPT WRAPPER STARTS HERE */}
        <div id="receipt-card" className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-[#6B8060]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <ShieldCheck size={200} />
            </div>

            <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-8 relative z-10">
               <div>
                 <h2 className="text-3xl font-black text-[#1A1F16]">80G Tax Receipt</h2>
                 <p className="text-gray-500 mt-1 font-medium">Official certificate for tax deduction claims.</p>
               </div>
               <div className="text-right">
                 <h3 className="text-xl font-extrabold tracking-tight text-[#1A1F16]">
                  Seva<span className="text-[#6B8060]">Pay</span>
                 </h3>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-6 text-sm relative z-10">
               <div>
                 <p className="text-gray-400 uppercase tracking-widest text-[10px] font-bold mb-2">Donor Details</p>
                 <p className="font-bold text-[#1A1F16] text-xl mb-1">{formData.fullName}</p>
                 <p className="text-gray-600 mb-1">{formData.email}</p>
                 <p className="text-gray-600 font-mono mt-2 bg-gray-50 inline-block px-3 py-1 rounded-md border border-gray-100">PAN: {formData.pan || 'Not Provided'}</p>
               </div>
               
               {/* Removed the extra closing div that was here */}
               
               <div className="text-right">
                 <p className="text-gray-400 uppercase tracking-widest text-[10px] font-bold mb-2">Grand Total</p>
                 <p className="font-black text-4xl text-[#6B8060] mb-2">₹{formData.amount?.toLocaleString()}</p>
                 <p className="text-gray-600 font-medium text-xs mb-1">{receiptData?.timestamp || date}</p>
                 <p className="text-gray-400 font-mono text-[10px] mt-1">TXN: {receiptData?.transactionId}</p>
                 <p className="text-gray-400 font-mono text-[10px]">RCPT: {receiptData?.receiptId}</p>
                 <div className="inline-block mt-2 px-2 py-1 bg-slate-100 text-slate-500 text-[9px] font-bold rounded border border-slate-200 uppercase tracking-wider">
                   Processed via {receiptData?.gateway || 'Smart Router'}
                 </div>
               </div>
            </div>

            <div className="mb-10 pt-4 border-t border-gray-100 relative z-10">
              <p className="text-gray-400 uppercase tracking-widest text-[10px] font-bold mb-3">Causes Supported</p>
              <div className="space-y-2">
                {formData.cart?.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                    <span className="text-gray-700 font-medium">{item.quantity}x {item.title}</span>
                    <span className="font-bold text-gray-900">₹{item.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F5F2EB] rounded-2xl p-6 border border-[#6B8060]/20 text-sm relative z-10">
              <p className="text-[#4A5E40] uppercase tracking-widest text-[10px] font-bold mb-4">NGO Details (Required for 80G Claim)</p>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <span className="block text-gray-500 text-xs mb-1">Organization Name</span>
                  <span className="font-bold text-gray-800">SevaPay Foundation</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-xs mb-1">80G Registration Number</span>
                  <span className="font-bold text-gray-800 font-mono tracking-wide">80G-DEL-2023-9876</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-xs mb-1">NGO PAN</span>
                  <span className="font-bold text-gray-800 font-mono tracking-wide">AAATN1234E</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-xs mb-1">Registered Address</span>
                  <span className="font-bold text-gray-800 leading-snug block">123, Green Valley, Cyber Hub, Delhi, India</span>
                </div>
              </div>
            </div>

           <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center relative z-10">
               <p className="text-[10px] text-gray-400 max-w-xs">This is a computer-generated receipt. Automated 80G compliance applied where eligible.</p>
               <div className="text-right">
                 <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mb-1">{receiptData?.complianceStatus}</p>
                 <p className="text-[10px] font-mono text-gray-400 border border-gray-200 px-2 py-1 rounded bg-gray-50">
                   Sig: {receiptData?.digitalSignature}
                 </p>
               </div>
            </div>
            
        </div> 
        {/* RECEIPT WRAPPER ENDS HERE - Now everything inside prints! */}

        <div className="grid grid-cols-2 gap-4 mt-8 no-print">
          <button onClick={() => window.print()} className="py-4 botanical-btn-primary rounded-xl font-bold flex items-center justify-center gap-2 text-lg shadow-xl hover:-translate-y-1 transition-all duration-300">
            <Download size={20} /> Download Receipt
          </button>
          <button onClick={resetDonation} className="py-4 bg-white border border-[#6B8060]/30 text-[#1A1F16] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 shadow-sm">
            Return Home
          </button>
        </div>

        <div className="mt-8 no-print">
          {!feedbackSubmitted ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-[#6B8060]/20 shadow-sm text-left">
              <h3 className="text-lg font-black text-[#1A1F16] mb-2 flex items-center gap-2">
                <MessageSquare size={20} className="text-[#6B8060]" /> Share Your Impact
              </h3>
              <p className="text-sm text-[#4A5E40] mb-4">Inspire others by leaving a message on our Community Wall.</p>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Why did you donate today?" 
                  className="flex-1 bg-white border border-[#6B8060]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6B8060] focus:ring-2 focus:ring-[#6B8060]/20 transition-all"
                  maxLength={120}
                  onKeyDown={(e) => e.key === 'Enter' && handleFeedbackSubmit()}
                />
                <button 
                  onClick={handleFeedbackSubmit}
                  disabled={!feedbackText.trim()}
                  className="bg-[#1A1F16] text-[#F5F2EB] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#2c3625] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:-translate-y-1"
                >
                  Post <Send size={16} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#6B8060]/10 p-6 rounded-2xl border border-[#6B8060]/20 text-center flex flex-col items-center justify-center shadow-sm">
               <CheckCircle2 size={32} className="text-[#6B8060] mb-3" />
               <p className="font-bold text-[#1A1F16] text-lg">Message Posted!</p>
               <p className="text-[#4A5E40] text-sm mt-1">Thank you. Your message is now live on the Community Wall.</p>
               <button onClick={resetDonation} className="mt-4 text-[#6B8060] font-bold text-sm hover:underline">
                 View Wall on Home Page &rarr;
               </button>
            </motion.div>
          )}
        </div>

      </motion.div>
    </div>
  );
}