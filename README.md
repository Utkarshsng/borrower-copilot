# Borrower Copilot

**A decision-first borrowing assistant for Indian borrowers.**

> **Core idea:** don't start with “How much might a lender give me?” Start with “How much can my own cash flow safely carry?” Then compare that boundary with a lender-style capacity, fair pricing and a stress case.

**[Live Demo](https://borrower-copilot-bchm-git-main-utkarshsngs-projects.vercel.app)** · 

**[GitHub](https://github.com/Utkarshsng/borrower-copilot)** · 

**[Rules](RULES.md)** · 

**[Run-throughs](THREE_RUNTHROUGHS.md)** ·

**[5-Min Walkthrough](WALKTHROUGH.md)**

---

## What this product does

Borrower Copilot is a browser-only self-assessment for an Indian borrower who wants to understand a loan **before negotiating with a lender**.

It answers four questions from borrower-provided information:

1. **Should I borrow at all?**
2. **How much can I safely carry vs. what a lender-style calculation might allow?**
3. **What rate range is fair to compare against?**
4. **What EMI should I agree to?**

The result ends with a one-screen **Negotiation Card** the borrower can take to a lender.

> The product is **not trying to predict lender approval**. It is trying to establish the borrower's own borrowing boundary before they negotiate.

---

## What I optimized for

I deliberately optimized for **explainability over feature count**.

This is a financial decision system, so every important output should be traceable:

```text
Input → Borrower Profile → Rule → Calculation → Boundary → Decision → Explanation
```

That led to a small deterministic architecture rather than an LLM-driven financial decision layer, a composite risk score, a large lender catalogue, or a backend/database that the core problem does not require.

The guiding principle was:

> **Make the product feel smarter through better reasoning, not through more software.**

---

## The Borrowing Boundary

The main product concept is simple:

```text
                 BORROWING BOUNDARY
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
   What cash flow can            What a lender-style
   safely carry                  calculation might allow
          │                             │
          └──────────────┬──────────────┘
                         ▼
                  Requested loan
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
       Stress boundary         Fair price / APR
             │                       │
             └───────────┬───────────┘
                         ▼
              Borrow / Borrow Less /
                    Don't Borrow
```

The UI also explains **what moved the boundary** — for example, existing EMIs, essential expenses, repayment distress or a stable co-borrower.

---

## How to review this in 5 minutes

### 1. Open the demo

Run the **Priya** scenario and inspect the borrowing boundary, pricing and Negotiation Card.

### 2. Change one rule

Open `src/domain/rules.js` and change:

```js
safeFoIR: 0.40
```

to:

```js
safeFoIR: 0.35
```

The borrower-safe boundary should fall, while the lender-style 50% boundary remains unchanged.

### 3. Inspect the reasoning

Open `src/domain/assess.js`.

The financial model is implemented as small deterministic functions. There is no hidden scoring model deciding the result.

### 4. Read the rules

`RULES.md` documents the material thresholds, pricing bands, fees, assumptions and rationale.

### 5. Run the tests

```bash
npm install
npm test
```

The tests focus on the decision model and important boundary conditions rather than UI snapshots.

---

## Decision flow

```text
Questionnaire
     ↓
BorrowerProfile
     ↓
assessBorrower(profile)
     ↓
AssessmentResult
     ↓
Boundary + Decision + Pricing + Stress
     ↓
Negotiation Card
```

The UI is intentionally thin. React handles presentation and input; the domain layer owns the financial reasoning.

---

## Engineering decisions

| Decision | Why |
|---|---|
| React + Vite | Small interactive browser application without framework overhead |
| JavaScript | Keeps the assessment implementation concise and easy to inspect during an interview |
| Pure domain functions | Deterministic calculations are easy to test and explain |
| Central `src/domain/rules.js` | Material assumptions can be changed in one obvious place |
| No backend/database | The challenge does not require persistence or server-side computation |
| No LLM for decisions | Financial outputs remain deterministic, auditable and explainable |
| Vitest | Fast tests around the decision model |

### Project structure

```text
src/
├── App.jsx
├── components/
│   ├── QuestionStep.jsx
│   ├── BoundaryResult.jsx
│   └── NegotiationCard.jsx
├── domain/
│   ├── rules.js
│   ├── questions.js
│   └── assess.js
└── tests/
    └── assess.test.js
```

---

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

> **Fewer questions, not fewer inputs. More relevant questions, not more questions.**

The UI principle is:

> **We don't ask everything. We ask what can change your borrowing boundary.**

---

## Decision model

### 1. Safe borrower boundary

```text
FOIR ceiling = assessed income × 40%

Expense ceiling = assessed income
                 − essential expenses
                 − 10% residual-income buffer

Safe total EMI = min(FOIR ceiling, expense ceiling)

Safe new EMI = max(0, safe total EMI − existing EMI)
```

The 40% FOIR value is a **model judgement**, not a universal regulatory threshold.

### 2. Lender-style boundary

```text
Lender total EMI = assessed income × 50%

Lender new EMI = max(0, lender total EMI − existing EMI)
```

This is deliberately labelled **illustrative lender-style capacity**, not an approval prediction.

### 3. Decision

```text
Recent repayment distress?
    → DON'T BORROW

Otherwise, requested EMI ≤ safe new EMI?
    → BORROW

Otherwise
    → BORROW LESS
```

The model intentionally avoids a composite “risk score”.

### 4. Stress

One stress case is shown: household income falls by **20%**, then the safe EMI boundary is recalculated.

### 5. Pricing

The app shows a **rate band**, not a false point estimate, plus an all-in APR calculation that accounts for the upfront processing fee.

Unknown credit score widens the pricing band rather than being treated as a bad score.

### 6. Unknowns

Unknown is not zero:

- Unknown credit score → wider pricing band.
- Unknown expenses → never silently treated as zero.
- Unverified higher income → not automatically counted as reliable capacity.
- Collateral → can support a discussion with a lender, but the app does not invent an exact secured sanction amount.

---

## What makes the output explainable?

The product does not stop at a verdict.

It connects the result back to the borrower:

```text
What changed?
      ↓
Which rule responded?
      ↓
How did the EMI boundary move?
      ↓
Why did the verdict change or stay the same?
```

For example, an existing EMI reduces new capacity directly; a stable co-borrower can increase assessed income; recent high-cost repayment distress can stop new borrowing altogether.

This makes an interviewer-led assumption change easy to follow.

---

## Three borrower run-throughs

The assessment includes three intentionally different cases.

### Priya — Borrow

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

The case demonstrates how a stable income and strong credit can support pricing while the existing EMI remains a direct constraint on new capacity.

### Ravi — Borrow Less

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

The case demonstrates that a legitimate co-borrower can improve capacity, while cash-flow affordability can still be below the requested amount. Collateral may make a secured route worth discussing, but the app does not manufacture a sanction number.

### Anita — Don't Borrow

- Variable income: ₹28,000/month reliable planning income
- Essentials: ₹18,000/month
- Existing EMI: ₹4,500/month
- High-cost debt: yes
- Recent missed/bounced payment: yes
- Request: ₹1,50,000 vehicle loan

Key outputs:

- Safe new EMI: about ₹2,700/month
- Verdict: **DON'T BORROW**

The key issue is active repayment distress: high-cost debt plus a recent missed/bounced payment. A productive purpose does not override current repayment stress.

Full walkthroughs are in [`THREE_RUNTHROUGHS.md`](THREE_RUNTHROUGHS.md).

---

## Rule-change interview

The main assumptions are deliberately centralized.

For example:

```js
RULES.affordability.safeFoIR = 0.35;
```

Changing the safe FOIR changes the **borrower-safe boundary** and therefore can change the verdict. It does not silently change the lender-style 50% boundary.

That is intentional: the interviewer can change one assumption and watch one part of the reasoning move.

---

## Deliberate non-features

I intentionally did **not** build:

- an LLM-driven financial decision layer
- a composite credit/risk score
- a large lender/product catalogue
- a backend or database
- authentication
- multiple competing stress models
- a complex rules-engine framework

These would add implementation surface without improving the core borrower decision enough to justify the complexity in this assessment.

> **More reasoning, not more software.**

---

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

---

## Limitations

This is a **self-assessment, not underwriting**.

Actual lender decisions can differ because lenders use their own policies, documentation, bureau data, product rules, collateral valuation and pricing models.

Rate and fee bands in the app are indicative planning benchmarks/assumptions and should be checked against the lender's current Key Facts Statement.

No backend stores personal data; answers exist only in browser memory for the current session.

---

## Assessment deliverables

The four requested deliverables are intentionally kept at the repository root:

- [`README.md`](README.md) — product and engineering explanation
- [`RULES.md`](RULES.md) — material rules, thresholds, bands and assumptions
- [`THREE_RUNTHROUGHS.md`](THREE_RUNTHROUGHS.md) — Priya, Ravi and Anita walkthroughs
- [`WALKTHROUGH.md`](WALKTHROUGH.md) — five-minute interviewer walkthrough

---

## What I would cut next

If the time box became tighter, I would keep:

- the eight-question adaptive flow
- deterministic assessment
- safe vs. lender-style boundary
- fair-rate band + APR
- one stress case
- boundary drivers
- Negotiation Card
- tests

I would cut visual polish and optional input detail before cutting the reasoning model.
