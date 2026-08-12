export function BrewingGuide({
  amount,
  tempC,
  steepSeconds,
  infusions,
}: {
  amount?: string | null;
  tempC?: number | null;
  steepSeconds?: number | null;
  infusions?: number | null;
}) {
  const steep =
    steepSeconds == null
      ? "—"
      : steepSeconds === 0
        ? "Whisk to dissolve"
        : `${Math.round(steepSeconds / 60)} min`;

  const steps = [
    { label: "Tea amount", value: amount || "—" },
    { label: "Water temperature", value: tempC ? `${tempC}°C` : "—" },
    { label: "Steep time", value: steep },
    { label: "Infusions", value: infusions ? String(infusions) : "—" },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl text-brand-forest-deep">How to Brew</h2>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2">
        {steps.map((step, index) => (
          <li
            key={step.label}
            className="rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white/70 px-4 py-4"
          >
            <p className="text-xs tracking-[0.14em] uppercase text-brand-muted">
              {index + 1}. {step.label}
            </p>
            <p className="mt-2 font-display text-xl text-brand-forest">{step.value}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
