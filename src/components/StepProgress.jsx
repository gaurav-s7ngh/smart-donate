import React from 'react';
import { motion } from 'framer-motion';

export default function StepProgress({ currentStep }) {
  const steps = [1, 2, 3];

  return (
    <div className="flex justify-center items-center gap-3 mb-6">
      {steps.map((step) => {
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center">
            <motion.div
              initial={false}
              animate={{
                backgroundColor: isActive || isCompleted ? '#1e293b' : '#f1f5f9', // slate-900 or slate-100
                color: isActive || isCompleted ? '#ffffff' : '#94a3b8',
                scale: isActive ? 1.1 : 1
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 z-10 relative"
            >
              {isCompleted ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : (
                step
              )}
              
              {/* Active Glow */}
              {isActive && (
                <motion.div 
                  layoutId="step-glow"
                  className="absolute inset-0 rounded-full bg-indigo-500 blur-lg opacity-20 -z-10"
                />
              )}
            </motion.div>
            
            {/* Connecting Line */}
            {step < 3 && (
              <div className="w-12 h-1 bg-slate-100 ml-3 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ x: '-100%' }}
                   animate={{ x: isCompleted ? '0%' : '-100%' }}
                   transition={{ duration: 0.5, ease: "easeInOut" }}
                   className="h-full bg-slate-900 w-full"
                 />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}