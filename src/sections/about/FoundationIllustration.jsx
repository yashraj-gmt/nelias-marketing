/**
 * Decorative illustration of the platform foundation connecting to multiple tailored environments.
 * Uses role CSS variables for seamless light/dark mode adaptability.
 * Contains no text, numbers, or orange.
 */
export function FoundationIllustration({ className = "h-auto w-full" }) {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* Connector lines between hub and corner panels */}
      <g stroke="var(--line-strong)" strokeWidth="2" strokeLinecap="round">
        <line x1="160" y1="120" x2="196" y2="148" />
        <line x1="320" y1="120" x2="284" y2="148" />
        <line x1="160" y1="240" x2="196" y2="212" />
        <line x1="320" y1="240" x2="284" y2="212" />
      </g>

      {/* Terminal connector dots */}
      <g fill="var(--line-strong)">
        <circle cx="160" cy="120" r="3.5" />
        <circle cx="196" cy="148" r="3.5" />
        <circle cx="320" cy="120" r="3.5" />
        <circle cx="284" cy="148" r="3.5" />
        <circle cx="160" cy="240" r="3.5" />
        <circle cx="196" cy="212" r="3.5" />
        <circle cx="320" cy="240" r="3.5" />
        <circle cx="284" cy="212" r="3.5" />
      </g>

      {/* Panel 1: Top-Left (2x2 grid) */}
      <rect
        x="28"
        y="28"
        width="132"
        height="92"
        rx="14"
        fill="var(--surface-raised)"
        stroke="var(--line)"
        strokeWidth="2"
      />
      <rect x="46" y="46" width="42" height="22" rx="6" fill="var(--accent)" />
      <rect x="94" y="46" width="48" height="22" rx="6" fill="var(--accent-soft)" />
      <rect x="46" y="74" width="48" height="22" rx="6" fill="var(--accent-soft)" />
      <rect x="100" y="74" width="42" height="22" rx="6" fill="var(--accent)" />

      {/* Panel 2: Top-Right (Three stacked rows) */}
      <rect
        x="320"
        y="28"
        width="132"
        height="92"
        rx="14"
        fill="var(--surface-raised)"
        stroke="var(--line)"
        strokeWidth="2"
      />
      <rect x="338" y="44" width="80" height="16" rx="5" fill="var(--accent)" />
      <rect x="338" y="66" width="96" height="16" rx="5" fill="var(--accent-soft)" />
      <rect x="338" y="88" width="64" height="16" rx="5" fill="var(--accent-soft)" />

      {/* Panel 3: Bottom-Left (One tall block with two small ones) */}
      <rect
        x="28"
        y="240"
        width="132"
        height="92"
        rx="14"
        fill="var(--surface-raised)"
        stroke="var(--line)"
        strokeWidth="2"
      />
      <rect x="46" y="258" width="36" height="56" rx="6" fill="var(--accent)" />
      <rect x="88" y="258" width="54" height="24" rx="5" fill="var(--accent-soft)" />
      <rect x="88" y="290" width="54" height="24" rx="5" fill="var(--accent)" />

      {/* Panel 4: Bottom-Right (Row of four blocks) */}
      <rect
        x="320"
        y="240"
        width="132"
        height="92"
        rx="14"
        fill="var(--surface-raised)"
        stroke="var(--line)"
        strokeWidth="2"
      />
      <rect x="334" y="272" width="22" height="28" rx="5" fill="var(--accent)" />
      <rect x="362" y="272" width="22" height="28" rx="5" fill="var(--accent-soft)" />
      <rect x="390" y="272" width="22" height="28" rx="5" fill="var(--accent)" />
      <rect x="418" y="272" width="22" height="28" rx="5" fill="var(--accent-soft)" />

      {/* Centre Hub */}
      <rect x="196" y="136" width="88" height="88" rx="20" fill="var(--selected)" />
      {/* Inner mark: three short horizontal bars */}
      <g fill="var(--selected-fg)" fillOpacity="0.9">
        <rect x="226" y="168" width="28" height="4" rx="2" />
        <rect x="226" y="178" width="28" height="4" rx="2" />
        <rect x="226" y="188" width="28" height="4" rx="2" />
      </g>
    </svg>
  );
}
