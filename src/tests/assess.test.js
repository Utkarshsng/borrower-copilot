import { describe, expect, it } from "vitest";
import {
  assessBorrower,
  calculateAssessedIncome,
  calculateEmi,
  calculateLoanAmountFromEmi,
} from "../domain/assess";

const priya = {
  loan: { purpose: "wedding", amount: 800000, type: "personal" },
  income: { type: "salaried", stability: "stable", reliableMonthly: 110000 },
  expenses: { essentialMonthly: 50000 },
  existingDebt: { monthlyEmi: 14000, highCost: "no" },
  repayment: { recentIssue: "no" },
  coBorrower: { hasOne: "no" },
  backup: { savingsMonths: "3to6", collateral: "no", creditScore: 780 },
};

const ravi = {
  loan: { purpose: "business", amount: 1500000, type: "securedBusiness" },
  income: { type: "selfEmployed", stability: "stable", reliableMonthly: 35000 },
  expenses: { essentialMonthly: 30000 },
  existingDebt: { monthlyEmi: 0, highCost: "no" },
  repayment: { recentIssue: "no" },
  coBorrower: { hasOne: "yes", reliableMonthly: 18000, stable: "yes" },
  backup: { savingsMonths: "1to3", collateral: "yes", creditScore: "" },
};

const anita = {
  loan: { purpose: "vehicle", amount: 150000, type: "vehicle" },
  income: { type: "variable", stability: "highlyVariable", reliableMonthly: 28000 },
  expenses: { essentialMonthly: 18000 },
  existingDebt: { monthlyEmi: 4500, highCost: "yes" },
  repayment: { recentIssue: "missedPayment" },
  coBorrower: { hasOne: "no" },
  backup: { savingsMonths: "less1", collateral: "no", creditScore: "" },
};

describe("loan math", () => {
  it("calculates EMI", () => {
    expect(Math.round(calculateEmi(800000, 0.125, 48))).toBe(21264);
  });

  it("calculates a loan amount from an EMI boundary", () => {
    const amount = calculateLoanAmountFromEmi(30000, 0.125, 48);
    expect(Math.round(amount)).toBe(1128668);
  });
});

describe("borrower assessment", () => {
  it("uses only a stable joint borrower's income", () => {
    expect(calculateAssessedIncome(ravi)).toBe(53000);
  });

  it("reaches Borrow for Priya", () => {
    const result = assessBorrower(priya);
    expect(result.decision.verdict).toBe("BORROW");
    expect(result.capacity.safeEmi).toBe(24500);
    expect(result.capacity.lenderEmi).toBe(41000);
  });

  it("reaches Borrow Less for Ravi", () => {
    const result = assessBorrower(ravi);
    expect(result.decision.verdict).toBe("BORROW LESS");
    expect(result.capacity.safeEmi).toBe(17700);
  });

  it("reaches Don't Borrow for Anita", () => {
    const result = assessBorrower(anita);
    expect(result.decision.verdict).toBe("DON'T BORROW");
  });

  it("keeps unknown credit score from becoming a penalty score", () => {
    const result = assessBorrower(ravi);
    expect(result.pricing.rateHigh).toBeCloseTo(0.17, 6);
    expect(result.boundaryDrivers.some((x) => x.includes("Credit score is unknown"))).toBe(true);
  });

  it("changes the safe boundary without changing lender-style capacity when safe FOIR changes", async () => {
    const rules = await import("../domain/rules");
    const original = rules.RULES.affordability.safeFoIR;
    rules.RULES.affordability.safeFoIR = 0.35;

    const result = assessBorrower(priya);

    expect(result.capacity.safeEmi).toBe(30000);
    expect(result.capacity.lenderEmi).toBe(41000);

    rules.RULES.affordability.safeFoIR = original;
  });

  it("shows the requested EMI against a single stress case", () => {
    const result = assessBorrower(priya);
    expect(result.stress.stressedIncome).toBe(88000);
    expect(result.stress.stressedSafeEmi).toBe(15200);
    expect(result.stress.survives).toBe(false);
  });
});