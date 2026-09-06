# Borrower Copilot — Rules & Assumptions

Every material threshold or band used by the assessment is listed here with its purpose and provenance.

## 1. Safe FOIR — 40%

**Value:** 40% of assessed monthly income.

**Type:** My judgement / model assumption.

**Why:** Used as a conservative borrower-facing affordability boundary. It is not presented as a universal RBI rule or guaranteed lender threshold.

**Effect:** Limits total EMI before existing EMI is subtracted.

---

## 2. Lender-style FOIR — 50%

**Value:** 50% of assessed monthly income.

**Type:** Illustrative model assumption.

**Why:** Provides a deliberately separate "what a lender-style calculation might allow" comparison. It is not a prediction of any lender's sanction.

**Effect:** Produces the second required amount.

---

## 3. Residual-income guardrail — 10%

**Value:** At least 10% of assessed income is reserved after essential expenses in the expense-based affordability calculation.

**Type:** My judgement / model assumption.

**Why:** FOIR alone can look acceptable while leaving too little cash after essentials. This guardrail keeps the borrower-facing boundary conservative.

---

## 4. Existing EMI

**Value:** 100% of stated existing monthly EMI is deducted from both safe and lender-style total EMI capacity.

**Type:** Direct calculation.

**Why:** Existing debt service consumes monthly cash flow.

---

## 5. Unknown is not zero

**Value:** Unknown credit score is represented as unknown.

**Type:** Product rule.

**Why:** The challenge explicitly requires unknown inputs not to be treated as zero/bad data.

**Effect:** Unknown credit score widens the rate band rather than applying an invented penalty.

---

## 6. High-cost debt + recent missed/bounced payment

**Value:** This combination reaches DON'T BORROW.

**Type:** My judgement / safety guardrail.

**Why:** Active repayment distress is a stronger signal for this self-assessment than inventing a numerical "risk score" or applying an arbitrary percentage penalty.

**Important:** High-cost debt alone does not receive an invented EMI penalty.

---

## 7. Co-borrower income

**Value:** Included only when the person is a genuine joint borrower, has reliable income and is marked stable.

**Type:** Model rule.

**Why:** A joint borrower shares repayment responsibility. A guarantor's income is not automatically counted.

---

## 8. Stress case — 20% income reduction

**Value:** Income × 0.80.

**Type:** My judgement / illustrative stress assumption.

**Why:** Gives the borrower one simple resilience check without creating a large stress-test framework.

---

## 9. Personal-loan rate band — 10% to 15%

**Value:** 10%–15% annual interest rate.

**Type:** Indicative benchmark, based on lender-published personal-loan pricing context available during the build; not a quote.

**Why:** The challenge asks for a fair rate band rather than a point estimate.

**Source:** State Bank of India personal-loan page and published interest-rate/processing information. The exact offer available to an individual can differ.

---

## 10. Vehicle/two-wheeler rate band — 11.7% to 15.7%

**Value:** 11.7%–15.7% annual interest rate.

**Type:** Indicative benchmark.

**Why:** Used only for a vehicle/two-wheeler illustration. Actual lender pricing can differ.

**Source:** SBI two-wheeler loan rate information reviewed during the build.

---

## 11. Secured/business rate band — 11% to 16%

**Value:** 11%–16% annual interest rate.

**Type:** My judgement / deliberately broad planning range.

**Why:** The app must not pretend it can infer an exact secured/business sanction or price from collateral alone. This broad range is only for planning; the lender's actual product/KFS should take precedence.

---

## 12. Processing fee — product dependent

**Personal:** 1.5% of loan amount, subject to lender-specific minimum/maximum rules.

**Vehicle/two-wheeler:** 3.0% + GST in the SBI benchmark reviewed for this build. The app models the 3.0% fee rate before GST; actual lender fees can differ.

**Secured/business:** 1.5% illustrative assumption.

**Type:** Product-specific benchmark/assumption.

**Source:** SBI published processing-fee pages were reviewed for personal and two-wheeler products.

The app treats these as planning assumptions, not universal fees.

---

## 13. APR

**Method:** Effective annualized rate derived from borrower cash flows:

```text
time 0: borrower receives principal − upfront fee
months 1..N: borrower pays EMI
solve monthly IRR
APR = (1 + monthly IRR)^12 − 1
```

**Type:** Calculation based on the model's assumed fee and rate.

**Why:** APR should reflect the cost of credit including applicable charges rather than simply adding a fee percentage to the nominal rate.

**Regulatory context:** RBI's Key Facts Statement framework describes APR as the annual cost of credit including interest and associated charges.

---

## 14. Default tenure — 48 months

**Value:** 48 months.

**Type:** Product illustration assumption.

**Why:** Keeps comparisons understandable and avoids an unnecessarily large tenure matrix.

**Comparison:** 36, 48 and 60 months are shown for the requested amount.

---

## 15. Credit-score pricing adjustment

**Score ≥ 800:** rate band moves down by 0.5 percentage points.

**Score < 700:** rate band moves up by 1 percentage point.

**Score unknown:** upper end widens by 1 percentage point.

**Type:** My judgement / illustrative pricing logic.

**Why:** Credit score is used primarily for pricing context in this model, not to change the safe FOIR boundary.

---

## 16. Income treatment

**Salaried:** stated reliable net monthly income is used.

**Self-employed:** reliable/documented income is the base; unverified higher cash income is not automatically added.

**Variable/gig:** reliable planning income is used; typical/low-month fields are collected for context.

**Type:** Model rule.

**Why:** Capacity should be based on income that is reasonably repeatable, not a best month.

---

## 17. Important limitations

- FOIR values in this app are model assumptions, not universal regulatory limits.
- Lender-style capacity is illustrative.
- Rate bands are not lender offers.
- Collateral does not automatically become cash-flow capacity.
- A self-assessment cannot reproduce a lender's underwriting model.
- The borrower should compare the lender's actual KFS, rate, fees and repayment schedule before agreeing.

## Sources

- State Bank of India — Personal Loan:
  https://sbi.bank.in/web/personal-banking/loans/personal-loans/sbi-personal-loan
- State Bank of India — Processing Fees:
  https://sbi.bank.in/en/web/interest-rates/interest-rates/processing-fees
- Reserve Bank of India — Key Facts Statement / APR framework:
  https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=12827
