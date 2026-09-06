export const RULES = {
  affordability: {
    safeFoIR: 0.40,
    lenderFoIR: 0.50,
    minimumResidualIncome: 0.10,
  },

  stress: {
    incomeFactor: 0.80,
  },

  loan: {
    defaultTenureMonths: 48,
    comparisonTenures: [36, 48, 60],
  },

  pricing: {
    personal: {
      low: 0.10,
      high: 0.15,
      processingFeeRate: 0.015,
    },
    vehicle: {
      low: 0.117,
      high: 0.157,
      processingFeeRate: 0.03,
    },
    securedBusiness: {
      low: 0.11,
      high: 0.16,
      processingFeeRate: 0.015,
    },
  },
};