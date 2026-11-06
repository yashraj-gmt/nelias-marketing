import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/**
 * DEV-only design preview page. Shows all design tokens, type scale,
 * button variants, gradients, and a breakpoint indicator.
 * Not reachable in production builds (route excluded from router).
 */

const brandColors = [
  {
    group: "Navy",
    tokens: [
      { name: "navy-950", hex: "#001a33" },
      { name: "navy-900", hex: "#002b52" },
      { name: "navy-800", hex: "#0b3a66" },
      { name: "navy-700", hex: "#0a4c85" },
    ],
  },
  {
    group: "Azure",
    tokens: [
      { name: "azure-50", hex: "#f0f7fd" },
      { name: "azure-100", hex: "#ddeefa" },
      { name: "azure-200", hex: "#bfe0f7" },
      { name: "azure-300", hex: "#8cc8f0" },
      { name: "azure-400", hex: "#4daae6" },
      { name: "azure-500", hex: "#0a78c8" },
      { name: "azure-600", hex: "#0a5fa8" },
      { name: "azure-700", hex: "#084c8a" },
    ],
  },
  {
    group: "Flame",
    tokens: [
      { name: "flame-50", hex: "#fff4ea" },
      { name: "flame-100", hex: "#ffe5cc" },
      { name: "flame-300", hex: "#ffb26b" },
      { name: "flame-400", hex: "#ff920b" },
      { name: "flame-500", hex: "#fa6f00" },
      { name: "flame-600", hex: "#d95b00" },
      { name: "flame-700", hex: "#b04700" },
    ],
  },
  {
    group: "Sun",
    tokens: [
      { name: "sun-200", hex: "#ffe58a" },
      { name: "sun-300", hex: "#ffd543" },
      { name: "sun-400", hex: "#faab20" },
    ],
  },
  {
    group: "Ink",
    tokens: [
      { name: "ink-50", hex: "#f6f9fc" },
      { name: "ink-100", hex: "#eaf0f6" },
      { name: "ink-200", hex: "#d8e1eb" },
      { name: "ink-300", hex: "#b9c6d4" },
      { name: "ink-400", hex: "#8a9aad" },
      { name: "ink-500", hex: "#5e6f84" },
      { name: "ink-600", hex: "#475569" },
      { name: "ink-700", hex: "#33415a" },
      { name: "ink-800", hex: "#1e2b3e" },
      { name: "ink-900", hex: "#0e1b2c" },
    ],
  },
  {
    group: "Status",
    tokens: [
      { name: "success", hex: "#15803d" },
      { name: "warning", hex: "#b45309" },
      { name: "danger", hex: "#b91c1c" },
    ],
  },
];

const roleTokens = [
  { name: "surface", hex: "#ffffff" },
  { name: "surface-muted", hex: "#f6f9fc" },
  { name: "surface-tint", hex: "#f0f7fd" },
  { name: "surface-inverse", hex: "#002b52" },
  { name: "surface-inverse-deep", hex: "#001a33" },
  { name: "fg", hex: "#0e1b2c" },
  { name: "fg-muted", hex: "#475569" },
  { name: "fg-subtle", hex: "#5e6f84" },
  { name: "fg-inverse", hex: "#ffffff" },
  { name: "fg-inverse-muted", hex: "#b9c6d4" },
  { name: "line", hex: "#d8e1eb" },
  { name: "link", hex: "#0a5fa8" },
  { name: "cta", hex: "#fa6f00" },
  { name: "cta-hover", hex: "#ff920b" },
  { name: "cta-fg", hex: "#001a33" },
  { name: "focus", hex: "#0a78c8" },
];

const variants = ["primary", "secondary", "outline", "ghost"];
const sizes = ["md", "lg"];

function Swatch({ name, hex }) {
  const isLight = [
    "#ffffff",
    "#f6f9fc",
    "#f0f7fd",
    "#fff4ea",
    "#ffe5cc",
    "#ffe58a",
    "#ffd543",
    "#ddeefa",
    "#bfe0f7",
    "#eaf0f6",
    "#d8e1eb",
    "#b9c6d4",
    "#ffb26b",
  ].includes(hex);
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="h-12 w-12 rounded-lg border border-ink-200 shadow-sm"
        style={{ backgroundColor: hex }}
      />
      <span className={`text-xs font-medium ${isLight ? "text-fg" : "text-fg-muted"}`}>{name}</span>
      <span className="font-mono text-[10px] text-fg-subtle">{hex}</span>
    </div>
  );
}

