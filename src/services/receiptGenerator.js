export const generateComplianceReceipt = (transaction) => {
  // Check if cart has any 80G eligible items
  const has80G = transaction.cart.some(item => item.deductionRate > 0);
  
  return {
    receiptId: `80G-SP-${Math.floor(100000 + Math.random() * 900000)}`,
    transactionId: transaction.transactionId,
    timestamp: new Date(transaction.timestamp).toLocaleString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    gateway: transaction.gatewayUsed,
    is80GEligible: has80G,
    digitalSignature: `Verified_SevaPay_${transaction.transactionId}`,
    complianceStatus: has80G ? "80G Compliant" : "Standard Receipt"
  };
};