export const QUESTIONS = [
  {
    id: "loan",
    title: "What are you planning to borrow for?",
    help: "This sets the amount, product context and pricing benchmark.",
    fields: [
      {
        key: "purpose",
        label: "Purpose",
        type: "select",
        options: [
          ["wedding", "Wedding / personal event"],
          ["education", "Education"],
          ["emergency", "Emergency / essential expense"],
          ["vehicle", "Vehicle"],
          ["business", "Business / working capital"],
          ["other", "Other"],
        ],
      },
      {
        key: "amount",
        label: "Amount you want",
        type: "number",
        prefix: "₹",
        min: 10000,
      },
      {
        key: "type",
        label: "Loan type",
        type: "select",
        options: [
          ["personal", "Personal loan"],
          ["vehicle", "Vehicle / two-wheeler loan"],
          ["securedBusiness", "Secured / business borrowing"],
        ],
      },
    ],
  },
  {
    id: "incomeType",
    title: "How do you earn?",
    help: "Income stability changes how much income we can responsibly rely on.",
    fields: [
      {
        key: "type",
        label: "Income type",
        type: "select",
        options: [
          ["salaried", "Salaried"],
          ["selfEmployed", "Self-employed"],
          ["variable", "Gig / variable income"],
        ],
      },
      {
        key: "stability",
        label: "How stable is it?",
        type: "select",
        options: [
          ["stable", "Stable"],
          ["somewhatVariable", "Somewhat variable"],
          ["highlyVariable", "Highly variable"],
        ],
      },
    ],
  },
  {
    id: "income",
    title: "What reliably comes into your household each month?",
    help: "Use income you can reasonably expect, not a best month.",
    fields: [
      {
        key: "reliableMonthly",
        label: "Reliable monthly income",
        type: "number",
        prefix: "₹",
        min: 0,
      },
      {
        key: "typicalMonthly",
        label: "Typical monthly income (if variable)",
        type: "number",
        prefix: "₹",
        min: 0,
        showWhen: (answers) => answers.incomeType?.type === "variable",
      },
      {
        key: "lowMonthly",
        label: "Low recent monthly income (if variable)",
        type: "number",
        prefix: "₹",
        min: 0,
        showWhen: (answers) => answers.incomeType?.type === "variable",
      },
      {
        key: "documentedMonthly",
        label: "Documented monthly income (if self-employed)",
        type: "number",
        prefix: "₹",
        min: 0,
        showWhen: (answers) => answers.incomeType?.type === "selfEmployed",
      },
    ],
  },
  {
    id: "expenses",
    title: "What must your household spend each month?",
    help: "Think essentials: housing, food, utilities, transport, school and other unavoidable costs.",
    fields: [
      {
        key: "essentialMonthly",
        label: "Essential monthly expenses",
        type: "number",
        prefix: "₹",
        min: 0,
      },
    ],
  },
  {
    id: "existingDebt",
    title: "What loan payments are you already making?",
    help: "Existing EMI reduces the room available for a new loan.",
    fields: [
      {
        key: "monthlyEmi",
        label: "Total existing monthly EMI",
        type: "number",
        prefix: "₹",
        min: 0,
      },
      {
        key: "highCost",
        label: "Do you have high-cost debt?",
        type: "select",
        options: [
          ["no", "No"],
          ["yes", "Yes"],
          ["unknown", "Not sure"],
        ],
      },
    ],
  },
  {
    id: "repayment",
    title: "Has repayment become harder recently?",
    help: "We use repayment distress as a guardrail, not as a credit score.",
    fields: [
      {
        key: "recentIssue",
        label: "Choose what best describes you",
        type: "select",
        options: [
          ["no", "No"],
          ["unstableIncome", "My income has become less stable"],
          ["missedPayment", "I have missed or bounced a payment"],
          ["highCostDebt", "I have expensive/high-cost debt"],
          ["multipleDebt", "Multiple debt payments are becoming difficult"],
        ],
      },
    ],
  },
  {
    id: "coBorrower",
    title: "Will someone apply with you?",
    help: "Only a genuine joint borrower with repayment responsibility can add income here.",
    fields: [
      {
        key: "hasOne",
        label: "Joint borrower?",
        type: "select",
        options: [
          ["no", "No"],
          ["yes", "Yes"],
        ],
      },
      {
        key: "reliableMonthly",
        label: "Co-borrower's reliable monthly income",
        type: "number",
        prefix: "₹",
        min: 0,
        showWhen: (answers) => answers.coBorrower?.hasOne === "yes",
      },
      {
        key: "stable",
        label: "Is their income stable?",
        type: "select",
        options: [
          ["yes", "Yes"],
          ["no", "No / variable"],
        ],
        showWhen: (answers) => answers.coBorrower?.hasOne === "yes",
      },
    ],
  },
  {
    id: "backup",
    title: "What financial backup do you have?",
    help: "These inputs mostly affect resilience, pricing context and alternative borrowing routes.",
    fields: [
      {
        key: "savingsMonths",
        label: "Savings that could cover essentials",
        type: "select",
        options: [
          ["less1", "Less than 1 month"],
          ["1to3", "1–3 months"],
          ["3to6", "3–6 months"],
          ["6plus", "More than 6 months"],
          ["unknown", "I don't know"],
        ],
      },
      {
        key: "collateral",
        label: "Do you have collateral you may use?",
        type: "select",
        options: [
          ["no", "No"],
          ["yes", "Yes"],
          ["unknown", "Not sure"],
        ],
      },
      {
        key: "creditScore",
        label: "Credit score, if known",
        type: "number",
        min: 300,
        max: 900,
        placeholder: "Leave blank if unknown",
      },
    ],
  },
];