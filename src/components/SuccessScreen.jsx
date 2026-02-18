import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Download, Share2, ArrowRight } from 'lucide-react';

// --- PHYSICS CONFETTI COMPONENT ---
const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate 50 particles with random physics
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: 0, // Start from center
      y: 0, 
      // Random velocity
      velocityX: (Math.random() - 0.5) * 800, 
      velocityY: -Math.random() * 800 - 400, // Explode UP
      color: ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'][Math.floor(Math.random() * 5)],
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm"
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ 
            x: p.velocityX, 
            y: p.velocityY + 800, // Add "Gravity" (fall down)
            opacity: 0,
            rotate: p.rotation + 720, // Spin wildly
            scale: p.scale 
          }}
          transition={{ 
            duration: 2.5, 
            ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for "pop" feel
          }}
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
};

// --- MAIN SUCCESS SCREEN ---
export default function SuccessScreen({ formData }) {
  return (
    <div className="text-center py-6 relative h-full flex flex-col items-center justify-center">
      
      {/* 1. The Confetti Explosion */}
      <Confetti />

      {/* 2. Success Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30 ring-4 ring-white"
      >
        <Check size={48} className="text-white drop-shadow-md" strokeWidth={3} />
      </motion.div>

      {/* 3. Text & Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Donation Successful!</h2>
        <p className="text-slate-500 mb-8 max-w-xs mx-auto">
          Thank you, <span className="font-semibold text-slate-700">{formData.fullName}</span>. Your contribution has been verified.
        </p>
      </motion.div>

      {/* 4. Receipt Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/60 w-full max-w-sm mb-8 backdrop-blur-sm"
      >
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Amount Paid</span>
            <span className="text-2xl font-bold text-slate-900">₹{formData.amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-500">Transaction ID</span>
            <span className="font-mono text-slate-700">TXN_{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
        </div>
        <div className="flex justify-between text-sm">
            <span className="text-slate-500">Date</span>
            <span className="text-slate-700">{new Date().toLocaleDateString()}</span>
        </div>
      </motion.div>

      {/* 5. Action Buttons */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3 w-full max-w-sm"
      >
        <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2 group">
          <Download size={18} className="text-slate-400 group-hover:text-slate-600" />
          <span>Receipt</span>
        </button>
        <button className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2">
          <span>Share</span>
          <Share2 size={18} />
        </button>
      </motion.div>

      <p className="mt-8 text-xs text-slate-400 animate-pulse">
        Redirecting to home in 10s...
      </p>
    </div>
  );
}