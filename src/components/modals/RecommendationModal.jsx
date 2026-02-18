import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe, BookOpen, Smile } from 'lucide-react';

export default function RecommendationModal({ onComplete, onClose }) {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState([]);

  // Mock "AI" Processing delay
  const handleFinish = () => {
    setStep(3); // Loading state
    setTimeout(() => {
      onComplete(preferences);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
      >
        <div className="p-8">
          {step === 1 && (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                  <Heart size={24} fill="currentColor" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Let's Personalize Impact</h2>
                <p className="text-slate-500 text-sm mt-2">What causes are closest to your heart?</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { id: 'education', icon: BookOpen, label: "Education" },
                  { id: 'health', icon: Heart, label: "Healthcare" },
                  { id: 'hunger', icon: Smile, label: "Hunger" },
                  { id: 'climate', icon: Globe, label: "Climate" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPreferences(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${preferences.includes(item.id) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    <item.icon size={20} />
                    <span className="text-sm font-bold">{item.label}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={handleFinish}
                disabled={preferences.length === 0}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold disabled:opacity-50"
              >
                Find My Causes
              </button>
            </>
          )}

          {step === 3 && (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
              <h3 className="text-lg font-bold text-slate-900">Curating Impact...</h3>
              <p className="text-xs text-slate-400 mt-2">Matching your preferences with high-need areas.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}