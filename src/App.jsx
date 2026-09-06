import { useMemo, useState } from "react";
import { QUESTIONS } from "./domain/questions";
import { assessBorrower } from "./domain/assess";
import QuestionStep from "./components/QuestionStep";
import BoundaryResult from "./components/BoundaryResult";
import NegotiationCard from "./components/NegotiationCard";

function isQuestionComplete(question, answers) {
  const fields = question.fields.filter(
    (field) => !field.showWhen || field.showWhen(answers)
  );
  const section = answers[question.id] || {};

  return fields.every(
    (field) =>
      field.required === false ||
      (section[field.key] !== "" && section[field.key] != null)
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const question = QUESTIONS[step];
  const complete = useMemo(
    () => question && isQuestionComplete(question, answers),
    [question, answers]
  );

  const updateAnswer = (section, key, value) => {
    setAnswers((current) => ({
      ...current,
      [section]: {
        ...(current[section] || {}),
        [key]: value,
      },
    }));
  };

  const next = () => {
    if (!complete) return;
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
      return;
    }

    setResult(
      assessBorrower({
        loan: answers.loan,
        income: {
          type: answers.incomeType?.type,
          stability: answers.incomeType?.stability,
          reliableMonthly: answers.income?.reliableMonthly,
          typicalMonthly: answers.income?.typicalMonthly,
          lowMonthly: answers.income?.lowMonthly,
          documentedMonthly: answers.income?.documentedMonthly,
        },
        expenses: answers.expenses,
        existingDebt: answers.existingDebt,
        repayment: answers.repayment,
        coBorrower: answers.coBorrower,
        backup: answers.backup,
      })
    );
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    return (
      <div className="app-shell">
        <header className="topbar">
          <div>
            <div className="eyebrow">Borrower Copilot</div>
            <strong>Know your boundary before you meet the lender.</strong>
          </div>
        </header>
        <BoundaryResult result={result} onRestart={restart} />
        <NegotiationCard result={result} />
        <footer className="footer">
          Self-assessment only. No bureau pull. No personal data is stored by this app.
        </footer>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">Borrower Copilot</div>
          <strong>Know your boundary before you meet the lender.</strong>
        </div>
        <span>{step + 1} / {QUESTIONS.length}</span>
      </header>

      <main className="flow">
        <div className="progress">
          <span style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
        </div>

        <p className="signature">
          We don't ask everything. We ask what can change your borrowing boundary.
        </p>

        <QuestionStep
          question={question}
          answers={answers}
          onChange={updateAnswer}
        />

        <div className="nav">
          <button
            className="secondary"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
          <button className="primary" disabled={!complete} onClick={next}>
            {step === QUESTIONS.length - 1 ? "See my boundary" : "Continue"}
          </button>
        </div>
      </main>

      <footer className="footer">
        Your answers stay in this browser session. This is a planning tool, not a lender approval.
      </footer>
    </div>
  );
}