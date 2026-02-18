import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TARGET_AMOUNT = 243500;

export default function LiveCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Smooth counting logic
    const duration = 2500;
    const start = performance.now();
    
    const animate = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(ease * TARGET_AMOUNT));
      
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, []);

  return (
    <div className="flex justify-center pt-6 pb-2 sticky top-0 z-50 pointer-events-none">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="glass-pill px-5 py-2 flex items-center gap-3 pointer-events-auto ring-1 ring-white/60 relative overflow-hidden group"
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Live Donations</span>
        </div>
        
        <div className="h-4 w-px bg-slate-200"></div>
        
        <div className="font-mono text-sm font-bold text-slate-800 tabular-nums tracking-tight">
          ₹ {count.toLocaleString('en-IN')}
        </div>
      </motion.div>
    </div>
  );
}