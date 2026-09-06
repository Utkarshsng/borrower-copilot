const money = (value) =>
  `₹${Math.round(value || 0).toLocaleString("en-IN")}`;

const percent = (value) =>
  value == null ? "—" : `${(value * 100).toFixed(1)}%`;

export default function BoundaryResult({ result, onRestart }) {
  const { decision, capacity, pricing, stress } = result;

  return (
    <main className="results">
      <section className={`verdict verdict-${decision.verdict.replaceAll(" ", "-").replaceAll("'", "").toLowerCase()}`}>
        <div className="eyebrow">Your borrowing boundary</div>
        <h1>{decision.verdict}</h1>
        <p>{decision.reasons[0]}</p>
      </section>

      <section className="grid two">
        <article className="panel safe-panel">
          <div className="eyebrow">Use this number</div>
          <h2>{money(capacity.safeAmount)}</h2>
          <p>Borrower-safe amount at the default 48-month illustration.</p>
          <strong>Safe new EMI: {money(capacity.safeEmi)}/month</strong>
        </article>

        <article className="panel">
          <div className="eyebrow">Lender-style capacity</div>
          <h2>{money(capacity.lenderAmount)}</h2>
          <p>Illustrative capacity using a 50% total-EMI boundary.</p>
          <strong>Illustrative new EMI: {money(capacity.lenderEmi)}/month</strong>
        </article>
      </section>

      <section className="panel">
        <div className="eyebrow">What should you accept?</div>
        <div className="metric-row">
          <div>
            <span>Fair rate band</span>
            <strong>{percent(pricing.rateLow)}–{percent(pricing.rateHigh)}</strong>
          </div>
          <div>
            <span>Requested EMI</span>
            <strong>{money(pricing.emi)}</strong>
          </div>
          <div>
            <span>All-in APR</span>
            <strong>{pricing.apr == null ? "Not available" : percent(pricing.apr)}</strong>
          </div>
        </div>

        <div className="tenure">
          <h3>Tenure trade-off</h3>
          <div className="tenure-row">
            {pricing.comparison.map((item) => (
              <div key={item.months}>
                <span>{item.months} months</span>
                <strong>{money(item.emi)}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="eyebrow">One stress case</div>
        <h2>What if income falls 20%?</h2>
        <p>
          Your safer new-EMI boundary becomes <strong>{money(stress.stressedSafeEmi)}</strong>.
          {" "}
          {stress.survives
            ? "The requested EMI still fits this stressed boundary."
            : "The requested EMI would no longer fit this stressed boundary."}
        </p>
      </section>

      <section className="panel">
        <div className="eyebrow">What moved your boundary?</div>
        <ul className="drivers">
          {result.boundaryDrivers.map((driver) => (
            <li key={driver}>{driver}</li>
          ))}
        </ul>
      </section>

      <div className="actions">
        <button className="primary" onClick={onRestart}>Start again</button>
        <button className="secondary" onClick={() => window.print()}>Print / save this result</button>
      </div>
    </main>
  );
}