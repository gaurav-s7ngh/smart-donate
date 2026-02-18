import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export default function ImpactCard({ cause, isSelected, onSelect, quantity, onUpdateQuantity }) {
  const progress = (cause.raised / cause.goal) * 100;

  const handleIncrement = (e) => {
    e.stopPropagation();
    onUpdateQuantity(cause.id, quantity + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (quantity > 1) onUpdateQuantity(cause.id, quantity - 1);
  };

  return (
    <motion.div
      layout
      onClick={() => onSelect(cause.id)}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer group
        ${isSelected 
          ? 'border-indigo-500 bg-white shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500' 
          : 'border-slate-200 bg-white/50 hover:bg-white hover:border-indigo-300'
        }`}
    >
      {/* Background Progress Bar (Subtle) */}
      <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full">
        <div className="h-full bg-emerald-500/50" style={{ width: `${progress}%` }} />
      </div>

      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
            {cause.category}
          </span>
          {isSelected && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              SELECTED
            </motion.div>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{cause.title}</h3>
        <p className="text-xs text-slate-500 mb-4 line-clamp-2">{cause.desc}</p>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase">Cost / Unit</div>
            <div className="text-lg font-bold text-slate-900">₹{cause.unitCost}</div>
          </div>

          {/* Quantity Controls (Only visible when selected) */}
          {isSelected ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 bg-slate-900 text-white rounded-xl p-1.5 shadow-lg"
            >
              <button onClick={handleDecrement} className="p-1 hover:bg-white/20 rounded-lg transition"><Minus size={14} /></button>
              <span className="font-bold w-4 text-center text-sm">{quantity}</span>
              <button onClick={handleIncrement} className="p-1 hover:bg-white/20 rounded-lg transition"><Plus size={14} /></button>
            </motion.div>
          ) : (
             <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Plus size={16} />
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}