const money = (value) =>
  `₹${Math.round(value || 0).toLocaleString("en-IN")}`;

const pct = (value) => `${(value * 100).toFixed(1)}%`;

export default function NegotiationCard({ result }) {
  return (
    <section className="card">
      <div className="eyebrow">Negotiation Card</div>
      <h2>Take this to the lender</h2>

      <div className="card-highlight">
        <span>Fair rate for this profile</span>
        <strong>
          {pct(result.pricing.rateLow)}–{pct(result.pricing.rateHigh)}
        </strong>
      </div>

      <div className="card-grid">
        <div>
          <span>Borrower-safe amount</span>
          <strong>{money(result.capacity.safeAmount)}</strong>
        </div>
        <div>
          <span>Safe monthly ceiling</span>
          <strong>{money(result.capacity.safeEmi)}</strong>
        </div>
        <div>
          <span>Requested EMI</span>
          <strong>{money(result.pricing.emi)}</strong>
        </div>
        <div>
          <span>All-in APR</span>
          <strong>
            {result.pricing.apr == null ? "Ask lender" : pct(result.pricing.apr)}
          </strong>
        </div>
      </div>

      <div className="card-why">
        <strong>Why this boundary?</strong>
        <p>{result.boundaryDrivers[0]}</p>
      </div>

      <p className="small">
        Ask the lender to show the rate, processing fee and other applicable
        charges in the Key Facts Statement before agreeing.
      </p>
    </section>
  );
}