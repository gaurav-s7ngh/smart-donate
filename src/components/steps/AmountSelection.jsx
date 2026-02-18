import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Wallet } from 'lucide-react';
import ImpactCard from '../ImpactCard';
import TaxVisualizer from '../modals/TaxVisualizer';

const CAUSES = [
  { id: 1, title: "Sponsor a Meal", category: "Hunger", unitCost: 40, desc: "Nutritious meal for a child.", raised: 12000, goal: 50000 },
  { id: 2, title: "School Kit", category: "Education", unitCost: 500, desc: "Books, bag & stationery.", raised: 45000, goal: 100000 },
  { id: 3, title: "Cataract Surgery", category: "Health", unitCost: 2000, desc: "Restore vision for an elder.", raised: 15000, goal: 200000 },
];

export default function AmountSelection({ formData, setFormData, onNext }) {
  const [selectedCauseId, setSelectedCauseId] = useState(CAUSES[0].id);
  const [quantity,QH] = useState(1);
  const [showTax, setShowTax] = useState(false);

  // Update parent state whenever local selection changes
  const updateSelection = (id, qty) => {
    setSelectedCauseId(id);
    QH(qty);
    const cause = CAUSES.find(c => c.id === id);
    const total = cause.unitCost * qty;
    
    setFormData(prev => ({
      ...prev,
      amount: total,
      causeId: id,
      causeTitle: cause.title,
      units: qty
    }));
  };

  // Initial Sync
  React.useEffect(() => {
    if(!formData.causeId) updateSelection(CAUSES[0].id, 1);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">Choose Impact</h2>
        <div className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
          Outcome First
        </div>
      </div>

      <div className="space-y-3 mb-6 overflow-y-auto pr-1 -mr-2 pb-2">
        {CAUSES.map(cause => (
          <ImpactCard 
            key={cause.id}
            cause={cause}
            isSelected={selectedCauseId === cause.id}
            onSelect={(id) => updateSelection(id, 1)}
            quantity={quantity}
            onUpdateQuantity={updateSelection}
          />
        ))}
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-end mb-4 px-1">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Total Impact</span>
            <div className="text-2xl font-extrabold text-slate-900">
              ₹{formData.amount?.toLocaleString() || 0}
            </div>
          </div>
          <div className="text-right">
             <span className="text-xs text-slate-400 font-bold uppercase block">Lives Touched</span>
             <span className="text-lg font-bold text-indigo-600">{quantity}</span>
          </div>
        </div>

        <TaxVisualizer 
          amount={formData.amount || 0} 
          isOpen={showTax} 
          onToggle={() => setShowTax(!showTax)} 
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="w-full mt-4 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2"
        >
          <span>Continue</span>
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}