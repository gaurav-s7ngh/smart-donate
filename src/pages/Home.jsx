import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Heart, CreditCard, Smartphone, CheckCircle2, 
  Leaf, Globe, Calculator, ArrowRight, ArrowUp, Sparkles, 
  Building2, MessageSquare, TrendingDown, Wallet, Download, Send, Trash2 
} from 'lucide-react';
import { useDonation } from '../hooks/useDonation';
import { useTaxCalculator } from '../hooks/useTaxCalculator';
import Navbar from '../components/Navbar';
import Leaderboard from '../components/Leaderboard';
import CommunityWall from '../components/CommunityWall';
import ReceiptCard from '../components/RecieptCard';
import TaxExplanationSection from '../components/TaxExplanationSection';
import { processPaymentWithProtection } from '../services/paymentOrchestrator';
import { generateComplianceReceipt } from '../services/receiptGenerator';

import pmnrfLogo from '../assets/pmnrf.jpeg';   // Ensure the extension matches what you downloaded
import akshayaLogo from '../assets/akshaya.jpg';
import sankalpLogo from '../assets/sankalp.png';
// Data
// Data with Real Indian NGOs & Govt Funds
const CAUSES = [
  { id: 1, title: "Disaster Relief", desc: "PMNRF (Govt. of India)", category: "Relief", unitCost: 500, icon: Heart, deductionRate: 100 },
  { id: 2, title: "Provide Meals", desc: "The Akshaya Patra Foundation", category: "Hunger", unitCost: 50, icon: Globe, deductionRate: 50 },
  { id: 3, title: "Plant Trees", desc: "SankalpTaru Foundation", category: "Environment", unitCost: 100, icon: Leaf, deductionRate: 50 },
];

const NGOS = [
  { 
    name: "PMNRF", 
    focus: "Disaster Relief", 
    impact: "Govt. Backed 100% Deduction", 
    deduction: 100, 
    logoImg: pmnrfLogo // <--- Use the imported variable
  },
  { 
    name: "Akshaya Patra", 
    focus: "Hunger", 
    impact: "3M+ Daily Meals", 
    deduction: 50, 
    logoImg: akshayaLogo // <--- Use the imported variable
  },
  { 
    name: "SankalpTaru", 
    focus: "Environment", 
    impact: "5M+ Trees Planted", 
    deduction: 50, 
    logoImg: sankalpLogo // <--- Use the imported variable
  },
];
const INITIAL_COMMENTS = [
  { name: "John D.", text: "Keep up the amazing work! For a greener tomorrow.", time: "10 mins ago" },
  { name: "Sarah W.", text: "Happy to help the kids get back to school.", time: "1 hour ago" },
  { name: "Anonymous", text: "Small steps lead to big changes.", time: "3 hours ago" },
  { name: "Amit K.", text: "Dedicated to my grandfather.", time: "5 hours ago" },
];

// Validation Regex
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  
  const { formData, setFormData, resetFlow } = useDonation();
  const [taxRegime, setTaxRegime] = useState('old'); 
