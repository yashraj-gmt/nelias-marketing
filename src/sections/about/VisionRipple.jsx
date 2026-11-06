/**
 * Decorative vision ripple illustration showing expanding concentric circles from Côte d'Ivoire
 * with a bold brand ribbon arc sweeping upward.
 * Contains no text, numbers, map, or flag.
 */
export function VisionRipple({ className = "absolute inset-0 h-full w-full" }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient id="vision-ribbon-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-flame-500)" />
          <stop offset="45%" stopColor="var(--color-flame-400)" />
          <stop offset="100%" stopColor="var(--color-sun-300)" />
        </linearGradient>
      </defs>

      {/* Four concentric ripple circles expanding outward */}
      <circle cx="96" cy="304" r="70" stroke="var(--line)" strokeWidth="2" strokeOpacity="1" />
      <circle cx="96" cy="304" r="130" stroke="var(--line)" strokeWidth="2" strokeOpacity="0.8" />
      <circle cx="96" cy="304" r="190" stroke="var(--line)" strokeWidth="2" strokeOpacity="0.6" />
      <circle cx="96" cy="304" r="260" stroke="var(--line)" strokeWidth="2" strokeOpacity="0.4" />

      {/* Origin: faint outer circle and filled selected inner circle */}
      <circle cx="96" cy="304" r="26" fill="var(--accent-soft)" />
      <circle cx="96" cy="304" r="12" fill="var(--selected)" />

      {/* Sweeping ribbon arc */}
      <path
        d="M 96 304 C 150 190, 250 120, 372 64"
        stroke="url(#vision-ribbon-gradient)"
        strokeWidth="12"
        strokeLinecap="round"
        pathLength="1"
        strokeDasharray="1"
        className="animate-ribbon-draw"
      />
    </svg>
  );
}
