# Borrower Copilot

**[Live Demo →](https://borrower-copllot-bchm.vercel.app/)**

A working Vercel deployment is provided above for review. The source repo contains the full assessment deliverables.

A browser-only self-assessment that helps an Indian borrower answer four questions before meeting a lender:

1. Should I borrow at all?
2. How much can I safely carry vs. what a lender-style calculation might allow?
3. What rate range is fair to compare against?
4. What EMI should I agree to?

It then produces a one-screen Negotiation Card.

## Why 8 questions?

**8 questions does not mean 8 data points.**

The goal is not to ask fewer questions for the sake of being shorter. The goal is to collect the minimum information required to make the borrowing decision responsibly.

Each question can capture multiple related inputs, and conditional fields appear only when they can change an output.

Every question must change/refine at least one of:
- borrowing decision
- safe amount
- lender-style capacity
- fair rate band
- stress outcome
- explanation of what moved the borrowing boundary

**If a question does not change an output, we don't ask it.**

> Fewer questions, not fewer inputs. More relevant questions, not more questions.

## Submission links

- **Live app:** https://borrower-copllot-bchm.vercel.app/
- **Repository:** https://github.com/Utkarshsng/borrower-copilot

The four assessment deliverables are kept at the repository root: `README.md`, `RULES.md`, `THREE_RUNTHROUGHS.md`, and `WALKTHROUGH.md`.

## Architecture

```text
Questionnaire
    ↓
BorrowerProfile
    ↓
assessBorrower(profile)
    ↓
AssessmentResult
    ↓
Results + Negotiation Card
```

React handles presentation and input. The financial reasoning lives in a deterministic domain function. All editable assumptions live in `src/domain/rules.js`.

There is no backend, login, bureau pull, database, or LLM dependency.

## Run locally

Requirements: Node.js 20+ recommended.

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

Run tests:

```bash
npm test
```

Production build:

```bash
npm run build
```

## Decision model

### Safe borrower boundary

```text
FOIR ceiling = assessed income × 40%

Expense ceiling = assessed income
                 − essential expenses
                 − 10% residual-income buffer

Safe total EMI = min(FOIR ceiling, expense ceiling)

Safe new EMI = max(0, safe total EMI − existing EMI)
```

### Lender-style boundary

```text
Lender total EMI = assessed income × 50%

Lender new EMI = max(0, lender total EMI − existing EMI)
```

The lender-style amount is intentionally labelled illustrative. It is not an approval prediction.

### Decision

```text
Recent repayment distress?
    → DON'T BORROW

Otherwise, requested EMI ≤ safe new EMI?
    → BORROW

Otherwise
    → BORROW LESS
```

The model deliberately avoids a composite "risk score".

### Stress

One scenario is shown: household income falls by 20%, then the safe EMI boundary is recalculated.

### Unknowns

Unknown credit score is not treated as a bad score. It widens the pricing band.

Unknown expenses are never treated as zero.

Unverified higher income is not automatically counted as reliable capacity.

## Three required walkthroughs

The assessment provides the following intended reasoning examples. These are illustrative walkthrough inputs, not claims about what a lender will actually sanction.

### Priya — Borrow

Inputs:
- Salaried, stable
- Net income: ₹1,10,000/month
- Essentials: ₹50,000/month
- Existing EMI: ₹14,000/month
- Credit score: 780
- Request: ₹8,00,000 personal loan

Key outputs:
- Safe new EMI: about ₹30,000/month
- Lender-style new EMI: about ₹41,000/month
- Requested EMI at midpoint rate: about ₹21,264/month
- Verdict: **BORROW**

Why:
- Stable income and strong credit support pricing.
- Existing ₹14,000 EMI is the biggest direct constraint on new capacity.

### Ravi — Borrow Less

Inputs:
- Self-employed, stable
- Documented income: ₹35,000/month
- Joint borrower: wife with ₹18,000 stable monthly income
- Essentials: ₹30,000/month
- No existing EMI
- Collateral available
- Credit score unknown
- Request: ₹15,00,000 secured/business borrowing

Key outputs:
- Assessed income: ₹53,000/month
- Safe new EMI: about ₹17,700/month
- Verdict: **BORROW LESS**

Why:
- Joint-borrower income legitimately increases capacity.
- Cash-flow affordability is still below the requested borrowing level.
- Collateral may make a secured route worth discussing with a lender, but this app does not invent a secured sanction amount.

### Anita — Don't Borrow

Inputs:
- Variable income: ₹28,000/month reliable planning income
- Essentials: ₹18,000/month
- Existing EMI: ₹4,500/month
- High-cost debt: yes
- Recent missed/bounced payment: yes
- Request: ₹1,50,000 vehicle loan

Key outputs:
- Safe new EMI: about ₹2,700/month
- Verdict: **DON'T BORROW**

Why:
- The key issue is active repayment distress: high-cost debt plus a recent missed/bounced payment.
- A productive purpose does not override current repayment stress.

## Rule change interview

The main assumptions are deliberately centralized.

Example:

```js
RULES.affordability.safeFoIR = 0.35;
```

This lowers the borrower-safe boundary while leaving the lender-style 50% boundary unchanged.

That makes live rule changes easy to explain and test.

## Limitations

This is a self-assessment, not underwriting.

Actual lender decisions can differ because lenders use their own policies, documentation, bureau data, product rules, collateral valuation and pricing models.

Rate and fee bands in the app are indicative planning benchmarks/assumptions and should be checked against the lender's current Key Facts Statement.

No backend stores personal data; answers exist only in browser memory for the current session.

## What I would cut next

If the time box became tighter, I would keep:
- the eight-question adaptive flow
- deterministic assessment
- safe vs lender-style boundary
- fair-rate band + APR
- one stress case
- boundary drivers
- Negotiation Card
- tests

I would cut visual polish and optional input detail before cutting the reasoning model.