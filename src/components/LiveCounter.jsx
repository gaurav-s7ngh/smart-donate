import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function LiveCounter() {
  const [count, setCount] = useState(14205);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Simulate live donations
    const interval = setInterval(() => {
      const shouldUpdate = Math.random() > 0.6; // Random chance
      if (shouldUpdate) {
        setCount(prev => prev + 1);
        
        // Show subtle toast
        const names = ["Aarav", "Priya", "Rahul", "Ananya", "Vikram"];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const cities = ["Mumbai", "Delhi", "Bangalore", "Pune"];
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        
        setNotification(`${randomName} from ${randomCity} just donated!`);
        
        // Hide toast after 3s
        setTimeout(() => setNotification(null), 3000);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Fixed Counter Pill */}
      <div className="fixed top-6 right-6 z-40">
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
          </div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Impact Makers</span>
          <div className="w-px h-3 bg-slate-200 mx-1" />
          <motion.span 
            key={count}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-sm font-extrabold text-slate-900 tabular-nums"
          >
            {count.toLocaleString()}
          </motion.span>
        </div>
      </div>

      {/* Floating Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 10, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 flex items-center gap-3 px-4 py-2.5 bg-slate-900 text-white rounded-full shadow-xl shadow-slate-900/20 whitespace-nowrap"
          >
            <div className="bg-white/10 p-1 rounded-full">
              <Zap size={12} className="text-yellow-400" fill="currentColor" />
            </div>
            <span className="text-xs font-medium">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}