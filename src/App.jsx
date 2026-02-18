import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LiveCounter from './components/LiveCounter';
import StepProgress from './components/StepProgress';
import AmountSelection from './components/steps/AmountSelection';
import DonorDetails from './components/steps/DonorDetails';
import PaymentSummary from './components/steps/PaymentSummary';
import SuccessScreen from './components/SuccessScreen';

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ amount: 1000, fullName: '', email: '', pan: '' });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen relative font-sans selection:bg-indigo-500/20 selection:text-indigo-900 pb-20">
      
      <LiveCounter />

      <main className="max-w-lg mx-auto px-4 pt-4">
        
        {/* Header Text */}
        <div className="text-center mb-8 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2"
          >
            Make an <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Impact</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium"
          >
            100% Secure. Tax Exempt. Transparent.
          </motion.p>
        </div>

        {/* The "Masterpiece" Card */}
        <div className="relative group">
          
          {/* Ambient Glow behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          
          <div className="glass-morphism rounded-[2rem] p-8 sm:p-10 relative overflow-hidden min-h-[550px] flex flex-col">
            
            {step < 4 && <StepProgress currentStep={step} />}
            
            <div className="flex-1 mt-6 relative">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1" 
                    initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }} 
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
                    exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <AmountSelection formData={formData} setFormData={setFormData} onNext={nextStep} />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div 
                    key="step2" 
                    initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }} 
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
                    exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <DonorDetails formData={formData} setFormData={setFormData} onNext={nextStep} onBack={prevStep} />
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div 
                    key="step3" 
                    initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }} 
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
                    exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <PaymentSummary formData={formData} onBack={prevStep} onSuccess={nextStep} />
                  </motion.div>
                )}
                {step === 4 && (
                  <motion.div 
                    key="step4" 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                  >
                    <SuccessScreen formData={formData} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 flex justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Simple visual placeholders for trust logos */}
             <div className="h-5 w-16 bg-slate-900/20 rounded-md"></div>
             <div className="h-5 w-16 bg-slate-900/20 rounded-md"></div>
             <div className="h-5 w-16 bg-slate-900/20 rounded-md"></div>
        </div>

      </main>
    </div>
  );
}