# 5-Minute Walkthrough

## 0:00–0:45 — Product thesis

Borrowers often know the amount they want, but not the boundary they should negotiate around.

Borrower Copilot asks eight adaptive questions and turns the answers into one borrowing boundary.

## 0:45–1:30 — Question design

The eight questions are intentionally compact.

They cover purpose/amount/product, income, essentials, existing debt, repayment difficulty, joint borrowing and financial backup.

Conditional fields appear only when they can change an output.

## 1:30–2:30 — The reasoning

The important distinction is between:

- what the borrower can safely carry
- what a lender-style calculation might allow

The safe boundary uses a 40% FOIR ceiling plus a 10% residual-income guardrail, then subtracts existing EMI.

The lender-style comparison uses 50%.

These are clearly labelled model assumptions, not lender guarantees.

## 2:30–3:30 — Pricing and stress

The app shows a rate band rather than a fake precise rate.

It also calculates all-in APR from the modeled upfront fee and EMI cash flows.

Then it shows one stress case: income falls 20%.

## 3:30–4:15 — Explainability

The strongest differentiator is "What moved your boundary?"

The same calculation context generates the explanation, so the UI is not guessing why a number changed.

## 4:15–5:00 — Negotiation Card + limits

The card gives the borrower:

- fair rate range
- safe amount
- safe EMI
- requested EMI
- APR
- one reason

Then state the limitations clearly:

This is not underwriting, not a bureau pull and not a lender approval prediction.

### What I would cut if I had less time

1. Visual polish
2. Optional input detail
3. Extra product types
4. Extra stress scenarios
5. Any separate risk score

I would not cut the deterministic assessment, explanations, safe-vs-lender distinction, tests or Negotiation Card.
