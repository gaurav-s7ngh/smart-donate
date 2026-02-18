import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useTaxCalculator } from '../../hooks/useTaxCalculator';

export default function TaxVisualizer({ amount, isOpen, onToggle }) {
  const { saved, effectiveCost, income, setIncome, regime, setRegime } = useTaxCalculator(amount);

  return (
    <div className="mt-4 border border-indigo-100 rounded-2xl bg-white/60 backdrop-blur-md overflow-hidden transition-all shadow-sm">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-indigo-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
            <Calculator size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Smart 80G Tax Saver</h4>
            <p className="text-[10px] text-slate-500 font-medium">See how much you save</p>
          </div>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-indigo-50 bg-white"
          >
            <div className="p-5 space-y-4">
              {/* Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Annual Income</label>
                  <select 
                    value={income} 
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500"
                  >
                    <option value={500000}>Up to ₹5L</option>
                    <option value={1000000}>₹5L - ₹10L</option>
                    <option value={1500000}>₹10L - ₹15L</option>
                    <option value={2000000}>Above ₹15L</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tax Regime</label>
                  <div className="flex bg-slate-50 p-1 rounded-lg mt-1 border border-slate-200">
                    {['old', 'new'].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRegime(r)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${regime === r ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Result Card */}
              <div className="bg-slate-900 rounded-xl p-4 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500 blur-3xl opacity-20 rounded-full" />
                
                <div className="relative z-10 grid grid-cols-3 gap-2 text-center divide-x divide-white/10">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">You Give</div>
                    <div className="text-lg font-bold">₹{amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-400 uppercase">You Save</div>
                    <div className="text-lg font-bold text-emerald-400">₹{saved.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-indigo-300 uppercase">Real Cost</div>
                    <div className="text-lg font-bold text-indigo-300">₹{effectiveCost.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 items-start bg-amber-50 p-2 rounded-lg border border-amber-100">
                <Info size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <p className="text-[10px] text-amber-800 leading-tight">
                  Under section 80G, 50% of your donation is deductible. Savings calculated based on your slab.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}