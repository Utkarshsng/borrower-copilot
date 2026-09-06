export default function QuestionStep({ question, answers, onChange }) {
  const fields = question.fields.filter(
    (field) => !field.showWhen || field.showWhen(answers)
  );

  return (
    <section className="question-card">
      <div className="eyebrow">Question</div>
      <h1>{question.title}</h1>
      <p className="muted">{question.help}</p>

      <div className="field-list">
        {fields.map((field) => {
          const value = answers[question.id]?.[field.key] ?? "";

          return (
            <label className="field" key={field.key}>
              <span>{field.label}</span>

              {field.type === "select" ? (
                <select
                  value={value}
                  onChange={(event) =>
                    onChange(question.id, field.key, event.target.value)
                  }
                >
                  <option value="">Choose…</option>
                  {field.options.map(([optionValue, label]) => (
                    <option value={optionValue} key={optionValue}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="input-wrap">
                  {field.prefix && <span>{field.prefix}</span>}
                  <input
                    type="number"
                    min={field.min}
                    max={field.max}
                    placeholder={field.placeholder}
                    value={value}
                    onChange={(event) =>
                      onChange(
                        question.id,
                        field.key,
                        event.target.value === "" ? "" : Number(event.target.value)
                      )
                    }
                  />
                </div>
              )}
            </label>
          );
        })}
      </div>
    </section>
  );
}