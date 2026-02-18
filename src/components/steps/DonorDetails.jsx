import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck, AlertCircle, ArrowLeft, Lock } from 'lucide-react';

export default function DonorDetails({ formData, setFormData, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Regex patterns
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  useEffect(() => {
    const newErrors = {};
    if (formData.email && !EMAIL_REGEX.test(formData.email)) newErrors.email = "Invalid email";
    if (formData.pan && !PAN_REGEX.test(formData.pan)) newErrors.pan = "Invalid PAN";
    setErrors(newErrors);
    setIsValid(formData.fullName && formData.email && formData.pan && Object.keys(newErrors).length === 0);
  }, [formData]);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Your Details</h2>

      <div className="space-y-5 flex-1">
        {/* Name */}
        <div className="group">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="input-field"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div className="group relative">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`input-field ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}`}
              placeholder="john@example.com"
            />
            {formData.email && !errors.email && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3 top-3.5 text-emerald-500 bg-emerald-50 rounded-full p-0.5">
                <Check size={14} strokeWidth={3} />
              </motion.div>
            )}
          </div>
        </div>

        {/* PAN */}
        <div className="group">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">PAN Number</label>
          <div className="relative">
            <input
              type="text"
              value={formData.pan}
              onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
              maxLength={10}
              className={`input-field uppercase tracking-widest font-mono ${errors.pan ? 'border-red-300' : ''}`}
              placeholder="ABCDE1234F"
            />
             {formData.pan && !errors.pan && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3 top-3.5 text-emerald-500 bg-emerald-50 rounded-full p-0.5">
                <Check size={14} strokeWidth={3} />
              </motion.div>
            )}
          </div>
          
          {/* Tax Badge */}
          <AnimatePresence>
            {formData.pan && !errors.pan && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100/50 rounded-xl p-3 flex items-center gap-3 shadow-sm"
              >
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white p-1.5 rounded-lg shadow-amber-200 shadow-md">
                  <ShieldCheck size={14} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-900/80">80G Tax Exemption Eligible</p>
                  <p className="text-[10px] text-amber-700/60 font-medium">Receipt sent automatically</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button 
          onClick={onBack} 
          className="px-5 py-4 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <motion.button
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <span>Review & Pay</span>
          <Lock size={16} className="opacity-50" />
        </motion.button>
      </div>
    </div>
  );
}