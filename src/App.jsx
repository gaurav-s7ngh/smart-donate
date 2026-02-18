import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Assets
import logo from './assets/logo.png';

// Custom Hooks
import { useDonation } from './hooks/useDonation';

// Components
import LiveCounter from './components/LiveCounter';
import StepProgress from './components/StepProgress';
import AmountSelection from './components/steps/AmountSelection';
import DonorDetails from './components/steps/DonorDetails';
import PaymentSummary from './components/steps/PaymentSummary';
import SuccessScreen from './components/SuccessScreen';
import Dashboard from './pages/Dashboard';
import RecommendationModal from './components/modals/RecommendationModal';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState('donate'); // 'donate' | 'dashboard'
  const [showRecModal, setShowRecModal] = useState(false);

  // Core Donation Logic (via Hook)
  const { 
    step, 
    formData, 
    setFormData, 
    nextStep, 
    prevStep, 
    resetFlow 
  } = useDonation();

  // Effect: Intelligence Recommendation on First Visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('smartDonate_v2_visited');
    if (!hasVisited) {
      // Small delay for better UX
      const timer = setTimeout(() => setShowRecModal(true), 1500);
      localStorage.setItem('smartDonate_v2_visited', 'true');
      return () => clearTimeout(timer);
    }
  }, []);

  // Handler for Recommendation "AI" Completion
  const handleRecommendationComplete = (preferences) => {
    console.log("User Preferences Captured:", preferences);
    // In a real app, you would filter causes here based on these prefs
    setShowRecModal(false);
  };

  // --- RENDER: DASHBOARD VIEW ---
  if (currentView === 'dashboard') {
    return (
      <AnimatePresence mode="wait">
        <motion.div 
          key="dashboard"
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          exit={{ opacity: 0, x: -20 }}
        >
          <Dashboard onBack={() => setCurrentView('donate')} />
        </motion.div>
      </AnimatePresence>
    );
  }

  // --- RENDER: MAIN DONATION FLOW ---
  return (
    <div className="min-h-screen relative font-sans selection:bg-indigo-500/20 selection:text-indigo-900 pb-20 overflow-x-hidden bg-slate-50">
      
      {/* Background Decor (Subtle Premium Gradients) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Intelligence Modal */}
      <AnimatePresence>
        {showRecModal && (
          <RecommendationModal 
            onClose={() => setShowRecModal(false)}
            onComplete={handleRecommendationComplete} 
          />
        )}
      </AnimatePresence>

      <LiveCounter />

      <main className="max-w-lg mx-auto px-4 pt-6 relative z-10">
        
        {/* Header (Hidden on Success Screen for Cleanliness) */}
        {step < 4 && (
          <div className="text-center mb-8 relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex justify-center"
            >
              <img 
                src={logo} 
                alt="SmartDonate Logo" 
                className="h-10 object-contain" 
                onError={(e) => e.target.style.display='none'} 
              />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Outcome First <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Giving</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">100% Transparency. Real Tax Benefits.</p>
          </div>
        )}

        {/* The Glass Card Container */}
        <div className="relative group perspective-1000">
          {/* Hover Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur-xl opacity-5 group-hover:opacity-15 transition duration-1000"></div>
          
          <div className="glass-morphism rounded-[2rem] p-6 sm:p-8 relative overflow-hidden min-h-[600px] flex flex-col transition-all duration-300 ring-1 ring-white/60 bg-white/80 backdrop-blur-2xl shadow-2xl">
            
            {/* Progress Indicator (Only steps 1-3) */}
            {step < 4 && <StepProgress currentStep={step} />}
            
            <div className="flex-1 mt-4 relative">
              <AnimatePresence mode="wait" initial={false}>
                
                {step === 1 && (
                  <motion.div 
                    key="step1" 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }} className="h-full"
                  >
                    <AmountSelection 
                      formData={formData} 
                      setFormData={setFormData} 
                      onNext={nextStep} 
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2" 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }} className="h-full"
                  >
                    <DonorDetails 
                      formData={formData} 
                      setFormData={setFormData} 
                      onNext={nextStep} 
                      onBack={prevStep} 
                    />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3" 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }} className="h-full"
                  >
                    <PaymentSummary 
                      formData={formData} 
                      onBack={prevStep} 
                      onSuccess={nextStep} 
                    />
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div 
                    key="step4" 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="h-full"
                  >
                    <SuccessScreen 
                      formData={formData} 
                      onReset={resetFlow} 
                      onViewDashboard={() => setCurrentView('dashboard')} 
                    />
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Footer Navigation */}
        {step < 4 && (
           <div className="text-center mt-8 pb-8">
             <button 
                onClick={() => setCurrentView('dashboard')} 
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors flex items-center justify-center gap-1 mx-auto"
             >
               View My Impact Dashboard
             </button>
           </div>
        )}

      </main>
    </div>
  );
}