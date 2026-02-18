export const TAX_REGIMES = {
  OLD: 'old',
  NEW: 'new',
};

/**
 * Calculates estimated tax savings based on 80G logic.
 * * Logic:
 * 1. New Regime: No 80G benefits (Savings = 0).
 * 2. Old Regime: 50% of the donation amount is deductible (Section 80G).
 * 3. Tax Rate: Estimated based on income slab (simplified for UX).
 */
export const calculateTaxSavings = (donationAmount, annualIncome, regime) => {
  // 1. New Regime Check
  if (regime === TAX_REGIMES.NEW) {
    return { 
      saved: 0, 
      effectiveCost: donationAmount, 
      taxRate: 0,
      message: "Tax benefits are only applicable under the Old Regime." 
    };
  }

  // 2. Determine Slab Rate (Simplified 2024-25 Old Regime estimations)
  let taxRate = 0;
  if (annualIncome > 1000000) {
    taxRate = 0.30; // 30% slab
  } else if (annualIncome > 500000) {
    taxRate = 0.20; // 20% slab (averaged)
  } else {
    taxRate = 0; // Below taxable limit
  }

  // Add 4% Health & Education Cess
  const effectiveTaxRate = taxRate * 1.04;

  // 3. Calculate 80G Deduction (50% of donation is deductible)
  const deductibleAmount = donationAmount * 0.5;
  
  // 4. Final Savings
  const taxSaved = Math.round(deductibleAmount * effectiveTaxRate);

  return {
    saved: taxSaved,
    effectiveCost: donationAmount - taxSaved,
    taxRate: (taxRate * 100).toFixed(0),
    deductible: deductibleAmount
  };
};