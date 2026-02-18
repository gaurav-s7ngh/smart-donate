import React from 'react';
import { motion } from 'framer-motion';

export default function StepProgress({ currentStep }) {
  const steps = [
    { id: 1, label: "Amount" },
    { id: 2, label: "Details" },
    { id: 3, label: "Confirm" }
  ];

  return (
    <div className="flex justify-between items-center mb-8 px-2 relative">
      {/* Connecting Line */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 rounded-full"></div>
      
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <div key={step.id} className="flex flex-col items-center gap-2 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-xl">
            <motion.div 
              initial={false}
              animate={{
                scale: isActive ? 1.1 : 1,
                backgroundColor: isActive || isCompleted ? '#4f46e5' : '#f1f5f9',
                borderColor: isActive ? '#c7d2fe' : 'transparent'
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-transparent transition-colors duration-300 relative`}
            >
              {isCompleted ? (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{step.id}</span>
              )}
              
              {/* Active Glow */}
              {isActive && (
                <motion.div 
                  layoutId="glow"
                  className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)] z-[-1]"
                />
              )}
            </motion.div>
            
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}