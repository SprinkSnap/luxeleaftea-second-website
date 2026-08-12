function Meter({ label, value }: { label: string; value: number }) {
  const filled = Math.max(0, Math.min(5, value));
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="w-24 text-sm text-brand-muted">{label}</span>
      <div className="flex gap-1" aria-label={`${label}: ${filled} of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={
              i < filled
                ? "h-2.5 w-2.5 rounded-full bg-brand-forest"
                : "h-2.5 w-2.5 rounded-full border border-brand-forest/30"
            }
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}

export function TeaProfile({
  aroma,
  body,
  sweetness,
  roast,
  caffeine,
  flavourNotes,
}: {
  aroma: number;
  body: number;
  sweetness: number;
  roast: number;
  caffeine: number;
  flavourNotes: string[];
}) {
  return (
    <div>
      <h2 className="font-display text-2xl text-brand-forest-deep">
        Sensory Profile
      </h2>
      <div className="mt-4 max-w-md">
        <Meter label="Aroma" value={aroma} />
        <Meter label="Body" value={body} />
        <Meter label="Sweetness" value={sweetness} />
        <Meter label="Roast" value={roast} />
        <Meter label="Caffeine" value={caffeine} />
      </div>
      <div className="mt-5">
        <p className="text-xs tracking-[0.14em] uppercase text-brand-muted">
          Flavour notes
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {flavourNotes.map((note) => (
            <li
              key={note}
              className="rounded-full border border-[var(--brand-line)] px-3 py-1 text-sm text-brand-ink"
            >
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
