import { RULES } from "./rules";

const round = (value, digits = 0) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

export function calculateEmi(principal, annualRate, months) {
  if (!principal || principal <= 0 || !annualRate || annualRate <= 0 || !months) {
    return principal > 0 && months ? principal / months : 0;
  }

  const monthlyRate = annualRate / 12;
  return principal * monthlyRate * (1 + monthlyRate) ** months /
    ((1 + monthlyRate) ** months - 1);
}

export function calculateLoanAmountFromEmi(emi, annualRate, months) {
  if (!emi || emi <= 0 || !annualRate || annualRate <= 0 || !months) return 0;

  const monthlyRate = annualRate / 12;
  return emi * ((1 + monthlyRate) ** months - 1) /
    (monthlyRate * (1 + monthlyRate) ** months);
}

function calculateApr(principal, annualRate, months, upfrontFee) {
  const payment = calculateEmi(principal, annualRate, months);
  const netDisbursed = principal - upfrontFee;

  if (netDisbursed <= 0 || payment <= 0) return null;

  const npv = (monthlyRate) => {
    let value = netDisbursed;
    for (let month = 1; month <= months; month += 1) {
      value -= payment / (1 + monthlyRate) ** month;
    }
    return value;
  };

  let low = 0;
  let high = 1;

  for (let i = 0; i < 80; i += 1) {
    const mid = (low + high) / 2;
    if (npv(mid) > 0) high = mid;
    else low = mid;
  }

  const monthlyIr = (low + high) / 2;
  return (1 + monthlyIr) ** 12 - 1;
}

export function calculateAssessedIncome(profile) {
  const base = Number(profile.income?.reliableMonthly) || 0;
  const coBorrower =
    profile.coBorrower?.hasOne === "yes" && profile.coBorrower?.stable === "yes"
      ? Number(profile.coBorrower.reliableMonthly) || 0
      : 0;

  return base + coBorrower;
}

export function calculateSafeBoundary(profile) {
  const income = calculateAssessedIncome(profile);
  const existingEmi = Number(profile.existingDebt?.monthlyEmi) || 0;
  const essentials = Number(profile.expenses?.essentialMonthly) || 0;

  const foirCeiling = income * RULES.affordability.safeFoIR;
  const expenseCeiling =
    income - essentials - income * RULES.affordability.minimumResidualIncome;

  const safeTotalEmi = Math.max(0, Math.min(foirCeiling, expenseCeiling));
  const safeNewEmi = Math.max(0, safeTotalEmi - existingEmi);

  return {
    income,
    existingEmi,
    essentials,
    foirCeiling,
    expenseCeiling,
    safeTotalEmi,
    safeNewEmi,
  };
}

export function calculateLenderBoundary(profile) {
  const income = calculateAssessedIncome(profile);
  const existingEmi = Number(profile.existingDebt?.monthlyEmi) || 0;
  const lenderTotalEmi = income * RULES.affordability.lenderFoIR;
  const lenderNewEmi = Math.max(0, lenderTotalEmi - existingEmi);

  return {
    income,
    existingEmi,
    lenderTotalEmi,
    lenderNewEmi,
  };
}

function pricingFor(type) {
  return RULES.pricing[type] || RULES.pricing.personal;
}

function getPricingBand(profile) {
  const pricing = pricingFor(profile.loan?.type);
  let low = pricing.low;
  let high = pricing.high;
  const rawScore = profile.backup?.creditScore;
  const score = rawScore === "" || rawScore == null ? NaN : Number(rawScore);

  if (Number.isFinite(score)) {
    if (score >= 800) {
      low -= 0.005;
      high -= 0.005;
    } else if (score < 700) {
      low += 0.01;
      high += 0.01;
    }
  } else {
    high += 0.01;
  }

  return {
    low: Math.max(0, low),
    high,
    processingFeeRate: pricing.processingFeeRate,
    scoreKnown: Number.isFinite(score),
  };
}

function decisionFor(profile, safeBoundary, requestedEmi) {
  const issue = profile.repayment?.recentIssue;
  const highCost = profile.existingDebt?.highCost === "yes";
  const distress =
    issue === "missedPayment" ||
    (highCost && issue === "highCostDebt") ||
    issue === "multipleDebt";

  if (distress) {
    return {
      verdict: "DON'T BORROW",
      reasons: [
        "Recent repayment difficulty or high-cost debt makes adding another loan unsafe right now.",
      ],
    };
  }

  if (requestedEmi <= safeBoundary.safeNewEmi) {
    return {
      verdict: "BORROW",
      reasons: [
        "The requested EMI fits within your safer monthly borrowing boundary.",
      ],
    };
  }

  return {
    verdict: "BORROW LESS",
    reasons: [
      "The requested EMI is above your safer monthly borrowing boundary.",
    ],
  };
}

