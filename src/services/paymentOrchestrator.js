// Simulated Gateway Intelligence
const GATEWAYS = [
  { id: 'razorpay', name: 'Razorpay', successRate: 98.5, latency: 200 },
  { id: 'phonepe', name: 'PhonePe', successRate: 95.2, latency: 300 },
  { id: 'stripe', name: 'Stripe', successRate: 99.1, latency: 450 },
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const simulateGatewayStats = () => {
  // Add slight randomization to simulate real-time network conditions
  return GATEWAYS.map(g => ({
    ...g,
    currentLatency: g.latency + Math.floor(Math.random() * 100),
    isHealthy: Math.random() > 0.05 // 5% chance of spontaneous network drop
  })).sort((a, b) => a.currentLatency - b.currentLatency); // Rank by speed
};

export const processPaymentWithProtection = async (amount, cart, onLogUpdate) => {
  onLogUpdate("Initiating Revenue Protection Layer...");
  await delay(600);

  const availableGateways = simulateGatewayStats();
  let primary = availableGateways[0];
  let secondary = availableGateways[1];

  onLogUpdate(`Optimal Route Selected: ${primary.name} (${primary.currentLatency}ms ping)`);
  await delay(800);

  onLogUpdate(`Authorizing ₹${amount} via ${primary.name}...`);
  await delay(1200);

  // DEMO TRICK: If amount ends in '1' (e.g., 1001), force a gateway failure to show retry logic
  const isDemoFailure = amount % 10 === 1;

  if (isDemoFailure || !primary.isHealthy) {
    onLogUpdate(`⚠️ ${primary.name} Timeout. Revenue Protection Active.`);
    await delay(1000);
    
    onLogUpdate(`🔄 Rerouting transaction via ${secondary.name}...`);
    await delay(1500);
    
    onLogUpdate(`✅ Reroute Successful via ${secondary.name}`);
    primary = secondary; // Transaction ultimately processed by secondary
  } else {
    onLogUpdate(`✅ Payment Processed via ${primary.name}`);
  }

  await delay(500);

  return {
    success: true,
    transactionId: `SP-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    gatewayUsed: primary.name,
    timestamp: new Date().toISOString(),
    amount: amount,
    cart: cart
  };
};