import { useState, useEffect } from 'react';

const INITIAL_DATA = {
  amount: 0,
  causeId: null,
  causeTitle: '',
  units: 0,
  fullName: '',
  email: '',
  pan: '',
};

export const useDonation = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  
  // Load real history from localStorage on initialization
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('sd_donation_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist history whenever it changes
  useEffect(() => {
    localStorage.setItem('sd_donation_history', JSON.stringify(history));
  }, [history]);

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  
  const resetFlow = () => {
    // Save the successful donation to history before resetting
    if (formData.amount > 0) {
      const newEntry = {
        ...formData,
        id: Date.now(),
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [newEntry, ...prev]);
    }
    setStep(1);
    setFormData(INITIAL_DATA);
  };

  return { step, formData, setFormData, history, nextStep, prevStep, resetFlow };
};