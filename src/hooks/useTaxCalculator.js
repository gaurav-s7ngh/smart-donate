import { useState, useMemo } from 'react';
import { calculateTaxSavings, TAX_REGIMES } from '../lib/taxLogic';

export const useTaxCalculator = (amount) => {
  const [income, setIncome] = useState(1200000); // Default bracket
  const [regime, setRegime] = useState(TAX_REGIMES.OLD);

  const result = useMemo(() => {
    return calculateTaxSavings(amount, income, regime);
  }, [amount, income, regime]);

  return {
    income,
    setIncome,
    regime,
    setRegime,
    ...result
  };
};