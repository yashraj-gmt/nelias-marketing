import { useState } from "react";
import { Sparkles, Layers, Shield, Building, Users, Briefcase, DollarSign } from "lucide-react";

import {
  Button,
  Container,
  Section,
  Badge,
  AvailabilityBadge,
  Card,
  CardTitle,
  CardText,
  CardLink,
  Panel,
  RuledList,
  RuledItem,
  IconBadge,
  SectionHeading,
  TextLink,
  Alert,
  Accordion,
  Tabs,
  SegmentedControl,
  Toggletip,
  Modal,
  Reveal,
  ResponsiveTable,
} from "@/components/ui";

import {
  Field,
  Fieldset,
  Input,
  Textarea,
  Select,
  Checkbox,
  ChoiceCard,
  NumberStepper,
} from "@/components/ui/forms";

import {
  PageHeader,
  CtaBand,
  ProcessSteps,
  PreviewFrame,
  StepProgress,
} from "@/components/patterns";

import { AVAILABILITY } from "@/data/feature-states";

export default function UiKitPreviewPage() {
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [stepperVal, setStepperVal] = useState(4);
  const [stepperDisabledVal] = useState(2);
  const [stepperErrVal, setStepperErrVal] = useState(0);
  const [segmentedVal, setSegmentedVal] = useState("monthly");
  const [choiceRadio, setChoiceRadio] = useState("retail");
  const [choiceCheckbox, setChoiceCheckbox] = useState(true);

  // Step progress interactive state
  const [stepIndex, setStepIndex] = useState(1);

  // Tabs state
  const eightTabs = [
    {
      id: "tab-1",
      label: "Overview",
      content: <p className="text-fg-muted">Overview content area</p>,
    },
    {
      id: "tab-2",
      label: "Features",
      content: <p className="text-fg-muted">Features content area</p>,
    },
    {
      id: "tab-3",
      label: "Integrations",
      content: <p className="text-fg-muted">Integrations content area</p>,
    },
    {
      id: "tab-4",
      label: "Security & Privacy",
      content: <p className="text-fg-muted">Security content area</p>,
    },
    {
      id: "tab-5",
      label: "Specifications",
      content: <p className="text-fg-muted">Specifications content area</p>,
    },
    {
      id: "tab-6",
      label: "Architecture",
      content: <p className="text-fg-muted">Architecture content area</p>,
    },
    {
      id: "tab-7",
      label: "Compliance",
      content: <p className="text-fg-muted">Compliance content area</p>,
    },
    {
      id: "tab-8",
      label: "Support & SLA",
      content: <p className="text-fg-muted">Support content area</p>,
    },
  ];

  const wizardSteps = [
    { id: "company", label: "Company profile" },
    { id: "modules", label: "Select capabilities" },
    { id: "scale", label: "Team sizing" },
    { id: "review", label: "Confirmation" },
  ];

  return (
    <div className="bg-surface">
      {/* Gallery Header */}
      <section className="border-b border-line bg-surface-tint py-8">
        <Container>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="mb-1 text-xs font-semibold tracking-wider text-azure-600 uppercase">
                DEV Environment Only
              </p>
              <h1 className="font-display text-3xl font-bold text-navy-900">UI Kit Gallery</h1>
              <p className="mt-1 text-sm text-fg-muted">
                Comprehensive component catalog testing all primitives, forms and patterns.
              </p>
            </div>

            {/* In-page sticky jump navigation */}
            <nav
              aria-label="Component quick index"
              className="scrollbar-none flex items-center gap-2 overflow-x-auto py-2 text-xs font-semibold"
            >
              {[
                ["Buttons", "#buttons"],
                ["Badges", "#badges"],
                ["Cards & Panels", "#cards"],
                ["Alerts", "#alerts"],
                ["Accordion", "#accordion"],
                ["Tabs", "#tabs"],
                ["Selection", "#selection"],
                ["Forms", "#forms"],
                ["Table", "#table"],
                ["Modal", "#modal"],
                ["Patterns", "#patterns"],
                ["Dark Tone", "#dark-tone"],
              ].map(([name, href]) => (
                <a
                  key={href}
                  href={href}
                  className="rounded border border-line bg-white px-2.5 py-1.5 whitespace-nowrap text-ink-700 transition-colors hover:border-navy-900 hover:text-navy-900"
                >
                  {name}
                </a>
              ))}
            </nav>
          </div>
        </Container>
      </section>

      {/* 1. BUTTONS */}
      <Section id="buttons" spacing="md" className="border-b border-line">
        <Container>
          <SectionHeading
            title="Buttons"
            lead="Variants, sizes, loading, disabled, and icon states."
          />

          <div className="flex flex-col gap-6">
            {/* Variants */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-fg-muted">Variants (md size)</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary Action</Button>
                <Button variant="outline">Outline Action</Button>
                <Button variant="ghost">Ghost Action</Button>
                <div className="inline-flex rounded-md bg-navy-950 p-2" data-tone="inverse">
                  <Button variant="onDark">On Dark Action</Button>
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-fg-muted">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="md">Medium (44px)</Button>
                <Button size="lg">Large (48px)</Button>
                <Button size="icon" aria-label="Icon button sample">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-fg-muted">States</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button loading>Save Changes</Button>
                <Button disabled>Disabled Action</Button>
                <Button variant="outline" loading>
                  Processing Order
                </Button>
                <Button variant="secondary" disabled>
                  Unavailable Action
                </Button>
              </div>
            </div>

            {/* Full Width */}
            <div className="max-w-md">
              <h3 className="mb-3 text-sm font-semibold text-fg-muted">Full Width</h3>
              <Button fullWidth>Full Width Button</Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. BADGES */}
      <Section id="badges" spacing="md" className="border-b border-line">
        <Container>
          <SectionHeading
            title="Badges"
            lead="Tones, sizes, icons, and capability availability states."
          />

          <div className="flex flex-col gap-6">
            {/* Tone scale */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-fg-muted">Tones (md size)</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="neutral">Neutral</Badge>
                <Badge tone="info">Informational</Badge>
                <Badge tone="success">Success state</Badge>
                <Badge tone="warning">Warning notice</Badge>
                <Badge tone="danger">High priority</Badge>
                <Badge tone="highlight">Special offer</Badge>
                <div className="inline-flex rounded-md bg-navy-950 p-2">
                  <Badge tone="inverse">Inverse pill</Badge>
                </div>
              </div>
            </div>

            {/* Sizes & Icons */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-fg-muted">Sizes and Icon Slot</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge size="sm" icon={Shield} tone="info">
                  Small badge with icon
                </Badge>
                <Badge size="md" icon={Shield} tone="success">
                  Medium badge with icon
                </Badge>
              </div>
            </div>

            {/* Availability Badge */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-fg-muted">AvailabilityBadges</h3>
              <div className="flex flex-wrap items-center gap-3">
                <AvailabilityBadge state={AVAILABILITY.AVAILABLE} />
                <AvailabilityBadge state={AVAILABILITY.DEMO_ONLY} />
                <AvailabilityBadge state={AVAILABILITY.COMING_LATER} />
                <span className="text-xs text-fg-muted italic">(Hidden state renders null)</span>
                <AvailabilityBadge state={AVAILABILITY.HIDDEN} />
              </div>
            </div>

            {/* IconBadge */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-fg-muted">
                IconBadges (Never Orange)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <IconBadge icon={Layers} tone="azure" size="md" />
                <IconBadge icon={Layers} tone="azure" size="lg" />
                <IconBadge icon={Building} tone="navy" size="md" />
                <IconBadge icon={Building} tone="navy" size="lg" />
                <IconBadge icon={Users} tone="neutral" size="md" />
                <IconBadge icon={Users} tone="neutral" size="lg" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. CARDS, PANELS & RULED LIST */}
      <Section id="cards" spacing="md" className="border-b border-line">
        <Container>
          <SectionHeading
            title="Cards & Surfaces"
            lead="Card tones, elevations, CardLink pattern, Panel surface, and RuledList."
          />

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card tone="default" elevation="card">
              <CardTitle>Default White Card</CardTitle>
              <CardText className="mt-2">
                Card with subtle brand navy border and standard shadow.
              </CardText>
            </Card>

            <Card tone="muted" elevation="none">
              <CardTitle>Muted Surface Card</CardTitle>
              <CardText className="mt-2">
                Card using ink-50 soft neutral tone without elevation.
              </CardText>
            </Card>

            <Card tone="tint" elevation="raised">
              <CardTitle>Tinted Card Surface</CardTitle>
              <CardText className="mt-2">
                Azure-50 tinted card with raised floating elevation shadow.
              </CardText>
            </Card>
          </div>

          {/* CardLink sample */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* TODO(Debass): temporary target after the restructure; the page is rewritten in a later step. */}
            <CardLink to="/about" title="Clickable Internal CardLink" icon={Layers}>
              Hovering shifts border to azure-500 and underlines the title without transform lift.
            </CardLink>

            <CardLink to="https://example.com" title="Clickable External CardLink" icon={Briefcase}>
              External destination link with full card clickability area.
            </CardLink>
          </div>

          {/* Panel */}
          <Panel tone="muted" padding="lg" className="mb-8">
            <h3 className="mb-2 font-display text-xl font-semibold text-navy-900">
              Large Panel Surface (rounded-xl)
            </h3>
            <p className="leading-relaxed text-fg-muted">
              Panels provide a broader structural container for grouped content, workflows, or
              embedded dashboards.
            </p>
          </Panel>

          {/* RuledList */}
          <div>
            <h3 className="mb-4 font-display text-lg font-semibold text-navy-900">
              RuledList (Quiet sequential alternative to grids)
            </h3>
            <RuledList>
              <RuledItem icon={Building} title="First quiet capability item">
                A structured descriptive sentence outlining business workflow capabilities.
              </RuledItem>
              <RuledItem icon={Users} title="Second quiet capability item">
                Another descriptive summary demonstrating the horizontal hairline divider.
              </RuledItem>
              <RuledItem icon={DollarSign} title="Third quiet capability item">
                Final item verifying responsive stacking on mobile viewports.
              </RuledItem>
            </RuledList>
          </div>
        </Container>
      </Section>

      {/* 4. ALERTS */}
      <Section id="alerts" spacing="md" className="border-b border-line">
        <Container>
          <SectionHeading title="Alerts" lead="All status tones and ARIA live region bindings." />

          <div className="flex flex-col gap-4">
            <Alert tone="info" title="Informational announcement">
              System maintenance or descriptive contextual advisory message.
            </Alert>
            <Alert tone="success" title="Success confirmation" live="polite">
              Your configuration changes were recorded successfully.
            </Alert>
            <Alert tone="warning" title="Warning notice">
              Please review your submitted values before confirming.
            </Alert>
            <Alert tone="danger" title="Critical error notification" live="assertive">
              Payment gateway communication timed out. Please retry.
            </Alert>
            <Alert tone="note" title="General contextual note">
              A quiet neutral note using the subtle line boundary.
            </Alert>
          </div>
        </Container>
      </Section>

      {/* 5. ACCORDION */}
      <Section id="accordion" spacing="md" className="border-b border-line">
        <Container>
          <SectionHeading
            title="Accordion (FAQ Disclosure)"
            lead="Ruled hair-line disclosure with arrow key navigation, grid row expansion, and inert panels."
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-fg-muted">Single Expansion</h3>
              <Accordion
                type="single"
                defaultOpen={["faq-1"]}
                items={[
                  {
                    id: "faq-1",
                    title: "How does module deployment work?",
                    content:
                      "Modules are enabled on demand through your workspace configuration dashboard.",
                  },
                  {
                    id: "faq-2",
                    title: "Can I connect existing accounting tools?",
                    content: "NELIAS provides standard connector APIs for legacy data migration.",
                  },
                  {
                    id: "faq-3",
                    title: "Is user training provided?",
                    content: "Our regional advisors provide on-site and remote guided onboarding.",
                  },
                ]}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-fg-muted">Multiple Expansion</h3>
              <Accordion
                type="multiple"
                defaultOpen={["faq-a", "faq-b"]}
                items={[
                  {
                    id: "faq-a",
                    title: "What security measures are active?",
                    content:
                      "All customer sessions are protected by industry standard encryption protocols.",
                  },
                  {
                    id: "faq-b",
                    title: "What is the uptime service target?",
                    content:
                      "Enterprise plans include dedicated cluster monitoring and prioritized incident resolution.",
                  },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. TABS */}
      <Section id="tabs" spacing="md" className="border-b border-line">
        <Container>
          <SectionHeading
            title="Tabs"
            lead="Underline & pill variants with 8 tabs to prove mobile horizontal scrolling without page overflow."
          />

          <div className="flex flex-col gap-10">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-fg-muted">
                Underline Variant (8 tabs test container scroll at 320px)
              </h3>
              <Tabs
                variant="underline"
                defaultValue="tab-1"
                items={eightTabs}
                label="Sample feature tabs"
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-fg-muted">
                Pill Variant (8 tabs test container scroll at 320px)
              </h3>
              <Tabs
                variant="pill"
                defaultValue="tab-1"
                items={eightTabs}
                label="Sample pill tabs"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 7. SELECTION WIDGETS & TOGGLETIP */}
      <Section id="selection" spacing="md" className="border-b border-line">
        <Container>
          <SectionHeading
            title="Selection Widgets & Toggletip"
            lead="SegmentedControl radio switcher and viewport-safe Toggletip hints."
          />

          <div className="flex flex-col gap-12 md:flex-row md:items-start">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-fg-muted">Segmented Control</h3>
              <SegmentedControl
                value={segmentedVal}
                onChange={setSegmentedVal}
                label="Billing duration switcher"
                options={[
                  { value: "monthly", label: "Monthly" },
                  {
                    value: "annual",
                    label: "Annual",
                    badge: (
                      <Badge tone="highlight" size="sm">
                        Save 20%
                      </Badge>
                    ),
                  },
                ]}
              />
              <p className="mt-3 text-sm text-fg-muted">
                Active value: <strong className="text-navy-900">{segmentedVal}</strong>
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-fg-muted">Toggletips</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-navy-900">Start alignment hint:</span>
                  <Toggletip align="start">
                    Configuration settings are applied instantly to your workspace.
                  </Toggletip>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-navy-900">End alignment hint:</span>
                  <Toggletip align="end">
                    This tooltip automatically prevents right-hand edge overflow on narrow mobile
                    screens.
                  </Toggletip>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 8. FORMS */}
      <Section id="forms" spacing="md" className="border-b border-line">
        <Container>
          <SectionHeading
            title="Form Controls"
            lead="Inputs, Selects, Textareas, Checkboxes, ChoiceCards, and Steppers in normal, error, and disabled states."
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Standard inputs */}
            <div className="flex flex-col gap-5">
              <h3 className="border-b border-line pb-2 font-display text-base font-semibold text-navy-900">
                Standard States
              </h3>

              <Field label="Full Name" required hint="Provide your legal personal name">
                {({ id, required, "aria-describedby": ariaDescribedBy }) => (
                  <Input
                    id={id}
                    required={required}
                    aria-describedby={ariaDescribedBy}
                    placeholder="e.g. Jean Dupont"
                  />
                )}
              </Field>

              <Field label="Sector Category" optional>
                {({ id, "aria-describedby": ariaDescribedBy }) => (
                  <Select
                    id={id}
                    aria-describedby={ariaDescribedBy}
                    placeholder={true}
                    options={[
                      { value: "retail", label: "Retail & Distribution" },
                      { value: "services", label: "Professional Services" },
                      { value: "manufacturing", label: "Industrial & Manufacturing" },
                    ]}
                  />
                )}
              </Field>

              <Field label="Project Notes" optional>
                {({ id, "aria-describedby": ariaDescribedBy }) => (
                  <Textarea
                    id={id}
                    aria-describedby={ariaDescribedBy}
                    placeholder="Enter project details..."
                  />
                )}
              </Field>

              <Checkbox
                id="consent-standard"
                label="I agree to receive operational platform notifications"
                hint="You may unsubscribe at any time."
              />

              <div>
                <p className="mb-2 text-sm font-semibold text-navy-900">Team Member Stepper</p>
                <NumberStepper
                  value={stepperVal}
                  onChange={setStepperVal}
                  min={1}
                  max={50}
                  unit="users"
                />
              </div>
            </div>

            {/* Error states */}
            <div className="flex flex-col gap-5">
              <h3 className="border-b border-line pb-2 font-display text-base font-semibold text-danger">
                Validation Error States
              </h3>

              <Field
                label="Company Email"
                required
                error="Please enter a valid business email address"
              >
                {({
                  id,
                  required,
                  "aria-describedby": ariaDescribedBy,
                  "aria-invalid": ariaInvalid,
                }) => (
                  <Input
                    id={id}
                    required={required}
                    aria-describedby={ariaDescribedBy}
                    aria-invalid={ariaInvalid}
                    defaultValue="invalid-email"
                  />
                )}
              </Field>

              <Field
                label="Primary Currency"
                error="A primary accounting currency must be selected"
              >
                {({ id, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid }) => (
                  <Select
                    id={id}
                    aria-describedby={ariaDescribedBy}
                    aria-invalid={ariaInvalid}
                    placeholder="Select currency"
                    options={[
                      { value: "xof", label: "XOF - West African CFA Franc" },
                      { value: "eur", label: "EUR - Euro" },
                    ]}
                  />
                )}
              </Field>

              <Field
                label="Brief Description"
                error="Description must contain at least 20 characters"
              >
                {({ id, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid }) => (
                  <Textarea
                    id={id}
                    aria-describedby={ariaDescribedBy}
                    aria-invalid={ariaInvalid}
                    defaultValue="Too short"
                  />
                )}
              </Field>

              <Checkbox
                id="consent-err"
                label="I accept the mandatory terms of service"
                error="Accepting the terms of service is mandatory"
              />

              <div>
                <p className="mb-2 text-sm font-semibold text-navy-900">Stepper with Error</p>
                <NumberStepper
                  value={stepperErrVal}
                  onChange={setStepperErrVal}
                  min={1}
                  max={20}
                  aria-invalid="true"
                  unit="units"
                />
                <p className="mt-1 text-xs text-danger">Minimum 1 unit required</p>
              </div>
            </div>

            {/* Disabled states */}
            <div className="flex flex-col gap-5">
              <h3 className="border-b border-line pb-2 font-display text-base font-semibold text-fg-muted">
                Disabled States
              </h3>

              <Field label="Organization ID (Locked)" optional>
                {({ id }) => <Input id={id} disabled defaultValue="ORG-94820-CI" />}
              </Field>

              <Field label="System Region (Locked)" optional>
                {({ id }) => (
                  <Select
                    id={id}
                    disabled
                    defaultValue="abidjan"
                    options={[{ value: "abidjan", label: "West Africa (Abidjan)" }]}
                  />
                )}
              </Field>

              <Field label="Audit Log Archive" optional>
                {({ id }) => (
                  <Textarea
                    id={id}
                    disabled
                    defaultValue="Archived log comments cannot be altered."
                  />
                )}
              </Field>

              <Checkbox
                id="consent-dis"
                disabled
                label="Permanent administrator access"
                hint="Managed by workspace policy"
              />

              <div>
                <p className="mb-2 text-sm font-semibold text-fg-muted">Disabled Stepper</p>
                <NumberStepper
                  value={stepperDisabledVal}
                  onChange={() => {}}
                  disabled
                  unit="entities"
                />
              </div>
            </div>
          </div>

          {/* Choice Cards (Radio and Checkbox groups) */}
          <div className="mt-12 border-t border-line pt-8">
            <h3 className="mb-4 font-display text-lg font-semibold text-navy-900">
              ChoiceCards (Radio & Checkbox Groups)
            </h3>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Radio Group */}
              <Fieldset legend="Select Primary Sector (Radio ChoiceCards)">
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ChoiceCard
                    type="radio"
                    name="industry-demo"
                    title="Retail & Commerce"
                    description="POS, inventory management, multi-store logistics."
                    icon={Building}
                    checked={choiceRadio === "retail"}
                    onChange={() => setChoiceRadio("retail")}
                  />
                  <ChoiceCard
                    type="radio"
                    name="industry-demo"
                    title="Health & Clinics"
                    description="Appointments, patient records, pharmacy supplies."
                    icon={Shield}
                    checked={choiceRadio === "health"}
                    onChange={() => setChoiceRadio("health")}
                  />
                </div>
              </Fieldset>

              {/* Checkbox Group */}
              <Fieldset legend="Select Add-on Features (Checkbox ChoiceCards)">
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ChoiceCard
                    type="checkbox"
                    name="addon-demo"
                    title="Multi-Currency Hub"
                    description="Automated foreign currency balancing and rates."
                    icon={DollarSign}
                    badge={
                      <Badge tone="highlight" size="sm">
                        Popular
                      </Badge>
                    }
                    checked={choiceCheckbox}
                    onChange={(e) => setChoiceCheckbox(e.target.checked)}
                  />
                  <ChoiceCard
                    type="checkbox"
                    name="addon-demo"
                    title="API Integration"
                    description="Direct synchronization with external ERPs."
                    icon={Layers}
                    disabled
                  />
                </div>
              </Fieldset>
            </div>
          </div>
        </Container>
      </Section>

      {/* 9. DATA TABLE */}
      <Section id="table" spacing="md" className="border-b border-line">
        <Container>
          <SectionHeading
            title="Responsive Table"
            lead="Scrollable container with 6 columns and sticky left header cells."
          />

          <ResponsiveTable
            caption="Sample Capabilities Matrix"
            label="Capabilities comparison matrix"
          >
            <thead>
              <tr>
                <th scope="col">Capability</th>
                <th scope="col">Starter</th>
                <th scope="col">Professional</th>
                <th scope="col">Enterprise</th>
                <th scope="col">API Connectors</th>
                <th scope="col">SLA Target</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Financial Accounting</th>
                <td>Core journals</td>
                <td>Multi-currency</td>
                <td>Consolidated ledgers</td>
                <td>Restricted</td>
                <td>99.5%</td>
              </tr>
              <tr>
                <th scope="row">Point of Sale (POS)</th>
                <td>Single register</td>
                <td>Up to 5 registers</td>
                <td>Unlimited registers</td>
                <td>Direct sync</td>
                <td>99.9%</td>
              </tr>
              <tr>
                <th scope="row">Supply & Purchasing</th>
                <td>Local stock</td>
                <td>Automated re-orders</td>
                <td>Warehouse matrix</td>
                <td>Webhooks</td>
                <td>99.9%</td>
              </tr>
              <tr>
                <th scope="row">Customer Analytics</th>
                <td>Basic summaries</td>
                <td>Cohort reports</td>
                <td>Custom BI export</td>
                <td>Full REST API</td>
                <td>99.9%</td>
              </tr>
            </tbody>
          </ResponsiveTable>
        </Container>
      </Section>

      {/* 10. MODAL */}
      <Section id="modal" spacing="md" className="border-b border-line">
        <Container>
          <SectionHeading
            title="Modal Dialog"
            lead="Native <dialog> modal with trapped focus, Esc dismiss, and backdrop dismiss."
          />

          <div className="flex items-center gap-4">
            <Button onClick={() => setModalOpen(true)}>Open Sample Modal</Button>
            <span className="text-sm text-fg-muted">
              Press Esc or click backdrop to close once opened.
            </span>
          </div>

          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Sample Confirmation Modal"
            description="This dialog confirms your workspace configuration changes."
            footer={
              <>
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setModalOpen(false)}>Confirm Action</Button>
              </>
            }
          >
            <p className="text-sm leading-relaxed text-fg-muted">
              Native dialog element implementation provides built-in accessibility, automatic focus
              retention, and inert backdrop management.
            </p>
          </Modal>
        </Container>
      </Section>

      {/* 11. PATTERNS */}
      <Section id="patterns" spacing="md" className="border-b border-line">
        <Container>
          <SectionHeading
            title="Composed Patterns"
            lead="PageHeader, ProcessSteps, PreviewFrame, StepProgress, and CtaBand."
          />

          {/* PageHeader sample */}
          <div className="mb-12 overflow-hidden rounded-xl border border-line">
            <PageHeader
              accent
              title="Modern Enterprise Suite for African Markets"
              lead="Experience a unified operations hub calibrated for local accounting and supply reality."
              actions={
                <>
                  <Button variant="primary">Book a Demo</Button>
                  <Button variant="outline">Learn More</Button>
                </>
              }
              media={
                <div className="flex h-44 w-full items-center justify-center rounded-lg border border-azure-200 bg-azure-100 font-semibold text-azure-700">
                  Media Graphic Slot
                </div>
              }
            />
          </div>

          {/* ProcessSteps (6 items) */}
          <div className="mb-12">
            <h3 className="mb-6 font-display text-lg font-semibold text-navy-900">
              ProcessSteps (Sequence of 6 numbered steps)
            </h3>
            <ProcessSteps
              steps={[
                {
                  title: "Define Business Scope",
                  text: "Select your company size and regulatory requirements.",
                },
                {
                  title: "Configure Platform",
                  text: "Pick operational modules suited to your daily routine.",
                },
                {
                  title: "Import Data",
                  text: "Seamlessly map existing accounting items and catalog.",
                },
                {
                  title: "Team Onboarding",
                  text: "Equip staff with roles and guided workspace training.",
                },
                {
                  title: "Go Live",
                  text: "Launch parallel daily operations with dedicated advisor support.",
                },
                {
                  title: "Continuous Review",
                  text: "Expand features and connectors as your branches scale.",
                },
              ]}
            />
          </div>

          {/* PreviewFrame (Desktop & Mobile) */}
          <div className="mb-12">
            <h3 className="mb-6 font-display text-lg font-semibold text-navy-900">
              PreviewFrame (Desktop & Mobile with Illustrative Badge)
            </h3>
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <PreviewFrame device="desktop" caption="Desktop Operations Dashboard">
                  <div className="flex h-64 items-center justify-center bg-slate-100 font-medium text-fg-muted">
                    Neutral desktop dashboard graphic content
                  </div>
                </PreviewFrame>
              </div>

              <div className="flex justify-center lg:col-span-4">
                <PreviewFrame device="mobile" caption="Mobile POS Terminal">
                  <div className="flex h-full items-center justify-center bg-slate-100 p-4 text-center text-xs font-medium text-fg-muted">
                    Neutral mobile viewport layout content
                  </div>
                </PreviewFrame>
              </div>
            </div>
          </div>

          {/* StepProgress (interactive) */}
          <div className="mb-12 rounded-xl border border-line bg-surface-muted p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-navy-900">
                StepProgress Wizard Tracker
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  size="md"
                  variant="outline"
                  disabled={stepIndex === 0}
                  onClick={() => setStepIndex((p) => Math.max(0, p - 1))}
                >
                  Previous Step
                </Button>
                <Button
                  size="md"
                  disabled={stepIndex === wizardSteps.length - 1}
                  onClick={() => setStepIndex((p) => Math.min(wizardSteps.length - 1, p + 1))}
                >
                  Next Step
                </Button>
              </div>
            </div>

            <StepProgress
              steps={wizardSteps}
              current={stepIndex}
              onStepClick={(idx) => setStepIndex(idx)}
            />
          </div>

          {/* CtaBand */}
          <div className="overflow-hidden rounded-xl shadow-raised">
            <CtaBand
              title="Ready to automate your operations with NELIAS?"
              body="Speak with an experienced solution architect and configure your organization."
            />
          </div>
        </Container>
      </Section>

      {/* 12. REVEAL ANIMATIONS */}
      <Section spacing="md" className="border-b border-line">
        <Container>
          <SectionHeading
            title="Reveal Component (One-time lightweight scroll entrance)"
            lead="Appears smoothly when scrolled into view. Automatically disabled when user prefers reduced motion."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Reveal delay={0}>
              <Card className="flex h-40 items-center justify-center font-semibold text-navy-900">
                Reveal Block 1 (0ms delay)
              </Card>
            </Reveal>
            <Reveal delay={150}>
              <Card className="flex h-40 items-center justify-center font-semibold text-navy-900">
                Reveal Block 2 (150ms delay)
              </Card>
            </Reveal>
            <Reveal delay={300}>
              <Card className="flex h-40 items-center justify-center font-semibold text-navy-900">
                Reveal Block 3 (300ms delay)
              </Card>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 13. INVERSE (DARK SURFACE) SECTION */}
      <Section id="dark-tone" tone="inverse" spacing="lg">
        <Container>
          <SectionHeading
            tone="inverse"
            eyebrow="Dark Surface Verification"
            title="Components on Inverse Tone (data-tone='inverse')"
            lead="Verifying contrast, white text, sun-300 focus rings, and dark surface styling."
          />

          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Primary Action</Button>
              <Button variant="onDark">OnDark Action</Button>
              <Badge tone="inverse">Inverse Badge</Badge>
              <Badge tone="highlight">Highlight</Badge>
              <TextLink to="/about" className="text-white hover:text-sun-300">
                Inverse Text Link
              </TextLink>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card tone="inverse" elevation="raised">
                <CardTitle>Inverse Card Component</CardTitle>
                <CardText className="mt-2">
                  Card rendered with inverse tone, white/10 hairline borders, and muted light text.
                </CardText>
              </Card>

              <Panel tone="inverse" padding="md">
                <h4 className="mb-2 font-display text-lg font-semibold text-white">
                  Inverse Panel Component
                </h4>
                <p className="text-sm leading-relaxed text-fg-inverse-muted">
                  Panel container on deep brand navy with compliant 4.5:1+ text contrast.
                </p>
              </Panel>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
