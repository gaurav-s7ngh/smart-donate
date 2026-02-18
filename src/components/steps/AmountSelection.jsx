import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

const PRESETS = [
  { value: 100, label: "🌱 Seed", impact: "3 meals" },
  { value: 500, label: "📚 Learn", impact: "1 week school" },
  { value: 1000, label: "💊 Care", impact: "Medical kit" },
  { value: 2500, label: "🏥 Heal", impact: "Full surgery" },
];

export default function AmountSelection({ formData, setFormData, onNext }) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Select Contribution</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {PRESETS.map((preset) => {
          const isSelected = formData.amount === preset.value;
          return (
            <motion.button
              key={preset.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData({ ...formData, amount: preset.value })}
              className={`
                relative p-4 rounded-2xl text-left border transition-all duration-200 overflow-hidden
                ${isSelected 
                  ? "border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-500/10" 
                  : "border-slate-200 bg-white/50 hover:border-indigo-200 hover:bg-white"
                }
              `}
            >
              {isSelected && <div className="absolute top-0 right-0 p-2"><div className="bg-indigo-500 rounded-full p-0.5"><Check size={12} className="text-white"/></div></div>}
              
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">{preset.label}</span>
              <div className="text-xl font-bold text-slate-900 mb-1">₹{preset.value}</div>
              <div className="text-[10px] font-medium text-slate-500 bg-slate-100 inline-block px-2 py-1 rounded-full">{preset.impact}</div>
            </motion.button>
          );
        })}
      </div>

      <div className="mb-8">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Custom Amount</label>
        <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
            <input 
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                className="input-field pl-10 text-xl font-bold tracking-tight"
                placeholder="0"
            />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="mt-auto w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 group transition-all"
      >
        <span>Continue</span>
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}