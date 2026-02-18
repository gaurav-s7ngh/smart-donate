import { useState } from 'react';

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
  const [history, setHistory] = useState([]); // In a real app, this fetches from API

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  
  const resetFlow = () => {
    setStep(1);
    // Preserve history, reset current form
    if (formData.amount > 0) {
      setHistory(prev => [
        { ...formData, date: new Date().toISOString() }, 
        ...prev
      ]);
    }
    setFormData(INITIAL_DATA);
  };

  return {
    step,
    setStep,
    formData,
    setFormData,
    history,
    nextStep,
    prevStep,
    resetFlow
  };
};