function buildDrivers(profile, safeBoundary, lenderBoundary) {
  const drivers = [];

  if (safeBoundary.existingEmi > 0) {
    drivers.push(
      `Existing EMI of ₹${Math.round(safeBoundary.existingEmi).toLocaleString("en-IN")} reduces the room available for a new EMI.`
    );
  }

  if (safeBoundary.expenseCeiling < safeBoundary.foirCeiling) {
    drivers.push(
      "Essential household expenses, plus the 10% residual-income guardrail, are the main limit on the safe boundary."
    );
  } else {
    drivers.push(
      "The 40% safe affordability boundary is the main limit on the safe monthly EMI."
    );
  }

  if (lenderBoundary.lenderNewEmi > safeBoundary.safeNewEmi + 1) {
    drivers.push(
      "A lender-style 50% capacity can be higher than the borrower's safer boundary; the safer number is the one to use."
    );
  }

  if (!Number.isFinite(Number(profile.backup?.creditScore))) {
    drivers.push("Credit score is unknown, so the fair-rate range is kept wider rather than assuming a score.");
  }

  if (profile.repayment?.recentIssue === "unstableIncome") {
    drivers.push("Recent income instability makes the boundary less resilient under stress.");
  }

  return drivers.slice(0, 3);
}

export function assessBorrower(profile) {
  const safeBoundary = calculateSafeBoundary(profile);
  const lenderBoundary = calculateLenderBoundary(profile);
  const requestedAmount = Number(profile.loan?.amount) || 0;
  const pricing = getPricingBand(profile);
  const tenure = RULES.loan.defaultTenureMonths;
  const midpointRate = (pricing.low + pricing.high) / 2;
  const requestedEmi = calculateEmi(requestedAmount, midpointRate, tenure);
  const processingFee = requestedAmount * pricing.processingFeeRate;
  const apr = calculateApr(requestedAmount, midpointRate, tenure, processingFee);

  const safeAmount = calculateLoanAmountFromEmi(
    safeBoundary.safeNewEmi,
    midpointRate,
    tenure
  );

  const lenderAmount = calculateLoanAmountFromEmi(
    lenderBoundary.lenderNewEmi,
    midpointRate,
    tenure
  );

  const stressProfile = {
    ...profile,
    income: {
      ...profile.income,
      reliableMonthly:
        (Number(profile.income?.reliableMonthly) || 0) * RULES.stress.incomeFactor,
    },
    coBorrower: {
      ...profile.coBorrower,
      reliableMonthly:
        (Number(profile.coBorrower?.reliableMonthly) || 0) * RULES.stress.incomeFactor,
    },
  };

  const stressBoundary = calculateSafeBoundary(stressProfile);
  const decision = decisionFor(profile, safeBoundary, requestedEmi);

  const comparison = RULES.loan.comparisonTenures.map((months) => ({
    months,
    emi: round(requestedAmount ? calculateEmi(requestedAmount, midpointRate, months) : 0),
  }));

  return {
    decision,
    capacity: {
      safeEmi: round(safeBoundary.safeNewEmi),
      safeAmount: round(safeAmount),
      lenderEmi: round(lenderBoundary.lenderNewEmi),
      lenderAmount: round(lenderAmount),
      useSafeAmount: true,
    },
    pricing: {
      rateLow: pricing.low,
      rateHigh: pricing.high,
      midpointRate,
      processingFee: round(processingFee),
      emi: round(requestedEmi),
      totalInterest: round(Math.max(0, requestedEmi * tenure - requestedAmount)),
      apr: apr == null ? null : round(apr, 4),
      tenureMonths: tenure,
      comparison,
    },
    stress: {
      stressedIncome: round(stressBoundary.income),
      stressedSafeEmi: round(stressBoundary.safeNewEmi),
      survives: requestedEmi <= stressBoundary.safeNewEmi,
    },
    boundaryDrivers: buildDrivers(profile, safeBoundary, lenderBoundary),
    limitations: [
      "This is a self-assessment, not a lender approval or credit decision.",
      "The lender-style amount is illustrative; actual sanction depends on lender policy and documentation.",
      "Rate and fee bands are indicative benchmarks/assumptions and should be checked against the lender's current Key Facts Statement.",
    ],
  };
}