// ✅ Correct
const { taxSaved, effectiveCost } = useTaxCalculator(formData.cart, taxRegime);
  const [count, setCount] = useState(14205432);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  const [paymentLog, setPaymentLog] = useState('');
  const [receiptData, setReceiptData] = useState(null);
  
  // Multi-cart specific states
  const [activeCauseId, setActiveCauseId] = useState(null);
  const [customQty, setCustomQty] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Community Wall State
  const [communityComments, setCommunityComments] = useState(INITIAL_COMMENTS);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setCount(prev => prev + Math.floor(Math.random() * 5)), 3500);
    const handleScroll = () => setShowScrollTop(window.scrollY > 800);
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleAmountSelect = (causeId, qty) => {
    const cause = CAUSES.find(c => c.id === causeId);
    if (!cause) return;

    setFormData(prev => {
      let newCart = [...(prev.cart || [])];
      const index = newCart.findIndex(item => item.id === causeId);
      
      if (qty <= 0) {
        if (index !== -1) newCart.splice(index, 1);
        if (activeCauseId === causeId) setActiveCauseId(null);
      } else {
        if (index !== -1) {
          newCart[index] = { ...newCart[index], quantity: qty, total: cause.unitCost * qty };
        } else {
          newCart.push({ 
            id: cause.id, 
            title: cause.title, 
            unitCost: cause.unitCost, 
            quantity: qty, 
            total: cause.unitCost * qty,
            deductionRate: cause.deductionRate // 👈 THIS IS THE CRUCIAL NEW LINE
          });
        }
      }
      
      const newAmount = newCart.reduce((sum, item) => sum + item.total, 0);
      return { ...prev, cart: newCart, amount: newAmount };
    });
  };

  const handleCustomQtyChange = (e) => {
    const val = Math.max(0, parseInt(e.target.value) || 0);
    setCustomQty(e.target.value);
    if (activeCauseId) {
      handleAmountSelect(activeCauseId, val);
    }
  };

 const handlePay = async () => {
    setIsProcessing(true);
    setPaymentLog('Securing connection...');
    
    try {
      // 1. Run the Orchestrator
      const txResult = await processPaymentWithProtection(
        formData.amount, 
        formData.cart, 
        (message) => setPaymentLog(message) // Live update the UI
      );

      // 2. Generate Compliance Data
      const complianceData = generateComplianceReceipt(txResult);
      
      // 3. Save to state and complete
      setTxnId(txResult.transactionId);
      setReceiptData({ ...txResult, ...complianceData });
      
      setIsProcessing(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setPaymentLog('Transaction failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const resetDonation = () => {
    setIsSuccess(false);
    setCustomQty('');
    setIsCustomMode(false);
    setFeedbackText('');
    setFeedbackSubmitted(false);
    setActiveCauseId(null);
    resetFlow(); // <--- This already saves to history AND resets formData
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) return;
    const newComment = { name: formData.fullName || "Anonymous Donor", text: feedbackText, time: "Just now" };
    setCommunityComments([newComment, ...communityComments]);
    setFeedbackSubmitted(true);
  };

  const scrollToDonate = () => document.getElementById('donate-section')?.scrollIntoView({ behavior: 'smooth' });

  // Robust Form Validation
  const isPanValid = !formData.pan || PAN_REGEX.test(formData.pan);
  const isFormValid = 
    formData.amount > 0 && 
    formData.fullName?.trim().length > 2 && 
    formData.email && EMAIL_REGEX.test(formData.email) &&
    isPanValid;
  
  const activeCause = CAUSES.find(c => c.id === activeCauseId);
  const activeCartItem = formData.cart?.find(c => c.id === activeCauseId);

  if (isSuccess) {
    return (
      <ReceiptCard 
        formData={formData}
        txnId={txnId}
        receiptData={receiptData} // <--- Pass the new data
        resetDonation={resetDonation}
        feedbackText={feedbackText}
        setFeedbackText={setFeedbackText}
        handleFeedbackSubmit={handleFeedbackSubmit}
        feedbackSubmitted={feedbackSubmitted}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#EAE3D2] font-sans relative">
      <Navbar />

      <section className="pt-32 pb-16 px-6 relative z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#6B8060]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#EAE3D2] rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-8 items-center mt-12">
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="lg:col-span-7 text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F5F2EB] border border-[#6B8060]/30 text-[#4A5E40] font-bold text-sm mb-8 shadow-sm">
              <Sparkles size={16} className="text-[#6B8060]" /> Welcome to SevaPay
            </div>
            
            <h1 className="text-6xl md:text-7xl xl:text-8xl font-black text-[#1A1F16] tracking-tighter mb-8 leading-[1.05]">
              Empower Lives. <br />
              <span className="text-[#6B8060]">Claim Your Impact.</span>
            </h1>
            
            <p className="text-[#4A5E40] text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-medium">
              Join thousands of donors making a transparent difference. Support verified NGOs, automatically save on taxes under section 80G, and track your global impact instantly.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <button onClick={scrollToDonate} className="px-8 py-4 bg-[#1A1F16] text-[#F5F2EB] rounded-2xl font-black text-lg hover:bg-[#2c3625] transition-all flex items-center gap-2 shadow-xl shadow-[#1A1F16]/20 transform hover:-translate-y-1">
                Start Donating <ArrowRight size={20} />
              </button>
              
              <div className="flex items-center">
                 <div className="flex items-center ml-2">
                    <div className="w-12 h-12 rounded-full border-4 border-[#EAE3D2] bg-gray-200 z-30 overflow-hidden shadow-sm"><img src="https://i.pravatar.cc/100?img=1" alt="user" className="w-full h-full object-cover" /></div>
                    <div className="w-12 h-12 rounded-full border-4 border-[#EAE3D2] bg-gray-300 z-20 overflow-hidden -ml-4 shadow-sm"><img src="https://i.pravatar.cc/100?img=2" alt="user" className="w-full h-full object-cover" /></div>
                    <div className="w-12 h-12 rounded-full border-4 border-[#EAE3D2] bg-[#6B8060] text-white flex items-center justify-center font-bold text-xs z-10 -ml-4 shadow-sm">+10k</div>
                 </div>
                 <span className="text-sm font-bold text-[#4A5E40] ml-4">Trusted Donors</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:col-span-5 relative order-1 lg:order-2 mb-10 lg:mb-0">
            <div className="relative rounded-[2.5rem] bg-[#F5F2EB]/80 backdrop-blur-md border border-[#6B8060]/20 p-8 shadow-2xl overflow-hidden aspect-square flex flex-col items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-br from-[#6B8060]/10 to-transparent z-0 pointer-events-none" />
               
               <div className="relative z-10 w-full">
                  <p className="text-xs font-black text-[#6B8060] uppercase tracking-[0.15em] mb-4 text-center">Real-Time Impact</p>
                  
                  <div className="bg-[#1A1F16] rounded-[2rem] p-6 md:p-8 shadow-2xl flex flex-col items-center justify-center border border-[#6B8060]/30 transform hover:scale-[1.02] transition-transform duration-500 w-full max-w-sm mx-auto">
                    <span className="text-xs md:text-sm text-[#A3B19B] font-bold uppercase tracking-widest mb-3">Total Funds Raised</span>
                    <div className="flex justify-center items-center gap-1 w-full">
                      <span className="text-3xl md:text-5xl text-[#6B8060] font-black mr-1 mt-1">₹</span>
                      {count.toString().split('').map((num, i) => (
                        <motion.div key={`${i}-${num}`} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-7 h-10 md:w-10 md:h-14 bg-[#2a3123] rounded-lg flex items-center justify-center shadow-inner">
                          <span className="text-2xl md:text-4xl font-black text-[#F5F2EB]">{num}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100">
                     <div className="w-10 h-10 rounded-full bg-[#6B8060]/10 flex items-center justify-center text-[#6B8060]"><Leaf size={20}/></div>
                     <div>
                       <span className="block font-black text-sm text-[#1A1F16]">5M+ Trees</span>
                       <span className="block text-xs text-gray-500 font-medium">Planted globally</span>
                     </div>
                  </motion.div>

                  <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100">
                     <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Globe size={20}/></div>
                     <div>
                       <span className="block font-black text-sm text-[#1A1F16]">12 Countries</span>
                       <span className="block text-xs text-gray-500 font-medium">Active impact</span>
                     </div>
                  </motion.div>
               </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Main Donation Section */}
      <section id="donate-section" className="max-w-[1400px] mx-auto px-6 py-12 pb-24 relative z-10 mt-12">
        <div className="grid lg:grid-cols-12 gap-8 xl:gap-16 items-start">
          
          <div className="lg:col-span-7 space-y-16">
            
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#6B8060] text-[#F5F2EB] flex items-center justify-center font-black text-xl shadow-md">1</div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#1A1F16]">Choose Your Impact</h2>
                  <p className="text-[#4A5E40] text-sm font-bold mt-1">You can select multiple causes to support.</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4">
                {CAUSES.map(cause => {
                  const cartItem = formData.cart?.find(c => c.id === cause.id);
                  const isSelected = !!cartItem;
                  const isActivePanel = activeCauseId === cause.id;
                  const Icon = cause.icon;
                  
                  return (
                    <motion.div 
                      whileHover={{ y: -4 }} 
                      key={cause.id} 
                      onClick={() => { 
                        setActiveCauseId(cause.id); 
                        if (!isSelected) handleAmountSelect(cause.id, 10); // Anchoring to 10
                        setIsCustomMode(false); 
                      }} 
                      className={`cursor-pointer p-6 rounded-[2rem] transition-all duration-300 border-2 relative ${
                        isSelected ? `bg-[#F5F2EB] border-[#6B8060] shadow-lg shadow-[#6B8060]/10` : 'bg-[#F5F2EB]/60 border-transparent hover:border-[#6B8060]/30 hover:bg-[#F5F2EB]'
                      } ${isActivePanel && isSelected ? 'ring-2 ring-offset-2 ring-[#6B8060]/50' : ''}`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 bg-[#6B8060] text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-sm">
                          {cartItem.quantity} units
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-4">
                        <Icon className={`${isSelected ? 'text-[#6B8060]' : 'text-[#4A5E40]/60'}`} size={36} />
                        {/* 🌟 Dynamic Deduction Badge */}
                       <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${cause.deductionRate === 100 ? 'bg-amber-400 text-amber-900' : 'bg-[#6B8060]/10 text-[#6B8060]'}`}>
  {cause.deductionRate}% Deductible
</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#1A1F16] mb-1">{cause.title}</h3>
                      <p className="text-[#4A5E40] text-xs font-medium mb-3">{cause.desc}</p>
                      <div className={`text-sm font-black ${isSelected ? 'text-[#4A5E40]' : 'text-[#1A1F16]'}`}>₹{cause.unitCost.toLocaleString()} / unit</div>
                    </motion.div>
                  );
                })}
              </div>

              <AnimatePresence>
                {activeCause && activeCartItem && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="botanical-card p-8 relative overflow-hidden">
                    <button 
                      onClick={() => handleAmountSelect(activeCause.id, 0)}
                      className="absolute top-6 right-6 text-red-500 hover:bg-red-50 p-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                    
                    <p className="font-bold text-[#1A1F16] mb-5 text-lg">
                      How many units of <span className="text-[#4A5E40]">{activeCause.title}</span>?
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mt-4">
                      {[1, 5, 10, 50, 100].map(qty => (
                        <div key={qty} className="relative">
                          {qty === 10 && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm z-10 whitespace-nowrap">
                              Most Popular
                            </span>
                          )}
                          <button 
                            onClick={() => { setIsCustomMode(false); handleAmountSelect(activeCause.id, qty); }} 
                            className={`px-6 py-4 rounded-2xl font-black text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${!isCustomMode && activeCartItem.quantity === qty ? 'bg-[#6B8060] text-[#F5F2EB] shadow-md ring-2 ring-[#6B8060] ring-offset-2 ring-offset-[#F5F2EB]' : 'bg-[#EAE3D2] text-[#4A5E40] hover:bg-[#dfd7c3] border border-[#6B8060]/20'}`}>
                            {qty}
                          </button>
                        </div>
                      ))}
                      
                      {!isCustomMode ? (
                        <div className="relative">
                          <button onClick={() => { setIsCustomMode(true); setCustomQty(activeCartItem.quantity); }} className="px-6 py-4 rounded-2xl font-black text-lg bg-[#EAE3D2] text-[#4A5E40] hover:bg-[#dfd7c3] border border-[#6B8060]/20 transition-all duration-300 hover:-translate-y-1">
                            Custom
                          </button>
                        </div>
                      ) : (
                        <div className="relative flex items-center">
                          <input type="number" min="1" autoFocus value={customQty} onChange={handleCustomQtyChange} placeholder="Enter qty" 
                            className="w-32 px-6 py-4 bg-[#F5F2EB] border-2 border-[#6B8060] rounded-2xl font-black text-[#1A1F16] text-lg focus:outline-none" />
                          <span className="absolute right-4 text-[#4A5E40] font-bold text-sm pointer-events-none">units</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={`space-y-8 transition-opacity duration-500 ${formData.amount > 0 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#4A5E40] text-[#F5F2EB] flex items-center justify-center font-black text-xl shadow-md">2</div>
                <h2 className="text-3xl md:text-4xl font-black text-[#1A1F16]">Your Details & Tax</h2>
              </div>
              
              <div className="botanical-card p-8 space-y-6">
                
                <div className="bg-[#EAE3D2] p-6 rounded-2xl border border-[#6B8060]/20 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Calculator className="text-[#4A5E40]" />
                    <h3 className="font-bold text-[#1A1F16]">Select Tax Regime (For 80G Deductions)</h3>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setTaxRegime('old')} className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${taxRegime === 'old' ? 'border-[#4A5E40] bg-[#4A5E40]/10 text-[#1A1F16]' : 'border-transparent bg-[#F5F2EB] text-[#4A5E40] hover:border-[#6B8060]/40'}`}>
                      Old Regime <span className="block text-xs font-normal opacity-80">Tax Benefits Applicable</span>
                    </button>
                    <button onClick={() => setTaxRegime('new')} className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${taxRegime === 'new' ? 'border-[#4A5E40] bg-[#4A5E40]/10 text-[#1A1F16]' : 'border-transparent bg-[#F5F2EB] text-[#4A5E40] hover:border-[#6B8060]/40'}`}>
                      New Regime <span className="block text-xs font-normal opacity-80">No 80G Benefits</span>
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-[#4A5E40] uppercase tracking-wider mb-2 block">Full Name</label>
                    <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="botanical-input" placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#4A5E40] uppercase tracking-wider mb-2 block">Email Address</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`botanical-input ${formData.email && !EMAIL_REGEX.test(formData.email) ? 'border-red-400 focus:ring-red-400/20' : ''}`} placeholder="jane@example.com" />
                    {formData.email && !EMAIL_REGEX.test(formData.email) && <p className="text-red-500 text-[10px] font-bold mt-1">Please enter a valid email.</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-[#4A5E40] uppercase tracking-wider mb-2 flex items-center gap-2">
                      PAN Number (Optional)
                      <span className="group relative cursor-help">
                        <ShieldCheck size={14} className="text-[#6B8060]" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#1A1F16] text-[#F5F2EB] text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center font-normal tracking-normal shadow-xl">
                          Required securely by the Govt. of India solely to generate your official 80G tax exemption certificate.
                        </span>
                      </span>
                    </label>
                    <input 
                      type="text" 
                      value={formData.pan} 
                      onChange={(e) => setFormData({...formData, pan: e.target.value.toUpperCase()})} 
                      maxLength={10} 
                      className={`botanical-input uppercase w-full px-4 py-3 rounded-xl border ${formData.pan && !PAN_REGEX.test(formData.pan) ? 'border-red-400 focus:ring-red-400/20' : 'border-[#6B8060]/30 focus:ring-[#6B8060]/20'} bg-[#F5F2EB] focus:outline-none focus:ring-2 transition-all`} 
                      placeholder="ABCDE1234F" 
                    />
                    {formData.pan && !PAN_REGEX.test(formData.pan) && (
                      <p className="text-red-500 text-[10px] font-bold mt-1">Please enter a valid 10-digit Indian PAN.</p>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 botanical-card p-8 md:p-10 border-t-4 border-t-[#6B8060] overflow-hidden relative">
              
              {taxSaved > 0 && (
                <div className="absolute top-24 right-0 w-40 h-40 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />
              )}
              
              <h3 className="text-2xl font-black text-[#1A1F16] mb-8 border-b border-[#6B8060]/20 pb-6 flex items-center justify-between">
                Cart Summary
                <Wallet size={24} className="text-[#6B8060]" />
              </h3>
              
              <div className="space-y-6 mb-10">
                {formData.cart?.length > 0 ? (
                  <div className="space-y-3 mb-6">
                    {formData.cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-white/50 p-3.5 rounded-xl border border-[#6B8060]/10 shadow-sm">
                        <div>
                          <span className="block font-bold text-[#1A1F16]">{item.title}</span>
                          <span className="text-xs text-[#4A5E40] font-medium">{item.quantity} units x ₹{item.unitCost}</span>
                        </div>
                        <span className="font-black text-[#1A1F16]">₹{item.total.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border-2 border-dashed border-[#6B8060]/20 rounded-xl mb-6">
                    <p className="text-sm font-bold text-[#4A5E40]">Your cart is empty.</p>
                  </div>
                )}

                <div className="flex justify-between items-center text-[#4A5E40] px-2 pt-4 border-t border-[#6B8060]/20">
                  <span className="font-medium text-lg">Total Contribution</span>
                  <span className="font-black text-[#1A1F16] text-xl">₹{formData.amount.toLocaleString()}</span>
                </div>
                
                <motion.div 
                  initial={false}
                  animate={taxSaved > 0 ? { scale: 1.02, backgroundColor: "rgba(16, 185, 129, 0.08)" } : { scale: 1, backgroundColor: "rgba(107, 128, 96, 0.05)" }}
                  className={`border rounded-3xl p-6 relative overflow-hidden transition-all duration-500 ${taxSaved > 0 ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/10' : 'border-[#6B8060]/20'}`}
                >
                  {taxSaved > 0 && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider py-1.5 px-4 rounded-bl-2xl shadow-sm flex items-center gap-1">
                      <TrendingDown size={14} strokeWidth={3} /> Save {Math.round((taxSaved / formData.amount) * 100)}%
                    </div>
                  )}

                  <div className="flex justify-between items-center relative z-10 mt-2">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner ${taxSaved > 0 ? 'bg-emerald-500/20 text-emerald-600' : 'bg-[#6B8060]/20 text-[#6B8060]'}`}>
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <span className={`block font-black text-xl ${taxSaved > 0 ? 'text-emerald-700' : 'text-[#4A5E40]'}`}>
                          Est. Tax Savings
                        </span>
                        <span className={`block text-xs font-bold mt-1 ${taxSaved > 0 ? 'text-emerald-600/80' : 'text-[#4A5E40]/70'}`}>
                          {taxRegime === 'old' ? 'Under Old Regime (80G)' : 'Not applicable in New Regime'}
                        </span>
                      </div>
                    </div>
                    <span className={`font-black text-3xl tracking-tight ${taxSaved > 0 ? 'text-emerald-600' : 'text-[#4A5E40]/50'}`}>
                      - ₹{taxSaved?.toLocaleString() || 0}
                    </span>
                  </div>
                </motion.div>

                {formData.amount > 0 && (
                  <div className="space-y-3 px-2">
                    <div className="h-4 w-full bg-[#EAE3D2] rounded-full overflow-hidden flex shadow-inner border border-[#6B8060]/10">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(0, ((formData.amount - taxSaved) / formData.amount) * 100)}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-[#1A1F16]" />
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(taxSaved / formData.amount) * 100}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-emerald-500 relative">
                        <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }} className="absolute inset-0 bg-white/30 skew-x-12 w-1/2" />
                      </motion.div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider px-1">
                      <span className="text-[#1A1F16] flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1A1F16] shadow-sm"/> Real Cost
                      </span>
                      <span className="text-emerald-600 flex items-center gap-2">
                        Govt Pays Back <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"/>
                      </span>
                    </div>
                  </div>
                )}

                <div className="h-px bg-[#6B8060]/20 w-full my-6" />
                
                <div className="flex justify-between items-end bg-gradient-to-br from-[#F5F2EB] to-[#EAE3D2] p-6 rounded-[2rem] border border-[#6B8060]/20 shadow-sm">
                  <div>
                    <span className="text-[#4A5E40] font-black uppercase tracking-wider text-sm block mb-1">Effective Cost To You</span>
                    <span className="text-xs text-[#4A5E40]/80 font-bold">Your actual out-of-pocket expense</span>
                  </div>
                  <div className="text-right">
                    <span className="text-5xl font-black text-[#1A1F16] tracking-tighter drop-shadow-sm">
₹{effectiveCost?.toLocaleString() || formData.amount}                  </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <p className="text-xs font-bold text-[#4A5E40] uppercase tracking-widest">Select Payment Method</p>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setPaymentMethod('razorpay')} className={`py-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold transition-all border-2 ${paymentMethod === 'razorpay' ? 'border-[#6B8060] bg-[#EAE3D2] text-[#1A1F16]' : 'border-transparent bg-[#EAE3D2]/50 text-[#4A5E40] hover:bg-[#EAE3D2]'}`}><CreditCard size={24}/> Razorpay</button>
                  <button onClick={() => setPaymentMethod('phonepe')} className={`py-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold transition-all border-2 ${paymentMethod === 'phonepe' ? 'border-[#6B8060] bg-[#EAE3D2] text-[#1A1F16]' : 'border-transparent bg-[#EAE3D2]/50 text-[#4A5E40] hover:bg-[#EAE3D2]'}`}><Smartphone size={24}/> PhonePe</button>
                </div>
              </div>

              {/* NEW: Revenue Protection Badge */}
              <div className="flex items-center justify-between mb-4 px-2">
                 <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md">
                   <ShieldCheck size={14} /> Revenue Protection Active
                 </span>
                 <span className="text-[10px] text-[#4A5E40] font-bold uppercase tracking-wider">Smart Routing Engine</span>
              </div>

              <button 
                onClick={handlePay} 
                disabled={!isFormValid || isProcessing}
                className="w-full py-6 botanical-btn-primary rounded-2xl font-black text-xl disabled:opacity-90 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-1 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#6B8060]/30 transition-all duration-300 relative overflow-hidden"
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center z-10">
                    <span className="text-sm font-bold text-[#EAE3D2] animate-pulse mb-1">{paymentLog}</span>
                    <div className="w-48 h-1 bg-[#4A5E40] rounded-full overflow-hidden">
                       <div className="w-1/2 h-full bg-[#EAE3D2] animate-[slide_1s_ease-in-out_infinite]" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 z-10">
                    <ShieldCheck size={28} /> Confirm ₹{formData.amount?.toLocaleString()}
                  </div>
                )}
              </button>
              
              <p className="text-center text-xs text-[#4A5E40] mt-6 font-medium flex items-center justify-center gap-2">
                <ShieldCheck size={16} /> 100% Secure & Encrypted
              </p>
            </div>
          </div>
        </div>
      </section>

      <Leaderboard />

      <TaxExplanationSection />

      {/* Partner NGOs Section */}
      <section className="py-24 border-t border-[#6B8060]/20">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#1A1F16] mb-4">Our Root Partners</h2>
            <p className="text-[#4A5E40] text-lg max-w-2xl mx-auto">Verified, high-impact organizations on the ground.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {NGOS.map((ngo, idx) => (
              <div key={idx} className="botanical-card p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                
                {/* 🌟 80G Tax Ribbon */}
                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl font-black text-[10px] tracking-widest uppercase shadow-sm z-10 ${ngo.deduction === 100 ? 'bg-amber-400 text-amber-900' : 'bg-[#6B8060] text-[#F5F2EB]'}`}>
                  {ngo.deduction}% Deductible
                </div>
                
                {/* Logo Container */}
<div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-md mb-6 border-4 border-[#F5F2EB] group-hover:scale-105 transition-transform duration-300 overflow-hidden p-3">
  {ngo.logoImg ? (
    <img src={ngo.logoImg} alt={`${ngo.name} Logo`} className="w-full h-full object-contain" />
  ) : (
    <span className="text-[#6B8060] font-black text-2xl">{ngo.logoText}</span>
  )}
</div>
                
                <h3 className="text-xl font-black text-[#1A1F16] mb-2">{ngo.name}</h3>
                <p className="text-xs font-bold text-[#6B8060] uppercase tracking-wider mb-3">{ngo.focus}</p>
                <p className="text-[#4A5E40] text-sm font-medium">{ngo.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CommunityWall comments={communityComments} onDonateClick={scrollToDonate} />

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToDonate}
            className="fixed bottom-8 right-8 z-50 px-6 py-4 botanical-btn-primary rounded-full font-bold flex items-center gap-2 shadow-2xl"
          >
            <ArrowUp size={20} /> Donate Now
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}