export default function DesignPreviewPage() {
  return (
    <>
      {/* Breakpoint badge */}
      <div className="fixed right-2 bottom-2 z-[9999] rounded-md bg-navy-900 px-2 py-1 font-mono text-xs text-white">
        <span className="inline xs:hidden">base</span>
        <span className="hidden xs:inline sm:hidden">xs</span>
        <span className="hidden sm:inline md:hidden">sm</span>
        <span className="hidden md:inline lg:hidden">md</span>
        <span className="hidden lg:inline xl:hidden">lg</span>
        <span className="hidden xl:inline 2xl:hidden">xl</span>
        <span className="hidden 2xl:inline 3xl:hidden">2xl</span>
        <span className="hidden 3xl:inline">3xl</span>
      </div>

      {/* Colour swatches */}
      <Section spacing="lg">
        <Container>
          <h1 className="font-display text-h1">Design tokens</h1>
          <p className="mt-2 text-fg-muted">DEV-only preview. Not included in production.</p>

          <h2 className="mt-10 font-display text-h2">Brand colours</h2>
          {brandColors.map((group) => (
            <div key={group.group} className="mt-6">
              <h3 className="font-display text-h3">{group.group}</h3>
              <div className="mt-3 flex flex-wrap gap-4">
                {group.tokens.map((t) => (
                  <Swatch key={t.name} name={t.name} hex={t.hex} />
                ))}
              </div>
            </div>
          ))}

          <h2 className="mt-10 font-display text-h2">Role tokens</h2>
          <div className="mt-3 flex flex-wrap gap-4">
            {roleTokens.map((t) => (
              <Swatch key={t.name} name={t.name} hex={t.hex} />
            ))}
          </div>

          <h2 className="mt-10 font-display text-h2">Semantic tokens</h2>
          <p className="mt-2 text-fg-muted">
            Live custom properties that adapt with the theme (light and dark).
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[
              "surface",
              "surface-raised",
              "surface-muted",
              "surface-tint",
              "surface-sunken",
              "surface-inverse",
              "surface-inverse-deep",
              "fg",
              "fg-strong",
              "fg-muted",
              "fg-subtle",
              "heading",
              "line",
              "line-strong",
              "field",
              "link",
              "accent",
              "accent-soft",
              "accent-line",
              "accent-strong",
              "focus",
              "selected",
              "selected-fg",
              "secondary",
              "secondary-hover",
              "secondary-fg",
              "success",
              "success-soft",
              "success-strong",
              "warning",
              "warning-soft",
              "warning-strong",
              "danger",
              "danger-soft",
              "danger-strong",
              "highlight-soft",
              "highlight-strong",
              "deep-from",
              "deep-via",
              "deep-to",
            ].map((token) => (
              <div
                key={token}
                className="flex flex-col gap-1.5 rounded-lg border border-line p-3 shadow-2xs"
                style={{ backgroundColor: `var(--${token})` }}
              >
                <span className="font-mono text-xs font-bold" style={{ color: "var(--fg)" }}>
                  {token}
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <span style={{ color: "var(--fg)" }}>Aa fg</span>
                  <span style={{ color: "var(--heading)" }}>Aa h</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Type scale */}
      <Section tone="muted" spacing="lg">
        <Container>
          <h2 className="font-display text-h2">Type scale</h2>
          <div className="mt-6 space-y-6">
            <div>
              <span className="text-sm font-medium text-fg-subtle">display</span>
              <p className="font-display text-display">The quick brown fox</p>
            </div>
            <div>
              <span className="text-sm font-medium text-fg-subtle">h1</span>
              <p className="font-display text-h1">The quick brown fox</p>
            </div>
            <div>
              <span className="text-sm font-medium text-fg-subtle">h2</span>
              <p className="font-display text-h2">The quick brown fox</p>
            </div>
            <div>
              <span className="text-sm font-medium text-fg-subtle">h3</span>
              <p className="font-display text-h3">The quick brown fox</p>
            </div>
            <div>
              <span className="text-sm font-medium text-fg-subtle">lead</span>
              <p className="text-lead">
                The quick brown fox jumps over the lazy dog. This is a longer paragraph to
                demonstrate the lead text size and line height.
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-fg-subtle">body</span>
              <p>
                The quick brown fox jumps over the lazy dog. This is a longer paragraph to
                demonstrate the default body text size and line height.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Buttons */}
      <Section spacing="lg">
        <Container>
          <h2 className="font-display text-h2">Buttons</h2>
          <div className="mt-6 space-y-8">
            {variants.map((variant) => (
              <div key={variant}>
                <h3 className="mb-3 font-display text-h3">{variant}</h3>
                <div className="flex flex-wrap items-center gap-4">
                  {sizes.map((size) => (
                    <Button key={`${variant}-${size}`} variant={variant} size={size}>
                      {variant} {size}
                    </Button>
                  ))}
                  <Button variant={variant} disabled>
                    {variant} disabled
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* onDark buttons in inverse section */}
      <Section tone="inverse" spacing="lg">
        <Container>
          <h2 className="font-display text-h2">onDark variant</h2>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {sizes.map((size) => (
              <Button key={`onDark-${size}`} variant="onDark" size={size}>
                onDark {size}
              </Button>
            ))}
            <Button variant="onDark" disabled>
              onDark disabled
            </Button>
          </div>
        </Container>
      </Section>

      {/* Gradient samples */}
      <Section spacing="lg">
        <Container>
          <h2 className="font-display text-h2">Gradients</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 font-display text-h3">bg-brand-ribbon</h3>
              <div className="h-24 rounded-xl bg-brand-ribbon" />
            </div>
            <div>
              <h3 className="mb-3 font-display text-h3">bg-brand-deep</h3>
              <div className="h-24 rounded-xl bg-brand-deep" />
            </div>
          </div>
        </Container>
      </Section>

      {/* Shadows */}
      <Section tone="muted" spacing="lg">
        <Container>
          <h2 className="font-display text-h2">Shadows</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-card">
              <p className="font-semibold">shadow-card</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-raised">
              <p className="font-semibold">shadow-raised</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Radius scale */}
      <Section spacing="lg">
        <Container>
          <h2 className="font-display text-h2">Radius scale</h2>
          <div className="mt-6 flex flex-wrap items-end gap-6">
            {[
              { name: "sm", cls: "rounded-sm" },
              { name: "md", cls: "rounded-md" },
              { name: "lg", cls: "rounded-lg" },
              { name: "xl", cls: "rounded-xl" },
            ].map((r) => (
              <div key={r.name} className="flex flex-col items-center gap-2">
                <div className={`h-16 w-16 border-2 border-azure-500 bg-azure-50 ${r.cls}`} />
                <span className="text-sm text-fg-muted">{r.name}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
